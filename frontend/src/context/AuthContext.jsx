import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getCurrentUser } from "../api/adminApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const loadUser = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setUser(null);
      setAuthLoading(false);
      return;
    }

    try {
      const res = await getCurrentUser();
      setUser(res.data || res.user || res);
    } catch (error) {
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = (token, userData = null) => {
    localStorage.setItem("token", token);
    if (userData) setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/";
  };

  const value = useMemo(
    () => ({
      user,
      setUser,
      authLoading,
      login,
      logout,
      reloadUser: loadUser,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === "admin" || user?.role === "election_officer",
    }),
    [user, authLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}