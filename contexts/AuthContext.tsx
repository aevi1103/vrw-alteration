import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { SupabaseClient, UserResponse } from "@supabase/supabase-js";
import supabase from "@/lib/supabase-client";

type SupabaseContextType = {
  supabase: SupabaseClient | null;
  user: UserResponse | null;
};

const SupabaseContext = createContext<SupabaseContextType | undefined>(
  undefined
);

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error("useSupabase must be used within a SupabaseProvider");
  }
  return context;
};

type SupabaseProviderProps = {
  children: ReactNode;
};

export const SupabaseProvider = ({ children }: SupabaseProviderProps) => {
  const [user, setUser] = useState<UserResponse | null>(null);

  useEffect(() => {
    // Fetch the authenticated user on component mount
    const fetchUser = async () => {
      const currentUser = await supabase.auth.getUser();
      setUser(currentUser);
    };

    fetchUser();
  }, []);

  const value: SupabaseContextType = {
    supabase,
    user,
  };

  console.log("supabase", {
    supabase,
    user,
  });

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
};
