"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import Cookies from "js-cookie";

interface User {
  email: string;
  role: string;
  username: string;
  profile_pic?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    const token = Cookies.get("token");
    if (!token) return;
    try {
      const res = await api.get("/me");
      setUser(res.data);
    } catch (error) {
      console.error("Token verification failed", error);
      Cookies.remove("token");
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      await fetchUser();
      setLoading(false);
    };
    checkAuth();
  }, [fetchUser]);

  const login = useCallback((token: string, userData: User) => {
    Cookies.set("token", token, { expires: 1 }); // 1 day
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    Cookies.remove("token");
    setUser(null);
    window.location.href = "/login";
  }, []);

  const refreshUser = useCallback(async () => {
    await fetchUser();
  }, [fetchUser]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
