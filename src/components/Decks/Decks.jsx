import React, { useContext, useEffect, useState } from "react";
import "./Decks.scss";
import { informationWithFirebase } from "../../index";
import { useAuthState } from "react-firebase-hooks/auth";
import { PlusCircleOutlined, RocketOutlined } from "@ant-design/icons";
import { ListManyCardsLearn, ModalTask } from "../../utils/modals";
import Deck from "../Deck/Deck";

export default function Decks({ decks }) {
  const { auth } = useContext(informationWithFirebase);
  const [user] = useAuthState(auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenList, setIsModalOpenList] = useState(false);
  const [isModalCreateCardOpen, setIsModalCreateCardOpen] = useState(false);
  const [idDeck, setIdDeck] = useState(0);
  const [deck, setDeck] = useState(null);
  const [isModalListCardsLearn, setIsModalListCardsLearn] = useState(false);
  const [cardsLearnForDecks, setCardsLearnForDecks] = useState([]);
  const [estLearningDaysForCards, setEstLearningDaysForCards] = useState("");

  useEffect(() => {
    if (decks !== {}) {
      setCardsLearnForDecks(
        decks.reduce((accumulator, deck) => {
          if (user.uid === deck.userId) {
            const cards = deck.cards;
            accumulator.push(...cards);
          }
          return accumulator;
        }, [])
      );
    } else {
      setCardsLearnForDecks([]);
    }
  }, [decks, user.uid]);

  return (
    <>
      {cardsLearnForDecks.length !== 0 && (
        <button
          onClick={() => {
            setIsModalListCardsLearn(true);
            setCardsLearnForDecks(
              decks.reduce((accumulator, deck) => {
                if (user.uid === deck.userId) {
                  const cards = deck.cards;
                  accumulator.push(...cards);
                }
                return accumulator;
              }, [])
            );
          }}
          className={
            estLearningDaysForCards === null
              ? "learn-card active"
              : "learn-card"
          }
        >
          <RocketOutlined />
          Learn All
        </button>
      )}
      {isModalListCardsLearn && (
        <ListManyCardsLearn
          cardsLearnForDecks={cardsLearnForDecks}
          isModalListCardsLearn={isModalListCardsLearn}
          setIsModalListCardsLearn={setIsModalListCardsLearn}
        />
      )}
      <div className="decks-list">
        {decks.map((card) => {
          if (user.uid === card.userId) {
            return (
              <Deck
                setCardsLearnForDecks={setCardsLearnForDecks}
                setIsModalListCardsLearn={setIsModalListCardsLearn}
                setEstLearningDaysForCards={setEstLearningDaysForCards}
                setIsModalOpenList={setIsModalOpenList}
                isModalOpenList={isModalOpenList}
                deck={deck}
                setIdDeck={setIdDeck}
                setDeck={setDeck}
                setIsModalCreateCardOpen={setIsModalCreateCardOpen}
                setIsModalOpen={setIsModalOpen}
                isModalCreateCardOpen={isModalCreateCardOpen}
                card={card}
                idDeck={idDeck}
              />
            );
          }
        })}
        <div className="create-task" onClick={showModal}>
          <PlusCircleOutlined /> Create New Deck
        </div>
        {isModalOpen && (
          <ModalTask
            setDeck={setDeck}
            setIsModalOpen={setIsModalOpen}
            isModalOpen={isModalOpen}
            deck={deck}
          />
        )}
      </div>
    </>
  );

  function showModal() {
    setIsModalOpen(true);
  }
}
