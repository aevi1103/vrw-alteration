// contexts/FirebaseContext.tsx

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { initializeApp, FirebaseApp } from "firebase/app";
import { Analytics, getAnalytics } from "firebase/analytics";

interface FirebaseContextType {
  app: FirebaseApp | undefined;
  analytics: Analytics | undefined;
}

interface FirebaseProviderProps {
  children: ReactNode;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(
  undefined
);

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error("useFirebase must be used within a FirebaseProvider");
  }
  return context;
}

export function FirebaseProvider({ children }: FirebaseProviderProps) {
  const [app, setApp] = useState<FirebaseApp>();
  const [analytics, setAnalytics] = useState<Analytics>();

  useEffect(() => {
    const app = initializeApp({
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    });
    setApp(app);
    if (typeof window !== "undefined") {
      const res = getAnalytics(app);
      setAnalytics(res);
    }
  }, []);

  return (
    <FirebaseContext.Provider value={{ app, analytics }}>
      {children}
    </FirebaseContext.Provider>
  );
}
