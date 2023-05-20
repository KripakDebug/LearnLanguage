import React, { useContext, useState } from "react";
import "./Tasks.scss";
import { Context } from "../../../index";
import { useAuthState } from "react-firebase-hooks/auth";
import ModalTask from "./ModalTask/ModalTask";
import { Card, Col } from "antd";
import ModalCreateCard from "./ModalCreateCard/ModalCreateCard";

export default function Tasks({ cards }) {
  const { auth, firestore } = useContext(Context);
  const [user] = useAuthState(auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idDeck, setIdDeck] = useState(0);
  firestore
    .collection("decks")
    .get()
    .then((data) => {
      data.docs.map((doc) => {
        setIdDeck(doc.data().id);
      });
    });
  return (
    <div className="tasks">
      <h1>My Task</h1>
      <ul className="list-task">
        {cards.map((card) => {
          if (user.uid === card.userId) {
            return (
              <Col span={8}>
                <ModalCreateCard idDeck={idDeck} id={card.id} />
                <Card
                  key={card.id}
                  title={card.cards + "cards"}
                  bordered={false}
                >
                  {card.name}
                </Card>
              </Col>
            );
          }
        })}
        <li className="create-task" onClick={showModal}>
          Create New Deck
        </li>
      </ul>
      <ModalTask setIsModalOpen={setIsModalOpen} isModalOpen={isModalOpen} />
    </div>
  );
  function showModal() {
    setIsModalOpen(true);
  }
}
