import React, { useContext, useState } from "react";
import "./Tasks.scss";
import { Context } from "../../../index";
import { useAuthState } from "react-firebase-hooks/auth";
import { Card } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { ModalCreateCard, ModalTask, ModalList } from "../../../utils/modals";

export default function Tasks({ cards }) {
  const { auth, firestore } = useContext(Context);
  const [user] = useAuthState(auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenList, setIsModalOpenList] = useState(false);
  const [isModalCreateCardOpen, setIsModalCreateCardOpen] = useState(false);
  const [idDeck, setIdDeck] = useState(0);
  const [deckName, setDeckName] = useState("");
  const [deck, setDeck] = useState(null);
  return (
    <div className="tasks">
      <h1>My Decks</h1>
      <div className="list-task">
        {cards.map((card) => {
          if (user.uid === card.userId) {
            return (
              <div className="task">
                {card.id === idDeck && isModalCreateCardOpen && (
                  <ModalCreateCard
                    isModalCreateCardOpen={isModalCreateCardOpen}
                    setIsModalCreateCardOpen={setIsModalCreateCardOpen}
                    idDeck={idDeck}
                    cardName={deckName}
                  />
                )}
                {card.id === idDeck && isModalOpenList && (
                  <ModalList
                    setIsModalCreateCardOpen={setIsModalCreateCardOpen}
                    isModalOpenList={isModalOpenList}
                    setIsModalOpenList={setIsModalOpenList}
                    setIsModalOpen={setIsModalOpen}
                  />
                )}
                <Card
                  key={card.id}
                  bordered={false}
                  onClick={() => {
                    getItemFirestore(card.id);
                    setIsModalOpenList(true);
                  }}
                >
                  <div className="info-card">
                    <div className="card-count">
                      {card.cards.length + " cards"}
                    </div>
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
        })}
        <div className="create-task" onClick={showModal}>
          <PlusCircleOutlined /> Create New Deck
        </div>
        {isModalOpen && (
          <ModalTask
            setDeck={setDeck}
            setIsModalOpen={setIsModalOpen}
            isModalOpen={isModalOpen}
            idDeck={idDeck}
            deck={deck}
          />
        )}
      </div>
    </div>
  );

  function getItemFirestore(id) {
    firestore
      .collection("decks")
      .get()
      .then((data) => {
        data.docs.map((doc) => {
          if (id === doc.data().id) {
            setIdDeck(doc.data().id);
            setDeck(doc.data());
            setDeckName(doc.data().nameDeck);
          }
        });
      });
  }

  function showModal() {
    setIsModalOpen(true);
  }
}
