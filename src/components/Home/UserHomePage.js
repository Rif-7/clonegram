import React, { useEffect, useState } from "react";
import { getFollowersPosts, getLatestPosts } from "../../FirebaseFunctions";
import LoadingFormIndicator from "../Register/Forms/LoadingFormIndicator";
import PostContainer from "./Cards/PostContainer";

const UserHomePage = ({ filter, updateFilter }) => {
  const [posts, setPosts] = useState([]);
  const [alert, setAlert] = useState(null);
  useEffect(() => {
    handlePosts();
  }, [filter]);

  const handlePosts = async () => {
    setAlert(null);
    setPosts([]);
    switch (filter) {
      case "all":
        const publicPosts = await getLatestPosts();
        if (publicPosts === "error") {
          return;
        }
        setPosts(publicPosts.reverse());
        return;

      case "following":
        const followersPosts = await getFollowersPosts("following");
        if (followersPosts === "error") {
          return;
        } else if (followersPosts === "error/no-followings") {
          setAlert("You're Not Following Anyone");
          return;
        }
        setPosts(followersPosts.reverse());
        return;

      case "followers":
        const followingUsersPost = await getFollowersPosts("followers");
        if (followingUsersPost === "error") {
          return;
        } else if (followingUsersPost === "error/no-followings") {
          setAlert("You've No Followers");
          return;
        }
        setPosts(followingUsersPost.reverse());
        return;

      default:
        setAlert("Invalid Filter");
        return;
    }
  };

  if (alert) {
    return (
      <div className="home-container">
        <div className="home-alert">{alert}</div>
        <div className="show-all" onClick={() => updateFilter("all")}>
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
