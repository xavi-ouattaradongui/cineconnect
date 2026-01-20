import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });

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

  const login = (userData, authToken = null) => {
    setUser(userData);
    if (authToken) {
      setToken(authToken);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
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
