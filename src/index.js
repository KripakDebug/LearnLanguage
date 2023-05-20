import React, { createContext } from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import App from "./App";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const app = firebase.initializeApp({
  apiKey: "AIzaSyCM3Qkwp6uMYLrzA3i36Lw2YOVOHJq16Ok",
  authDomain: "learnlanguage-a7037.firebaseapp.com",
  projectId: "learnlanguage-a7037",
  storageBucket: "learnlanguage-a7037.appspot.com",
  messagingSenderId: "402695065800",
  appId: "1:402695065800:web:c884938f0a4cd227dc95fd",
  measurementId: "G-TEBT4WZ8GS",
});
const auth = firebase.auth();
const firestore = firebase.firestore();
export const Context = createContext(null);
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Context.Provider
      value={{
        firebase,
        auth,
        firestore,
      }}
    >
      <App />
    </Context.Provider>
  </React.StrictMode>
);
