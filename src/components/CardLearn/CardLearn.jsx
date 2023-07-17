import React, { useState } from "react";
import {
  ArrowRightOutlined,
  CloseOutlined,
  FormOutlined,
  UndoOutlined,
} from "@ant-design/icons";

export default function CardLearn({
  card,
  setCardsLearn,
  setLineCardsProgress,
}) {
  const [progressLearnCard, setProgressLearnCard] = useState(1);
  const [isFailLearnCard, setIsFailLearnCard] = useState(false);
  return (
    <>
      <div className="card-learn">
        {progressLearnChangeMarking()}
        <button className="card-change">
          <FormOutlined />
        </button>
      </div>
      <div className="learn-progress">
        <div className="message-learn">Guess the answer</div>
        {progressLearnCard === 1 ? (
          <button
            onClick={() => setProgressLearnCard((prevState) => prevState + 1)}
            className="learn-check"
          >
            <UndoOutlined />
          </button>
        ) : (
          progressLearnCard === 2 && (
            <div>
              <button
                onClick={() => {
                  setIsFailLearnCard(true);
                  setProgressLearnCard((prevState) => prevState + 1);
                }}
                style={{ marginRight: "20px" }}
                className="learn-check"
              >
                <CloseOutlined />
              </button>

              <button
                onClick={() => {
                  setIsFailLearnCard(false);
                  setProgressLearnCard((prevState) => prevState + 1);
                }}
                className="learn-check"
              >
                <div className="circle"></div>
              </button>
            </div>
          )
        )}
        {progressLearnCard === 3 && (
          <button
            onClick={() => {
              changeCardForDeck();
            }}
            className="learn-check"
          >
            <ArrowRightOutlined />
          </button>
        )}
      </div>
    </>
  );

  function progressLearnChangeMarking() {
    if (card?.flashcard) {
      switch (progressLearnCard) {
        case 1: {
          return <div className="word">{card?.card.wordCard}</div>;
        }
        case 2: {
          return <div className="back">{card?.card.definition}</div>;
        }
        case 3: {
          return (
            <div className="container-word">
              <div className="word">{card?.card.wordCard}</div>
              <hr />
              <div className="back">{card?.card.definition}</div>
            </div>
          );
        }
      }
    }
  }

  function changeCardForDeck() {}
}
