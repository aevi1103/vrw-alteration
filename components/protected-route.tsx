// components/ProtectedRoute.tsx
import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";
import { useAuth, AuthProvider } from "@/contexts/AuthContext";
import { LoadingScreen } from "./loading-screen";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, authenticating } = useAuth();
  const router = useRouter();

  console.log("protected route", {
    user,
    authenticating,
  });

  useEffect(() => {
    if (authenticating) {
      return;
    }

    if (!user) {
      // Redirect to the login page if the user is not authenticated
      router.push("/login");
    }
  }, [user, router, authenticating]);

  if (authenticating || !user) {
    // Render an authenticating state while data is being fetched
    return <LoadingScreen />;
  }

  return <AuthProvider>{children}</AuthProvider>;
};

export default ProtectedRoute;
