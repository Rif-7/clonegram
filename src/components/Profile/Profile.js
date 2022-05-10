import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

import PostList from "./Cards/PostList";
import ProfileCard from "./Cards/ProfileCard";

import "./Profile.css";

const Profile = () => {
  const user = useSelector((state) => state.user);

  if (!user.user) {
    return <Navigate replace to="/login"></Navigate>;
  }
  return (
    <div className="profile-container">
      <ProfileCard />
      <PostList />
    </div>
  );
};

export default Profile;
