import React, { useContext, useEffect } from "react";
import "./Profile.scss";
import { informationWithFirebase } from "../../index";
import moment from "moment";
import {
  ExclamationCircleFilled,
  MoreOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Dropdown, Modal, Space } from "antd";
import { useCollectionData } from "react-firebase-hooks/firestore";
import LoaderComponent from "../../components/LoaderComponent/LoaderComponent";
import { openNotificationError } from "../../utils/notificationHelpers";
import { cardsForDeckContext } from "../../App";
import { useLocation } from "react-router-dom";

export default function Profile() {
  const { firebase, firestore } = useContext(informationWithFirebase);
  const firebaseUser = firebase.auth();
  const [cards, loading] = useCollectionData(firestore.collection("decks"));
  const user = firebaseUser.currentUser;
  const startDate = moment(user.metadata.creationTime);
  const today = moment();

  const daysPassed = today.diff(startDate, "days");
  const monthsPassed = today.diff(startDate, "months");
  const yearsPassed = today.diff(startDate, "years");
  const { setNavbarBool } = useContext(cardsForDeckContext);
  const location = useLocation();

  useEffect(() => {
    setNavbarBool(true);
  }, [location]);
  if (loading) {
    return <LoaderComponent />;
  }
  const totalCards = cards.reduce(
    (count, card) => count + card.cards.length,
    0
  );
  let timePassed = daysPassed + (daysPassed === 1 ? " day ago" : " days ago");
  if (yearsPassed >= 1) {
    timePassed = yearsPassed + (yearsPassed === 1 ? " year ago" : " years ago");
  } else if (monthsPassed >= 1) {
    timePassed =
      monthsPassed + (monthsPassed === 1 ? " month ago" : " months ago");
  }

  const items = [
    {
      label: <div onClick={showDeleteConfirm}>Delete Account</div>,
      key: "0",
    },
  ];

  return (
    <div className="profile">
      <div className="title">Account Info</div>
      <div className="info-user-wrap">
        <div className="user">
          {user.photoURL === null ? (
            <Avatar size={100} icon={<UserOutlined />} />
          ) : (
            <img src={user.photoURL} className="avatar" />
          )}
          <div className="info-user">
            <div className="name">{user.displayName}</div>
            <div className="user-start">started {timePassed}</div>
          </div>
          <Dropdown
            menu={{
              items,
            }}
            trigger={["click"]}
          >
            <a className="burger" onClick={(e) => e.preventDefault()}>
              <Space>
                <MoreOutlined />
              </Space>
            </a>
          </Dropdown>
        </div>
        <div className="info-lesson">
          <div className="item-lesson">
            <div>ACCESSED</div>
            <span>
              {monthsPassed >= 1
                ? monthsPassed
                : yearsPassed >= 1
                ? yearsPassed
                : daysPassed}
            </span>
            <p>
              {monthsPassed >= 1
                ? "months"
                : yearsPassed >= 1
                ? "years"
                : "days"}
            </p>
          </div>
          <div className="item-lesson">
            <div>LEARNING</div>
            <span>{totalCards}</span>
            <p>cards</p>
          </div>
        </div>
      </div>
    </div>
  );

  function showDeleteConfirm() {
    Modal.confirm({
      title: "Are you sure delete Account?",
      icon: <ExclamationCircleFilled />,
      content: "",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        deleteAccount();
      },
      onCancel() {},
    });
  }
  function deleteAccount() {
    firebaseUser.currentUser.delete().catch(() => {
      openNotificationError("Перезайдіть в аккаунт");
    });
  }
}
