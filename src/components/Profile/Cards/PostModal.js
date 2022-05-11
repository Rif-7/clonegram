import React, { useEffect, useState } from "react";
import { getPostInfo, updatePost } from "../../../FirebaseFunctions";
import LoadingFormIndicator from "../../Register/Forms/LoadingFormIndicator";

const PostModal = ({ id, onCloseClicked }) => {
  const [postInfo, setPostInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(null);
  const [updatedCaption, setUpdatedCaption] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

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

  const updatePostInfo = async () => {
    if (!updatedTitle) {
      return;
    }
    return await updatePost(id, updatedTitle, updatedCaption);
  };

  const handleEditMode = async (e) => {
    if (isEditing) {
      setIsUpdating(true);
      const result = await updatePostInfo();
      if (result === "error") {
        setIsUpdating(false);
        return;
      }
      setPostInfo({
        ...postInfo,
        title: updatedTitle,
        caption: updatedCaption,
      });
      setUpdatedTitle(null);
      setUpdatedCaption(null);
      setIsUpdating(false);
    } else {
      setUpdatedTitle(postInfo.title);
      setUpdatedCaption(postInfo.caption);
    }
    setIsEditing(!isEditing);
    e.target.disabled = false;
  };
  const updateTitleValue = (e) => setUpdatedTitle(e.target.value);
  const updateCaptionValue = (e) => setUpdatedCaption(e.target.value);

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
            {isEditing ? (
              <input
                onChange={updateTitleValue}
                type="text"
                value={updatedTitle}
              ></input>
            ) : (
              <div className="title">{postInfo.title}</div>
            )}
            <img
              className="img-container"
              src={postInfo.imgUrl}
              alt="post"
            ></img>
            {isEditing ? (
              <textarea
                onChange={updateCaptionValue}
                value={updatedCaption}
              ></textarea>
            ) : (
              <div className="caption">{postInfo.caption}</div>
            )}
            {isUpdating ? (
              <LoadingFormIndicator />
            ) : (
              <button className="submit-btn" onClick={handleEditMode}>
                Update
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PostModal;
