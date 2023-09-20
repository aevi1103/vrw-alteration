// components/ProtectedRoute.tsx
import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";
import { useAuth, AuthProvider } from "@/contexts/AuthContext";
import { LoadingScreen } from "./loading-screen";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, role, authenticating } = useAuth();
  const router = useRouter();

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
