import React, { useContext, useState } from "react";
import "./Tasks.scss";
import { Context } from "../../../index";
import { useAuthState } from "react-firebase-hooks/auth";
import ModalTask from "./ModalTask/ModalTask";

export default function Tasks() {
  const { auth, firestore } = useContext(Context);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const [user] = useAuthState(auth);
  return (
    <div className="tasks">
      <div className="create-task" onClick={showModal}>
        Create New Deck
      </div>
      <ModalTask setIsModalOpen={setIsModalOpen} isModalOpen={isModalOpen} />
    </div>
  );
}
