import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ isLoggedIn }) => {
  // if user is logged show option to logout else show options to login in
  const renderedListItems = isLoggedIn ? (
    <>
      <li className="nav-link">
        <Link to="#">Profile</Link>
      </li>
      <li className="nav-link">
        <Link to="#">Logout</Link>
      </li>
    </>
  ) : (
    <>
      <li className="nav-link">
        <Link to="#">Login</Link>
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
