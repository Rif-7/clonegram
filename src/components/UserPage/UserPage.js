import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import {
  checkIfUserIsFollowing,
  followUser,
  getUserInfo,
  getUsersPosts,
  unfollowUser,
  getFollowInfo,
} from "../../FirebaseFunctions";
import { useSelector } from "react-redux";

import PostCard from "../Profile/Cards/PostCard";

import "./UserPage.css";

const UserPage = () => {
  const signedUser = useSelector((state) => state.user);
  const { userId } = useParams();
  const [userInfo, setUserInfo] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(null);
  const [followInfo, setFollowInfo] = useState({});

  useEffect(() => {
    handleUserInfo();
    handleUserPosts();
  }, []);

  const handleUserInfo = async () => {
    const result = await getUserInfo(userId);
    if (result === "error") {
      return;
    }
    handleFollowingInfo(result);
    setUserInfo(result);
  };

  const handleFollowingInfo = async (userInfo) => {
    if (!signedUser.uid) {
      return;
    }
    const isUserFollowing = await checkIfUserIsFollowing(
      signedUser.uid,
      userInfo.refId
    );
    if (isUserFollowing) {
      setIsFollowing("following");
    } else {
      setIsFollowing(false);
    }
    const followData = await getFollowInfo(userId);
    setFollowInfo(followData);
  };

  const handleUserPosts = async () => {
    const result = await getUsersPosts(userId);
    if (result === "error") {
      return;
    }
    setPosts(result);
  };

  const onFollowClicked = async (e) => {
    if (!signedUser.uid) {
      return;
    }
    e.target.classList.add("loading-btn");
    const result = await followUser(
      signedUser.uid,
      signedUser.user,
      userInfo.refId
    );
    if (result === "error") {
      e.target.classList.remove("loading-btn");
      return;
    }
    setIsFollowing("following");
    e.target.classList.remove("loading-btn");
  };

  const onUnfollowClicked = async (e) => {
    if (!signedUser.uid) {
      return;
    }
    e.target.classList.add("loading-btn");
    const result = await unfollowUser(signedUser.uid, userInfo.refId);
    if (result === "error") {
      e.target.classList.remove("loading-btn");
      return;
    }
    setIsFollowing(false);
    e.target.classList.remove("loading-btn");
  };

  let renderedPosts = null;
  if (posts.length !== 0) {
    renderedPosts = posts.map((post, index) => {
      return (
        <PostCard title={post.postTitle} imgUrl={post.postImage} key={index} />
      );
    });
  }

  if (signedUser.uid === userId) {
    return <Navigate replace to="/profile" />;
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
                {isFollowing === "following" ? (
                  <button className="follow-btn" onClick={onUnfollowClicked}>
                    Unfollow
                  </button>
                ) : (
                  <button className="follow-btn" onClick={onFollowClicked}>
                    Follow
                  </button>
                )}
              </div>
              <div className="date-of-birth">{userInfo.dateOfBirth}</div>
              <div className="description">{userInfo.description}</div>
              <div className="followers">
                Followers: {followInfo.followers?.length || 0}
              </div>
              <div className="following">
                Following: {followInfo.following?.length || 0}
              </div>
            </div>
          </>
        )}
      </div>
      <div className="post-list">{renderedPosts}</div>
    </div>
  );
};

export default UserPage;
