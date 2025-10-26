import React, { createContext, useContext, useState, useEffect } from "react";

interface Admin {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: string;
  lastLogin: string | null;
}

interface AuthContextType {
  admin: Admin | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    username: string,
    password: string
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  verifyAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = "http://localhost:3001/api/auth";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const verifyAuth = async () => {
    try {
      const response = await fetch(`${API_URL}/verify`, {
        credentials: "include",
      });

      const data = await response.json();

      if (data.valid) {
        setAdmin(data.admin);
      } else {
        setAdmin(null);
      }
    } catch (error) {
      console.error("Auth verification failed:", error);
      setAdmin(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    verifyAuth();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        setAdmin(data.admin);
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Login failed:", error);
      return {
        success: false,
        message: "Terjadi kesalahan. Silakan coba lagi.",
      };
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });

      setAdmin(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        isAuthenticated: !!admin,
        isLoading,
        login,
        logout,
        verifyAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
