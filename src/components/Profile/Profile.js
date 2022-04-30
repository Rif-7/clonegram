import React from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../../App";

import ProfileCard from "./Cards/ProfileCard";

import "./Profile.css";

const Profile = () => {
  if (!auth.currentUser) {
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
