import React, { useContext, useEffect, useState } from "react";
import {
  ArrowRightOutlined,
  CloseOutlined,
  FormOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import uuid from "react-uuid";
import { informationWithFirebase } from "../../index";
import { useNavigate } from "react-router-dom";
import { ModalChangeCard } from "../../utils/modals";
export default function CardLearn({
  card,
  cardsToChangeCard,
  nextCardConfigurationWillBe,
  setCards,
  currentPath,
  cards,
  isModalChangeCard,
  setIsModalChangeCard,
  userId,
  setLineCardsProgress,
  decks,
}) {
  const [progressLearnCard, setProgressLearnCard] = useState(1);
  const [isFailLearnCard, setIsFailLearnCard] = useState(false);
  const [wordForLetter, setWordForLetter] = useState([]);
  const [filteredCardsLearn, setFilteredCardsLearn] = useState([]);
  const { firestore } = useContext(informationWithFirebase);
  const navigate = useNavigate();
  useEffect(() => {
    if (progressLearnCard === 3) {
      setWordForLetter([]);
    }
    if (cards.every((card) => card === "") && cards.length !== 0) {
      navigate("/finally-learn");
      sessionStorage.setItem("myDataKey", JSON.stringify(filteredCardsLearn));
    }
  }, [filteredCardsLearn, navigate, cards, progressLearnCard]);
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
        <button
          className="card-change"
          onClick={() => setIsModalChangeCard((prevState) => !prevState)}
        >
          <FormOutlined />
        </button>
        {isModalChangeCard && (
          <ModalChangeCard
            deck={decks}
            userId={userId}
            cards={cardsToChangeCard.find(
              (item) => item.idCard === card?.card?.idCard
            )}
            cardId={card?.card?.idCard}
            isModalChangeCard={isModalChangeCard}
            setIsModalChangeCard={setIsModalChangeCard}
          />
        )}
      </div>
      <div className="learn-progress">
        <div className="message-learn">
          {progressLearnCard === 1
            ? nextCardConfigurationWillBe === "typing"
              ? "Type the answer"
              : "Guess the answer"
            : progressLearnCard === 2
            ? nextCardConfigurationWillBe === "typing"
              ? "Type the answer"
              : "Did you remember correctly?"
            : progressLearnCard === 3
            ? `Interval days is expanded to ${
                isFailLearnCard
                  ? card?.card?.estIntervalDays === 0
                    ? "1"
                    : "2"
                  : card?.card?.estIntervalDays
              }`
            : `Interval days is expanded to ${
                isFailLearnCard
                  ? card?.card?.estIntervalDays === 0
                    ? "1"
                    : "2"
                  : card?.card?.estIntervalDays
              }`}
        </div>
        {progressLearnCard === 1 ? (
          <button
            onClick={() => setProgressLearnCard((prevState) => prevState + 1)}
            className="learn-check"
          >
            {nextCardConfigurationWillBe === "typing" ? (
              <ArrowRightOutlined />
            ) : (
              <UndoOutlined />
            )}
          </button>
        ) : (
          progressLearnCard === 2 &&
          (nextCardConfigurationWillBe === "typing" ? (
            <button
              onClick={() => {
                wordForLetter.join("") !== card?.card.wordCard
                  ? setIsFailLearnCard(true)
                  : setIsFailLearnCard(false);
                setProgressLearnCard(3);
              }}
              className="learn-check"
            >
              <ArrowRightOutlined />
            </button>
          ) : (
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
          ))
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
          return <div className="word">{card?.card?.wordCard}</div>;
        }
        case 2: {
          return <div className="back">{card?.card?.definition}</div>;
        }
        case 3: {
          return (
            <div className="container-word">
              <div className="word">{card?.card?.wordCard}</div>
              <hr />
              <div className="back">{card?.card?.definition}</div>
            </div>
          );
        }
        case 4: {
          return <div className="word">{card?.card?.example}</div>;
        }
      }
    } else if (nextCardConfigurationWillBe === "flashcardReverse") {
      switch (progressLearnCard) {
        case 1: {
          return <div className="back">{card?.card?.definition}</div>;
        }
        case 2: {
          return <div className="word">{card?.card?.wordCard}</div>;
        }
        case 3: {
          return (
            <div className="container-word">
              <div className="back">{card?.card?.definition}</div>
              <hr />
              <div className="word">{card?.card?.wordCard}</div>
            </div>
          );
        }
        case 4: {
          return <div className="word">{card?.card?.example}</div>;
        }
      }
    } else if (nextCardConfigurationWillBe === "typing") {
      switch (progressLearnCard) {
        case 1: {
          return <div className="back">{card?.card?.definition}</div>;
        }
        case 2: {
          return (
            <div className="typing-word">
              <input
                type="text"
                className="typing"
                autoFocus
                maxLength={card?.card?.wordCard.split("").length}
                onChange={(e) => setWordForLetter(e.target.value.split(""))}
              />
              {card?.card?.wordCard.split("").map((word, index) => {
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
              <div className="word">{card?.card?.wordCard}</div>
              <hr />
              <div className="back">{card?.card?.definition}</div>
            </div>
          );
        }
        case 4: {
          return <div className="word">{card?.card?.example}</div>;
        }
      }
    }
  }

  function changeCardForDeck() {
    setFilteredCardsLearn((prevState) => [...prevState, card]);
    if (currentPath[2] === "practice") {
      setCards((prevState) => [...prevState.slice(1), ""]);
      setLineCardsProgress((prevState) => prevState + 1);
      setProgressLearnCard(1);
    } else {
      firestore
        .collection("decks")
        .where("id", "==", card?.idDeck)
        .get()
        .then((data) => {
          data.docs.map((doc) => {
            const cards = doc.data().cards;
            const updatedCards = cards.map((item) => {
              if (item.idCard === card?.card?.idCard) {
                const intervalDaysSequence = [2, 4, 7, 15, 30, 60, 120, 240];
                const indexOfCurrentValue = intervalDaysSequence.indexOf(
                  item.estIntervalDays
                );
                let newEstIntervalDays;

                if (item.estIntervalDays === 0) {
                  newEstIntervalDays = isFailLearnCard ? 1 : 2;
                } else if (isFailLearnCard) {
                  newEstIntervalDays = 1;
                } else if (indexOfCurrentValue === -1) {
                  const lastValue =
                    intervalDaysSequence[intervalDaysSequence.length - 1];
                  newEstIntervalDays = lastValue + 6;
                } else if (
                  indexOfCurrentValue ===
                  intervalDaysSequence.length - 1
                ) {
                  newEstIntervalDays = item.estIntervalDays + 6;
                } else {
                  newEstIntervalDays =
                    intervalDaysSequence[indexOfCurrentValue + 1];
                }
                const newNextTest =
                  item.nextTest === null
                    ? new Date(
                        new Date().getTime() +
                          (isFailLearnCard ? 1 : 2) * 24 * 60 * 60 * 1000
                      )
                    : new Date(
                        item.nextTest + newEstIntervalDays * 24 * 60 * 60 * 1000
                      );

                return {
                  ...item,
                  estIntervalDays: newEstIntervalDays,
                  lastTested: new Date().getTime(),
                  testCnt: isFailLearnCard ? item.testCnt : item.testCnt + 1,
                  failCnt: isFailLearnCard ? item.failCnt + 1 : item.failCnt,
                  nextTest: newNextTest.getTime(),
                };
              }
              return item;
            });
            setCards((prevState) => [...prevState.slice(1), ""]);
            setLineCardsProgress((prevState) => prevState + 1);
            setProgressLearnCard(1);
            doc.ref.update({ cards: updatedCards });
          });
        });
    }
  }
}
