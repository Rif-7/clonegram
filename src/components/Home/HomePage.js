import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import PublicHomePage from "./PublicHomePage";

const HomePage = () => {
  return (
    <div className="home">
      <PublicHomePage />
      <Link to="/new-post">
        <button className="new-post-btn">New</button>
      </Link>
    </div>
  );
};

export default HomePage;
