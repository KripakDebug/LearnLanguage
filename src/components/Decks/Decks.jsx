import React, { useContext, useState } from "react";
import "./Decks.scss";
import { informationWithFirebase } from "../../index";
import { useAuthState } from "react-firebase-hooks/auth";
import { PlusCircleOutlined } from "@ant-design/icons";
import { ModalTask } from "../../utils/modals";
import { useCollectionData } from "react-firebase-hooks/firestore";
import LoaderComponent from "../LoaderComponent/LoaderComponent";
import Deck from "../Deck/Deck";

export default function Decks() {
  const { auth, firestore } = useContext(informationWithFirebase);
  const [cards, loading] = useCollectionData(firestore.collection("decks"));
  const [user] = useAuthState(auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenList, setIsModalOpenList] = useState(false);
  const [isModalCreateCardOpen, setIsModalCreateCardOpen] = useState(false);
  const [idDeck, setIdDeck] = useState(0);
  const [deck, setDeck] = useState(null);
  if (loading) {
    return <LoaderComponent />;
  }

  return (
    <div className="decks-list">
      {cards.map((card) => {
        if (user.uid === card.userId) {
          return (
            <Deck
              setIsModalOpenList={setIsModalOpenList}
              isModalOpenList={isModalOpenList}
              deck={deck}
              setDeck={setDeck}
              setIsModalCreateCardOpen={setIsModalCreateCardOpen}
              setIsModalOpen={setIsModalOpen}
              getItemFirestore={getItemFirestore}
              isModalCreateCardOpen={isModalCreateCardOpen}
              card={card}
              idDeck={idDeck}
            />
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
          deck={deck}
        />
      )}
    </div>
  );

  function getItemFirestore(id) {
    firestore
      .collection("decks")
      .get()
      .then((data) => {
        data.docs.map((doc) => {
          if (id === doc.data().id) {
            setDeck(doc.data());
            setIdDeck(doc.data().id);
            setIsModalOpenList(true);
          }
        });
      });
  }

  function showModal() {
    setIsModalOpen(true);
  }
}
