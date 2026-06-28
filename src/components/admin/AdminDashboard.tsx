import { useState, useEffect, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  BookOpen,
  Building2,
  RefreshCw,
  TrendingUp,
  LogOut,
  X,
  Menu,
  ClipboardList,
} from "lucide-react";
import {
  fetchDashboardData,
  fetchFaculties,
  createProgram,
  updateProgram,
  deleteProgram,
  createFacility,
  updateFacility,
  deleteFacility,
  createGedung,
  updateGedung,
  deleteGedung,
  type DashboardData,
  type FacultyInfo,
  type Fasilitas,
  type Gedung,
} from "../../services/api/dataService";
import type { ProgramData } from "../../types";
import ProgramModal from "../modals/crud/ProgramModal";
import FacilityModal from "../modals/crud/FacilityModal";
import BuildingModal from "../modals/crud/BuildingModal";
import DeleteConfirmModal from "../modals/shared/DeleteConfirmModal";
import Toast, { type ToastType } from "../common/Toast";
const AdminTrafficAnalytics = lazy(() => import("./analytics/AdminTrafficAnalytics"));
import BuildingsTable from "./tables/BuildingsTable";
import FacilitiesTable from "./tables/FacilitiesTable";
import ProgramsTable from "./tables/ProgramsTable";
import AuditLogTable from "./tables/AuditLogTable";
import { useAuth } from "../../contexts/AuthContext";
import "./admin.css";

