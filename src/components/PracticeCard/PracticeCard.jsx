import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { cardsForDeckContext } from "../../App";

export default function PracticeCard() {
  const { amountCard } = useParams();
  const { cardInDeck, setNavbarBool } = useContext(cardsForDeckContext);

  useEffect(() => {
    setNavbarBool(false);
  }, []);

  console.log(amountCard, cardInDeck);
  return <div>fdsfsd</div>;
}
