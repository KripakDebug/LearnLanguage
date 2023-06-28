import React, { useContext } from "react";
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
  setIsLearnAll,
  setIdDeck,
  setIsModalListCardsLearn,
  setDeck,
  setEstLearningDaysForCards,
  idDeck,
}) {
  const { firestore } = useContext(informationWithFirebase);
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
          setIsLearnAll={setIsLearnAll}
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
        {card.cards.length === 0 ? (
          <div className="count-lesson">0</div>
        ) : (
          <div className="count-lesson active">
            {card.cards.reduce((total, card) => {
              setEstLearningDaysForCards(card.estIntervalDays);
              return card.estIntervalDays === null ? total + 1 : total;
            }, 0)}
          </div>
        )}
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
