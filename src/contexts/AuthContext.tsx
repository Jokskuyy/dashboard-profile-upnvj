import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "../lib/supabase";
import { authAdapter } from "../services/auth";

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

  const verifyAuth = useCallback(async () => {
    try {
      // Check session via auth adapter
      const { session, error: sessionError } = await authAdapter.getSession();
      
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
        fullName: (session.user.userMetadata?.full_name as string) || username,
        email: email,
        role: (session.user.userMetadata?.role as string) || 'admin',
        lastLogin: session.user.lastSignInAt || new Date().toISOString(),
      });
    } catch (error) {
      console.error("Auth verification failed:", error);
      setAdmin(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    verifyAuth();

    // Listen for auth state changes
    const { unsubscribe } = authAdapter.onAuthStateChange((_event, session) => {
      if (!session) {
        setAdmin(null);
      } else {
        verifyAuth();
      }
    });

    return () => unsubscribe();
  }, [verifyAuth]);

  const login = useCallback(async (username: string, password: string) => {
    try {
      // Convert username to email format for Supabase Auth
      const email = `${username}@admin.upnvj.ac.id`;
      
      if (import.meta.env.DEV) {
        console.log('Attempting login with email:', email);
      }
      
      const { session, user, error } = await authAdapter.signInWithPassword(email, password);

      if (error) {
        console.error('Login error:', error.message);
        
        if (error.message.includes('Invalid login credentials')) {
          return {
            success: false,
            message: "Username atau password salah.",
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

      // Fetch admin profile from admin_users table (data concern — uses supabase directly)
      let adminProfile = null;
      try {
        const { data: profileData } = await supabase
          .from('admin_users')
          .select('id, username, nama_lengkap, role')
          .eq('username', username)
          .single();
        
        if (profileData) {
          adminProfile = profileData;
        }
      } catch (profileError) {
        console.warn('Could not fetch admin profile from admin_users:', profileError);
      }

      // Set admin data — prioritize admin_users table, fallback to auth metadata
      if (session && user) {
        setAdmin({
          id: user.id,
          username: adminProfile?.username || username,
          fullName: adminProfile?.nama_lengkap || (user.userMetadata?.full_name as string) || username,
          email: email,
          role: adminProfile?.role || (user.userMetadata?.role as string) || 'admin',
          lastLogin: user.lastSignInAt || new Date().toISOString(),
        });
      }

      return { success: true, message: "Login berhasil" };
    } catch (error: unknown) {
      console.error("Login failed:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Terjadi kesalahan. Silakan coba lagi.",
      };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authAdapter.signOut();
      setAdmin(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, []);

  const value = useMemo(
    () => ({
      admin,
      isAuthenticated: !!admin,
      isLoading,
      login,
      logout,
      verifyAuth,
    }),
    [admin, isLoading, login, logout, verifyAuth]
  );

  return (
    <AuthContext.Provider value={value}>
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
