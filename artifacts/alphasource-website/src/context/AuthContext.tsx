import { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  isAdminLoggedIn: boolean;
  login: () => void;
  loginAdmin: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  isAdminLoggedIn: false,
  login: () => {},
  loginAdmin: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn]           = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const login      = () => setIsLoggedIn(true);
  const loginAdmin = () => setIsAdminLoggedIn(true);
  const logout     = () => { setIsLoggedIn(false); setIsAdminLoggedIn(false); };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isAdminLoggedIn, login, loginAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
