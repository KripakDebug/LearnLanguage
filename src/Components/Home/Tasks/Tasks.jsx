import React, { useContext, useState } from "react";
import "./Tasks.scss";
import { Context } from "../../../index";
import { useAuthState } from "react-firebase-hooks/auth";
import ModalTask from "./ModalTask/ModalTask";
import { Card, Modal } from "antd";
import ModalCreateCard from "./ModalCreateCard/ModalCreateCard";

export default function Tasks({ cards }) {
  const { auth, firestore } = useContext(Context);
  const [user] = useAuthState(auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalCreateCardOpen, setIsModalCreateCardOpen] = useState(false);
  const [idDeck, setIdDeck] = useState(0);
  const [deckName, setDeckName] = useState("");

  return (
    <div className="tasks">
      <h1>My Task</h1>
      <div className="list-task">
        {cards.map((card) => {
          if (user.uid === card.userId) {
            return (
              <div className="task">
                {card.id === idDeck && (
                  <ModalCreateCard
                    isModalCreateCardOpen={isModalCreateCardOpen}
                    infoModal={info}
                    setIsModalCreateCardOpen={setIsModalCreateCardOpen}
                    idDeck={idDeck}
                    cardName={deckName}
                    id={card.id}
                  />
                )}
                <Card
                  key={card.id}
                  bordered={false}
                  onClick={() => {
                    setIsModalCreateCardOpen(true);
                    getItemFirestore(card.id);
                  }}
                >
                  <h4>{card.cards + "cards"}</h4>
                  {card.name}
                </Card>
              </div>
            );
          }
        })}
        <div className="create-task" onClick={showModal}>
          Create New Deck
        </div>
      </div>
      {isModalOpen && (
        <ModalTask
          infoModal={info}
          setIsModalOpen={setIsModalOpen}
          isModalOpen={isModalOpen}
        />
      )}
    </div>
  );

  function info(title, message) {
    Modal.info({
      title: title,
      content: <div>{message}</div>,
      onOk() {},
    });
  }

  function getItemFirestore(id) {
    firestore
      .collection("decks")
      .get()
      .then((data) => {
        data.docs.map((doc) => {
          if (id === doc.data().id) {
            setIdDeck(doc.data().id);
            setDeckName(doc.data().name);
          }
        });
      });
  }
  function showModal() {
    setIsModalOpen(true);
  }
}
