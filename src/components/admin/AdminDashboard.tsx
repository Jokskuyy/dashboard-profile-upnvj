import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Award,
  Package,
  BookOpen,
  Building2,
  Save,
  X,
  RefreshCw,
  TrendingUp,
  LogOut,
} from "lucide-react";
import {
  fetchDashboardData,
  fetchFaculties,
  saveDashboardData,
  clearCache,
  getTotalStats,
  createProgram,
  updateProgram,
  deleteProgram,
  createFacility,
  updateFacility,
  deleteFacility,
  type DashboardData,
  type FacultyInfo,
  type FacilityData,
} from "../../services/api/dataService";
import type {
  ProgramData,
} from "../../types";
import ProgramModal from "../modals/crud/ProgramModal";
import FacilityModal from "../modals/crud/FacilityModal";
import DeleteConfirmModal from "../modals/shared/DeleteConfirmModal";
import Toast, { type ToastType } from "../common/Toast";
import AdminTrafficAnalytics from "./analytics/AdminTrafficAnalytics";
import FacilitiesTable from "./tables/FacilitiesTable";
import ProgramsTable from "./tables/ProgramsTable";
import { useAuth } from "../../contexts/AuthContext";
import "./admin.css";

type TabType = "assets" | "programs" | "analytics";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { logout, admin } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("assets");
  const [data, setData] = useState<DashboardData | null>(null);
  const [faculties, setFaculties] = useState<FacultyInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [programModal, setProgramModal] = useState<{
    isOpen: boolean;
    program?: ProgramData;
  }>({ isOpen: false });

  const [facilityModal, setFacilityModal] = useState<{
    isOpen: boolean;
    facility?: FacilityData;
  }>({ isOpen: false });

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    type?: string;
    id?: string | number;
    name?: string;
  }>({ isOpen: false });

  // Toast state
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: ToastType;
  }>({ show: false, message: "", type: "info" });

  const showToast = (message: string, type: ToastType) => {
    setToast({ show: true, message, type });
  };

  // Load data on mount
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

  const handleLogout = async () => {
    try {
      await logout();
      showToast("Logout berhasil", "success");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      showToast("Gagal logout", "error");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.type) return;

    try {
      if (deleteModal.type === "accreditation" && deleteModal.id) {
        await deleteAccreditation(deleteModal.id.toString());
        showToast("Akreditasi berhasil dihapus", "success");
      } else if (deleteModal.type === "program" && deleteModal.id) {
        await deleteProgram(deleteModal.id.toString());
        showToast("Program studi berhasil dihapus", "success");
      } else if (deleteModal.type === "facility" && deleteModal.id) {
        await deleteFacility(Number(deleteModal.id));
        showToast("Fasilitas berhasil dihapus", "success");
      }

      await loadData();
      setDeleteModal({ isOpen: false });
    } catch (error) {
      console.error("Error deleting:", error);
      showToast("Gagal menghapus data", "error");
    }
  };



  // Program CRUD handlers
  const handleSaveProgram = async (
    program: Omit<ProgramData, "id"> | ProgramData,
  ) => {
    try {
      if ("id" in program) {
        await updateProgram(program.id.toString(), program);
        showToast("Data program studi berhasil diupdate", "success");
      } else {
        await createProgram(program);
        showToast("Program studi baru berhasil ditambahkan", "success");
      }
      await loadData();
    } catch (error) {
      console.error("Error saving program:", error);
      showToast("Gagal menyimpan data program studi", "error");
      throw error;
    }
  };

  // Facility CRUD handlers
  const handleSaveFacility = async (
    facility: Omit<FacilityData, "id"> | FacilityData,
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
    } catch (error) {
      console.error("Error saving facility:", error);
      showToast("Gagal menyimpan fasilitas", "error");
      throw error;
    }
  };

  const handleSave = async () => {
    if (!data) return;

    setSaving(true);
    try {
      const success = await saveDashboardData(data);
      if (success) {
        alert("Data berhasil disimpan!");
        clearCache();
      } else {
        alert("Gagal menyimpan data.");
      }
    } catch (err) {
      alert("Terjadi kesalahan saat menyimpan data.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    {
      id: "assets",
      label: "Fasilitas",
      icon: Package,
      count: data?.assets.length,
    },
    {
      id: "programs",
      label: "Program Studi",
      icon: BookOpen,
      count: data?.programs.length,
    },

    {
      id: "analytics",
      label: "Analytics",
      icon: TrendingUp,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-green-50">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-green-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={loadData}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  const stats = data ? getTotalStats(data) : null;

  return (
    <>
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-emerald-50">
        {/* Toast Notification */}
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
          faculties={faculties}
          accreditations={data?.accreditations || []}
        />

        <FacilityModal
          isOpen={facilityModal.isOpen}
          onClose={() => setFacilityModal({ isOpen: false })}
          onSave={handleSaveFacility}
          facility={facilityModal.facility}
        />

        <DeleteConfirmModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false })}
          onConfirm={handleDeleteConfirm}
          title="Konfirmasi Hapus"
          message="Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan."
          itemName={deleteModal.name}
        />

        {/* Header */}
        <nav className="fixed top-0 left-0 w-full z-50 glass-nav transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="block text-lg font-bold tracking-tight leading-none text-slate-900">
                    UPNVJ
                  </span>
                  <span className="block text-xs font-medium text-slate-500">
                    Admin Portal
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <p className="hidden md:flex items-center gap-2 text-sm text-slate-500">
                  <RefreshCw className="w-4 h-4" />
                  Terakhir diupdate:{" "}
                  {data?.lastUpdated
                    ? new Date(data.lastUpdated).toLocaleString("id-ID")
                    : "-"}
                </p>
                <div className="hidden md:flex items-center gap-3 px-4 py-2 border-l border-slate-200">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">
                      {admin?.fullName || admin?.username || "Admin"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {admin?.role || "Administrator"}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                    {(admin?.fullName || admin?.username || "A")
                      .substring(0, 1)
                      .toUpperCase()}
                  </div>
                </div>
                <button
                  onClick={loadData}
                  className="flex items-center gap-2 px-4 py-2 text-slate-600 border border-slate-200 bg-white rounded-full hover:border-emerald-500 hover:text-emerald-600 transition-all shadow-sm"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span className="hidden sm:inline font-medium text-sm">
                    Refresh Data
                  </span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-200 bg-white rounded-full hover:bg-red-50 hover:border-red-400 transition-all shadow-sm"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline font-medium text-sm">
                    Logout
                  </span>
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-semibold shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                  style={{ display: "none" }}
                >
                  <Save className="w-4 h-4" />
                  {saving ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Stats Cards */}
        {stats && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  Selamat Datang, Admin
                </h1>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

              <div className="glass-panel p-5 rounded-2xl flex flex-col items-start gap-4 hover:-translate-y-1 transition-transform duration-300 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-slate-500 text-sm font-medium mb-1">
                    Total Fasilitas
                  </p>
                  <h3 className="text-3xl font-bold text-slate-900">
                    {stats.totalAssets}
                  </h3>
                </div>
              </div>
              <div className="glass-panel p-5 rounded-2xl flex flex-col items-start gap-4 hover:-translate-y-1 transition-transform duration-300 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-slate-500 text-sm font-medium mb-1">
                    Total Fakultas
                  </p>
                  <h3 className="text-3xl font-bold text-slate-900">
                    {stats.totalFaculties}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="glass-panel rounded-3xl shadow-lg overflow-hidden">
            <div className="flex overflow-x-auto pb-4 mb-0 gap-2 border-b border-slate-200 px-6 pt-6">
              <nav className="flex gap-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as TabType)}
                      className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold whitespace-nowrap rounded-t-lg transition-all ${
                        activeTab === tab.id
                          ? "text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50"
                          : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                      {tab.count !== undefined && (
                        <span
                          className={`ml-1 px-2 py-0.5 text-xs rounded-full ${
                            activeTab === tab.id
                              ? "bg-emerald-600 text-white"
                              : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {tab.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6 bg-white/40">
              {activeTab === "assets" && (
                <FacilitiesTable
                  onAdd={() => setFacilityModal({ isOpen: true })}
                  onEdit={(facility) =>
                    setFacilityModal({ isOpen: true, facility })
                  }
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
                  onEdit={(program) =>
                    setProgramModal({ isOpen: true, program })
                  }
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
              {activeTab === "analytics" && <AdminTrafficAnalytics />}
            </div>
          </div>
        </div>

        {/* Footer spacing */}
        <div className="h-20"></div>
      </div>
    </>
  );
}
