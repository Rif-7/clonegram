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
  updateDoc,
  orderBy,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

const convertTimeStamp = (post) => {
  return (
    post.timeStamp.toDate().toDateString() +
    " " +
    post.timeStamp.toDate().toLocaleTimeString()
  );
};

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
  try {
    const userQuery = query(
      collection(store, "users"),
      where("uid", "==", uid),
      limit(1)
    );

    const userDocs = await getDocs(userQuery);
    return { ...userDocs.docs[0].data(), refId: userDocs.docs[0].id };
  } catch (error) {
    console.log(error);
    return "error";
  }
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
      limit(20),
      orderBy("timeStamp")
    );
    const postsSnap = await getDocs(postQuery);

    return postsSnap.docs.map((post) => {
      const timeStamp = convertTimeStamp(post.data());
      return { ...post.data(), id: post.id, timeStamp };
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
    const timeStamp = convertTimeStamp(postSnap.data());
    return { ...postSnap.data(), timeStamp };
  } catch (error) {
    console.log(error);
    return "error";
  }
};

const updatePost = async (postRefId, updatedTitle, updatedCaption) => {
  try {
    const postRef = doc(store, "posts", postRefId);
    return await updateDoc(postRef, {
      postTitle: updatedTitle,
      postCaption: updatedCaption,
    });
  } catch (error) {
    console.log(error);
    return "error";
  }
};

const getLatestPosts = async () => {
  try {
    const postQuery = query(
      collection(store, "posts"),
      orderBy("timeStamp"),
      limit(15)
    );
    const postsSnap = await getDocs(postQuery);
    return postsSnap.docs.map((post) => {
      const timeStamp = convertTimeStamp(post.data());
      return { ...post.data(), id: post.id, timeStamp };
    });
  } catch (error) {
    console.log(error);
    return "error";
  }
};

const addUserToFollowersList = async (signedUsersId, followingUsersId) => {
  try {
  } catch (error) {
    console.log(error);
    return "error";
  }
};

const followUser = async (signedUsersId, signedUsername, followingUsersId) => {
  if (signedUsersId === followingUsersId || !signedUsersId) {
    return "error";
  }
  try {
    const followRef = doc(
      store,
      "users",
      followingUsersId,
      "followers",
      signedUsersId
    );
    return await setDoc(followRef, {
      username: signedUsername,
      timeStamp: serverTimestamp(),
    });
  } catch (error) {
    console.log(error);
    return "error";
  }
};

const unfollowUser = async (signedUsersId, followingUsersId) => {
  try {
    const followRef = doc(
      store,
      "users",
      followingUsersId,
      "followers",
      signedUsersId
    );
    await deleteDoc(followRef);
  } catch (error) {
    console.log(error);
    return "error";
  }
};

const checkIfUserIsFollowing = async (signedUsersId, followingUsersId) => {
  try {
    const followRef = doc(
      store,
      "users",
      followingUsersId,
      "followers",
      signedUsersId
    );
    const docSnap = await getDoc(followRef);
    return docSnap.exists();
  } catch (error) {
    console.log(error);
    return "error";
  }
};

const getFollowersList = async (userId) => {
  try {
    const followersRef = collection(store, "users", userId, "followers");
    const followersSnap = await getDocs(followersRef);
    return followersSnap.docs;
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
  updatePost,
  getLatestPosts,
  followUser,
  checkIfUserIsFollowing,
  unfollowUser,
  getFollowersList,
  addUserToFollowersList,
};
