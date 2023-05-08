import React, { useContext, useState } from "react";
import { Menu } from "antd";
import "./NavBar.scss";
import {
  ExportOutlined,
  HomeOutlined,
  LeftOutlined,
  RightOutlined,
  SwitcherOutlined,
} from "@ant-design/icons";
import classNames from "classnames";
import { Context } from "../../index";
import { useAuthState } from "react-firebase-hooks/auth";

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}
const items = [getItem("Profile", "5", <HomeOutlined src={"/profile"} />)];

export default function NavBar() {
  const { auth } = useContext(Context);
  const [user] = useAuthState(auth);
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
        onClick={() => auth.signOut()}
      >
        <ExportOutlined />
        {collapsed ? "" : <span className="text">Logout</span>}
      </button>
    </nav>
  );

  function toggleCollapsed() {
    setCollapsed(!collapsed);
  }
}
