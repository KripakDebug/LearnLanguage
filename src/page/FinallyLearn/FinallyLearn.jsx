import React from "react";

export default function FinallyLearn() {
  const savedData = JSON.parse(localStorage.getItem("myDataKey"));
  console.log(savedData);
  return <div>Finally</div>;
}
