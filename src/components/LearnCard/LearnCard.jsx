import React, { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { cardsForDeckContext } from "../../App";
import { DoubleRightOutlined } from "@ant-design/icons";
import "./LearnCard.scss";
import { informationWithFirebase } from "../../index";
import CardLearn from "../CardLearn/CardLearn";
import { useAuthState } from "react-firebase-hooks/auth";
import { Progress } from "antd";
export default function LearnCard() {
  const { card, amountCard } = useParams();
  const { setNavbarBool } = useContext(cardsForDeckContext);
  const { auth, firestore } = useContext(informationWithFirebase);
  const [user] = useAuthState(auth);
  const currentPath = window.location.pathname.split("/");
  const [cards, setCards] = useState([]);
  const [isFailLearnCard, setIsFailLearnCard] = useState(false);
  const [decks, setDecks] = useState([]);
  const [filteredCardsLearn, setFilteredCardsLearn] = useState([]);
  const [cardsToChangeCard, setCardsToChangeCard] = useState(null);
  const [isModalChangeCard, setIsModalChangeCard] = useState(false);
  const [lineCardsProgress, setLineCardsProgress] = useState(1);
  const [nextCardConfigurationWillBe, setNextCardConfigurationWillBe] =
    useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setNavbarBool(false);

    const getFirestoreDecksAndPushToCards = async () => {
      const decksFirestore = await firestore
        .collection("decks")
        .where("userId", "==", user.uid)
        .get();

      const decks = decksFirestore.docs.map((doc) => doc.data());
      setDecks(decks);
      let filteredCards = [];
      decks.forEach((deck) => {
        setCardsToChangeCard(deck.cards);
      });

      if (card === "all") {
        decks.forEach((deck) => {
          if (deck.cards === []) {
            navigate("/home");
          }
          filteredCards.push(...filterCardsByInterval(deck.cards, deck));
        });
      } else {
        const filteredDeck = decks.find((deck) => deck.id === card);
        if (filteredDeck.cards === []) {
          navigate("/home");
        }
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
  }, [isModalChangeCard]);

  useEffect(() => {
    const avaliableConfigs = [];
    cards[0]?.flashcard && avaliableConfigs.push("flashcard");
    cards[0]?.flashcardReverse && avaliableConfigs.push("flashcardReverse");
    cards[0]?.typing && avaliableConfigs.push("typing");
    setNextCardConfigurationWillBe(
      avaliableConfigs[Math.floor(Math.random() * avaliableConfigs.length)]
    );
  }, [cards]);
  return (
    <div className="container">
      <div className="learn">
        <div className="learn__header">
          <div className="learn__header-btn">
            <div className="return-page">
              <NavLink to="/home">Home </NavLink>/ Learning
            </div>
            <button
              type="default"
              className="learn__finish"
              onClick={() => {
                navigate("/finally-learn");
                sessionStorage.setItem(
                  "myDataKey",
                  JSON.stringify(filteredCardsLearn)
                );
              }}
            >
              <DoubleRightOutlined /> Finish
            </button>
          </div>
          <div className="line-progress-card">
            <Progress
              type="line"
              showInfo={false}
              strokeColor={"white"}
              trailColor={"rgb(196, 196, 196)"}
              strokeWidth={"5px"}
              percent={(lineCardsProgress / cards.length) * 100}
            />
            <div className="amount-card">
              {lineCardsProgress} / {cards.length}
            </div>
          </div>
          <div className="learn__deck-name">{cards[0]?.deckName}</div>
        </div>
        <CardLearn
          card={cards[0]}
          currentPath={currentPath}
          cardsToChangeCard={cardsToChangeCard}
          cards={cards}
          setIsFailLearnCard={setIsFailLearnCard}
          setFilteredCardsLearn={setFilteredCardsLearn}
          filteredCardsLearn={filteredCardsLearn}
          isFailLearnCard={isFailLearnCard}
          decks={decks}
          setIsModalChangeCard={setIsModalChangeCard}
          isModalChangeCard={isModalChangeCard}
          userId={user.uid}
          setLineCardsProgress={setLineCardsProgress}
          setCards={setCards}
          nextCardConfigurationWillBe={nextCardConfigurationWillBe}
        />
      </div>
    </div>
  );

  function filterCardsByInterval(cards, deck) {
    return cards.reduce((filtered, card) => {
      if (card.nextTest === null || card.nextTest <= new Date()) {
        filtered.push({
          card,
          isFailLearnCard,
          flashcard: deck.flashcardDeck,
          flashcardReverse: deck.flashcardReverseDeck,
          typing: deck.typingDeck,
          deckName: deck.nameDeck,
          idDeck: deck.id,
        });
      } else if (currentPath[2] === "practice") {
        filtered.push({
          card,
          isFailLearnCard,
          flashcard: deck.flashcardDeck,
          flashcardReverse: deck.flashcardReverseDeck,
          typing: deck.typingDeck,
          deckName: deck.nameDeck,
          idDeck: deck.id,
        });
      }

      return filtered;
    }, []);
  }
}
