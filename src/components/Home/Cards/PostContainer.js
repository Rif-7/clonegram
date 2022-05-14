import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUserInfo } from "../../../FirebaseFunctions";

const PostContainer = ({ title, caption, imgUrl, timeStamp, userId }) => {
  const [username, setUsername] = useState("loading");
  useEffect(() => {
    handleUsername();
  }, []);

  const handleUsername = async () => {
    const userInfo = await getUserInfo(userId);
    setUsername(userInfo.username);
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
      <div className="caption">{caption}</div>
    </div>
  );
};

export default PostContainer;
