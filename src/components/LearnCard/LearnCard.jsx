import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { cardsForDeckContext } from "../../App";

export default function LearnCard() {
  const { amountCard } = useParams();
  const { cardInDeck } = useContext(cardsForDeckContext);
  console.log(amountCard, cardInDeck);
  return <div>Learn</div>;
}
