import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { useDispatch, useSelector } from "react-redux";
import { userLoggedOut } from "../../features/user/userSlice";

const Navbar = () => {
  const isLoggedIn = useSelector((state) => state.user.user);

  const dispatch = useDispatch();
  const logoutUser = () => {
    dispatch(userLoggedOut());
  };

  // if user is logged show option to logout else show options to login in
  const renderedListItems = isLoggedIn ? (
    <>
      <li className="nav-link">
        <Link to="#">Profile</Link>
      </li>
      <li className="nav-link">
        <Link to="#" onClick={logoutUser}>
          Logout
        </Link>
      </li>
    </>
  ) : (
    <>
      <li className="nav-link">
        <Link to="login">Login</Link>
      </li>
      <li className="nav-link">
        <Link to="#">SignUp</Link>
      </li>
    </>
  );

  return (
    <nav>
      <Link className="nav-header" to="#">
        Clonegram
      </Link>
      <ul className="nav-links">{renderedListItems}</ul>
    </nav>
  );
};

export default Navbar;
