import { Session, User } from "@supabase/supabase-js";
import { createContext, PropsWithChildren, useCallback, useEffect, useMemo, useState } from "react";

import { supabase } from "@/lib/supabase";
import { Profile } from "@/types/profile";

type AuthResult = {
  success: boolean;
  message?: string;
  needsEmailConfirmation?: boolean;
};

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isSigningIn: boolean;
  isSigningUp: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (displayName: string, email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

function getFriendlyAuthError(message?: string) {
  const normalized = message?.toLowerCase() ?? "";

  if (normalized.includes("invalid login") || normalized.includes("invalid credentials")) {
    return "Email or password is incorrect.";
  }

  if (normalized.includes("already registered") || normalized.includes("already exists")) {
    return "This email may already be registered.";
  }

  if (normalized.includes("password")) {
    return "Password must be at least 8 characters.";
  }

  return "Something went wrong. Please try again.";
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);

  const user = session?.user ?? null;

  const loadProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      setProfile(null);
      return;
    }

    setProfile((data as Profile | null) ?? null);
  }, []);

  const refreshProfile = useCallback(async () => {
    const currentUserId = session?.user.id;

    if (!currentUserId) {
      setProfile(null);
      return;
    }

    await loadProfile(currentUserId);
  }, [loadProfile, session?.user.id]);

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!isMounted) {
        return;
      }

      const currentSession = data.session ?? null;
      setSession(currentSession);

      if (currentSession?.user.id) {
        await loadProfile(currentSession.user.id);
      } else {
        setProfile(null);
      }

      setIsLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);

      if (nextSession?.user.id) {
        loadProfile(nextSession.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, [loadProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      return { success: false, message: "Email is required." };
    }

    if (!password) {
      return { success: false, message: "Password is required." };
    }

    setIsSigningIn(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password
    });

    setIsSigningIn(false);

    if (error) {
      return { success: false, message: getFriendlyAuthError(error.message) };
    }

    setSession(data.session ?? null);

    if (data.user?.id) {
      await loadProfile(data.user.id);
    }

    return { success: true };
  }, [loadProfile]);

  const signUp = useCallback(async (displayName: string, email: string, password: string) => {
    const trimmedName = displayName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      return { success: false, message: "Display name is required." };
    }

    if (!trimmedEmail) {
      return { success: false, message: "Email is required." };
    }

    if (password.length < 8) {
      return { success: false, message: "Password must be at least 8 characters." };
    }

    setIsSigningUp(true);

    const { data, error } = await supabase.auth.signUp({
      email: trimmedEmail,
      password,
      options: {
        data: {
          display_name: trimmedName
        }
      }
    });

    setIsSigningUp(false);

    if (error) {
      return { success: false, message: getFriendlyAuthError(error.message) };
    }

    if (data.session) {
      setSession(data.session);
      await loadProfile(data.session.user.id);
      return { success: true };
    }

    return {
      success: true,
      needsEmailConfirmation: true,
      message: "Check your email to confirm your account."
    };
  }, [loadProfile]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
  }, []);

  const value = useMemo(
    () => ({
      session,
      user,
      profile,
      isLoading,
      isSigningIn,
      isSigningUp,
      signIn,
      signUp,
      signOut,
      refreshProfile
    }),
    [isLoading, isSigningIn, isSigningUp, profile, refreshProfile, session, signIn, signOut, signUp, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
