import React, { createRef, useState } from "react";
import { useForm } from "react-hook-form";

import LoadingFormIndicator from "./LoadingFormIndicator";

const UserProfileForm = ({ createUserProfile }) => {
  const createBtn = createRef();
  const [currentFormState, setCurrentFormState] = useState("idle");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    setCurrentFormState("loading");
    createUserProfile(data, createBtn).then(() => {
      setCurrentFormState("idle");
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="input-field">
        <label htmlFor="username">Username: </label>
        <input
          id="username"
          type="text"
          placeholder="bob123"
          {...register("username", {
            required: "Username Is Required",
            minLength: {
              value: "4",
              message: "Username Should be Atleast 4 Characters",
            },
            maxLength: {
              value: "12",
              message: "Username Should Be Less than 12 Characters",
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
        <label htmlFor="date">Date Of Birth: </label>
        <input
          type="date"
          {...register("dateOfBirth", {
            required: "Date Of Birth Is Required",
          })}
        ></input>
      </div>
      <div className="input-field">
        <label htmlFor="description">Description: </label>
        <textarea
          id="description"
          placeholder="Say Something About Yourself..."
          {...register("description")}
        ></textarea>
      </div>
      <p className="error-field">{errors[Object.keys(errors)[0]]?.message}</p>
      {currentFormState === "idle" ? (
        <button className="submit-btn" ref={createBtn}>
          Create
        </button>
      ) : (
        <LoadingFormIndicator />
      )}
    </form>
  );
};

export default UserProfileForm;
