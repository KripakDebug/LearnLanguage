import React from "react";
import { Spin } from "antd";
import "./LoaderComponent.scss";
export default function LoaderComponent() {
  return (
    <div className="loader-component">
      <Spin />
    </div>
  );
}
