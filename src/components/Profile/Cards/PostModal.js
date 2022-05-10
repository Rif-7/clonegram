import React, { useEffect, useState } from "react";
import { getPostInfo } from "../../../FirebaseFunctions";
import LoadingFormIndicator from "../../Register/Forms/LoadingFormIndicator";

const PostModal = ({ id, onCloseClicked }) => {
  const [postInfo, setPostInfo] = useState(null);
  useEffect(() => {
    handlePostInfo();
  }, []);

  const handlePostInfo = async () => {
    const postSnap = await getPostInfo(id);
    if (postSnap === "error") {
      return;
    }
    setPostInfo({
      title: postSnap.postTitle,
      imgUrl: postSnap.postImage,
      caption: postSnap.postCaption,
    });
  };

  return (
    <div className="post-modal">
      <div className="post-container">
        {!postInfo ? (
          <LoadingFormIndicator />
        ) : (
          <>
            <button className="close-modal" onClick={onCloseClicked}>
              Close
            </button>
            <div className="title">{postInfo.title}</div>
            <img
              className="img-container"
              src={postInfo.imgUrl}
              alt="post"
            ></img>
            <div className="caption">{postInfo.caption}</div>
          </>
        )}
      </div>
    </div>
  );
};

export default PostModal;
