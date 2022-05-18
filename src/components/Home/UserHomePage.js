import React, { useEffect, useState } from "react";
import { getFollowersPosts, getLatestPosts } from "../../FirebaseFunctions";
import LoadingFormIndicator from "../Register/Forms/LoadingFormIndicator";
import PostContainer from "./Cards/PostContainer";

const UserHomePage = () => {
  const [posts, setPosts] = useState([]);
  const [alert, setAlert] = useState(null);
  const [filter, setFilter] = useState(null);
  useEffect(() => {
    handlePosts();
  }, []);

  useEffect(() => {
    if (!filter) {
      return;
    }
    filterPosts();
  }, [filter]);

  const handlePosts = async () => {
    const result = await getFollowersPosts();
    if (result === "error") {
      return;
    } else if (result === "error/no-followings") {
      setAlert("Not Following Anyone");
      return;
    }
    setPosts(result.reverse());
  };

  const filterPosts = async () => {
    switch (filter) {
      case "public":
        const publicPosts = await getLatestPosts();
        if (publicPosts === "error") {
          return;
        }
        setPosts(publicPosts.reverse());
        return;

      default:
        return;
    }
  };

  const updateFilter = (filterName) => {
    if (filter === filterName) {
      return;
    }
    setFilter(filterName);
    setAlert(null);
  };

  if (alert) {
    return (
      <div className="home-container">
        <div className="home-alert">{alert}</div>
        <div className="show-all" onClick={() => updateFilter("public")}>
          Show All Posts
        </div>
      </div>
    );
  }

  return (
    <div className="user-home-page home-container">
      {posts.length === 0 ? (
        <LoadingFormIndicator />
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

export default UserHomePage;
