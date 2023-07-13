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
        if (currentCard.estIntervalDays !== null) {
          return prevTotal;
        }
        setEstLearningDaysForCards(currentCard.estIntervalDays);
        return prevTotal + 1;
      }, 0)
    );
  }, [card.cards, setEstLearningDaysForCards]);
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
