import React, { useContext } from "react";
import "./Profile.scss";
import { Context } from "../../index";
import moment from "moment";
import { MoreOutlined } from "@ant-design/icons";
import { Dropdown, Space } from "antd";
export default function Profile() {
  const { firebase } = useContext(Context);
  const firebaseUser = firebase.auth();
  const user = firebaseUser.currentUser;
  const startDate = moment(user.metadata.creationTime);
  const today = moment();
  const daysPassed = today.diff(startDate, "days");
  const monthsPassed = today.diff(startDate, "months");
  const yearsPassed = today.diff(startDate, "years");

  let timePassed = daysPassed + (daysPassed === 1 ? " day ago" : " days ago");
  if (yearsPassed >= 1) {
    timePassed = yearsPassed + (yearsPassed === 1 ? " year ago" : " years ago");
  } else if (monthsPassed >= 1) {
    timePassed =
      monthsPassed + (monthsPassed === 1 ? " month ago" : " months ago");
  }

  const items = [
    {
      label: <div onClick={deleteAccount}>Delete Account</div>,
      key: "0",
    },
  ];

  return (
    <div className="profile">
      <div className="title">Account Info</div>
      <div className="info-user-wrap">
        <div className="user">
          <img src={user.photoURL} className="avatar" />
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
      </div>
      <div className="info-lesson">
        <div className="accessed"></div>
        <div className="spent"></div>
        <div className="learning"></div>
      </div>
    </div>
  );

  function deleteAccount() {
    firebaseUser.currentUser
      .delete()
      .then(() => {
        console.log("Акаунт успішно видалено");
      })
      .catch((error) => {
        console.error("Помилка видалення акаунту:", error);
      });
  }
}
