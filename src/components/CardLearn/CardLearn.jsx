import React from "react";
import { FormOutlined } from "@ant-design/icons";

export default function CardLearn({ cards }) {
  return (
    <>
      <div className="card-learn">
        <div className="word"></div>
        <button className="card-change">
          <FormOutlined />
        </button>
      </div>
      <div className="learn-progress">
        <div className="message-learn"></div>
        <button className="learn-check"></button>
      </div>
    </>
  );
}
