import { useEffect } from 'react'
import { DrawSocket } from '../DrawSocket'
// Components
import { AppHeader } from '../components/AppHeader/AppHeader'
import { DrawLayout } from '../components/DrawLayout/DrawLayout'
import { Instructions } from '../components/Instructions/Instructions'
import { UserList } from '../components/UserList/UserList'
import { DrawArea } from '../components/DrawArea/DrawArea'
// Stores
import { useMyUserStore } from '../store/useMyUserStore'
import { useUsersStore } from '../store/useUsersStore'
// import { useDrawingStore } from '../store/useDrawingStore'
// Utils
import { createMyUser } from '../utils/create-my-user'
import { getInstructions } from '../utils/get-instructions'

function DrawPage() {
  const setMyUser = useMyUserStore((state) => state.setMyUser)
  const setUsers = useUsersStore((state) => state.setUsers)
  // const setStrokes = useDrawingStore((state) => state.setStrokes)

  const onClickJoin = () => {
    DrawSocket.emit("myUser:join", createMyUser() );
  }

  useEffect(() => {
    // Initial fetch of users
    DrawSocket.get('users').then((data) => {
      if (!data) return;
      setUsers(data.users);
      console.log("Initial users fetched:", data);
    });
  }, [setUsers]);

  useEffect(() => {
    // Initial fetch of strokes
    DrawSocket.get('strokes').then((data) => {
      if (!data) return;
      console.log("Initial strokes fetched:", data);
    });
  }, [/* setStrokes */]);

  useEffect(() => {
    // Listen when my user has joined
    DrawSocket.listen("myUser:joined", (data) => {
      setMyUser(data.user);

      console.log("My User joined:success", data);
    });
    return () => {
      DrawSocket.off("myUser:joined");
    }
  }, [setMyUser]);

  useEffect(() => {
    // Listen when users are updated
    DrawSocket.listen("users:updated", (data) => {
      setUsers(data.users);

      console.log("Users updated:", data);
    });
    return () => {
      DrawSocket.off("users:updated");
    }
  }, [setUsers]);

  return (
    <DrawLayout
      topArea={<AppHeader 
        onClickJoin={onClickJoin}
        
      />}
      rightArea={
        <>
          {/* <Instructions>
            {getInstructions('user-list')}
          </Instructions> */}
          <UserList users={useUsersStore((state) => state.users)} />
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
      <Instructions>
        {getInstructions('draw-area')}
      </Instructions>
      <DrawArea />
    </DrawLayout>
  )
}

export default DrawPage;
