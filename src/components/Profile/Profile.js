import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

import ProfileCard from "./Cards/ProfileCard";

import "./Profile.css";

const Profile = () => {
  const user = useSelector((state) => state.user.user);
  if (!user) {
    return <Navigate replace to="/login"></Navigate>;
  }
  return (
    <div className="profile-container">
      <ProfileCard />
      <div className="user-posts"></div>
    </div>
  );
};

export default Profile;
