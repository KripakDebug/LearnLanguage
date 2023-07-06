import React, { useContext, useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { cardsForDeckContext } from "../../App";
import { DoubleRightOutlined } from "@ant-design/icons";
import { Button } from "antd";
import "./LearnCard.scss";
export default function LearnCard() {
  const { amountCard } = useParams();
  const { cardInDeck, setNavbarBool } = useContext(cardsForDeckContext);
  const [listCard, setListCard] = useState(null);
  useEffect(() => {
    setNavbarBool(false);
  }, []);
  return (
    <div className="learn">
      <div className="learn-header">
        <div className="learn-header-btn">
          <div className="return-page">
            <NavLink to="/home">Home</NavLink>/Learning
          </div>
          <Button type="default" className="learn-finish">
            <DoubleRightOutlined /> Finish
          </Button>
        </div>
        <div className="line-progress-card">
          <div className="line-bar">
            <div className="line"></div>
          </div>
          <div className="amount-card">0 / </div>
        </div>
      </div>
      <div className="card-learn">
        <div className="word"></div>
      </div>
    </div>
  );
}
