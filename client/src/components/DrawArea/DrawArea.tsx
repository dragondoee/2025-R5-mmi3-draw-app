
export const DrawArea = () => {
  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    if (ctx) {
      const onMouseMove = (MouseEvent: MouseEvent) => {
        ctx.fillStyle = 'black';
        ctx.fillRect(MouseEvent.clientX - rect.left, MouseEvent.clientY - rect.top, 5, 5);
      }
      canvas.addEventListener('mousemove', onMouseMove);
      const onMouseUp = () => {
        canvas.removeEventListener('mousemove', onMouseMove);
        canvas.removeEventListener('mouseup', onMouseUp);
      }
      canvas.addEventListener('mouseup', onMouseUp);
    }
  }

  return (
    <div>
      <h2>Draw Area</h2>
      <div>
        <canvas width="500" height="250" className="border-1" onMouseDown={onMouseDown} />
      </div>
    </div>
  );
};
