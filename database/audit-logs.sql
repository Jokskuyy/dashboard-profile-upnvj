-- ============================================
-- AUDIT LOGS TABLE
-- Untuk mencatat semua aktivitas CRUD di dashboard
-- ============================================

-- Buat tabel audit_logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id BIGSERIAL PRIMARY KEY,
  actor_id UUID,
  actor_email TEXT,
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id TEXT,
  old_data JSONB,
  new_data JSONB,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Aktifkan Row Level Security
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Admin bisa membaca semua audit logs
CREATE POLICY "Admin read audit logs"
ON public.audit_logs
FOR SELECT
TO authenticated
USING (true);

-- Policy: Admin bisa insert audit logs
CREATE POLICY "Admin insert audit logs"
ON public.audit_logs
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Indexes untuk performa query
CREATE INDEX idx_audit_logs_actor ON public.audit_logs(actor_id);
CREATE INDEX idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX idx_audit_logs_table ON public.audit_logs(table_name);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_record_id ON public.audit_logs(record_id);

-- Comment dokumentasi
COMMENT ON TABLE public.audit_logs IS 'Log audit untuk mencatat semua aktivitas CRUD admin di dashboard';
