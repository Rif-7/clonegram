import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { initializeApp } from "firebase/app";

import Navbar from "./components/Navbar/Navbar";
import Register from "./components/Register/Register";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDSieWCEMtVfdXjD8j0LvFllv5G3KgrApo",
  authDomain: "clom-c8a86.firebaseapp.com",
  projectId: "clom-c8a86",
  storageBucket: "clom-c8a86.appspot.com",
  messagingSenderId: "275927124881",
  appId: "1:275927124881:web:e65a7e1eeacd2a13936830",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

function App() {
  return (
    <BrowserRouter>
      <Navbar isLoggedIn={false} />
      <Routes>
        <Route path="register" element={<Register />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
