import { useState, useEffect, useCallback } from "react";
import {
  RefreshCw,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Plus,
  Pencil,
  Trash2,
  Clock,
  User,
  Database,
} from "lucide-react";
import {
  fetchAuditLogs,
  type AuditLogEntry,
  type AuditLogFilter,
} from "../../../services/api/auditLogService";
import Pagination from "../shared/Pagination";
import { usePagination } from "../hooks/usePagination";

// Action badge config
const ACTION_BADGE: Record<
  string,
  { label: string; bg: string; text: string; icon: typeof Plus }
> = {
  create: {
    label: "Create",
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    icon: Plus,
  },
  update: {
    label: "Update",
    bg: "bg-blue-100",
    text: "text-blue-700",
    icon: Pencil,
  },
  delete: {
    label: "Delete",
    bg: "bg-red-100",
    text: "text-red-700",
    icon: Trash2,
  },
};

// Table name display
const TABLE_DISPLAY: Record<string, string> = {
  fasilitas: "Fasilitas",
  program_studi: "Program Studi",
  fakultas: "Fakultas",
  gedung: "Gedung",
};

/** Format ISO date to local readable */
const formatDate = (iso: string): string => {
  const utcIso = iso.endsWith("Z") || iso.includes("+") ? iso : `${iso}Z`;
  const d = new Date(utcIso);
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/** Format relative time */
const timeAgo = (iso: string): string => {
  const utcIso = iso.endsWith("Z") || iso.includes("+") ? iso : `${iso}Z`;
  const diff = Date.now() - new Date(utcIso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "baru saja";
  if (mins < 60) return `${mins} menit lalu`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} hari lalu`;
  return formatDate(iso);
};

export default function AuditLogTable() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("");
  const [tableFilter, setTableFilter] = useState<string>("");
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const loadLogs = useCallback(async () => {
    setLoading(true);
    try {
      const filters: AuditLogFilter = { limit: 200 };
      if (actionFilter)
        filters.action = actionFilter as "create" | "update" | "delete";
      if (tableFilter) filters.table_name = tableFilter;
      const data = await fetchAuditLogs(filters);
      setLogs(data);
    } catch (err) {
      console.error("Error loading audit logs:", err);
    } finally {
      setLoading(false);
    }
  }, [actionFilter, tableFilter]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  // Filter by search query
  const filteredLogs = logs.filter((log) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (log.table_name || "").toLowerCase().includes(q) ||
      (log.actor_email || "").toLowerCase().includes(q) ||
      (log.record_id || "").toLowerCase().includes(q) ||
      (log.action || "").toLowerCase().includes(q)
    );
  });

  const pagination = usePagination<AuditLogEntry>({
    totalItems: filteredLogs.length,
    itemsPerPage: 15,
  });
  const paginatedLogs = pagination.paginate(filteredLogs);

  // Reset pagination when filters change
  useEffect(() => {
    pagination.setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, actionFilter, tableFilter]);

  // Get unique table names from current data
  const tableNames = [...new Set(logs.map((l) => l.table_name))].sort();

  return (
    <div>
      {/* ─── Header ────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Audit Log</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Riwayat perubahan data pada sistem
          </p>
        </div>
        <button
          onClick={loadLogs}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* ─── Filters ───────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari email, tabel, record ID..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none bg-white placeholder:text-slate-300"
          />
        </div>

        {/* Action filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="pl-10 pr-8 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none bg-white appearance-none cursor-pointer min-w-[140px]"
          >
            <option value="">Semua Aksi</option>
            <option value="create">Create</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
          </select>
        </div>

        {/* Table filter */}
        <div className="relative">
          <Database className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <select
            value={tableFilter}
            onChange={(e) => setTableFilter(e.target.value)}
            className="pl-10 pr-8 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none bg-white appearance-none cursor-pointer min-w-[160px]"
          >
            <option value="">Semua Tabel</option>
            {tableNames.map((name) => (
              <option key={name} value={name}>
                {TABLE_DISPLAY[name] || name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ─── Table ─────────────────────────────────── */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="w-6 h-6 animate-spin text-amber-600" />
          <span className="ml-3 text-sm text-slate-500">
            Memuat audit log...
          </span>
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="text-center py-16">
          <Clock className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">
            Tidak ada log yang ditemukan.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Waktu
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Aksi
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Tabel
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Record
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Detail
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedLogs.map((log) => {
                  const badge = ACTION_BADGE[log.action] || ACTION_BADGE.create;
                  const BadgeIcon = badge.icon;
                  const isExpanded = expandedRow === log.id;

                  return (
                    <>
                      <tr
                        key={log.id}
                        onClick={() =>
                          setExpandedRow(isExpanded ? null : log.id ?? null)
                        }
                        className="hover:bg-slate-50/50 transition-colors cursor-pointer"
                      >
                        <td className="py-3 px-4">
                          <div className="text-slate-900 font-medium text-xs">
                            {log.created_at ? timeAgo(log.created_at) : "-"}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {log.created_at ? formatDate(log.created_at) : ""}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${badge.bg} ${badge.text}`}
                          >
                            <BadgeIcon className="w-3 h-3" />
                            {badge.label}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-slate-700 font-medium">
                            {TABLE_DISPLAY[log.table_name] || log.table_name}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <code className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                            #{log.record_id || "-"}
                          </code>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center">
                              <User className="w-3 h-3 text-amber-600" />
                            </div>
                            <span className="text-xs text-slate-600 truncate max-w-[150px]">
                              {log.actor_email || "System"}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div
                            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors inline-block"
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-slate-500" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-slate-500" />
                            )}
                          </div>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr key={`${log.id}-detail`}>
                          <td colSpan={6} className="px-4 py-4 bg-slate-50/80">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                              {log.action !== "create" && log.old_data && (
                                <div>
                                  <p className="font-semibold text-red-600 mb-1.5 flex items-center gap-1">
                                    <Trash2 className="w-3 h-3" /> Data Lama
                                  </p>
                                  <pre className="bg-white border border-red-100 rounded-xl p-3 overflow-x-auto text-[11px] text-slate-600 leading-relaxed max-h-48 overflow-y-auto">
                                    {JSON.stringify(log.old_data, null, 2)}
                                  </pre>
                                </div>
                              )}
                              {log.action !== "delete" && log.new_data && (
                                <div>
                                  <p className="font-semibold text-emerald-600 mb-1.5 flex items-center gap-1">
                                    <Plus className="w-3 h-3" /> Data Baru
                                  </p>
                                  <pre className="bg-white border border-emerald-100 rounded-xl p-3 overflow-x-auto text-[11px] text-slate-600 leading-relaxed max-h-48 overflow-y-auto">
                                    {JSON.stringify(log.new_data, null, 2)}
                                  </pre>
                                </div>
                              )}
                              {!log.old_data && !log.new_data && (
                                <p className="text-slate-400 italic col-span-2">
                                  Tidak ada detail data.
                                </p>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {paginatedLogs.map((log) => {
              const badge = ACTION_BADGE[log.action] || ACTION_BADGE.create;
              const BadgeIcon = badge.icon;
              const isExpanded = expandedRow === log.id;

              return (
                <div
                  key={log.id}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden"
                >
                  <div
                    className="p-4 cursor-pointer"
                    onClick={() =>
                      setExpandedRow(isExpanded ? null : log.id ?? null)
                    }
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${badge.bg} ${badge.text}`}
                      >
                        <BadgeIcon className="w-3 h-3" />
                        {badge.label}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {log.created_at ? timeAgo(log.created_at) : "-"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-800">
                          {TABLE_DISPLAY[log.table_name] || log.table_name}
                          <code className="ml-2 text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">
                            #{log.record_id}
                          </code>
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {log.actor_email || "System"}
                        </p>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-2 border-t border-slate-100 space-y-3">
                      {log.action !== "create" && log.old_data && (
                        <div>
                          <p className="font-semibold text-red-600 mb-1 text-xs">
                            Data Lama
                          </p>
                          <pre className="bg-red-50 border border-red-100 rounded-lg p-2.5 overflow-x-auto text-[10px] text-slate-600 max-h-36 overflow-y-auto">
                            {JSON.stringify(log.old_data, null, 2)}
                          </pre>
                        </div>
                      )}
                      {log.action !== "delete" && log.new_data && (
                        <div>
                          <p className="font-semibold text-emerald-600 mb-1 text-xs">
                            Data Baru
                          </p>
                          <pre className="bg-emerald-50 border border-emerald-100 rounded-lg p-2.5 overflow-x-auto text-[10px] text-slate-600 max-h-36 overflow-y-auto">
                            {JSON.stringify(log.new_data, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            startIndex={pagination.startIndex}
            endIndex={pagination.endIndex}
            totalItems={filteredLogs.length}
            pageNumbers={pagination.pageNumbers}
            onPageChange={pagination.setCurrentPage}
            onNext={pagination.goToNext}
            onPrev={pagination.goToPrev}
            isFirstPage={pagination.isFirstPage}
            isLastPage={pagination.isLastPage}
            itemLabel="log"
          />
        </>
      )}
    </div>
  );
}
