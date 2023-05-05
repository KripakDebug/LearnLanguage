import "./App.scss";
import NavBar from "./Components/NavBar/NavBar";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./Components/AppRouter";
import { useContext } from "react";
import { Context } from "./index";
import { useAuthState } from "react-firebase-hooks/auth";
import Loader from "./Components/Loader/Loader";

function App() {
  const { auth } = useContext(Context);
  const [user, loading] = useAuthState(auth);
  if (loading) {
    return <Loader />;
  }
  return (
    <BrowserRouter>
      <div className="wrapper">
        {user && <NavBar />}
        <AppRouter />
      </div>
    </BrowserRouter>
  );
}

export default App;
