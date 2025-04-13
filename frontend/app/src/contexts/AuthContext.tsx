import { createContext, useContext, ReactNode, useState } from "react";
import Cookies from "js-cookie";

interface AuthContextType {
  access_token: string | null;
  role: string | null;
  login: (access_token: string, role: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [access_token, setToken] = useState<string | null>(Cookies.get("access_token") || null);
  const [role, setRole] = useState<string | null>(Cookies.get("role") || null);

  const login = (newToken: string, newRole: string) => {
    Cookies.set("access_token", newToken);
    Cookies.set("role", newRole);
    setToken(newToken);
    setRole(newRole);
  };

  const logout = () => {
    Cookies.remove("access_token");
    Cookies.remove("role");
    setToken(null);
    setRole(null);
  };

  return <AuthContext.Provider value={{ access_token, role, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
