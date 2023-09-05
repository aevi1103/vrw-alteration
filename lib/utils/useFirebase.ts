"use client";
// Import the functions you need from the SDKs you need
import { FirebaseApp, initializeApp } from "firebase/app";
import { use, useEffect, useMemo, useState } from "react";
import { Analytics, getAnalytics } from "firebase/analytics";
import { FirebaseStorage, getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

export const useFirebase = () => {
  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional

  const [app, setApp] = useState<FirebaseApp>();
  const [analytics, setAnalytics] = useState<Analytics>();

  // todo: move to env
  const firebaseConfig = useMemo(
    () => ({
      apiKey: "AIzaSyBmmWPEmjvlHYUB_1cVt-SJy4omRLmJ4Xo",
      authDomain: "vrw-alteration.firebaseapp.com",
      projectId: "vrw-alteration",
      storageBucket: "vrw-alteration.appspot.com",
      messagingSenderId: "932064742558",
      appId: "1:932064742558:web:63a19d4bf23bf635df7f8f",
      measurementId: "G-ZQZGQ357XS",
    }),
    []
  );

  useEffect(() => {
    const app = initializeApp(firebaseConfig);
    setApp(app);
    if (typeof window !== "undefined") {
      const res = getAnalytics(app);
      setAnalytics(res);
    }
  }, [firebaseConfig]);

  // console.log("app", {
  //   app,
  //   analytics,
  // });

  return { app, analytics };
};
