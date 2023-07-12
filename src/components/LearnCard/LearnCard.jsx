import React, { useContext, useEffect } from "react";
import { NavLink, useLocation, useParams } from "react-router-dom";
import { cardsForDeckContext } from "../../App";
import { DoubleRightOutlined } from "@ant-design/icons";
import "./LearnCard.scss";
import { informationWithFirebase } from "../../index";
import { useCollectionData } from "react-firebase-hooks/firestore";
import CardLearn from "../CardLearn/CardLearn";
export default function LearnCard() {
  const { amountCard } = useParams();
  const { setNavbarBool } = useContext(cardsForDeckContext);
  const { firestore } = useContext(informationWithFirebase);
  const location = useLocation();
  const currentPath = location.pathname;
  const [deck] = useCollectionData(firestore.collection("decks"));
  useEffect(() => {
    setNavbarBool(false);
  }, [deck, setNavbarBool]);

  return (
    <div className="container">
      <div className="learn">
        <div className="learn-header">
          <div className="learn-header-btn">
            <div className="return-page">
              <NavLink to="/home">Home </NavLink>/ Learning
            </div>
            <button type="default" className="learn-finish">
              <DoubleRightOutlined /> Finish
            </button>
          </div>
          <div className="line-progress-card">
            <div className="line-bar">
              <progress className="line"></progress>
            </div>
            <div className="amount-card">0 / </div>
          </div>
        </div>
        <CardLearn deck={deck} />
      </div>
    </div>
  );
}
