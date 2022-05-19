import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getSimilarUsers } from "../../../FirebaseFunctions";

const Sidebar = () => {
  const userInfo = useSelector((state) => state.user);
  const [usernameField, setUsernameField] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!usernameField) {
      setUsers([]);
      return;
    }
    getUsers();
  }, [usernameField]);

  const updateUsernameField = (e) => {
    setUsernameField(e.target.value);
  };

  const getUsers = async () => {
    setIsSearching(true);
    const result = await getSimilarUsers(usernameField);
    if (result === "error") {
      setIsSearching(false);
      return;
    }
    setUsers(result);
    setIsSearching(false);
  };

  const renderedUsers = () => {
    if (isSearching) {
      return <span>Loading</span>;
    } else if (!users.length) {
      return null;
    }
    return (
      <ul>
        {users.map((user, index) => {
          return (
            <li key={index}>
              <Link replace to={`/user/${user.uid}`}>
                @{user.username}
              </Link>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="sidebar">
      <div className="sort-field">
        <label htmlFor="sort-posts">Sort by:</label>
        <select id="sort-posts" name="sort">
          {userInfo.user ? (
            <optgroup label="Users">
              <option value="following">Following</option>
              <option value="followers">Followers</option>
              <option value="all">All</option>
            </optgroup>
          ) : (
            <option value="all">All</option>
          )}
        </select>
      </div>
      <div className="search-field">
        <label htmlFor="search-user">Search User: </label>
        <input
          type="text"
          id="search-user"
          value={usernameField}
          onChange={updateUsernameField}
        ></input>
        {renderedUsers()}
      </div>
    </div>
  );
};

export default Sidebar;
