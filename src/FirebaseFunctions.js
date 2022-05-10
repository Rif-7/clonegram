import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage, store } from "./App";
import {
  collection,
  where,
  limit,
  query,
  getDocs,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
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
  return !!usernameQueryResults.docs[0];
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
      timeStamp: serverTimestamp(),
      postImage: postImageUrl,
    });
  } catch (error) {
    console.log(error);
    return "error";
  }
};

const getUsersPosts = async (uid) => {
  try {
    const postQuery = query(
      collection(store, "posts"),
      where("uid", "==", uid),
      limit(20)
    );
    const postsSnap = await getDocs(postQuery);

    return postsSnap.docs.map((post) => {
      return { ...post.data(), id: post.id };
    });
  } catch (error) {
    console.log(error);
    return "error";
  }
};

const getPostInfo = async (postRefId) => {
  try {
    const postRef = doc(store, "posts", postRefId);
    const postSnap = await getDoc(postRef);
    return postSnap.data();
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
  getUsersPosts,
  getPostInfo,
};
