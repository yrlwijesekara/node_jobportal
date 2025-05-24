import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type AuthContextType = {
  isLoggedIn: boolean;
  role: string;
  login: (role: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem("isLoggedIn");
    const storedRole = localStorage.getItem("role");
    setIsLoggedIn(stored === "true");
    setRole(storedRole || '');
    // Sync across tabs
    const handleStorage = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
      setRole(localStorage.getItem("role") || '');
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const login = (userRole: string) => {
    setIsLoggedIn(true);
    setRole(userRole);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("role", userRole);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setRole('');
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};