import React, { useState } from "react";
import "./Register.css";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";

import { auth, store } from "../../App";
import { userLoggedIn } from "../../features/user/userSlice";
import { useDispatch } from "react-redux";

import UserProfileForm from "./Forms/UserProfileForm";
import RegisterForm from "./Forms/RegisterForm";

const Register = () => {
  const [accountCreated, setAccountCreated] = useState(false);
  const [uid, setUID] = useState(null);
  const dispatch = useDispatch();

  const onAccountCreated = (userCredentials) => {
    setAccountCreated(true);
    setUID(userCredentials.user.uid);
  };

  const createUserAccount = (data) => {
    const { email, password } = data;
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        onAccountCreated(userCredentials);
      })
      .catch((error) => {
        console.log(error);
      });
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
          <RegisterForm createAccount={createUserAccount} />
        ) : (
          <UserProfileForm createUserProfile={createUserProfile} />
        )}
      </div>
    </div>
  );
};

export default Register;
