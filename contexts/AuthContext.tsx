import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Subscription, SupabaseClient, User } from "@supabase/supabase-js";
import supabase from "@/lib/supabase-client";
import { useRouter } from "next/router";

type SupabaseContextType = {
  supabase: SupabaseClient | null;
  user: User | null;
  authenticating: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<SupabaseContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useSupabase must be used within a SupabaseProvider");
  }
  return context;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [authenticating, setAuthenticating] = useState(true); // Renamed loading state

  useEffect(() => {
    let subscription: Subscription | null = null;

    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      setUser(data?.session?.user ?? null);

      const { data: subs } = await supabase.auth.onAuthStateChange(
        async (event, session) => {
          const currentUser = session?.user ?? null;
          setUser(currentUser);
        }
      );

      subscription = subs.subscription;
      setAuthenticating(false); // Set authenticating state to false when data has been fetched
    };

    getSession();

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const value: SupabaseContextType = {
    supabase,
    user,
    signIn: async () => {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
          redirectTo: `${window.location.origin}/admin`,
        },
      });
    },
    signOut: async () => {
      await supabase.auth.signOut();
    },
    authenticating,
  };

  // console.log("auth provider", {
  //   supabase,
  //   user,
  //   authenticating,
  // });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
