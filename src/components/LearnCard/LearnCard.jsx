import React from "react";
import { useParams } from "react-router-dom";

export default function LearnCard() {
  const { amountСard, card } = useParams();
  console.log(card, amountСard);
  return <div>Learn</div>;
}
