import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });

  const [loading, setLoading] = useState(false);

  // Sauvegarder user quand il change
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // Sauvegarder token quand il change
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      // Ajouter le token aux headers par défaut
      if (window.fetch) {
        const originalFetch = window.fetch;
        window.fetch = function (...args) {
          if (token && args[1]) {
            args[1].headers = args[1].headers || {};
            args[1].headers["Authorization"] = `Bearer ${token}`;
          }
          return originalFetch.apply(this, args);
        };
      }
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const data = await api.login(credentials);

      setToken(data.token);
      setUser(data.user);

      return data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const data = await api.register(userData);

      setToken(data.token);
      setUser(data.user);

      return data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const updateProfile = async (profileData) => {
    setLoading(true);
    try {
      const data = await api.updateProfile(profileData, token);

      // Mettre à jour immédiatement l'état
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Forcer un re-render de tous les composants
      window.dispatchEvent(new Event('storage'));

      return data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (!token) return;

    try {
      const data = await api.getProfile(token);
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      // Forcer un re-render
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error("Error refreshing profile:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        updateProfile,
        refreshProfile,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans AuthProvider");
  }
  return context;
}
