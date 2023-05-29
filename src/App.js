import "./App.scss";
import NavBar from "./components/NavBar/NavBar";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./components/AppRouter";
import { useContext } from "react";
import { informationWithFirebase } from "./index";
import { useAuthState } from "react-firebase-hooks/auth";
import Loader from "./components/Loader/Loader";

function App() {
  const { auth } = useContext(informationWithFirebase);
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
