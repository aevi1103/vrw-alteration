"use client";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

export const useFirebase = () => {
  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  // todo: move to env
  const firebaseConfig = {
    apiKey: "AIzaSyBmmWPEmjvlHYUB_1cVt-SJy4omRLmJ4Xo",
    authDomain: "vrw-alteration.firebaseapp.com",
    projectId: "vrw-alteration",
    storageBucket: "vrw-alteration.appspot.com",
    messagingSenderId: "932064742558",
    appId: "1:932064742558:web:63a19d4bf23bf635df7f8f",
    measurementId: "G-ZQZGQ357XS",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  let analytics;

  // if (typeof window != undefined) {
  //   analytics = getAnalytics(app);
  // }

  return { app, analytics };
};