type TabType = "buildings" | "assets" | "programs" | "analytics" | "audit";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { logout, admin } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("assets");
  const [data, setData] = useState<DashboardData | null>(null);
  const [faculties, setFaculties] = useState<FacultyInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Modal states
  const [programModal, setProgramModal] = useState<{
    isOpen: boolean;
    program?: ProgramData;
  }>({ isOpen: false });

  const [facilityModal, setFacilityModal] = useState<{
    isOpen: boolean;
    facility?: Fasilitas;
  }>({ isOpen: false });

  const [buildingModal, setBuildingModal] = useState<{
    isOpen: boolean;
    building?: Gedung;
  }>({ isOpen: false });

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    type?: string;
    id?: string | number;
    name?: string;
  }>({ isOpen: false });

  // Toast
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: ToastType;
  }>({ show: false, message: "", type: "info" });

  const showToast = (message: string, type: ToastType) => {
    setToast({ show: true, message, type });
  };

  // ── Data Loading ──────────────────────────────────
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [dashboardData, facultiesData] = await Promise.all([
        fetchDashboardData(),
        fetchFaculties(),
      ]);
      setData(dashboardData);
      setFaculties(facultiesData);
    } catch (err) {
      setError("Gagal memuat data. Silakan refresh halaman.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ── Auth ──────────────────────────────────────────
  const handleLogout = async () => {
    try {
      await logout();
      showToast("Logout berhasil", "success");
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
      showToast("Gagal logout", "error");
    }
  };

  // ── Error message helper ────────────────────────────
  const getErrorMessage = (err: unknown, fallback: string): string => {
    const error = err as { code?: string; message?: string; status?: number };
    // PostgreSQL 23505 = unique_violation (409 Conflict)
    if (error?.code === "23505" || error?.status === 409) {
      return "Program studi dengan kombinasi nama, jenjang, dan fakultas yang sama sudah ada.";
    }
    if (error?.message) return error.message;
    return fallback;
  };

  // ── CRUD: Programs ────────────────────────────────
  const handleSaveProgram = async (
    program: Omit<ProgramData, "id"> | ProgramData,
  ) => {
    try {
      if ("id" in program) {
        await updateProgram(program.id.toString(), program);
        showToast("Program studi berhasil diupdate", "success");
      } else {
        await createProgram(program);
        showToast("Program studi baru berhasil ditambahkan", "success");
      }
      await loadData();
      setProgramModal({ isOpen: false });
    } catch (err) {
      console.error("Error saving program:", err);
      showToast(getErrorMessage(err, "Gagal menyimpan data program studi"), "error");
      throw err;
    }
  };

  // ── CRUD: Facilities ──────────────────────────────
  const handleSaveFacility = async (
    facility: Omit<Fasilitas, "id"> | Fasilitas,
  ) => {
    try {
      if ("id" in facility && facility.id) {
        await updateFacility(facility.id, facility);
        showToast("Fasilitas berhasil diupdate", "success");
      } else {
        await createFacility(facility);
        showToast("Fasilitas baru berhasil ditambahkan", "success");
      }
      await loadData();
      setFacilityModal({ isOpen: false });
    } catch (err) {
      console.error("Error saving facility:", err);
      showToast(getErrorMessage(err, "Gagal menyimpan fasilitas"), "error");
      throw err;
    }
  };

  // ── CRUD: Buildings ────────────────────────────────
  const handleSaveBuilding = async (
    building: Omit<Gedung, "id"> | Gedung,
  ) => {
    try {
      if ("id" in building && building.id) {
        await updateGedung(building.id, building);
        showToast("Gedung berhasil diupdate", "success");
      } else {
        await createGedung(building);
        showToast("Gedung baru berhasil ditambahkan", "success");
      }
      await loadData();
      setBuildingModal({ isOpen: false });
    } catch (err) {
      console.error("Error saving building:", err);
      showToast(getErrorMessage(err, "Gagal menyimpan gedung"), "error");
      throw err;
    }
  };

  // ── CRUD: Delete ──────────────────────────────────
  const handleDeleteConfirm = async () => {
    if (!deleteModal.type || !deleteModal.id) return;

    try {
      if (deleteModal.type === "program") {
        await deleteProgram(deleteModal.id.toString());
        showToast("Program studi berhasil dihapus", "success");
      } else if (deleteModal.type === "facility") {
        await deleteFacility(Number(deleteModal.id));
        showToast("Fasilitas berhasil dihapus", "success");
      } else if (deleteModal.type === "building") {
        await deleteGedung(Number(deleteModal.id));
        showToast("Gedung berhasil dihapus", "success");
      }
      await loadData();
      setDeleteModal({ isOpen: false });
    } catch (err) {
      console.error("Error deleting:", err);
      showToast("Gagal menghapus data", "error");
    }
  };

  // ── Tab config ────────────────────────────────────
  const tabs = [
    { id: "buildings" as const, label: "Gedung", icon: Building2 },
    { id: "assets" as const, label: "Fasilitas", icon: Package, count: data?.assets.length },
    { id: "programs" as const, label: "Program Studi", icon: BookOpen, count: data?.programs.length },
    { id: "analytics" as const, label: "Analytics", icon: TrendingUp },
    { id: "audit" as const, label: "Audit Log", icon: ClipboardList },
  ];

  // ── Loading state ─────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-emerald-50">
        <div className="text-center">
          <RefreshCw className="w-10 h-10 animate-spin text-emerald-600 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">Memuat data...</p>
        </div>
      </div>
    );
  }

  // ── Error state ───────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-emerald-50 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-sm w-full">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-7 h-7 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Error</h2>
          <p className="text-slate-500 text-sm mb-6">{error}</p>
          <button
            onClick={loadData}
            className="w-full px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  const initials = (admin?.fullName || admin?.username || "A").substring(0, 1).toUpperCase();

  return (
    <>
      {/* Toast */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      {/* Modals */}
      <ProgramModal
        isOpen={programModal.isOpen}
        onClose={() => setProgramModal({ isOpen: false })}
        onSave={handleSaveProgram}
        program={programModal.program}
      />
      <FacilityModal
        isOpen={facilityModal.isOpen}
        onClose={() => setFacilityModal({ isOpen: false })}
        onSave={handleSaveFacility}
        facility={facilityModal.facility}
      />
      <BuildingModal
        isOpen={buildingModal.isOpen}
        onClose={() => setBuildingModal({ isOpen: false })}
        onSave={handleSaveBuilding}
        building={buildingModal.building}
      />
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false })}
        onConfirm={handleDeleteConfirm}
        title="Konfirmasi Hapus"
        message="Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan."
        itemName={deleteModal.name}
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
        {/* ─── Navbar ───────────────────────────────── */}
        <nav className="admin-nav fixed top-0 left-0 w-full z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <img
                  src="/logoupnvj.webp"
                  alt="Logo UPNVJ"
                  className="w-9 h-9 object-contain"
                />
                <div className="leading-tight">
                  <span className="block text-sm font-bold text-slate-900">UPNVJ</span>
                  <span className="block text-[11px] text-slate-400">Admin Portal</span>
                </div>
              </div>

              {/* Desktop: right section */}
              <div className="hidden md:flex items-center gap-3">
                <button
                  onClick={loadData}
                  className="admin-btn-outline"
                  title="Refresh Data"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span className="text-sm">Refresh</span>
                </button>

                <div className="h-8 w-px bg-slate-200" />

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-800 leading-tight">
                      {admin?.fullName || admin?.username || "Admin"}
                    </p>
                    <p className="text-[11px] text-slate-400">{admin?.role || "Administrator"}</p>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm">
                    {initials}
                  </div>
                </div>

                <button onClick={handleLogout} className="admin-btn-danger" title="Logout">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile: hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

            {/* Mobile dropdown menu */}
            {mobileMenuOpen && (
              <div className="md:hidden border-t border-slate-100 py-3 space-y-2">
                <div className="flex items-center gap-3 px-2 py-2">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm">
                    {initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {admin?.fullName || admin?.username || "Admin"}
                    </p>
                    <p className="text-xs text-slate-400">{admin?.role || "Administrator"}</p>
                  </div>
                </div>
                <button
                  onClick={() => { loadData(); setMobileMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 rounded-lg"
                >
                  <RefreshCw className="w-4 h-4" /> Refresh Data
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* ─── Main Content ─────────────────────────── */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
          {/* Welcome */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Selamat Datang{admin?.fullName ? `, ${admin.fullName}` : ""}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Kelola fasilitas, program studi, dan pantau analytics website.
            </p>
          </div>

          {/* ─── Tabs ─────────────────────────────────── */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
            {/* Tab navigation */}
            <div className="flex overflow-x-auto border-b border-slate-200 scrollbar-hide">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                      isActive
                        ? "text-emerald-600 border-emerald-600 bg-emerald-50/50"
                        : "text-slate-500 border-transparent hover:text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                    {tab.count !== undefined && (
                      <span
                        className={`ml-1 px-2 py-0.5 text-xs rounded-full font-medium ${
                          isActive
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Tab content */}
            <div className="p-4 sm:p-6">
              {activeTab === "buildings" && (
                <BuildingsTable
                  onAdd={() => setBuildingModal({ isOpen: true })}
                  onEdit={(building) => setBuildingModal({ isOpen: true, building })}
                  onDelete={(building) =>
                    setDeleteModal({
                      isOpen: true,
                      type: "building",
                      id: building.id,
                      name: building.nama_gedung,
                    })
                  }
                />
              )}
              {activeTab === "assets" && (
                <FacilitiesTable
                  onAdd={() => setFacilityModal({ isOpen: true })}
                  onEdit={(facility) => setFacilityModal({ isOpen: true, facility })}
                  onDelete={(facility) =>
                    setDeleteModal({
                      isOpen: true,
                      type: "facility",
                      id: facility.id,
                      name: facility.nama_fasilitas,
                    })
                  }
                />
              )}
              {activeTab === "programs" && data && (
                <ProgramsTable
                  programs={data.programs}
                  faculties={faculties}
                  onAdd={() => setProgramModal({ isOpen: true })}
                  onEdit={(program) => setProgramModal({ isOpen: true, program })}
                  onDelete={(program) =>
                    setDeleteModal({
                      isOpen: true,
                      type: "program",
                      id: program.id.toString(),
                      name: program.name,
                    })
                  }
                />
              )}
              {activeTab === "analytics" && <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading analytics...</div>}><AdminTrafficAnalytics /></Suspense>}
              {activeTab === "audit" && <AuditLogTable />}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
