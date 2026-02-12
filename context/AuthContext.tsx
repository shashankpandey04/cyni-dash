"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Auth = any;

const AuthContext = createContext<{
  auth: Auth;
  loading: boolean;
}>({ auth: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<Auth>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(async (res) => {
        if (!res.ok) return null;
        try {
          return await res.json();
        } catch {
          return null;
        }
      })
      .then((data) => setAuth(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ auth, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
