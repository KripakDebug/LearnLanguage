import React, { useState } from "react";
import {
  ArrowRightOutlined,
  CloseOutlined,
  FormOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import uuid from "react-uuid";
export default function CardLearn({ card, nextCardConfigurationWillBe }) {
  const [progressLearnCard, setProgressLearnCard] = useState(1);
  const [isFailLearnCard, setIsFailLearnCard] = useState(false);
  const [wordForLetter, setWordForLetter] = useState([]);
  return (
    <>
      <div className="card-learn">
        <div className="learn-failed">
          {progressLearnCard === 3 && (
            <div className={isFailLearnCard ? "icon failed" : "icon succeed"}>
              {isFailLearnCard ? (
                <CloseOutlined />
              ) : (
                <div className="circle"></div>
              )}
            </div>
          )}
        </div>
        {progressLearnChangeMarking()}
        <button className="card-change">
          <FormOutlined />
        </button>
      </div>
      <div className="learn-progress">
        <div className="message-learn">
          {progressLearnCard === 1
            ? "Guess the answer"
            : progressLearnCard === 2
            ? "Did you remember correctly?"
            : progressLearnCard === 3
            ? `Interval days is expanded to ${
                isFailLearnCard
                  ? card?.card.estIntervalDays === null && "1"
                  : "2"
              }`
            : `Interval days is expanded to ${
                isFailLearnCard
                  ? card?.card.estIntervalDays === null && "1"
                  : "2"
              }`}
        </div>
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
              card?.card?.example !== ""
                ? setProgressLearnCard((prevState) => prevState + 1)
                : changeCardForDeck();
            }}
            className="learn-check"
          >
            <ArrowRightOutlined />
          </button>
        )}
        {progressLearnCard === 4 && (
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
    if (nextCardConfigurationWillBe === "flashcard") {
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
        case 4: {
          return <div className="word">{card?.card.example}</div>;
        }
      }
    } else if (nextCardConfigurationWillBe === "flashcardReverse") {
      switch (progressLearnCard) {
        case 1: {
          return <div className="back">{card?.card.definition}</div>;
        }
        case 2: {
          return <div className="word">{card?.card.wordCard}</div>;
        }
        case 3: {
          return (
            <div className="container-word">
              <div className="back">{card?.card.definition}</div>
              <hr />
              <div className="word">{card?.card.wordCard}</div>
            </div>
          );
        }
        case 4: {
          return <div className="word">{card?.card.example}</div>;
        }
      }
    } else if (nextCardConfigurationWillBe === "typing") {
      switch (progressLearnCard) {
        case 1: {
          return <div className="back">{card?.card.definition}</div>;
        }
        case 2: {
          return (
            <div className="typing-word">
              <input
                type="text"
                className="typing"
                autoFocus
                maxLength={card?.card.wordCard.split("").length}
                onChange={(e) => setWordForLetter(e.target.value.split(""))}
              />
              {card?.card.wordCard.split("").map((word, index) => {
                return (
                  <span key={uuid()} className="letter">
                    {wordForLetter[index] || "_"}
                  </span>
                );
              })}
            </div>
          );
        }
        case 3: {
          return (
            <div className="container-word">
              <div className="back">{card?.card.definition}</div>
              <hr />
              <div className="word">{card?.card.wordCard}</div>
            </div>
          );
        }
        case 4: {
          return <div className="word">{card?.card.example}</div>;
        }
      }
    }
  }

  function changeCardForDeck() {}
}
