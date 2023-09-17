// components/ProtectedRoute.tsx
import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";
import { useAuth, AuthProvider } from "@/contexts/AuthContext";
import { LoadingScreen } from "./loading-screen";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { name, email, userId, user, role, authenticating } = useAuth();
  const router = useRouter();

  console.log("protected route", {
    name,
    email,
    userId,
    role,
    authenticating,
  });

  useEffect(() => {
    if (authenticating) {
      return;
    }

    if (!user) {
      router.push("/login");
    }

    if (role === undefined) {
      router.push("/login");
    }
  }, [user, router, authenticating, role]);

  if (authenticating || !user || !role) {
    return <LoadingScreen />;
  }

  return <AuthProvider>{children}</AuthProvider>;
};

export default ProtectedRoute;
