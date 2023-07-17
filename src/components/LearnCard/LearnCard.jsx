import React, { useContext, useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { cardsForDeckContext } from "../../App";
import { DoubleRightOutlined } from "@ant-design/icons";
import "./LearnCard.scss";
import { informationWithFirebase } from "../../index";
import CardLearn from "../CardLearn/CardLearn";
import { useAuthState } from "react-firebase-hooks/auth";
export default function LearnCard() {
  const { card, amountCard } = useParams();
  const { setNavbarBool } = useContext(cardsForDeckContext);
  const { auth, firestore } = useContext(informationWithFirebase);
  const [user] = useAuthState(auth);
  const currentPath = window.location.pathname.split("/");
  const [cards, setCards] = useState([]);
  const [lineCardsProgress, setLineCardsProgress] = useState(1);
  const [cardsLearn, setCardsLearn] = useState([]);
  useEffect(() => {
    setNavbarBool(false);

    const getFirestoreDecksAndPushToCards = async () => {
      const decksFirestore = await firestore
        .collection("decks")
        .where("userId", "==", user.uid)
        .get();

      const decks = decksFirestore.docs.map((doc) => doc.data());

      let filteredCards = [];

      if (card === "all") {
        decks.forEach((deck) => {
          filteredCards.push(...filterCardsByInterval(deck.cards, deck));
        });
      } else {
        const filteredDeck = decks.find((deck) => deck.id === card);
        if (filteredDeck) {
          filteredCards = filterCardsByInterval(
            filteredDeck.cards,
            filteredDeck
          );
        }
      }

      const limitedCards = filteredCards.slice(0, Number(amountCard));
      setCards(limitedCards);
    };

    getFirestoreDecksAndPushToCards();
  }, []);
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
              <progress
                style={{
                  width: `${(lineCardsProgress / cards.length) * 100}%`,
                }}
                className="line"
              ></progress>
            </div>
            <div className="amount-card">
              {lineCardsProgress} / {cards.length}
            </div>
          </div>
        </div>
        <CardLearn
          cards={cards}
          setCardsLearn={setCardsLearn}
          setLineCardsProgress={setLineCardsProgress}
        />
      </div>
    </div>
  );

  function filterCardsByInterval(cards, deck) {
    return cards.reduce((filtered, card) => {
      if (
        card.estIntervalDays === null ||
        (currentPath[2] === "practice" && card)
      ) {
        filtered.push({
          card: card,
          flashcard: deck.flashcardDeck,
          flashcardReverse: deck.flashcardReverseDeck,
          typing: deck.typingDeck,
          deckName: deck.nameDeck,
        });
      }
      return filtered;
    }, []);
  }
}
