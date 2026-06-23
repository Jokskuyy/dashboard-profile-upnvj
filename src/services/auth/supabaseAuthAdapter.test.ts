import { describe, test, expect, vi, beforeEach } from "vitest";
import type { Session, User, AuthError } from "@supabase/supabase-js";

// Mock the supabase client import
vi.mock("../../lib/supabase", () => {
  return {
    supabase: {
      auth: {
        getSession: vi.fn(),
        signInWithPassword: vi.fn(),
        signOut: vi.fn(),
        onAuthStateChange: vi.fn(),
      },
    },
  };
});

import { supabase } from "../../lib/supabase";
import { supabaseAuthAdapter } from "./supabaseAuthAdapter";

describe("SupabaseAuthAdapter", () => {
  const dummyUser = {
    id: "user-uuid-123",
    email: "test@upnvj.ac.id",
    user_metadata: { role: "admin", name: "Iman" },
    last_sign_in_at: "2026-05-22T00:00:00Z",
  };

  const dummySession = {
    user: dummyUser,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("getSession maps supabase session correctly", async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: dummySession as unknown as Session },
      error: null,
    });

    const { session, error } = await supabaseAuthAdapter.getSession();

    expect(error).toBeNull();
    expect(session).not.toBeNull();
    expect(session?.user.id).toBe("user-uuid-123");
    expect(session?.user.email).toBe("test@upnvj.ac.id");
    expect(session?.user.userMetadata).toEqual({ role: "admin", name: "Iman" });
    expect(session?.user.lastSignInAt).toBe("2026-05-22T00:00:00Z");
  });

  test("getSession returns null session and maps error correctly", async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: null },
      error: { message: "Invalid session key" } as unknown as AuthError,
    });

    const { session, error } = await supabaseAuthAdapter.getSession();

    expect(session).toBeNull();
    expect(error).toBeInstanceOf(Error);
    expect(error?.message).toBe("Invalid session key");
  });

  test("signInWithPassword returns mapped session and user", async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: { session: dummySession, user: dummyUser } as unknown as {
        session: Session;
        user: User;
      },
      error: null,
    });

    const { session, user, error } = await supabaseAuthAdapter.signInWithPassword(
      "test@upnvj.ac.id",
      "password123"
    );

    expect(error).toBeNull();
    expect(session?.user.id).toBe("user-uuid-123");
    expect(user?.id).toBe("user-uuid-123");
    expect(user?.email).toBe("test@upnvj.ac.id");
    expect(user?.userMetadata).toEqual({ role: "admin", name: "Iman" });
    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: "test@upnvj.ac.id",
      password: "password123",
    });
  });

  test("signOut throws error if supabase signout fails", async () => {
    vi.mocked(supabase.auth.signOut).mockResolvedValue({
      error: { message: "SignOut error occurred" } as unknown as AuthError,
    });

    await expect(supabaseAuthAdapter.signOut()).rejects.toThrow("SignOut error occurred");
  });

  test("signOut succeeds on success", async () => {
    vi.mocked(supabase.auth.signOut).mockResolvedValue({ error: null });

    await expect(supabaseAuthAdapter.signOut()).resolves.toBeUndefined();
    expect(supabase.auth.signOut).toHaveBeenCalledTimes(1);
  });

  test("onAuthStateChange sets up callback and unsubscribe", () => {
    const unsubscribeMock = vi.fn();
    vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
      data: { subscription: { unsubscribe: unsubscribeMock } },
    } as unknown as ReturnType<typeof supabase.auth.onAuthStateChange>);

    const callback = vi.fn();
    const { unsubscribe } = supabaseAuthAdapter.onAuthStateChange(callback);

    expect(supabase.auth.onAuthStateChange).toHaveBeenCalledTimes(1);

    // Call the inner callback from supabase
    const authStateChangeCallback = vi.mocked(supabase.auth.onAuthStateChange).mock.calls[0][0];
    authStateChangeCallback("SIGNED_IN", dummySession as unknown as Session);

    expect(callback).toHaveBeenCalledWith("SIGNED_IN", {
      user: {
        id: "user-uuid-123",
        email: "test@upnvj.ac.id",
        userMetadata: { role: "admin", name: "Iman" },
        lastSignInAt: "2026-05-22T00:00:00Z",
      },
    });

    // Unsubscribe
    unsubscribe();
    expect(unsubscribeMock).toHaveBeenCalledTimes(1);
  });
});
