import React from "react";
import "./Home.scss";
import Tasks from "./Tasks/Tasks";
function Home() {
  return (
    <div className="wrap-lessons">
      <div className="title">Weekly Report</div>
      <Tasks />
    </div>
  );
}

export default Home;
