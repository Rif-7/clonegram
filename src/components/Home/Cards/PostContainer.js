import React from "react";

const PostContainer = ({ title, caption, imgUrl, timeStamp }) => {
  return (
    <div className="post-view">
      <div className="title">
        {title} <span className="time-stamp">{timeStamp}</span>
      </div>
      <img src={imgUrl} alt="post" className="post-image"></img>
      <div className="caption">{caption}</div>
    </div>
  );
};

export default PostContainer;
