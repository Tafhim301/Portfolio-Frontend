/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

type User = {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  [key: string]: any;
};

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  setUser: (u: User | null) => void;
  refreshUser: (abortSignal?: AbortSignal) => Promise<void>;
  logout: () => Promise<void>;
  login: (data: { email: string; password: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const setUser = (u: User | null) => setUserState(u);

  const refreshUser = async (abortSignal?: AbortSignal) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/user`,
        {
          cache: "no-store",
          credentials: "include",
          signal: abortSignal,
        }
      );



     
      if (abortSignal?.aborted) return;

      if (!res?.ok) {
        setUserState(null);
        return;
      }

      const data = await res.json();
      const u = data?.data?.user || data?.user || null;
      setUserState(u);
    } catch (err) {
      // Don't update state if the request was aborted
      if (err instanceof DOMException && err.name === 'AbortError') {
        return;
      }
      console.error("AuthProvider refreshUser error:", err);
      setUserState(null);
    } finally {
    
      if (!abortSignal?.aborted) {
        setLoading(false);
      }
    }
  };

  const logout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("AuthProvider logout error:", err);
    } finally {
      setUserState(null);
    }
  };

  const login = async (data : {email : string; password: string}) => {
    try {
          setLoading(true);
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            credentials: "include", 
          });
    
          const json = await res.json();
          
          if (!res.ok) {
            toast.error(json?.message || "Invalid credentials");
            setLoading(false);
            return;
          }

          setUserState(json?.data?.user || null);
          
          toast.success("Login successful");
          router.push("/");
        } catch (err) {
          toast.error(`Something went wrong : ${err}`);
        } finally {
          setLoading(false);
          
        }
    
  };

  useEffect(() => {
    // Create a new AbortController for this effect instance
    const controller = new AbortController();
    
    // attempt to load the current user on mount
    refreshUser(controller.signal);
    
    // Cleanup function to abort any in-flight request when unmounting
    return () => {
      controller.abort();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, setUser, refreshUser, logout,login }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

export default AuthProvider;

