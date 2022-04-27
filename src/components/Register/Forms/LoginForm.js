import React, { useState } from "react";
import { useForm } from "react-hook-form";
import LoadingFormIndicator from "./LoadingFormIndicator";

const LoginForm = ({ loginUser }) => {
  const [currentFormState, setCurrentFormState] = useState("idle");
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = (data) => {
    setCurrentFormState("loading");
    loginUser(data).then(() => {
      setCurrentFormState("idle");
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="input-field">
        <label htmlFor="email">Email: </label>
        <input
          type="email"
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
          placeholder="Enter Your Password"
          {...register("password")}
        ></input>
      </div>

      <p className="error-field">{errors[Object.keys(errors)[0]]?.message}</p>

      {currentFormState === "idle" ? (
        <button className="submit-btn">Login</button>
      ) : (
        <LoadingFormIndicator />
      )}
    </form>
  );
};

export default LoginForm;
