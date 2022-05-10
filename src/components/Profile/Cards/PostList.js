import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUsersPosts } from "../../../FirebaseFunctions";
import LoadingFormIndicator from "../../Register/Forms/LoadingFormIndicator";
import PostCard from "./PostCard";
import PostModal from "./PostModal";

const PostList = () => {
  const [viewPost, setViewPost] = useState(null);

  const [posts, setPosts] = useState([]);
  const userId = useSelector((state) => state.user.uid);
  useEffect(() => {
    getPosts();
  }, []);

  const getPosts = async () => {
    const userPostSnap = await getUsersPosts(userId);
    if (userPostSnap === "error") {
      return;
    }
    setPosts(userPostSnap);
  };

  // onPostClicked takes an id returns a function
  // that sets the viewPost state value to that id
  const onPostClicked = (id) => () => setViewPost(id);
  const onCloseClicked = () => setViewPost(null);

  let renderedPosts = null;
  if (posts.length !== 0) {
    renderedPosts = posts.map((post, index) => {
      return (
        <PostCard
          title={post.postTitle}
          imgUrl={post.postImage}
          key={index}
          onClicked={onPostClicked(post.id)}
        />
      );
    });
  }

  return (
    <div className="post-list">
      {posts.length === 0 ? <LoadingFormIndicator /> : renderedPosts}
      {viewPost ? (
        <PostModal id={viewPost} onCloseClicked={onCloseClicked} />
      ) : null}
    </div>
  );
};

export default PostList;
