import { useState, useEffect } from "react";
import {
  Users,
  Award,
  GraduationCap,
  Package,
  BookOpen,
  Building2,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import {
  fetchDashboardData,
  fetchFaculties,
  saveDashboardData,
  clearCache,
  getTotalStats,
  createProfessor,
  updateProfessor,
  deleteProfessor,
  createAccreditation,
  updateAccreditation,
  deleteAccreditation,
  createStudentData,
  updateStudentData,
  deleteStudentData,
  createProgram,
  updateProgram,
  deleteProgram,
  createAssetCategory,
  updateAssetCategory,
  deleteAssetCategory,
  addAssetDetail,
  updateAssetDetail,
  deleteAssetDetail,
  type DashboardData,
  type FacultyInfo,
} from '../../services/api/dataService';
import type {
  Professor,
  Accreditation,
  StudentData,
  AssetCategory,
  AssetDetail,
  ProgramData,
} from "../../types";
import ProfessorModal from '../modals/crud/ProfessorModal';
import AccreditationModal from '../modals/crud/AccreditationModal';
import StudentModal from '../modals/crud/StudentModal';
import ProgramModal from '../modals/crud/ProgramModal';
import AssetModal from '../modals/crud/AssetModal';
import AssetDetailModal from '../modals/crud/AssetDetailModal';
import DeleteConfirmModal from '../modals/shared/DeleteConfirmModal';
import Toast, { type ToastType } from "../common/Toast";
import AdminTrafficAnalytics from './analytics/AdminTrafficAnalytics';

type TabType =
  | "professors"
  | "accreditations"
  | "students"
  | "assets"
  | "programs"
  | "analytics";

// Add glassmorphism styles
const glassStyles = `
  .glass-panel {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.5);
  }
  .glass-nav {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(226, 232, 240, 0.6);
  }
`;

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("professors");
  const [data, setData] = useState<DashboardData | null>(null);
  const [faculties, setFaculties] = useState<FacultyInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [professorModal, setProfessorModal] = useState<{
    isOpen: boolean;
    professor?: Professor;
  }>({ isOpen: false });

  const [accreditationModal, setAccreditationModal] = useState<{
    isOpen: boolean;
    accreditation?: Accreditation;
  }>({ isOpen: false });

  const [studentModal, setStudentModal] = useState<{
    isOpen: boolean;
    student?: StudentData;
  }>({ isOpen: false });

  const [programModal, setProgramModal] = useState<{
    isOpen: boolean;
    program?: ProgramData;
  }>({ isOpen: false });

  const [assetModal, setAssetModal] = useState<{
    isOpen: boolean;
    asset?: AssetCategory;
  }>({ isOpen: false });

  const [assetDetailModal, setAssetDetailModal] = useState<{
    isOpen: boolean;
    detail?: AssetDetail;
    categoryId?: string;
    categoryName?: string;
  }>({ isOpen: false });

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    type?: string;
    id?: string;
    facultyId?: string;
    categoryId?: string;
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

  // Professor CRUD handlers
  const handleSaveProfessor = async (
    professor: Omit<Professor, "id"> | Professor
  ) => {
    try {
      if ("id" in professor) {
        // Update existing
        await updateProfessor(professor.id, professor);
        showToast("Data dosen berhasil diupdate", "success");
      } else {
        // Create new
        await createProfessor(professor);
        showToast("Dosen baru berhasil ditambahkan", "success");
      }
      await loadData(); // Reload data
    } catch (error) {
      console.error("Error saving professor:", error);
      showToast("Gagal menyimpan data dosen", "error");
      throw error;
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.type) return;

    try {
      if (deleteModal.type === "professor" && deleteModal.id) {
        await deleteProfessor(deleteModal.id);
        showToast("Dosen berhasil dihapus", "success");
      } else if (deleteModal.type === "accreditation" && deleteModal.id) {
        await deleteAccreditation(deleteModal.id);
        showToast("Akreditasi berhasil dihapus", "success");
      } else if (deleteModal.type === "student" && deleteModal.facultyId) {
        await deleteStudentData(deleteModal.facultyId);
        showToast("Data mahasiswa berhasil dihapus", "success");
      } else if (deleteModal.type === "program" && deleteModal.id) {
        await deleteProgram(deleteModal.id);
        showToast("Program studi berhasil dihapus", "success");
      } else if (deleteModal.type === "asset" && deleteModal.id) {
        await deleteAssetCategory(deleteModal.id);
        showToast("Kategori aset berhasil dihapus", "success");
      } else if (
        deleteModal.type === "assetDetail" &&
        deleteModal.categoryId &&
        deleteModal.id
      ) {
        await deleteAssetDetail(deleteModal.categoryId, deleteModal.id);
        showToast("Item aset berhasil dihapus", "success");
      }

      await loadData(); // Reload data
    } catch (error) {
      console.error("Error deleting:", error);
      showToast("Gagal menghapus data", "error");
    }
  };

  // Accreditation CRUD handlers
  const handleSaveAccreditation = async (
    accreditation: Omit<Accreditation, "id"> | Accreditation
  ) => {
    try {
      if ("id" in accreditation) {
        await updateAccreditation(accreditation.id, accreditation);
        showToast("Data akreditasi berhasil diupdate", "success");
      } else {
        await createAccreditation(accreditation);
        showToast("Akreditasi baru berhasil ditambahkan", "success");
      }
      await loadData();
    } catch (error) {
      console.error("Error saving accreditation:", error);
      showToast("Gagal menyimpan data akreditasi", "error");
      throw error;
    }
  };

  // Student CRUD handlers
  const handleSaveStudent = async (student: StudentData) => {
    try {
      // Check if student data for this faculty already exists
      const existing = data?.students.find(
        (s) => s.faculty === student.faculty
      );

      if (existing) {
        // Update existing - use faculty as identifier
        await updateStudentData(student.faculty, student);
        showToast("Data mahasiswa berhasil diupdate", "success");
      } else {
        // Create new
        await createStudentData(student);
        showToast("Data mahasiswa berhasil ditambahkan", "success");
      }
      await loadData();
    } catch (error) {
      console.error("Error saving student data:", error);
      showToast("Gagal menyimpan data mahasiswa", "error");
      throw error;
    }
  };

  // Program CRUD handlers
  const handleSaveProgram = async (
    program: Omit<ProgramData, "id"> | ProgramData
  ) => {
    try {
      if ("id" in program) {
        await updateProgram(program.id, program);
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

  const handleSaveAsset = async (
    asset: Omit<AssetCategory, "id"> | AssetCategory
  ) => {
    try {
      if ("id" in asset) {
        await updateAssetCategory(asset.id, asset);
        showToast("Kategori aset berhasil diupdate", "success");
      } else {
        await createAssetCategory(asset);
        showToast("Kategori aset baru berhasil ditambahkan", "success");
      }
      await loadData();
    } catch (error) {
      console.error("Error saving asset category:", error);
      showToast("Gagal menyimpan kategori aset", "error");
      throw error;
    }
  };

  const handleSaveAssetDetail = async (
    detail: Omit<AssetDetail, "id"> | AssetDetail
  ) => {
    if (!assetDetailModal.categoryId) return;

    try {
      if ("id" in detail) {
        await updateAssetDetail(assetDetailModal.categoryId, detail.id, detail);
        showToast("Item aset berhasil diupdate", "success");
      } else {
        await addAssetDetail(assetDetailModal.categoryId, detail);
        showToast("Item aset baru berhasil ditambahkan", "success");
      }
      await loadData();
    } catch (error) {
      console.error("Error saving asset detail:", error);
      showToast("Gagal menyimpan item aset", "error");
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
      id: "professors",
      label: "Dosen",
      icon: Users,
      count: data?.professors.length,
    },
    {
      id: "accreditations",
      label: "Akreditasi",
      icon: Award,
      count: data?.accreditations.length,
    },
    {
      id: "students",
      label: "Mahasiswa",
      icon: GraduationCap,
      count: data?.students.length,
    },
    { id: "assets", label: "Aset", icon: Package, count: data?.assets.length },
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
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
      {/* Add glassmorphism styles */}
      <style>{glassStyles}</style>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
        {/* Toast Notification */}
        {toast.show && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ ...toast, show: false })}
          />
        )}

      {/* Modals */}
      <ProfessorModal
        isOpen={professorModal.isOpen}
        onClose={() => setProfessorModal({ isOpen: false })}
        onSave={handleSaveProfessor}
        professor={professorModal.professor}
        faculties={faculties}
      />

      <AccreditationModal
        isOpen={accreditationModal.isOpen}
        onClose={() => setAccreditationModal({ isOpen: false })}
        onSave={handleSaveAccreditation}
        accreditation={accreditationModal.accreditation}
      />

      <StudentModal
        isOpen={studentModal.isOpen}
        onClose={() => setStudentModal({ isOpen: false })}
        onSave={handleSaveStudent}
        student={studentModal.student}
        faculties={faculties}
      />

      <ProgramModal
        isOpen={programModal.isOpen}
        onClose={() => setProgramModal({ isOpen: false })}
        onSave={handleSaveProgram}
        program={programModal.program}
        faculties={faculties}
      />

      <AssetModal
        isOpen={assetModal.isOpen}
        onClose={() => setAssetModal({ isOpen: false })}
        onSave={handleSaveAsset}
        asset={assetModal.asset}
      />

      <AssetDetailModal
        isOpen={assetDetailModal.isOpen}
        onClose={() => setAssetDetailModal({ isOpen: false })}
        onSave={handleSaveAssetDetail}
        detail={assetDetailModal.detail}
        categoryName={assetDetailModal.categoryName || ""}
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
                <GraduationCap className="w-6 h-6" />
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
              <button
                onClick={loadData}
                className="flex items-center gap-2 px-4 py-2 text-slate-600 border border-slate-200 bg-white rounded-full hover:border-emerald-500 hover:text-emerald-600 transition-all shadow-sm"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline font-medium text-sm">Refresh Data</span>
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-semibold shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                style={{ display: 'none' }}
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
                Selamat Datang, Admin 👋
              </h1>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="glass-panel p-5 rounded-2xl flex flex-col items-start gap-4 hover:-translate-y-1 transition-transform duration-300 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-slate-500 text-sm font-medium mb-1">Total Dosen</p>
                <h3 className="text-3xl font-bold text-slate-900">{stats.totalProfessors}</h3>
              </div>
            </div>
            <div className="glass-panel p-5 rounded-2xl flex flex-col items-start gap-4 hover:-translate-y-1 transition-transform duration-300 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <p className="text-slate-500 text-sm font-medium mb-1">Total Mahasiswa</p>
                <h3 className="text-3xl font-bold text-slate-900">{stats.totalStudents.toLocaleString()}</h3>
              </div>
            </div>
            <div className="glass-panel p-5 rounded-2xl flex flex-col items-start gap-4 hover:-translate-y-1 transition-transform duration-300 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-slate-500 text-sm font-medium mb-1">Akreditasi Aktif</p>
                <h3 className="text-3xl font-bold text-slate-900">{stats.activeAccreditations}</h3>
              </div>
            </div>
            <div className="glass-panel p-5 rounded-2xl flex flex-col items-start gap-4 hover:-translate-y-1 transition-transform duration-300 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <p className="text-slate-500 text-sm font-medium mb-1">Total Aset</p>
                <h3 className="text-3xl font-bold text-slate-900">{stats.totalAssets}</h3>
              </div>
            </div>
            <div className="glass-panel p-5 rounded-2xl flex flex-col items-start gap-4 hover:-translate-y-1 transition-transform duration-300 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-slate-500 text-sm font-medium mb-1">Total Fakultas</p>
                <h3 className="text-3xl font-bold text-slate-900">{stats.totalFaculties}</h3>
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
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                      activeTab === tab.id
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                    {tab.count !== undefined && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs ${
                          activeTab === tab.id
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-600"
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
            {activeTab === "professors" && data && (
              <ProfessorsTable
                professors={data.professors}
                faculties={faculties}
                onAdd={() => setProfessorModal({ isOpen: true })}
                onEdit={(professor) =>
                  setProfessorModal({ isOpen: true, professor })
                }
                onDelete={(professor) =>
                  setDeleteModal({
                    isOpen: true,
                    type: "professor",
                    id: professor.id,
                    name: professor.name,
                  })
                }
              />
            )}
            {activeTab === "accreditations" && data && (
              <AccreditationsTable
                accreditations={data.accreditations}
                onAdd={() => setAccreditationModal({ isOpen: true })}
                onEdit={(accreditation) =>
                  setAccreditationModal({ isOpen: true, accreditation })
                }
                onDelete={(accreditation) =>
                  setDeleteModal({
                    isOpen: true,
                    type: "accreditation",
                    id: accreditation.id,
                    name: `${accreditation.program} - ${accreditation.level}`,
                  })
                }
              />
            )}
            {activeTab === "students" && data && (
              <StudentsTable
                students={data.students}
                onAdd={() => setStudentModal({ isOpen: true })}
                onEdit={(student) => setStudentModal({ isOpen: true, student })}
                onDelete={(student) =>
                  setDeleteModal({
                    isOpen: true,
                    type: "student",
                    facultyId: student.faculty,
                    name: student.faculty,
                  })
                }
              />
            )}
            {activeTab === "assets" && data && (
              <AssetsTable
                assets={data.assets}
                onAdd={() => setAssetModal({ isOpen: true })}
                onEdit={(asset) => setAssetModal({ isOpen: true, asset })}
                onDelete={(asset) =>
                  setDeleteModal({
                    isOpen: true,
                    type: "asset",
                    id: asset.id,
                    name: asset.name,
                  })
                }
                onAddDetail={(categoryId, categoryName) =>
                  setAssetDetailModal({
                    isOpen: true,
                    categoryId,
                    categoryName,
                  })
                }
                onEditDetail={(categoryId, categoryName, detail) =>
                  setAssetDetailModal({
                    isOpen: true,
                    detail,
                    categoryId,
                    categoryName,
                  })
                }
                onDeleteDetail={(categoryId, _categoryName, detail) =>
                  setDeleteModal({
                    isOpen: true,
                    type: "assetDetail",
                    id: detail.id,
                    categoryId,
                    name: detail.name,
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
                    id: program.id,
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

// Placeholder table components - akan diimplementasi detail
function ProfessorsTable({
  professors,
  onAdd,
  onEdit,
  onDelete,
}: {
  professors: Professor[];
  faculties: FacultyInfo[];
  onAdd: () => void;
  onEdit: (professor: Professor) => void;
  onDelete: (professor: Professor) => void;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(professors.length / itemsPerPage);
  
  // Calculate the data to display for current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = professors.slice(startIndex, endIndex);
  
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Daftar Dosen</h2>
          <p className="text-sm text-slate-500">Kelola data pengajar aktif di universitas.</p>
        </div>
        <div className="flex gap-3">
          <button className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors">
            <Package className="w-5 h-5" />
          </button>
          <button
            onClick={onAdd}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Tambah Dosen
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
              <th className="px-6 py-4">Nama Dosen</th>
              <th className="px-6 py-4">Gelar</th>
              <th className="px-6 py-4">Fakultas</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {currentData.map((prof) => (
              <tr key={prof.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                      {prof.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{prof.name}</p>
                      <p className="text-xs text-slate-500">{prof.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                    {prof.title}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600">
                  {prof.faculty}
                </td>
                <td className="px-6 py-4 text-slate-500">
                  {prof.email}
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit(prof)}
                      className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(prof)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 p-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            Menampilkan {startIndex + 1}-{Math.min(endIndex, professors.length)} dari {professors.length} dosen
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Previous
            </button>
            {getPageNumbers().map((page, index) => (
              page === '...' ? (
                <span key={`ellipsis-${index}`} className="px-4 py-2 text-slate-400">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page as number)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    currentPage === page
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                      : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {page}
                </button>
              )
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function AccreditationsTable({
  accreditations,
  onAdd,
  onEdit,
  onDelete,
}: {
  accreditations: Accreditation[];
  onAdd: () => void;
  onEdit: (accreditation: Accreditation) => void;
  onDelete: (accreditation: Accreditation) => void;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(accreditations.length / itemsPerPage);
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = accreditations.slice(startIndex, endIndex);
  
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: "bg-green-100 text-green-700",
      expired: "bg-red-100 text-red-700",
      pending: "bg-yellow-100 text-yellow-700",
    };
    return styles[status as keyof typeof styles] || "bg-gray-100 text-gray-700";
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Daftar Akreditasi</h2>
          <p className="text-sm text-slate-500">Kelola data akreditasi program studi.</p>
        </div>
        <button
          onClick={onAdd}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Tambah Akreditasi
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
              <th className="px-6 py-4">Program</th>
              <th className="px-6 py-4">Jenjang</th>
              <th className="px-6 py-4">Akreditor</th>
              <th className="px-6 py-4">Berlaku Hingga</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {currentData.map((acc) => (
              <tr key={acc.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4 font-semibold text-slate-900">{acc.program}</td>
                <td className="px-6 py-4 text-slate-600">{acc.level}</td>
                <td className="px-6 py-4 text-slate-600">{acc.accreditor}</td>
                <td className="px-6 py-4 text-slate-600">
                  {new Date(acc.validUntil).toLocaleDateString('id-ID')}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(acc.status)}`}>
                    {acc.status === 'active' ? 'Aktif' : acc.status === 'expired' ? 'Kadaluarsa' : 'Pending'}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit(acc)}
                      className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(acc)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 p-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            Menampilkan {startIndex + 1}-{Math.min(endIndex, accreditations.length)} dari {accreditations.length} akreditasi
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Previous
            </button>
            {getPageNumbers().map((page, index) => (
              page === '...' ? (
                <span key={`ellipsis-${index}`} className="px-4 py-2 text-slate-400">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page as number)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    currentPage === page
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                      : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {page}
                </button>
              )
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function StudentsTable({
  students,
  onAdd,
  onEdit,
  onDelete,
}: {
  students: StudentData[];
  onAdd: () => void;
  onEdit: (student: StudentData) => void;
  onDelete: (student: StudentData) => void;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(students.length / itemsPerPage);
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = students.slice(startIndex, endIndex);
  
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const totalStudents = students.reduce((sum, s) => sum + s.totalStudents, 0);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Data Mahasiswa</h2>
          <p className="text-sm text-slate-500">
            {students.length} Fakultas - Total: {totalStudents.toLocaleString()} mahasiswa
          </p>
        </div>
        <button
          onClick={onAdd}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Tambah Data
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
              <th className="px-6 py-4">Fakultas</th>
              <th className="px-6 py-4 text-right">S1/D3</th>
              <th className="px-6 py-4 text-right">S2</th>
              <th className="px-6 py-4 text-right">Total</th>
              <th className="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {currentData.map((student, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4 font-semibold text-slate-900">{student.faculty}</td>
                <td className="px-6 py-4 text-slate-600 text-right">{student.undergraduate.toLocaleString()}</td>
                <td className="px-6 py-4 text-slate-600 text-right">{student.graduate.toLocaleString()}</td>
                <td className="px-6 py-4 font-bold text-slate-900 text-right">{student.totalStudents.toLocaleString()}</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit(student)}
                      className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(student)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-slate-50 border-t-2 border-slate-300">
            <tr>
              <td className="px-6 py-4 text-sm font-bold text-slate-900">TOTAL</td>
              <td className="px-6 py-4 text-sm font-bold text-slate-900 text-right">
                {students
                  .reduce((sum, s) => sum + s.undergraduate, 0)
                  .toLocaleString()}
              </td>
              <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">
                {students
                  .reduce((sum, s) => sum + s.graduate, 0)
                  .toLocaleString()}
              </td>
              <td className="px-4 py-3 text-sm font-bold text-blue-600 text-right">
                {totalStudents.toLocaleString()}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 p-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            Menampilkan {startIndex + 1}-{Math.min(endIndex, students.length)} dari {students.length} fakultas
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Previous
            </button>
            {getPageNumbers().map((page, index) => (
              page === '...' ? (
                <span key={`ellipsis-${index}`} className="px-4 py-2 text-slate-400">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page as number)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    currentPage === page
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                      : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {page}
                </button>
              )
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function AssetsTable({
  assets,
  onAdd,
  onEdit,
  onDelete,
  onAddDetail,
  onEditDetail,
  onDeleteDetail,
}: {
  assets: AssetCategory[];
  onAdd: () => void;
  onEdit: (asset: AssetCategory) => void;
  onDelete: (asset: AssetCategory) => void;
  onAddDetail: (categoryId: string, categoryName: string) => void;
  onEditDetail: (
    categoryId: string,
    categoryName: string,
    detail: AssetDetail
  ) => void;
  onDeleteDetail: (
    categoryId: string,
    categoryName: string,
    detail: AssetDetail
  ) => void;
}) {
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Daftar Aset</h2>
          <p className="text-sm text-slate-500">{assets.length} Kategori aset terdaftar.</p>
        </div>
        <button
          onClick={onAdd}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Tambah Kategori
        </button>
      </div>
      <div className="space-y-4">
        {assets.map((category) => (
          <div
            key={category.id}
            className="border border-slate-200 rounded-2xl overflow-hidden bg-white/50"
          >
            <div className="bg-slate-50/50 px-6 py-4 flex items-center justify-between border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl bg-${category.color}-50 flex items-center justify-center`}>
                  <Package className={`w-6 h-6 text-${category.color}-600`} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">{category.name}</h4>
                  <p className="text-sm text-slate-500">{category.count} item terdaftar</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onAddDetail(category.id, category.name)}
                  className="px-4 py-2 text-sm bg-emerald-100 text-emerald-700 rounded-xl hover:bg-emerald-200 transition-colors flex items-center gap-2 font-semibold"
                >
                  <Plus className="w-4 h-4" />
                  Tambah Item
                </button>
                <button
                  onClick={() => onEdit(category)}
                  className="p-2.5 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onDelete(category)}
                  className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                    <th className="pb-3">Nama</th>
                    <th className="pb-3">Ruangan</th>
                    <th className="pb-3">Gedung</th>
                    <th className="pb-3 text-right">Kapasitas</th>
                    <th className="pb-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-100">
                  {category.details.slice(0, 5).map((detail) => (
                    <tr key={detail.id} className="hover:bg-slate-50 group transition-colors">
                      <td className="py-3 text-slate-900 font-medium">{detail.name}</td>
                      <td className="py-3 text-slate-600">{detail.room}</td>
                      <td className="py-3 text-slate-600">{detail.building}</td>
                      <td className="py-3 text-slate-600 text-right">
                        {detail.capacity ? `${detail.capacity} orang` : "-"}
                      </td>
                      <td className="py-3 text-center">
                        <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => onEditDetail(category.id, category.name, detail)}
                            className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteDetail(category.id, category.name, detail)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {category.details.length > 5 && (
                <div className="mt-4 pt-4 text-center text-sm border-t border-slate-200 bg-slate-50/50 rounded-lg p-3">
                  <span className="text-emerald-600 font-semibold">
                    +{category.details.length - 5} item lainnya
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProgramsTable({
  programs,
  onAdd,
  onEdit,
  onDelete,
}: {
  programs: ProgramData[];
  faculties: FacultyInfo[];
  onAdd: () => void;
  onEdit: (program: ProgramData) => void;
  onDelete: (program: ProgramData) => void;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(programs.length / itemsPerPage);
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = programs.slice(startIndex, endIndex);
  
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const totalStudents = programs.reduce((sum, p) => sum + p.students, 0);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Program Studi</h2>
          <p className="text-sm text-slate-500">
            {programs.length} Program - Total: {totalStudents.toLocaleString()} mahasiswa
          </p>
        </div>
        <button
          onClick={onAdd}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Tambah Program
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
              <th className="px-6 py-4">Nama Program</th>
              <th className="px-6 py-4">Jenjang</th>
              <th className="px-6 py-4">Fakultas</th>
              <th className="px-6 py-4 text-right">Mahasiswa</th>
              <th className="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {currentData.map((program) => (
              <tr key={program.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4 font-semibold text-slate-900">{program.name}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    {program.level}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600">{program.faculty}</td>
                <td className="px-6 py-4 text-slate-900 text-right font-bold">{program.students.toLocaleString()}</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit(program)}
                      className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(program)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 p-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            Menampilkan {startIndex + 1}-{Math.min(endIndex, programs.length)} dari {programs.length} program studi
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Previous
            </button>
            {getPageNumbers().map((page, index) => (
              page === '...' ? (
                <span key={`ellipsis-${index}`} className="px-4 py-2 text-slate-400">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page as number)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    currentPage === page
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                      : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {page}
                </button>
              )
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
