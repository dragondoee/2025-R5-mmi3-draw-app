import DrawPage from './pages/DrawPage';
import { useDrawingStore } from './store/useDrawingStore';

function App() {
  const isConnectedToServer = useDrawingStore().isConnectedToServer;

  if (!isConnectedToServer) {
    return <div>Connecting to server...</div>
  }

  return (
    <DrawPage />
  )
}

export default App
