// components/ProtectedRoute.tsx
import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";
import { useSupabase, SupabaseProvider } from "@/contexts/AuthContext";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useSupabase();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      // Redirect to the login page if the user is not authenticated
      router.push("/login");
    }
  }, [user, router]);

  return <SupabaseProvider>{children}</SupabaseProvider>;
};

export default ProtectedRoute;
