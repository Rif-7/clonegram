import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserInfo, getUsersPosts } from "../../FirebaseFunctions";

import PostCard from "../Profile/Cards/PostCard";

import "./UserPage.css";

const UserPage = () => {
  const { userId } = useParams();
  const [userInfo, setUserInfo] = useState(null);
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    handleUserInfo();
    handleUserPosts();
  }, []);

  const handleUserInfo = async () => {
    const result = await getUserInfo(userId);
    if (result === "error") {
      return;
    }
    setUserInfo(result);
  };

  const handleUserPosts = async () => {
    const result = await getUsersPosts(userId);
    if (result === "error") {
      return;
    }
    setPosts(result);
  };

  let renderedPosts = null;
  if (posts.length !== 0) {
    renderedPosts = posts.map((post, index) => {
      return (
        <PostCard title={post.postTitle} imgUrl={post.postImage} key={index} />
      );
    });
  }

  return (
    <div className="user-page">
      <div className="user-page-info">
        {userInfo && (
          <>
            <img src={userInfo.displayPic} alt="profile"></img>
            <div className="text-info">
              <div className="username">
                {userInfo.username}
                <button className="follow-btn">Follow</button>
              </div>
              <div className="date-of-birth">{userInfo.dateOfBirth}</div>
              <div className="description">{userInfo.description}</div>
              <div className="followers">Followers: 6</div>
              <div className="following">Following: 8</div>
            </div>
          </>
        )}
      </div>
      <div className="post-list">{renderedPosts}</div>
    </div>
  );
};

export default UserPage;
