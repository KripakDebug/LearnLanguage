import React from "react";
import "./Home.scss";
import Decks from "../../components/Decks/Decks";
function Home() {
  return (
    <div className="wrap-lessons">
      <div className="title">Weekly Report</div>
      <h1>My Decks</h1>
      <Decks />
    </div>
  );
}

export default Home;
