import React, { useContext, useState } from "react";
import { Breadcrumb, Button } from "antd";
import { NavLink, useBlocker, useNavigate } from "react-router-dom";
import "./FinallyLearn.scss";
import { cardsForDeckContext } from "../../App";
import moment from "moment";
export default function FinallyLearn() {
  const navigate = useNavigate();
  const { isNavbarShow } = useContext(cardsForDeckContext);
  const [isRedirectAccessed, setIsRedirectAccessed] = useState(false);

  useBlocker(
    () => "Hello from useBlocker -- are you sure you want to leave?",
    !(isNavbarShow || isRedirectAccessed)
  );
  const filteredCard = JSON.parse(sessionStorage.getItem("myDataKey"));
  if (isNavbarShow) {
    navigate("/home");
    return;
  }
  return (
    <div className="finally-learn">
      <Breadcrumb
        items={[
          {
            title: (
              <NavLink onClick={onRedirectHandler} to="/home">
                Home
              </NavLink>
            ),
          },
          {
            title: "Learning",
          },
        ]}
      />
      <div className="result-learn">
        <div className="title">You have learnt {filteredCard.length} cards</div>
        <div className="list-cards">
          <div>Front</div>
          <div>Interval Days</div>
          <div>Memory Level</div>
        </div>
        {filteredCard.map((item) => {
          const a = moment(new Date());
          const b = moment(item.card.nextTest);
          return (
            <div className="list-cards">
              <div>{item.card.wordCard}</div>
              <div>
                {item.card.estIntervalDays} =>{" "}
                {item.card.estIntervalDays === 0
                  ? item.isFailLearnCard
                    ? 1
                    : 2
                  : Math.ceil(b.diff(a, "days", true))}
              </div>
              <div>
                <div className="level">
                  <div
                    className={item.card.estIntervalDays >= 1 && "level-color"}
                  ></div>
                  <div
                    className={item.card.estIntervalDays > 14 && "level-color"}
                  ></div>
                  <div
                    className={item.card.estIntervalDays > 60 && "level-color"}
                  ></div>
                </div>
                <div className="text-level">
                  {(item.card.estIntervalDays < 1 && "new") ||
                    (item.card.estIntervalDays <= 14 && "Low") ||
                    (item.card.estIntervalDays <= 60 && "Mid") ||
                    (item.card.estIntervalDays > 60 && "High")}
                </div>
              </div>
            </div>
          );
        })}
        <NavLink onClick={onRedirectHandler} to="/home" className="btn-back">
          <Button type="default">Back To Home</Button>
        </NavLink>
      </div>
    </div>
  );

  function onRedirectHandler() {
    setIsRedirectAccessed(true);
    setTimeout(() => {
      navigate("/home");
    }, 0);
  }
}
