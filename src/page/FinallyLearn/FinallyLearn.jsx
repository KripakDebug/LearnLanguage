import React, { useContext, useEffect, useState } from "react";
import { Breadcrumb, Button } from "antd";
import { NavLink, useBlocker, useNavigate } from "react-router-dom";
import "./FinallyLearn.scss";
import { cardsForDeckContext } from "../../App";
import { informationWithFirebase } from "../../index";
export default function FinallyLearn() {
  const navigate = useNavigate();
  const { firestore } = useContext(informationWithFirebase);
  const { isNavbarShow } = useContext(cardsForDeckContext);
  const [estIntervalDaysForCardNew, setEstIntervalDaysForCardNew] = useState(
    []
  );
  const [isRedirectAccessed, setIsRedirectAccessed] = useState(false);
  useBlocker(
    () => "Hello from useBlocker -- are you sure you want to leave?",
    !(isNavbarShow || isRedirectAccessed)
  );
  const savedData = JSON.parse(sessionStorage.getItem("myDataKey"));
  useEffect(() => {
    savedData.map((item) => {
      firestore
        .collection("decks")
        .where("id", "==", item.idDeck)
        .get()
        .then((data) => {
          data.docs.map((doc) => {
            const cards = doc.data().cards;
            cards.map((card) => {
              if (card.id === item.card.id) {
                setEstIntervalDaysForCardNew((prevState) => [
                  card.estIntervalDays,
                ]);
              }
            });
          });
        });
    });
  }, []);
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
        <div className="title">You have learnt {savedData.length} cards</div>
        <div className="list-cards">
          <div>Front</div>
          <div>Interval Days</div>
          <div>Memory Level</div>
        </div>
        {savedData.map((item) => {
          return (
            <div className="list-cards">
              <div>{item.card.wordCard}</div>
              <div>
                {item.card.estIntervalDays} => {estIntervalDaysForCardNew}
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
          <Button type="default">Primary Button</Button>
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
