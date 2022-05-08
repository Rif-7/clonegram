import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage, store } from "./App";
import {
  collection,
  where,
  limit,
  query,
  getDocs,
  addDoc,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

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

  const usernameQueryResults = await getDocs(usernameQuery);

  // this returns undefined if there is no user
  if (usernameQueryResults.docs[0]) {
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

const createNewPost = async (uid, data) => {
  const { postTitle, postCaption, postImage } = data;

  if (!postImage) {
    return "error/no-image-found";
  }

  try {
    // creates a location in the format "<user_id>/posts/<unique_id>"
    const ImageLocation = `${uid}/posts/${uuidv4()}`;
    const ImageRef = ref(storage, ImageLocation);
    const ImageSnapshot = await uploadBytes(ImageRef, postImage[0]);
    const postImageUrl = await getDownloadURL(ImageSnapshot.ref);

    return await addDoc(collection(store, "posts"), {
      uid,
      postTitle,
      postCaption,
      postImage: postImageUrl,
    });
  } catch (error) {
    console.log(error);
    return "error";
  }
};

export {
  uploadDisplayPicture,
  checkIfUsernameTaken,
  getUserInfo,
  createNewPost,
};
