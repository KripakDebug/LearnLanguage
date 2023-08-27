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
        } else if (currentCard.nextTest === null) {
          setEstLearningDaysForCards(currentCard.nextTest);
          return prevTotal + 1;
        } else {
          return prevTotal;
        }
      }, 0)
    );
  }, [card.cards, setEstLearningDaysForCards]);
  const today = new Date();

  const futureTests = card.cards.filter(
    (card) => new Date(card.nextTest) > today
  );
  futureTests.sort((a, b) => new Date(a.nextTest) - new Date(b.nextTest));
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
            {futureTests.length > 0 && (
              <div className="date-review">
                Review in {formatTimeDifference(futureTests[0].nextTest)}
              </div>
            )}
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
    const timeDifference = new Date(date) - today;
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const monthsDifference = Math.floor(daysDifference / 30);

    if (monthsDifference === 1) {
      return "1 month";
    } else if (monthsDifference > 1) {
      return `${monthsDifference} months`;
    } else if (daysDifference === 1) {
      return "1 day";
    } else if (daysDifference > 1) {
      return `${daysDifference} days`;
    } else {
      return "today";
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
