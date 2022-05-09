import React from "react";

const PostCard = ({ title, imgUrl }) => {
  return (
    <div className="post-card">
      <img src={imgUrl} alt="post" className="post-card-image"></img>
      <div className="post-card-title">{title}</div>
    </div>
  );
};

export default PostCard;
