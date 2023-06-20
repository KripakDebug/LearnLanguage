import React, { useContext, useState } from "react";
import "./Decks.scss";
import { informationWithFirebase } from "../../index";
import { useAuthState } from "react-firebase-hooks/auth";
import { PlusCircleOutlined, RocketOutlined } from "@ant-design/icons";
import { ListManyCardsLearn, ModalTask } from "../../utils/modals";
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
  const [isModalListCardsLearn, setIsModalListCardsLearn] = useState(false);
  const [estLearningDaysForCards, setEstLearningDaysForCards] = useState("");
  if (loading) {
    return <LoaderComponent />;
  }

  return (
    <>
      <button
        onClick={() => setIsModalListCardsLearn(true)}
        className={
          estLearningDaysForCards === null ? "learn-card active" : "learn-card"
        }
      >
        <RocketOutlined />
        Learn All
      </button>
      {isModalListCardsLearn && (
        <ListManyCardsLearn
          isModalListCardsLearn={isModalListCardsLearn}
          setIsModalListCardsLearn={setIsModalListCardsLearn}
        />
      )}
      <div className="decks-list">
        {decks.map((card) => {
          if (user.uid === card.userId) {
            return (
              <Deck
                setIsModalListCardsLearn={setIsModalListCardsLearn}
                setEstLearningDaysForCards={setEstLearningDaysForCards}
                setIsModalOpenList={setIsModalOpenList}
                isModalOpenList={isModalOpenList}
                deck={deck}
                setIdDeck={setIdDeck}
                setDeck={setDeck}
                setIsModalCreateCardOpen={setIsModalCreateCardOpen}
                setIsModalOpen={setIsModalOpen}
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

  function showModal() {
    setIsModalOpen(true);
  }
}
