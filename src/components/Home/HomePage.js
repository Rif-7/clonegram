import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Sidebar from "./Cards/Sidebar";
import "./Home.css";
import PublicHomePage from "./PublicHomePage";
import UserHomePage from "./UserHomePage";

const HomePage = () => {
  const userInfo = useSelector((state) => state.user);
  return (
    <div className="home">
      {userInfo.user ? <UserHomePage /> : <PublicHomePage />}
      <Sidebar />
      <Link to="/new-post">
        <button className="new-post-btn">New</button>
      </Link>
    </div>
  );
};

export default HomePage;
