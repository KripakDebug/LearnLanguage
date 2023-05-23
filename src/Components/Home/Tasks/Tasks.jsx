import React, { useContext, useState } from "react";
import "./Tasks.scss";
import { Context } from "../../../index";
import { useAuthState } from "react-firebase-hooks/auth";
import ModalTask from "./ModalTask/ModalTask";
import { Card, Modal } from "antd";
import ModalCreateCard from "./ModalCreateCard/ModalCreateCard";
import { PlusCircleOutlined } from "@ant-design/icons";

export default function Tasks({ cards }) {
  const { auth, firestore } = useContext(Context);
  const [user] = useAuthState(auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalCreateCardOpen, setIsModalCreateCardOpen] = useState(false);
  const [idDeck, setIdDeck] = useState(0);
  const [deckName, setDeckName] = useState("");
  const [cardLessonCount, setCardLessonCount] = useState(0);
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
                  <div className="info-card">
                    <div className="card-count">
                      {card.cards.length + " cards"}
                    </div>
                    <div className="card-name">{card.name}</div>
                  </div>
                  <div className="count-lesson">
                    {card.cards.map((card) => {
                      return card.learn;
                    })}
                  </div>
                </Card>
              </div>
            );
          }
        })}
        <div className="create-task" onClick={showModal}>
          <PlusCircleOutlined /> Create New Deck
        </div>
      </div>
      {isModalOpen && (
        <ModalTask
          infoModal={info}
          setIsModalCreateCardOpen={setIsModalCreateCardOpen}
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
