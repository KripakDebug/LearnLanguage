import React, { useContext, useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { informationWithFirebase } from "../../index";
import { useCollectionData } from "react-firebase-hooks/firestore";
import "./ListCard.scss";
import { CaretDownOutlined, CheckOutlined } from "@ant-design/icons";
import { ModalListChangeCard } from "../../utils/modals";
import { Radio } from "antd";
import LoaderComponent from "../LoaderComponent/LoaderComponent";

export default function ListCard() {
  const { idDeck } = useParams();
  const { auth, firestore } = useContext(informationWithFirebase);
  const [deck, loading] = useCollectionData(firestore.collection("decks"));
  const [cardId, setCardId] = useState(0);
  const [cards, setCards] = useState(null);
  const [checkedAll, setCheckedAll] = useState(false);
  const [menuShowForRadio, setMenuShowForRadio] = useState(false);
  const [isModalOpenListChangeCard, setIsModalOpenListChangeCard] =
    useState(false);

  useEffect(() => {
    firestore
      .collection("decks")
      .where("id", "==", idDeck)
      .get()
      .then((data) => {
        data.docs.map((doc) => {
          setCards(doc.data());
        });
      });
  }, [isModalOpenListChangeCard, checkedAll]);
  if (loading) {
    return <LoaderComponent />;
  }

  return (
    <div className="list-card">
      <div className="path">
        <NavLink to="/home">Home</NavLink> / {cards.nameDeck}
      </div>

      <ul className="table-card">
        <li className="card">
          <div className="burger-card">
            <Radio.Button
              checked={checkedAll}
              onClick={() => {
                setCheckedAll((prevState) => !prevState);
                setFireStoreActiveMode(null, !checkedAll);
              }}
              className="icon-check"
            >
              <CheckOutlined style={{ color: "#fff" }} />
            </Radio.Button>
            <div className="show-modal" onClick={showModal}>
              <CaretDownOutlined />
            </div>
          </div>
          <div>Front</div>
          <div>Interval Days</div>
          <div>Level</div>
        </li>
        {cards.cards.map((item) => {
          return (
            <li key={item.idCard} className="card">
              <div className="burger-card">
                <Radio.Button
                  checked={item.active}
                  onClick={() => {
                    setFireStoreActiveMode(item.idCard);
                  }}
                  className="icon-check"
                >
                  <CheckOutlined style={{ color: "#fff" }} />
                </Radio.Button>
                <div
                  className="show-modal"
                  onClick={() => {
                    setCardId(item.idCard);
                    setIsModalOpenListChangeCard(true);
                  }}
                >
                  <CaretDownOutlined />
                </div>
              </div>
              <div className="card-word">
                <div className="word">{item.wordCard}</div>
                <div className="definition">{item.definition}</div>
              </div>
            </li>
          );
        })}
        {isModalOpenListChangeCard && (
          <ModalListChangeCard
            isModalOpenListChangeCard={isModalOpenListChangeCard}
            setIsModalOpenListChangeCard={setIsModalOpenListChangeCard}
            cardId={cardId}
            cards={cards}
            deck={deck}
            setCards={setCards}
            setMenuShowForRadio={setMenuShowForRadio}
            menuShowForRadio={menuShowForRadio}
          />
        )}
      </ul>
    </div>
  );

  function setFireStoreActiveMode(id = null, boolCheckAll) {
    firestore
      .collection("decks")
      .get()
      .then((data) => {
        data.docs.map((doc) => {
          const cards = doc.data().cards;
          const updatedCards = cards.map((item) => {
            if (id !== null) {
              if (item.idCard === id) {
                return {
                  ...item,
                  active: !item.active,
                };
              }
            } else {
              return {
                ...item,
                active: boolCheckAll,
              };
            }
            return item;
          });
          doc.ref.update({ cards: updatedCards });
        });
      });
  }

  function showModal() {
    firestore
      .collection("decks")
      .get()
      .then((data) => {
        data.docs.map((doc) => {
          const cards = doc.data().cards;
          cards.map((item) => {
            if (item.active) {
              setMenuShowForRadio(true);
              setIsModalOpenListChangeCard(true);
            }
          });
        });
      });
  }
}
