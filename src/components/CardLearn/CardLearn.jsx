import React, { useEffect, useState } from "react";
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
  useEffect(() => {
    document.addEventListener("keydown", setLetterToWord);
    return () => {
      document.removeEventListener("keydown", setLetterToWord);
    };
  }, []);

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
            : progressLearnCard === 3 &&
              `Interval days is expanded to ${
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

  function setLetterToWord(e) {
    const letters = document.getElementsByClassName("letter");
    if (e.key.length === 1 && e.key !== " ") {
      for (let i = 0; i < letters.length; i++) {
        const letter = letters[i];
        const nextLetter = letters[i + 1];
        if (letter.textContent === "_") {
          letter.textContent = e.key;
          letter.classList.remove("next-letter");
          if (nextLetter !== undefined) {
            nextLetter.classList.add("next-letter");
          }
          break;
        }
      }
    } else if (e.key === "Backspace") {
      for (let i = letters.length - 1; i >= 0; i--) {
        const letter = letters[i];
        const nextLetter = letters[i + 1];
        if (letter.textContent !== "_") {
          letter.classList.add("next-letter");
          if (nextLetter !== undefined) {
            nextLetter.classList.remove("next-letter");
          }
          letter.textContent = "_";
          break;
        }
      }
    }
  }

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
      }
    } else if (nextCardConfigurationWillBe === "typing") {
      switch (progressLearnCard) {
        case 1: {
          return <div className="back">{card?.card.definition}</div>;
        }
        case 2: {
          return (
            <div className="typing-word">
              {card?.card.wordCard.split("").map((word, index) => {
                const isFirstLetter = index === 0;
                return (
                  <span
                    key={uuid()}
                    className={`letter ${isFirstLetter ? "next-letter" : ""}`}
                  >
                    _
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
      }
    }
  }

  function changeCardForDeck() {}
}
