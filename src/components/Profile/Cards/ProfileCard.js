import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import {
  collection,
  getDocs,
  limit,
  query,
  updateDoc,
  where,
  doc,
} from "firebase/firestore";
import { store } from "../../../App";

import LoadingFormIndicator from "../../Register/Forms/LoadingFormIndicator";
import { userUpdated } from "../../../features/user/userSlice";

const ProfileCard = () => {
  const userInfo = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useDispatch();

  const { user, uid, description, dateOfBirth } = userInfo;

  const toggleCardStatus = () => setIsEditing(!isEditing);

  const checkIfUsernameTaken = async (username) => {
    const usernameQuery = query(
      collection(store, "users"),
      where("username", "==", username),
      limit(1)
    );

    const userNameQueryResults = await getDocs(usernameQuery);
    if (userNameQueryResults.docs[0]) {
      return true;
    }
    return false;
  };

  const updateUserProfile = async (newUserInfo) => {
    const { username, dateOfBirth, description } = newUserInfo;
    if (!(username === userInfo.user)) {
      const isUsernameTaken = await checkIfUsernameTaken(username);
      if (isUsernameTaken) {
        return "username taken";
      }
    }

    const userQuery = query(
      collection(store, "users"),
      where("uid", "==", uid),
      limit(1)
    );
    const userDoc = await getDocs(userQuery);
    const userRefId = userDoc.docs[0]?.id;
    if (!userRefId) {
      console.log("User info not found");
      return;
    }

    const userRef = doc(store, "users", userRefId);
    await updateDoc(userRef, {
      username,
      dateOfBirth,
      description,
    });
    dispatch(userUpdated({ username, description, dateOfBirth }));
    toggleCardStatus();
  };

  const childComponentProps = {
    username: user,
    description,
    dateOfBirth,
    displayPic: "",
  };

  if (isEditing) {
    return (
      <UpdateProfileForm
        {...childComponentProps}
        onUpdate={updateUserProfile}
        toggleCardStatus={toggleCardStatus}
      />
    );
  }

  return (
    <div className="profile-card">
      <ProfileView
        {...childComponentProps}
        onUpdateClicked={toggleCardStatus}
      />
    </div>
  );
};

const ProfileView = ({
  username,
  displayPic,
  description,
  dateOfBirth,
  onUpdateClicked,
}) => {
  let convertedDate = new Date(dateOfBirth);
  convertedDate = convertedDate.toDateString();

  return (
    <>
      {displayPic ? (
        <img src={displayPic} alt="display-pic" className="display-pic"></img>
      ) : (
        <div className="no-dp">No Display Picture Uploaded</div>
      )}
      <div className="follow-data">
        <div className="followers">Followers: 23</div>
        <div className="following">Following: 30</div>
      </div>
      <p className="username">{username}</p>
      <p className="description">{description}</p>
      <p className="date-of-birth">{convertedDate}</p>
      <button className="update-btn" onClick={onUpdateClicked}>
        Edit Profile
      </button>
    </>
  );
};

const UpdateProfileForm = ({
  username,
  description,
  dateOfBirth,
  onUpdate,
  toggleCardStatus,
}) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      username,
      description,
      dateOfBirth,
    },
  });

  const [customError, setCustomError] = useState(null);
  const [formStatus, setFormStatus] = useState("idle");

  const onSubmit = async (data) => {
    setFormStatus("loading");
    const result = await onUpdate(data);
    if (result === "username taken") {
      setCustomError("Username Taken");
    }
    setFormStatus("idle");
  };

  const error = errors[Object.keys(errors)[0]]?.message || customError;

  return (
    <form className="profile-card" onSubmit={handleSubmit(onSubmit)}>
      <div className="input-field display-pic-field">
        <label htmlFor="display-pic">Display Picture: </label>
        <input type="file" id="display-pic" accept="image/*"></input>
      </div>
      <div className="error-field">{error}</div>
      <div className="input-field">
        <label htmlFor="username">Username: </label>
        <input
          type="text"
          id="username"
          {...register("username", {
            required: "Username Is Required",
            minLength: {
              value: "4",
              message: "Username Should be Atleast 4 Characters",
            },
            maxLength: {
              value: "20",
              message: "Username Should Be Less than 20 Characters",
            },
            pattern: {
              value: /^[a-zA-Z0-9-]+$/,
              message:
                "Username Should Only Contain Letters, Numbers and '-' Symbol",
            },
          })}
        ></input>
      </div>

      <div className="input-field">
        <label htmlFor="date-of-birth">Date Of Birth: </label>
        <input
          type="date"
          {...register("dateOfBirth", {
            required: "Date Of Birth Is Required",
          })}
        ></input>
      </div>

      <div className="input-field">
        <label htmlFor="description">Description:</label>
        <textarea id="description" {...register("description")}></textarea>
      </div>
      {formStatus === "idle" ? (
        <div className="button-div">
          <button className="update-btn">Update Profile</button>
          <button
            type="button"
            className="update-btn"
            onClick={toggleCardStatus}
          >
            Cancel
          </button>
        </div>
      ) : (
        <LoadingFormIndicator />
      )}
    </form>
  );
};

export default ProfileCard;
