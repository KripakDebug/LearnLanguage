import React from "react";
import { ModalCreateCard, ModalList } from "../../utils/modals";
import { Card } from "antd";

export default function Deck({
  card,
  isModalCreateCardOpen,
  deck,
  isModalOpenList,
  setIsModalCreateCardOpen,
  setIsModalOpenList,
  setIsModalOpen,
  getItemFirestore,
  idDeck,
}) {
  return (
    <div className="deck">
      {card.id === idDeck && isModalCreateCardOpen && (
        <ModalCreateCard
          isModalCreateCardOpen={isModalCreateCardOpen}
          setIsModalCreateCardOpen={setIsModalCreateCardOpen}
          deck={deck}
        />
      )}
      {card.id === idDeck && isModalOpenList && (
        <ModalList
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
        <div className="count-lesson">
          {card.cards.length === 0
            ? 0
            : card.cards.reduce((total, card) => {
                return card.learn === 1 ? total + 1 : total;
              }, 0)}
        </div>
      </Card>
    </div>
  );
}
