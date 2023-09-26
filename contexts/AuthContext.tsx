import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Subscription, SupabaseClient, User } from "@supabase/supabase-js";
import supabase from "@/lib/supabase-client";
import { DbResult } from "@/database.types";

type SupabaseContextType = {
  supabase: SupabaseClient | null;
  user: User | null;
  authenticating: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  email: string | null | undefined;
  userId: string | null | undefined;
  name: string | null;
  role: string | null;
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
  const [user, setUser] = useState<User | null>(null);
  const [authenticating, setAuthenticating] = useState(true); // Renamed loading state
  const [email, setEmail] = useState<string | null | undefined>(null);
  const [userId, setUserId] = useState<string | null | undefined>(null);
  const [name, setName] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    let subscription: Subscription | null = null;

    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      setUser(data?.session?.user ?? null);

      const { data: subs } = await supabase.auth.onAuthStateChange(
        async (event, session) => {
          const currentUser = session?.user ?? null;

          setUser(currentUser);

          // set user info
          const { identities, email, id } = currentUser || {};
          const [identity] = identities || [];
          const { identity_data } = identity || {};
          const { name } = identity_data || {};

          setEmail(email);
          setUserId(id);
          setName(name);

          // fetch roles
          if (id) {
            fetchRole(id).then((role) => {
              setRole(role?.role);
            });
          }
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
    authenticating: authenticating,
    email,
    userId,
    name,
    role,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

async function fetchRole(userid: string) {
  const query = supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userid);

  const res: DbResult<typeof query> = await query;
  const { data, error } = res;

  if (error) {
    throw error;
  }

  const [role] = data ?? [];

  return role;
}
