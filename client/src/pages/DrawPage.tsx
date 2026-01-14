import { AppHeader } from '../shared/components/AppHeader/AppHeader'
import { DrawLayout } from '../shared/components/layouts/DrawLayout/DrawLayout'

import { UserList } from '../features/user/components/UserList'
import { DrawArea } from '../features/drawing/components/DrawArea'
import { DrawToolbar } from '../features/drawing/components/DrawToolbar'
import { useUpdatedUserList } from '../features/user/hooks/useUpdatedUserList'
import { useJoinMyUser } from '../features/user/hooks/useJoinMyUser'
import { useCallback, useState } from 'react'

function DrawPage() {
  const { joinMyUser }  = useJoinMyUser();
  const { userList, userDrawingList } = useUpdatedUserList(); // récupère les liste des utilisateurs et ceux qui dessinent
  const [canvas, setCanvas]= useState<HTMLCanvasElement | null>(null) ;

  const download = useCallback(() => {
    if (!canvas){
      return;
    }
    let url = canvas.toDataURL("image/png");
    let link = document.createElement('a');
    link.download = 'canvas.png';
    link.href = url;
    link.click();
  }, [canvas]);

  return (
    <DrawLayout
      topArea={<AppHeader 
        onClickJoin={() => joinMyUser()}
      />}
      rightArea={
        <>
          <UserList users={userList.map(
            user => (
              { ...user, isDrawing: userDrawingList.get(user.id) ?? false } // Ajoute la propriété isDrawing à chaque utilisateur en fonction de la Map userDrawingList
              ))} />
        </>
      }
      bottomArea={
        <>
          <DrawToolbar download={download} />
        </>
      }
    >
      <DrawArea setCanvas={setCanvas} />
    </DrawLayout>
  )
}

export default DrawPage;

