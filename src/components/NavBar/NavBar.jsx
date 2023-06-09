import React, { useContext, useState } from "react";
import { Avatar, Menu, Modal } from "antd";
import "./NavBar.scss";
import {
  ExclamationCircleFilled,
  ExportOutlined,
  HomeOutlined,
  LeftOutlined,
  RightOutlined,
  UserOutlined,
} from "@ant-design/icons";
import classNames from "classnames";
import { informationWithFirebase } from "../../index";
import { NavLink } from "react-router-dom";

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

export default function NavBar() {
  const { firebase, auth } = useContext(informationWithFirebase);
  const userPhoto = firebase.auth().currentUser;
  const photo = userPhoto.photoURL;
  const items = [
    getItem(
      <NavLink to="/home">
        <span>Home</span>
      </NavLink>,
      "1",
      <HomeOutlined />
    ),
    getItem(
      <NavLink to="/profile">
        <span>Profile</span>
      </NavLink>,
      "2",
      photo === null ? (
        <Avatar
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          size="small"
          icon={<UserOutlined />}
        />
      ) : (
        <img className="photo-user" src={photo} alt="photo" />
      )
    ),
  ];
  const [collapsed, setCollapsed] = useState(false);
  return (
    <nav
      className={classNames(["nav", collapsed ? "collapseOn" : "collapseOff"])}
    >
      <button
        className={classNames([
          "collapse",
          collapsed ? "collapse-btn-on" : "collapse-btn-off",
        ])}
      >
        {collapsed ? (
          <RightOutlined onClick={toggleCollapsed} />
        ) : (
          <LeftOutlined onClick={toggleCollapsed} />
        )}
      </button>
      <Menu
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        mode="inline"
        theme="dark"
        inlineCollapsed={collapsed}
        items={items}
      />
      <button
        className={classNames(["nav__logout", { "collapsed-btn": collapsed }])}
        onClick={logoutConfirm}
      >
        <ExportOutlined />
        {collapsed ? "" : <span className="text">Logout</span>}
      </button>
    </nav>
  );

  function logoutConfirm() {
    Modal.confirm({
      title: "Are you sure logout?",
      icon: <ExclamationCircleFilled />,
      content: "",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        auth.signOut();
      },
      onCancel() {},
    });
  }

  function toggleCollapsed() {
    setCollapsed(!collapsed);
  }
}
