import React, { useContext, useEffect, useState } from "react";
import { ModalCreateCard, ModalList } from "../../utils/modals";
import { Card } from "antd";
import { informationWithFirebase } from "../../index";

export default function Deck({
  card,
  isModalCreateCardOpen,
  deck,
  isModalOpenList,
  setIsModalCreateCardOpen,
  setCardsLearnForDecks,
  setIsModalOpenList,
  setIsModalOpen,
  setIdDeck,
  setIsModalListCardsLearn,
  setDeck,
  setEstLearningDaysForCards,
  idDeck,
}) {
  const { firestore } = useContext(informationWithFirebase);
  const [totalCountCardsForDeck, setTotalCountForDeck] = useState(null);
  useEffect(() => {
    setTotalCountForDeck(
      card.cards.reduce((prevTotal, currentCard) => {
        if (currentCard.nextTest <= new Date().getTime()) {
          setEstLearningDaysForCards(currentCard.nextTest);
          return prevTotal + 1;
        } else {
          return prevTotal;
        }
      }, 0)
    );
  }, [card.cards, setEstLearningDaysForCards]);
  const today = new Date();
  const sortCardsNextLearn = card.cards.sort((card, nextCard) => {
    return card.nextTest - nextCard.nextTest;
  });
  return (
    <div className="deck">
      {card.id === idDeck && isModalCreateCardOpen && (
        <ModalCreateCard
          isModalCreateCardOpen={isModalCreateCardOpen}
          setIsModalCreateCardOpen={setIsModalCreateCardOpen}
          deck={deck}
          setIsModalOpenList={setIsModalOpenList}
          setDeck={setDeck}
        />
      )}
      {card.id === idDeck && isModalOpenList && (
        <ModalList
          setIsModalListCardsLearn={setIsModalListCardsLearn}
          setDeck={setDeck}
          setCardsLearnForDecks={setCardsLearnForDecks}
          setIsModalCreateCardOpen={setIsModalCreateCardOpen}
          isModalOpenList={isModalOpenList}
          setIsModalOpenList={setIsModalOpenList}
          setIsModalOpen={setIsModalOpen}
          deck={deck}
        />
      )}
      <Card
        key={card.id}
        bordered={false}
        onClick={() => {
          getItemFirestore(card.id);
        }}
      >
        <div className="info-card">
          <div className="card-count">{card.cards.length + " cards"}</div>
          <div className="card-name">{card.nameDeck}</div>
        </div>
        <div>
          <div>
            <div className="date-review">
              {formatTimeDifference(sortCardsNextLearn)}
            </div>
          </div>
          <div
            className={
              totalCountCardsForDeck === 0
                ? "count-lesson"
                : "count-lesson active"
            }
          >
            {totalCountCardsForDeck}
          </div>
        </div>
      </Card>
    </div>
  );

  function formatTimeDifference(date) {
    const timeDifference = new Date(date[0]?.nextTest) - today;
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    const hoursDifference = Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );

    if (daysDifference > 0) {
      if (daysDifference === 1) {
        return `Review in ${daysDifference} day ${hoursDifference} hours`;
      }
      return `Review in ${daysDifference} days ${hoursDifference} hours`;
    } else if (hoursDifference > 0) {
      if (hoursDifference === 1) {
        return "Review in 1 hour";
      }
      return `Review in ${hoursDifference} hours`;
    }
  }

  function getItemFirestore(id) {
    firestore
      .collection("decks")
      .get()
      .then((data) => {
        const deck = data.docs.find((doc) => id === doc.data().id);
        if (deck) {
          setDeck(deck.data());
          setIdDeck(deck.data().id);
          setIsModalOpenList(true);
        }
      });
  }
}
