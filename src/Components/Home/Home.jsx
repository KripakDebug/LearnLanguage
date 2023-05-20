import React, { useContext } from "react";
import "./Home.scss";
import Tasks from "./Tasks/Tasks";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Context } from "../../index";
import Loader from "../Loader/Loader";
function Home() {
  const { firestore } = useContext(Context);
  const [cards, loading] = useCollectionData(firestore.collection("decks"));

  if (loading) {
    return <Loader />;
  }
  return (
    <div className="wrap-lessons">
      <div className="title">Weekly Report</div>
      <Tasks cards={cards} />
    </div>
  );
}

export default Home;
