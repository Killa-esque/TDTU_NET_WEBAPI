import { useNavigate } from "react-router-dom";
import { useRouteCustom } from "./hooks"
import { useEffect } from "react";
import { setNavigate } from "./services/navigation/navigationService";

function App() {
  const routes = useRouteCustom();

  const navigate = useNavigate();

  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  return (
    <>
      {routes}
    </>
  )
}

export default App
