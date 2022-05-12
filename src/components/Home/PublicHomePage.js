import React, { useEffect, useState } from "react";
import { getLatestPosts } from "../../FirebaseFunctions";

import PostContainer from "./Cards/PostContainer";
import LoadingFormIndicator from "../Register/Forms/LoadingFormIndicator";

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
        <LoadingFormIndicator />
      ) : (
        posts.map((post) => (
          <PostContainer
            title={post.postTitle}
            caption={post.postCaption}
            imgUrl={post.postImage}
            timeStamp={post.timeStamp}
          />
        ))
      )}
    </div>
  );
};

export default PublicHomePage;
