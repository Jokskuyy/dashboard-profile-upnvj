import { supabase } from '../../lib/supabase';
import type { AuthAdapter, AuthUser, AuthSession } from './authAdapter';

function mapUser(supaUser: { id: string; email?: string; user_metadata?: Record<string, unknown>; last_sign_in_at?: string | null }): AuthUser {
  return {
    id: supaUser.id,
    email: supaUser.email ?? '',
    userMetadata: supaUser.user_metadata ?? {},
    lastSignInAt: supaUser.last_sign_in_at ?? null,
  };
}

function mapSession(supaSess: { user: { id: string; email?: string; user_metadata?: Record<string, unknown>; last_sign_in_at?: string | null } }): AuthSession {
  return { user: mapUser(supaSess.user) };
}

class SupabaseAuthAdapter implements AuthAdapter {
  async getSession(): Promise<{ session: AuthSession | null; error: Error | null }> {
    const { data: { session }, error } = await supabase.auth.getSession();
    return {
      session: session ? mapSession(session) : null,
      error: error ? new Error(error.message) : null,
    };
  }

  async signInWithPassword(
    email: string,
    password: string
  ): Promise<{ session: AuthSession | null; user: AuthUser | null; error: Error | null }> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return {
      session: data.session ? mapSession(data.session) : null,
      user: data.user ? mapUser(data.user) : null,
      error: error ? new Error(error.message) : null,
    };
  }

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  }

  onAuthStateChange(
    callback: (event: string, session: AuthSession | null) => void
  ): { unsubscribe: () => void } {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session ? mapSession(session) : null);
    });
    return { unsubscribe: () => subscription.unsubscribe() };
  }
}

export const supabaseAuthAdapter = new SupabaseAuthAdapter();
