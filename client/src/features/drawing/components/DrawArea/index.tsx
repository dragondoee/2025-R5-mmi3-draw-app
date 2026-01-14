import { useCallback, useEffect, useMemo, useRef } from "react";
import { getCoordinatesRelativeToElement } from "../../utils/getCanvasCoordinates";
import { useMyUserStore } from "../../../user/store/useMyUserStore";
import styles from './DrawArea.module.css';
import { SocketManager } from "../../../../shared/services/SocketManager";
import type { DrawStroke, Point } from "../../../../shared/types/drawing.type";

export function DrawArea() {

  const canvasRef = useRef<HTMLCanvasElement>(null); /** Les updates sur ces constantes ne provoqueront pas re-render */
  const parentRef = useRef<HTMLDivElement>(null); /** Les updates sur ces constantes ne provoqueront pas re-render */

  const otherUserStrokes = useRef<Map<string, Point[]>>(new Map());

  const { myUser } = useMyUserStore();
  const canUserDraw = useMemo(() => myUser !== null, [myUser]); 
  
  /**
   * ===================
   * GESTION COORDONNEES
   * ===================
   */

  /** Pour récupérer les coordonnées d'un event en prenant en compte le placement de notre canvas */
  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | MouseEvent) => {
    return getCoordinatesRelativeToElement(e.clientX, e.clientY, canvasRef.current);
  } 

  const drawLine = useCallback((
    from: { x: number, y: number } | null,
    to: { x: number, y: number }
  ) => {
    if (!canvasRef.current) {
      return;
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) {
      return;
    }
    
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;
    if (from) {
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
    }
    ctx.lineTo(to.x, to.y);

    ctx.stroke();
  }, []);


  /**
   * ===================
   * GESTION DES EVENEMENTS MOUSE
   * ===================
   */

  const relativeCoordinates = ( coordinates :{x: number, y: number}) => {
    if (!canvasRef.current) return {x: 0, y:0};

    return {
      x : coordinates.x / canvasRef.current.width, 
      y: coordinates.y / canvasRef.current.height};
  }

  const onMouseMove = useCallback((e: MouseEvent) => {

    if (!canvasRef.current) {
      return;
    }

    const coordinates = getCanvasCoordinates(e);
    drawLine(
    null,  
    {
      x: coordinates.x,
      y: coordinates.y,
    });

    SocketManager.emit('draw:move', {
      x: coordinates.x,
      y: coordinates.y
    });

  }, [drawLine, getCanvasCoordinates]);

  const onMouseUp = useCallback(() => {

    SocketManager.emit('draw:end');

    canvasRef.current?.removeEventListener('mousemove', onMouseMove);
  }, [onMouseMove]);

  const onMouseDown: React.MouseEventHandler<HTMLCanvasElement> = useCallback((e) => {
    /** On empêche à l'utilisateur de dessiner tant qu'il n'a pas rejoint le serveur  */
    if (!canUserDraw) { return; }

    /** Récupération du contexte 2d du canvas */
    const canvas = e.currentTarget;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    /** Transformation des coordoonées mouse (relatives à la page) vers des coordonnées relative au canvas  */
    const coordinates = getCanvasCoordinates(e);
    drawLine(coordinates, coordinates);

    let relativeCoor = relativeCoordinates(coordinates);

    SocketManager.emit('draw:start', {
      x: relativeCoor.x,
      y: relativeCoor.y,
      strokeWidth: 3,
      color: 'black'
    });

    canvasRef.current?.addEventListener('mousemove', onMouseMove);
    canvasRef.current?.addEventListener('mouseup', onMouseUp);
  }, [canUserDraw, onMouseMove, onMouseUp, drawLine]);

  /**
   * ===================
   * GESTION DES DESSINS DES AUTRES UTILISATEURS
   * ===================
   */

  const drawOtherUserPoints = useCallback((socketId: string, points : Point[]) => {
    const previousPoints = otherUserStrokes.current.get(socketId) || [];

    /** On dessine à partir du dernier point connu */
    points.forEach((point, index) => {
      const to=point;
      const from = index === 0 ? point : points[index - 1];

      if ( previousPoints[index]){
        return;
      }

      drawLine(from, to);
    });
  }, []);
  
  const onOtherUserDrawStart = useCallback((payload : DrawStroke) => {
    drawOtherUserPoints(payload.socketId, payload.points);

    otherUserStrokes.current.set(payload.socketId, payload.points);
  }, [drawOtherUserPoints]);

  const onOtherUserDrawMove = useCallback((payload : DrawStroke) => {
    drawOtherUserPoints(payload.socketId, payload.points);
  }, [drawOtherUserPoints]);

  const onOtherUserDrawEnd = useCallback((payload : DrawStroke) => {
    otherUserStrokes.current.delete(payload.socketId);
  }, []);

  const getAllStrokes = useCallback(() => {
    SocketManager.get('strokes').then((data) => {
      if (!data || !data.strokes){
        return;
      }
      data.strokes.forEach((stroke) => {
        drawOtherUserPoints(stroke.socketId, stroke.points);
      });
    });
  }, [drawOtherUserPoints]);

  /**
   * ===================
   * GESTION DES DPR
   * ===================
   */


  const setCanvasDimensions = useCallback(() => {
    if (!canvasRef.current || !parentRef.current) return;

    /** On va utiliser le ratio de pixel de l'écran pour avoir un rendu net  (DPR = 3|2|1) et par défaut on sera toujours à 1 */
    const dpr = window.devicePixelRatio || 1;

    /** On définit la taille réelle interne du canvas en se basant sur les DPR  */
    const parentWidth = parentRef.current?.clientWidth;
    const canvasWidth = parentWidth; /** On veut remplir 100% de la largeur de l'élément parent */
    const canvasHeight = Math.round(parentWidth * 9 / 16); /** On veut un ratio 16/9 par rapport à la largeur */

    canvasRef.current.width = dpr * canvasWidth; /** On multiplie la largeur souhaitée par le nb de dpr */
    canvasRef.current.height = dpr * canvasHeight; /** On multiplie la hauteur souhaitée par le nb de dpr */

    /**  On définit ensuite la taille en CSS, visible par l'utilisateur  */
    
    parentRef.current.style.setProperty('--canvas-width', `${canvasWidth}px`);
    parentRef.current.style.setProperty('--canvas-height', `${canvasHeight}px`);

    const ctx = canvasRef.current.getContext("2d");
    if (ctx) {
      /** On scale en prenant compte les dpr */
      ctx.scale(dpr, dpr); 
    }
  }, []);

  /**
   * ===================
   * GESTION DU RESIZE
   * ===================
  */


  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      setCanvasDimensions();
      getAllStrokes();
    });
    
    if (parentRef.current) {
      resizeObserver.observe(parentRef.current);
    }
    return () => {
      resizeObserver.disconnect();
    };

  }, [setCanvasDimensions, getAllStrokes]);

  useEffect(() => {
    SocketManager.listen('draw:start', onOtherUserDrawStart);
    SocketManager.listen('draw:move', onOtherUserDrawMove);
    SocketManager.listen('draw:end', onOtherUserDrawEnd);

    return () => {
      SocketManager.off('draw:start');
      SocketManager.off('draw:move');
      SocketManager.off('draw:end');
    };
  }, [onOtherUserDrawStart, onOtherUserDrawMove, onOtherUserDrawEnd]);

  useEffect(() => {
    getAllStrokes();
  }, [getAllStrokes]);

  return (
    <div className={[styles.drawArea, 'w-full', 'h-full', 'overflow-hidden', 'flex', 'items-center'].join(' ')} ref={parentRef}>
      <canvas className={[styles.drawArea__canvas, 'border-1'].join(' ')} onMouseDown={onMouseDown} ref={canvasRef}
      >
      </canvas>
    </div>
  )
}