import { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";

const AuthCtx = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Charger l'utilisateur à partir du token
  const loadUser = async () => {
    const token = localStorage.getItem("boc_token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await api.get("/auth/me");
      setUser(res.data);
    } catch (err) {
      console.error("Token invalide ou expiré");
      localStorage.removeItem("boc_token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("boc_token", token);
    setUser(userData);        // Mise à jour immédiate
  };

  const logout = () => {
    api.post("/auth/logout").catch(() => {});
    localStorage.removeItem("boc_token");
    setUser(null);
  };

  // Pour forcer le rechargement après création d'un nouvel admin
  const refreshUser = async () => {
    await loadUser();
  };

  return (
    <AuthCtx.Provider value={{ 
      user, 
      login, 
      logout, 
      loading,
      refreshUser 
    }}>
      {children}
    </AuthCtx.Provider>
  );
};

export const useAuth = () => useContext(AuthCtx);
export default AuthCtx;