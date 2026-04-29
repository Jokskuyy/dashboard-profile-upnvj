import { supabase } from "../../lib/supabase";

// ===== Types =====

export interface AuditLogEntry {
  id?: number;
  actor_id?: string;
  actor_email?: string;
  action: "create" | "update" | "delete";
  table_name: string;
  record_id?: string;
  old_data?: Record<string, unknown> | null;
  new_data?: Record<string, unknown> | null;
  created_at?: string;
}

export interface AuditLogFilter {
  action?: "create" | "update" | "delete";
  table_name?: string;
  actor_email?: string;
  from_date?: string;
  to_date?: string;
  limit?: number;
  offset?: number;
}

// ===== Helper: Get current session info =====

const getSessionInfo = async (): Promise<{
  actor_id: string | undefined;
  actor_email: string | undefined;
}> => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user) {
      return {
        actor_id: session.user.id,
        actor_email: session.user.email,
      };
    }
  } catch (error) {
    console.warn("Could not get session for audit log:", error);
  }

  return { actor_id: undefined, actor_email: undefined };
};

// ===== Core: Insert Audit Log =====

/**
 * Insert a single audit log entry.
 * Automatically fills actor_id and actor_email from the current session.
 * This function is fire-and-forget — it logs errors but never throws,
 * so it won't interrupt CRUD operations.
 */
export const insertAuditLog = async (
  entry: Omit<AuditLogEntry, "id" | "actor_id" | "actor_email" | "created_at">
): Promise<void> => {
  try {
    const { actor_id, actor_email } = await getSessionInfo();

    const { error } = await supabase.from("audit_logs").insert({
      actor_id,
      actor_email,
      action: entry.action,
      table_name: entry.table_name,
      record_id: entry.record_id,
      old_data: entry.old_data ?? null,
      new_data: entry.new_data ?? null,
    });

    if (error) {
      console.error("Failed to insert audit log:", error);
    }
  } catch (error) {
    // Never throw — audit logging should not break CRUD ops
    console.error("Audit log error:", error);
  }
};

// ===== Convenience Wrappers =====

/**
 * Log a CREATE action
 */
export const logCreate = async (
  tableName: string,
  recordId: string,
  newData: Record<string, unknown>
): Promise<void> => {
  await insertAuditLog({
    action: "create",
    table_name: tableName,
    record_id: recordId,
    old_data: null,
    new_data: newData,
  });
};

/**
 * Log an UPDATE action
 */
export const logUpdate = async (
  tableName: string,
  recordId: string,
  oldData: Record<string, unknown>,
  newData: Record<string, unknown>
): Promise<void> => {
  await insertAuditLog({
    action: "update",
    table_name: tableName,
    record_id: recordId,
    old_data: oldData,
    new_data: newData,
  });
};

/**
 * Log a DELETE action
 */
export const logDelete = async (
  tableName: string,
  recordId: string,
  oldData: Record<string, unknown>
): Promise<void> => {
  await insertAuditLog({
    action: "delete",
    table_name: tableName,
    record_id: recordId,
    old_data: oldData,
    new_data: null,
  });
};

// ===== Query: Fetch Audit Logs =====

/**
 * Fetch audit logs with optional filters, ordered by newest first.
 */
export const fetchAuditLogs = async (
  filters?: AuditLogFilter
): Promise<AuditLogEntry[]> => {
  try {
    let query = supabase
      .from("audit_logs")
      .select("*")
      .order("created_at", { ascending: false });

    if (filters?.action) {
      query = query.eq("action", filters.action);
    }
    if (filters?.table_name) {
      query = query.eq("table_name", filters.table_name);
    }
    if (filters?.actor_email) {
      query = query.eq("actor_email", filters.actor_email);
    }
    if (filters?.from_date) {
      query = query.gte("created_at", filters.from_date);
    }
    if (filters?.to_date) {
      query = query.lte("created_at", filters.to_date);
    }

    const limit = filters?.limit ?? 50;
    const offset = filters?.offset ?? 0;
    query = query.range(offset, offset + limit - 1);

    const { data, error } = await query;

    if (error) throw error;

    return data as AuditLogEntry[];
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    return [];
  }
};

/**
 * Fetch audit logs for a specific record
 */
export const fetchRecordHistory = async (
  tableName: string,
  recordId: string
): Promise<AuditLogEntry[]> => {
  return fetchAuditLogs({
    table_name: tableName,
    limit: 100,
  }).then((logs) => logs.filter((log) => log.record_id === recordId));
};
