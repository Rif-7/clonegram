import React, { useEffect, useState, createRef } from "react";
import "./Register.css";
import { useForm } from "react-hook-form";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";

import { auth, store } from "../../App";
import { userLoggedIn } from "../../features/user/userSlice";
import { useDispatch } from "react-redux";

const Register = () => {
  const [accountCreated, setAccountCreated] = useState(false);
  const [uid, setUID] = useState(null);
  const dispatch = useDispatch();

  const onAccountCreated = (userCredentials) => {
    setAccountCreated(true);
    setUID(userCredentials.user.uid);
  };

  const createUserProfile = (userData, submitBtn) => {
    submitBtn.current.disabled = true;
    if (!uid) {
      console.log("No UID Found");
      return;
    }
    const { username, dateOfBirth, description = "" } = userData;
    addDoc(collection(store, "users"), {
      uid,
      username,
      dateOfBirth,
      description,
    })
      .then((data) => {
        console.log(data);
        dispatch(userLoggedIn({ user: username, userId: uid }));
      })
      .catch((error) => {
        console.log(error);
        submitBtn.current.disabled = false;
      });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <p className="header">Register</p>

        {!accountCreated ? (
          <RegisterForm onAccountCreated={onAccountCreated} />
        ) : (
          <SetUserProfileForm createUserProfile={createUserProfile} />
        )}
      </div>
    </div>
  );
};

const SetUserProfileForm = ({ createUserProfile }) => {
  const createBtn = createRef();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    createUserProfile(data, createBtn);
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
      <button className="submit-btn" ref={createBtn}>
        Create
      </button>
    </form>
  );
};

const RegisterForm = ({ onAccountCreated }) => {
  const [customError, setCustomError] = useState("");
  const nextBtn = createRef();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    nextBtn.current.click();
  }, []);

  const updateError = (value) => {
    if (customError !== value) {
      setCustomError(value);
    }
  };

  const onFormSubmit = (data) => {
    if (customError !== null) {
      return;
    }
    nextBtn.current.disabled = true;
    const { email, password } = data;
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        onAccountCreated(userCredentials);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  // this returns undefined if there are no errors
  const currentError = errors[Object.keys(errors)[0]]?.message;
  // if there is an error update the current error with new error
  if (currentError) {
    updateError(currentError);
  } else if (password !== confirmPassword && !currentError) {
    updateError("Passwords Do Not Match");
  } else if (!currentError) {
    updateError(null);
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <div className="input-field">
        <label htmlFor="email">Email: </label>
        <input
          type="text"
          id="email"
          placeholder="example@domain.com"
          {...register("email", {
            required: "Email Is Required",
            pattern: {
              value:
                /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
              message: "Invalid Email Format",
            },
          })}
        ></input>
      </div>
      <div className="input-field">
        <label htmlFor="password">Password: </label>
        <input
          type="password"
          id="password"
          placeholder="Enter your password"
          {...register("password", {
            required: "Password Is Required",
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,16}$/,
              message:
                "Password Should Be 8-16 Characters And Contain Atleast 1 Uppercase Letter, 1 Lowercase Letter And 1 Numeric Value",
            },
          })}
        ></input>
      </div>
      <div className="input-field">
        <label htmlFor="confirm-password">Confirm Password: </label>
        <input
          type="password"
          id="confirm-password"
          placeholder="Confirm your password"
          {...register("confirmPassword", {
            required: "Re-enter Your Password",
          })}
        ></input>
      </div>

      <button className="next-btn submit-btn" ref={nextBtn}>
        Next
      </button>

      {customError ? (
        <p className="error-field">{customError}</p>
      ) : (
        <p className="success-field">Good To Go</p>
      )}
    </form>
  );
};

export default Register;
