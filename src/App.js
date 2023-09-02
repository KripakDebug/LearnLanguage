import "./App.scss";
import NavBar from "./components/NavBar/NavBar";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./components/AppRouter";
import { createContext, useContext, useState } from "react";
import { informationWithFirebase } from "./index";
import { useAuthState } from "react-firebase-hooks/auth";
import Loader from "./components/Loader/Loader";

export const cardsForDeckContext = createContext(null);
function App() {
  const { auth } = useContext(informationWithFirebase);
  const [user, loading] = useAuthState(auth);
  const [isNavbarShow, setIsNavbarShow] = useState(true);

  function setNavbarBool(value) {
    setIsNavbarShow(value);
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <BrowserRouter>
      <cardsForDeckContext.Provider value={{ setNavbarBool, isNavbarShow }}>
        <div className="wrapper">
          {user && isNavbarShow ? <NavBar /> : ""}
          <AppRouter />
        </div>
      </cardsForDeckContext.Provider>
    </BrowserRouter>
  );
}

export default App;
