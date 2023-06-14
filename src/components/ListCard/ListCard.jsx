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
  const [listCardId, setListCardId] = useState([]);
  const [isModalOpenListChangeCard, setIsModalOpenListChangeCard] =
    useState(false);

  useEffect(() => {
    if (!listCardId.length) {
      setCheckedAll(false);
    }
  }, [listCardId.length]);

  useEffect(() => {
    firestore
      .collection("decks")
      .where("id", "==", idDeck)
      .get()
      .then((data) => {
        data.docs.forEach((doc) => {
          setCards(doc.data());
        });
      });
  }, [isModalOpenListChangeCard, firestore, idDeck, cardId]);
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
              onClick={checkAllCards}
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
                  checked={listCardId.includes(item.idCard)}
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
            listCardId={listCardId}
            deck={deck}
            userId={userId}
            setCards={setCards}
            setMenuShowForRadio={setMenuShowForRadio}
            menuShowForRadio={menuShowForRadio}
            idDeck={idDeck}
          />
        )}
      </ul>
    </div>
  );
  function checkAllCards() {
    setCheckedAll((prevState) => !prevState);
    if (checkedAll) {
      setListCardId([]);
      return;
    } else {
      cards.cards.forEach((item) => {
        setListCardId((prevState) => [...prevState, item.idCard]);
      });
    }
  }
  function setFireStoreActiveMode(itemId) {
    const isActive = listCardId.includes(itemId);
    if (isActive) {
      setListCardId((prevState) => prevState.filter((id) => id !== itemId));
    } else {
      setListCardId((prevState) => [...prevState, itemId]);
    }
  }
  function showModal() {
    if (listCardId.length) {
      setMenuShowForRadio(true);
      setIsModalOpenListChangeCard(true);
    }
  }
}
