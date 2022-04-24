import React, { useEffect, useState, createRef } from "react";
import "./Register.css";
import { useForm } from "react-hook-form";

const Register = () => {
  const [accountCreated, setAccountCreated] = useState(false);

  const onAccountCreated = () => setAccountCreated(true);

  return (
    <div className="login-container">
      <div className="login-card">
        <p className="header">Register</p>
        {!accountCreated ? (
          <RegisterForm onAccountCreated={onAccountCreated} />
        ) : null}
      </div>
    </div>
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
    onAccountCreated();
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
          {...register("password", {
            required: "Password Is Required",
            minLength: {
              message: "Password Should Be Atleast 8 characters",
              value: 8,
            },
          })}
        ></input>
      </div>
      <div className="input-field">
        <label htmlFor="confirm-password">Confirm Password: </label>
        <input
          type="password"
          id="confirm-password"
          {...register("confirmPassword", {
            required: "Re-enter Your Password",
            minLength: {
              message: "Password Should Be Atleast 8 characters",
              value: 8,
            },
          })}
        ></input>
      </div>

      <button className="next-btn" ref={nextBtn}>
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
