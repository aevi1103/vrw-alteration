import React, { ReactNode } from "react";

export const Layout = ({
  firebaseConfig,
  children,
}: {
  firebaseConfig?: any;
  children: ReactNode;
}) => {
  console.log({ firebaseConfig });

  return <div>{children}</div>;
};

export async function getServerSideProps() {
  const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  };

  return {
    props: {
      firebaseConfig,
    },
  };
}
