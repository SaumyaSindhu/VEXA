import { RouterProvider } from "react-router-dom";
import { router } from './app.routes';
import "../features/shared/style/global.scss";
import { useAuth } from "../features/auth/hook/useAuth";
import { useEffect } from "react";
import { useSelector } from "react-redux";

function App() {

  const auth = useAuth()
  const { loading } = useSelector((state) => state.auth)

  useEffect(() => {
    auth.handleGetMe();
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }
  
  return (
    <RouterProvider router={router} />
  )
}

export default App
