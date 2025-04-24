"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/auth-helpers-nextjs";

type AuthContextType = {
  user: User | null;
  profile: any | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isLoading: true,
  signOut: async () => {},
  refreshUser: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClientComponentClient();

  async function refreshUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // Fetch user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        setProfile(profile);
      }
    } catch (error) {
      console.error("Error refreshing user:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // Initial user fetch
    refreshUser();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          
          // Fetch user profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          setProfile(profile);
        } else {
          setUser(null);
          setProfile(null);
        }
        
        setIsLoading(false);
        router.refresh();
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  async function signOut() {
    await supabase.auth.signOut();
    router.push('/auth/login');
  }

  return (
    <AuthContext.Provider value={{ user, profile, isLoading, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}