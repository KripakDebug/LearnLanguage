import React, { useContext, useEffect } from "react";
import "./Home.scss";
import Decks from "../../components/Decks/Decks";
import { useCollectionData } from "react-firebase-hooks/firestore";
import LoaderComponent from "../../components/LoaderComponent/LoaderComponent";
import { informationWithFirebase } from "../../index";
import { cardsForDeckContext } from "../../App";
import { useLocation } from "react-router-dom";

function Home() {
  const { firestore } = useContext(informationWithFirebase);
  const [decks, loading] = useCollectionData(firestore.collection("decks"));
  const { setNavbarBool } = useContext(cardsForDeckContext);
  const location = useLocation();

  useEffect(() => {
    setNavbarBool(true);
  }, [location, setNavbarBool]);
  
  return (
    <div className="wrap-lessons">
      <div className="title">Weekly Report</div>
      <h1>My Decks</h1>
      {loading ? <LoaderComponent /> : <Decks decks={decks} />}
    </div>
  );
}

export default Home;
