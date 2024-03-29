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
  const [nameDeck, setNameDeck] = useState("");
  const [checkedAll, setCheckedAll] = useState(false);
  const [isSomeCheckedCards, setIsSomeCheckedCards] = useState(false);
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
          setCards(doc.data().cards);
          setNameDeck(doc.data().nameDeck);
        });
      });
  }, [isModalOpenListChangeCard, firestore, idDeck, cardId]);
  if (loading) {
    return <LoaderComponent />;
  }

  return (
    <div className="list-card">
      <div className="path">
        <NavLink to="/home">Home</NavLink> / {nameDeck}
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
        {cards.map((item) => {
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
              <div className="card-interval">
                <div className="interval">{item.estIntervalDays}</div>
              </div>
              <div className="card-level">
                <div className="level">
                  <div
                    className={item.estIntervalDays >= 1 && "level-color"}
                  ></div>
                  <div
                    className={item.estIntervalDays > 14 && "level-color"}
                  ></div>
                  <div
                    className={item.estIntervalDays > 60 && "level-color"}
                  ></div>
                </div>
                <div className="text-level">
                  {(item.estIntervalDays < 1 && "new") ||
                    (item.estIntervalDays <= 14 && "Low") ||
                    (item.estIntervalDays <= 60 && "Mid") ||
                    (item.estIntervalDays > 60 && "High")}
                </div>
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
            nameDeck={nameDeck}
            listCardId={listCardId}
            deck={deck}
            userId={userId}
            setCards={setCards}
            setIsSomeCheckedCards={setIsSomeCheckedCards}
            isSomeCheckedCards={isSomeCheckedCards}
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
      cards.forEach((item) => {
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
      setIsSomeCheckedCards(true);
      setIsModalOpenListChangeCard(true);
    }
  }
}
