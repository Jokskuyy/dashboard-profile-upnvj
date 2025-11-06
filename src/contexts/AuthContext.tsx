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

// Check if we're on GitHub Pages (no backend available)
const isStaticDeployment = () => {
  return window.location.hostname.includes('github.io');
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const verifyAuth = async () => {
    // Skip auth verification on static deployments
    if (isStaticDeployment()) {
      setAdmin(null);
      setIsLoading(false);
      return;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout

      const response = await fetch(`${API_URL}/verify`, {
        credentials: "include",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const data = await response.json();

      if (data.valid) {
        setAdmin(data.admin);
      } else {
        setAdmin(null);
      }
    } catch (error) {
      // Silent fail on static deployments
      if (!isStaticDeployment() && process.env.NODE_ENV === 'development') {
        console.error("Auth verification failed:", error);
      }
      setAdmin(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    verifyAuth();
  }, []);

  const login = async (username: string, password: string) => {
    // Prevent login attempts on static deployments
    if (isStaticDeployment()) {
      return {
        success: false,
        message: "Authentication is not available on static deployment. Please use local development environment.",
      };
    }

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
      if (process.env.NODE_ENV === 'development') {
        console.error("Login failed:", error);
      }
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
