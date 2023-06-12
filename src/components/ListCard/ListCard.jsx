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
  const { userId, idDeck } = useParams();
  const { firestore } = useContext(informationWithFirebase);
  const [deck, loading] = useCollectionData(firestore.collection("decks"));
  const [cardId, setCardId] = useState(0);
  const [cards, setCards] = useState(null);
  const [checkedAll, setCheckedAll] = useState(false);
  const [menuShowForRadio, setMenuShowForRadio] = useState(false);
  const [cardIdActive, setCardIdActive] = useState([]);
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
          const cards = doc.data().cards;
          if (checkedAll === true) {
            cards.map((item) => {
              return setCardIdActive((prevState) => [
                ...prevState,
                item.idCard,
              ]);
            });
          } else {
            return setCardIdActive([]);
          }
        });
      });
  }, [isModalOpenListChangeCard, checkedAll, firestore, idDeck, cardId]);
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
                  checked={cardIdActive.includes(item.idCard)}
                  onClick={() => {
                    setFireStoreActiveMode(item.idCard);
                    setCardId((prevState) => prevState + 1);
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
            userId={userId}
            setCards={setCards}
            setMenuShowForRadio={setMenuShowForRadio}
            menuShowForRadio={menuShowForRadio}
          />
        )}
      </ul>
    </div>
  );

  function setFireStoreActiveMode(itemId) {
    const isActive = cardIdActive.includes(itemId);
    if (isActive) {
      setCardIdActive((prevState) => prevState.filter((id) => id !== itemId));
    } else {
      setCardIdActive((prevState) => [...prevState, itemId]);
    }
  }
  function showModal() {
    firestore
      .collection("decks")
      .where("id", "==", idDeck)
      .get()
      .then((data) => {
        data.docs.forEach((doc) => {
          const cards = doc.data().cards;
          cards.forEach((item) => {
            if (item.active) {
              setMenuShowForRadio(true);
              setIsModalOpenListChangeCard(true);
            }
          });
        });
      });
  }
}
