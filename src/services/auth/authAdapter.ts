export interface AuthUser {
  id: string;
  email: string;
  userMetadata: Record<string, unknown>;
  lastSignInAt: string | null;
}

export interface AuthSession {
  user: AuthUser;
}

export interface AuthAdapter {
  getSession(): Promise<{ session: AuthSession | null; error: Error | null }>;
  signInWithPassword(
    email: string,
    password: string
  ): Promise<{
    session: AuthSession | null;
    user: AuthUser | null;
    error: Error | null;
  }>;
  signOut(): Promise<void>;
  onAuthStateChange(
    callback: (event: string, session: AuthSession | null) => void
  ): { unsubscribe: () => void };
}
