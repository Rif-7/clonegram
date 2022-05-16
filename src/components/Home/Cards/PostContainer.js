import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getUserInfo,
  likePost,
  unLikePost,
  checkIfUserLikedPost,
} from "../../../FirebaseFunctions";

const PostContainer = ({ title, caption, imgUrl, timeStamp, userId, id }) => {
  const [username, setUsername] = useState("loading");
  const [isLiked, setIsLiked] = useState(null);
  useEffect(() => {
    handleUsername();
    handleLike();
  }, []);

  const handleUsername = async () => {
    const userInfo = await getUserInfo(userId);
    setUsername(userInfo.username);
  };

  const handleLike = async () => {
    const result = await checkIfUserLikedPost(id);
    if (result === "error") {
      return;
    }
    setIsLiked(result);
  };

  const onLikeClicked = async () => {
    if (isLiked === null) {
      return;
    }
    const result = await likePost(id);
    if (result === "error") {
      return;
    }
    setIsLiked(true);
  };

  const onUnlikeClicked = async () => {
    if (isLiked === null) {
      return;
    }
    const result = await unLikePost(id);
    if (result === "error") {
      return;
    }
    setIsLiked(false);
  };

  return (
    <div className="post-view">
      <Link to={`/user/${userId}`} className="post-user">
        @{username}
      </Link>
      <div className="title">
        {title} <span className="time-stamp">{timeStamp}</span>
      </div>
      <img src={imgUrl} alt="post" className="post-image"></img>
      {isLiked ? (
        <button className="like-btn liked-btn" onClick={onUnlikeClicked}>
          Liked
        </button>
      ) : (
        <button className="like-btn" onClick={onLikeClicked}>
          Like
        </button>
      )}

      <div className="caption">{caption}</div>
    </div>
  );
};

export default PostContainer;
