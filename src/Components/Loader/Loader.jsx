import React from "react";
import { Spin } from "antd";
import "./Loader.scss";
export default function Loader() {
  return (
    <div className="loader">
      <Spin />
    </div>
  );
}
