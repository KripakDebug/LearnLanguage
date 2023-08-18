import React, { useContext, useState } from "react";
import { Breadcrumb, Button } from "antd";
import { NavLink, useBlocker, useNavigate } from "react-router-dom";
import "./FinallyLearn.scss";
import { cardsForDeckContext } from "../../App";
export default function FinallyLearn() {
  const navigate = useNavigate();
  const { isNavbarShow } = useContext(cardsForDeckContext);
  const [isRedirectAccessed, setIsRedirectAccessed] = useState(false);
  useBlocker(
    () => "Hello from useBlocker -- are you sure you want to leave?",
    !(isNavbarShow || isRedirectAccessed)
  );
  if (isNavbarShow) {
    navigate("/home");
    return;
  }
  const savedData = JSON.parse(sessionStorage.getItem("myDataKey"));

  return (
    <div className="finally-learn">
      <Breadcrumb
        items={[
          {
            title: (
              <NavLink onClick={onRedirectHandler} to="/home">
                Home
              </NavLink>
            ),
          },
          {
            title: "Learning",
          },
        ]}
      />
      <div className="result-learn">
        <div className="title">You have learnt {savedData.length} cards</div>
        <div className="list-cards"></div>
        <NavLink onClick={onRedirectHandler} to="/home" className="btn-back">
          <Button type="default">Primary Button</Button>
        </NavLink>
      </div>
    </div>
  );

  function onRedirectHandler() {
    setIsRedirectAccessed(true);
    setTimeout(() => {
      navigate("/home");
    }, 0);
  }
}
