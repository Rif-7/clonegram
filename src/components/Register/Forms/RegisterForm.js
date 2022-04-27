import React, { useEffect, useState, createRef } from "react";
import { useForm } from "react-hook-form";

import LoadingFormIndicator from "./LoadingFormIndicator";

const RegisterForm = ({ createAccount }) => {
  const [customError, setCustomError] = useState("");
  const [currentFormState, setCurrentFormState] = useState("idle");
  const nextBtn = createRef();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (nextBtn.current) {
      nextBtn.current.click();
    }
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
    setCurrentFormState("loading");
    nextBtn.current.disabled = true;
    createAccount(data)
      .then(() => {
        setCurrentFormState("idle");
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

      {currentFormState === "idle" ? (
        <button className="next-btn submit-btn" ref={nextBtn}>
          Next
        </button>
      ) : (
        <LoadingFormIndicator />
      )}

      {customError ? (
        <p className="error-field">{customError}</p>
      ) : (
        <p className="success-field">Good To Go</p>
      )}
    </form>
  );
};

export default RegisterForm;
