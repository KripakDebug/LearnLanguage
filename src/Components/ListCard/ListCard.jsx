import React, { useContext, useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { Context } from "../../index";
import { useCollectionData } from "react-firebase-hooks/firestore";
import "./ListCard.scss";
import Loader from "../Loader/Loader";
import { CaretDownOutlined, CheckOutlined } from "@ant-design/icons";
import { ModalListChangeCard } from "../../utils/modals";

export default function ListCard() {
  const { idDeck } = useParams();
  const { auth, firestore } = useContext(Context);
  const [deck, loading] = useCollectionData(firestore.collection("decks"));
  const [cards, setCards] = useState(null);
  const [isModalOpenListChangeCard, setIsModalOpenListChangeCard] =
    useState(false);

  useEffect(() => {
    firestore
      .collection("decks")
      .get()
      .then((data) => {
        data.docs.map((doc) => {
          if (idDeck === doc.data().id) {
            setCards(doc.data());
          }
        });
      });
  }, [firestore, idDeck, cards]);
  if (loading) {
    return <Loader />;
  }

  return (
    <div className="list-card">
      <div className="path">
        <NavLink to="/home">Home</NavLink> / {cards.nameDeck}
      </div>

      <ul className="table-card">
        <li className="card">
          <div className="burger-card">
            <div className="icon-check">
              <CheckOutlined style={{ color: "#fff" }} />
            </div>
            <CaretDownOutlined />
          </div>
          <div>Front</div>
          <div>Interval Days</div>
          <div>Level</div>
        </li>
        {cards.cards.map((item) => {
          return (
            <li className="card">
              <div
                className="burger-card"
                onClick={() => setIsModalOpenListChangeCard(true)}
              >
                <div className="icon-check">
                  <CheckOutlined style={{ color: "#fff" }} />
                </div>
                <CaretDownOutlined />
              </div>
              {isModalOpenListChangeCard && (
                <ModalListChangeCard
                  isModalOpenListChangeCard={isModalOpenListChangeCard}
                  setIsModalOpenListChangeCard={setIsModalOpenListChangeCard}
                  itemId={item.idCard}
                />
              )}
              <div className="card-word">
                <div className="word">
                  {item.wordCard.map((item) => {
                    return <div>{item}</div>;
                  })}
                </div>
                <div className="definition">
                  {item.definition.map((item) => {
                    return <div>{item}</div>;
                  })}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
