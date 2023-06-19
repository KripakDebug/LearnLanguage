import React, { useContext, useState } from "react";
import "./Decks.scss";
import { informationWithFirebase } from "../../index";
import { useAuthState } from "react-firebase-hooks/auth";
import { PlusCircleOutlined, RocketOutlined } from "@ant-design/icons";
import { ModalTask } from "../../utils/modals";
import { useCollectionData } from "react-firebase-hooks/firestore";
import LoaderComponent from "../LoaderComponent/LoaderComponent";
import Deck from "../Deck/Deck";

export default function Decks() {
  const { auth, firestore } = useContext(informationWithFirebase);
  const [decks, loading] = useCollectionData(firestore.collection("decks"));
  const [user] = useAuthState(auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenList, setIsModalOpenList] = useState(false);
  const [isModalCreateCardOpen, setIsModalCreateCardOpen] = useState(false);
  const [idDeck, setIdDeck] = useState(0);
  const [deck, setDeck] = useState(null);
  const [estLearningDaysForCards, setEstLearningDaysForCards] = useState("");
  if (loading) {
    return <LoaderComponent />;
  }

  return (
    <>
      <button
        className={
          estLearningDaysForCards === null ? "learn-card active" : "learn-card"
        }
      >
        <RocketOutlined />
        Learn All
      </button>
      <div className="decks-list">
        {decks.map((card) => {
          if (user.uid === card.userId) {
            return (
              <Deck
                setEstLearningDaysForCards={setEstLearningDaysForCards}
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
    </>
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

  function showModal() {
    setIsModalOpen(true);
  }
}
