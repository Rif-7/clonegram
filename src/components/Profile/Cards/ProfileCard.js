import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";

const ProfileCard = () => {
  const userInfo = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);

  const { user, description, dateOfBirth } = userInfo;

  const toggleCardStatus = () => setIsEditing(!isEditing);

  const childComponentProps = {
    username: user,
    description,
    dateOfBirth,
    displayPic: "",
  };

  if (isEditing) {
    return (
      <UpdateProfileForm {...childComponentProps} onUpdate={toggleCardStatus} />
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
  displayPic,
  description,
  dateOfBirth,
  onUpdate,
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

  const onSubmit = (data) => {
    console.log(data);
    onUpdate();
  };

  const error = errors[Object.keys(errors)[0]]?.message || null;

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
      <button className="update-btn">Update Profile</button>
    </form>
  );
};

export default ProfileCard;
