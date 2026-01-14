import { AppHeader } from '../shared/components/AppHeader/AppHeader'
import { DrawLayout } from '../shared/components/layouts/DrawLayout/DrawLayout'

import { Instructions } from '../shared/components/Instructions/Instructions'
import { getInstructions } from '../shared/utils/get-instructions'
import { UserList } from '../features/user/components/UserList'
import { DrawArea } from '../features/drawing/components/DrawArea'
import { useUpdatedUserList } from '../features/user/hooks/useUpdatedUserList'
import { useJoinMyUser } from '../features/user/hooks/useJoinMyUser'

function DrawPage() {
  const { joinMyUser }  = useJoinMyUser();
  const { userList, userDrawingList } = useUpdatedUserList(); // récupère les liste des utilisateurs et ceux qui dessinent

  return (
    <DrawLayout
      topArea={<AppHeader 
        onClickJoin={() => joinMyUser()}
      />}
      rightArea={
        <>
          {/* <Instructions>
            {getInstructions('user-list')}
          </Instructions> */}
          <UserList users={userList.map(
            user => (
              { ...user, isDrawing: userDrawingList.get(user.id) ?? false } // Ajoute la propriété isDrawing à chaque utilisateur en fonction de la Map userDrawingList
              ))} />
        </>
      }
      bottomArea={
        <>
          <Instructions>
            {getInstructions('toolbar')}
          </Instructions>
        </>
      }
    >
      <DrawArea />
      {/* <TestDrawArea /> */}
      {/* <Instructions className="max-w-xs">
        {getInstructions('draw-area')}
      </Instructions> */}
      
    </DrawLayout>
  )
}

export default DrawPage;

