import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUsersPosts } from "../../../FirebaseFunctions";
import LoadingFormIndicator from "../../Register/Forms/LoadingFormIndicator";
import PostCard from "./PostCard";

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const userId = useSelector((state) => state.user.uid);
  useEffect(() => {
    getPosts();
  });
  const getPosts = async () => {
    const userPostSnap = await getUsersPosts(userId);
    if (userPostSnap === "error") {
      return;
    }
    setPosts(userPostSnap);
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
    <div className="post-list">
      {posts.length === 0 ? <LoadingFormIndicator /> : renderedPosts}
    </div>
  );
};

export default PostList;
