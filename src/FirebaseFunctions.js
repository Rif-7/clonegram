import { ref, uploadBytes } from "firebase/storage";
import { storage, store } from "./App";
import { collection, where, limit, query, getDocs } from "firebase/firestore";

const uploadDisplayPicture = async (picture, uid) => {
  const userStorageRef = ref(storage, uid);
  const displayPicRef = ref(userStorageRef, "displayPic");
  return await uploadBytes(displayPicRef, picture);
};

const checkIfUsernameTaken = async (username) => {
  const usernameQuery = query(
    collection(store, "users"),
    where("username", "==", username),
    limit(1)
  );

  const userNameQueryResults = await getDocs(usernameQuery);

  // this returns undefined if there is no user
  if (userNameQueryResults.docs[0]) {
    return true;
  }
  return false;
};

const getUserInfo = async (uid) => {
  const userQuery = query(
    collection(store, "users"),
    where("uid", "==", uid),
    limit(1)
  );

  const userDocs = await getDocs(userQuery);
  return userDocs.docs[0]?.data();
};

export { uploadDisplayPicture, checkIfUsernameTaken, getUserInfo };
