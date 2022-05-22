import React, { useEffect, useRef, useState } from "react";
import { getFollowersPosts, getLatestPosts } from "../../FirebaseFunctions";
import PostContainer from "./Cards/PostContainer";
import ReactLoading from "react-loading";

const UserHomePage = ({ filter, updateFilter }) => {
  const [posts, setPosts] = useState([]);
  const [alert, setAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLastDivVisible, setIsLastDivVisible] = useState(false);
  const [lastPost, setLastPost] = useState(null);
  const lastDiv = useRef();

  useEffect(() => {
    window.addEventListener("scroll", scrollHandler);
    setLastPost(null);
    handlePosts();

    return () => window.removeEventListener("scroll", scrollHandler);
  }, [filter]);

  const scrollHandler = () => {
    if (isLoading) {
      return;
    } else if (
      lastDiv.current &&
      window.pageYOffset + window.innerHeight >= lastDiv.current.offsetTop
    ) {
      console.log("here");
      updateVisibility(true);
    }
  };

  const updateVisibility = (value) =>
    value !== isLastDivVisible ? setIsLastDivVisible(value) : null;

  const handlePosts = async (filterChanged = true) => {
    let lastPosts = posts;
    if (filterChanged) {
      lastPosts = [];
      setLastPost(null);
      setPosts([]);
    } else {
      setIsLoading(true);
    }
    setAlert(null);
    switch (filter) {
      case "all":
        const publicPosts = await getLatestPosts(lastPost);
        if (publicPosts === "error") {
          return;
        }
        if (lastPost === publicPosts.lastDoc) {
          return;
        }
        setLastPost(publicPosts.lastDoc);
        setPosts(lastPosts.concat(publicPosts.posts));
        setIsLoading(false);
        setIsLastDivVisible(false);
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
        setIsLoading(false);
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
  } else if (isLastDivVisible && !isLoading) {
    handlePosts(false);
  }

  return (
    <div className="user-home-page home-container">
      {posts.length === 0 ? (
        <ReactLoading type="spin" color="#3d405b" height="60px" width="60px" />
      ) : (
        <>
          {posts.map((post, index) => (
            <PostContainer
              title={post.postTitle}
              caption={post.postCaption}
              imgUrl={post.postImage}
              timeStamp={post.timeStamp}
              userId={post.uid}
              id={post.id}
              key={index}
            />
          ))}
          <div ref={lastDiv}></div>
        </>
      )}
    </div>
  );
};

export default UserHomePage;
