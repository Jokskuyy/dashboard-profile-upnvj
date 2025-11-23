import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const verifyAuth = async () => {
    try {
      // Check Supabase session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        setAdmin(null);
        setIsLoading(false);
        return;
      }

      // Extract username from email (format: username@admin.upnvj.ac.id)
      const email = session.user.email || '';
      const username = email.split('@')[0];

      // Create admin object from session data
      setAdmin({
        id: session.user.id,
        username: username,
        fullName: session.user.user_metadata?.full_name || username,
        email: email,
        role: session.user.user_metadata?.role || 'admin',
        lastLogin: session.user.last_sign_in_at || new Date().toISOString(),
      });
    } catch (error) {
      console.error("Auth verification failed:", error);
      setAdmin(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    verifyAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: any) => {
      if (!session) {
        setAdmin(null);
      } else {
        verifyAuth();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      // Convert username to email format for Supabase Auth
      const email = `${username}@admin.upnvj.ac.id`;
      
      console.log('Attempting login with email:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error.message);
        console.error('Full error:', error);
        
        // Better error messages
        if (error.message.includes('Invalid login credentials')) {
          return {
            success: false,
            message: "Username atau password salah. Pastikan email di Supabase: " + email,
          };
        }
        
        if (error.message.includes('Email not confirmed')) {
          return {
            success: false,
            message: "Email belum dikonfirmasi. Silakan cek inbox Anda.",
          };
        }

        return {
          success: false,
          message: error.message || "Gagal login",
        };
      }

      // Set admin data from session
      if (data.session) {
        setAdmin({
          id: data.user.id,
          username: username,
          fullName: data.user.user_metadata?.full_name || username,
          email: email,
          role: data.user.user_metadata?.role || 'admin',
          lastLogin: data.user.last_sign_in_at || new Date().toISOString(),
        });
      }

      return { success: true, message: "Login berhasil" };
    } catch (error: any) {
      console.error("Login failed:", error);
      return {
        success: false,
        message: error.message || "Terjadi kesalahan. Silakan coba lagi.",
      };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
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
