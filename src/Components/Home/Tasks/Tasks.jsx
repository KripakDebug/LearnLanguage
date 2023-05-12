import React, { useContext, useState } from "react";
import "./Tasks.scss";
import { Context } from "../../../index";
import { useAuthState } from "react-firebase-hooks/auth";
import ModalTask from "./ModalTask/ModalTask";
import { useCollectionData } from "react-firebase-hooks/firestore";
import Loader from "../../Loader/Loader";

export default function Tasks() {
  const { auth, firestore } = useContext(Context);
  const [user] = useAuthState(auth);
  const [cards, loading] = useCollectionData(firestore.collection("cards"));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="tasks">
      {cards.map((card) => {
        if (user.uid === card.userId) {
          return <li>{card.name}</li>;
        }
      })}
      <div className="create-task" onClick={showModal}>
        Create New Deck
      </div>
      <ModalTask setIsModalOpen={setIsModalOpen} isModalOpen={isModalOpen} />
    </div>
  );
}
