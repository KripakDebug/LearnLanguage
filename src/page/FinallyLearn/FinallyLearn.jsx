import React from "react";
import { Breadcrumb } from "antd";
import { NavLink } from "react-router-dom";
export default function FinallyLearn() {
  const savedData = JSON.parse(localStorage.getItem("myDataKey"));
  return (
    <div>
      <Breadcrumb
        items={[
          {
            title: <NavLink to="/home">Home</NavLink>,
          },
          {
            title: "Learning",
          },
        ]}
      />
      <div className="result-learn">
        <div className="title">You have learnt {savedData.length} cards</div>
        <div className="list-cards"></div>
        <NavLink to="/home" className="btn-back">
          Go Back Home
        </NavLink>
      </div>
    </div>
  );
}
