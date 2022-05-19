import React, { useEffect, useState } from "react";
import { getLatestPosts } from "../../FirebaseFunctions";

import PostContainer from "./Cards/PostContainer";
import ReactLoading from "react-loading";

const PublicHomePage = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    handlePosts();
  }, []);

  const handlePosts = async () => {
    const result = await getLatestPosts();
    if (result === "error") {
      return;
    }
    setPosts(result.reverse());
  };

  return (
    <div className="public-home-page home-container">
      {posts.length === 0 ? (
        <ReactLoading type="spin" color="#3d405b" height="60px" width="60px" />
      ) : (
        posts.map((post, index) => (
          <PostContainer
            title={post.postTitle}
            caption={post.postCaption}
            imgUrl={post.postImage}
            timeStamp={post.timeStamp}
            userId={post.uid}
            id={post.id}
            key={index}
          />
        ))
      )}
    </div>
  );
};

export default PublicHomePage;
