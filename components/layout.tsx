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
