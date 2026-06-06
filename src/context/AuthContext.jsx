import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { authApi } from "../api/authApi";
import {
  getStoredUser,
  isAuthenticated,
  persistAuth,
} from "../utils/authUtils";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authApi.login(email, password);
      const storedUser = persistAuth(data.token);
      setUser(storedUser);
      return data;
    } catch (err) {
      setError(err.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (registerData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authApi.register(registerData);
      const storedUser = persistAuth(data.token);
      setUser(storedUser);
      return data;
    } catch (err) {
      setError(err.message || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authApi.logout();
    setUser(null);
    setError(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      isLoggedIn: Boolean(user) || isAuthenticated(),
      login,
      register,
      logout,
      clearError: () => setError(null),
    }),
    [user, loading, error, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
