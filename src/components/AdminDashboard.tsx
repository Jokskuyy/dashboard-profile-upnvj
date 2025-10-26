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
  Download,
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
  createDepartment,
  updateDepartment,
  deleteDepartment,
  createAssetCategory,
  updateAssetCategory,
  deleteAssetCategory,
  addAssetDetail,
  updateAssetDetail,
  deleteAssetDetail,
  type DashboardData,
  type FacultyInfo,
} from "../services/dataService";
import type {
  Professor,
  Accreditation,
  StudentData,
  AssetCategory,
  AssetDetail,
  ProgramData,
  DepartmentData,
} from "../types";
import ProfessorModal from "./modals/ProfessorModal";
import AccreditationModal from "./modals/AccreditationModal";
import StudentModal from "./modals/StudentModal";
import ProgramModal from "./modals/ProgramModal";
import DepartmentModal from "./modals/DepartmentModal";
import AssetModal from "./modals/AssetModal";
import AssetDetailModal from "./modals/AssetDetailModal";
import DeleteConfirmModal from "./modals/DeleteConfirmModal";
import Toast, { type ToastType } from "./Toast";
import AdminTrafficAnalytics from "./AdminTrafficAnalytics";

type TabType =
  | "professors"
  | "accreditations"
  | "students"
  | "assets"
  | "programs"
  | "departments"
  | "analytics";

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

  const [departmentModal, setDepartmentModal] = useState<{
    isOpen: boolean;
    department?: DepartmentData;
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
      } else if (deleteModal.type === "department" && deleteModal.id) {
        await deleteDepartment(deleteModal.id);
        showToast("Departemen berhasil dihapus", "success");
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

  // Department CRUD handlers
  const handleSaveDepartment = async (
    department: Omit<DepartmentData, "id"> | DepartmentData
  ) => {
    try {
      if ("id" in department) {
        await updateDepartment(department.id, department);
        showToast("Data departemen berhasil diupdate", "success");
      } else {
        await createDepartment(department);
        showToast("Departemen baru berhasil ditambahkan", "success");
      }
      await loadData();
    } catch (error) {
      console.error("Error saving department:", error);
      showToast("Gagal menyimpan data departemen", "error");
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

  const handleExportData = () => {
    if (!data) return;

    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dashboard-data-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
      id: "departments",
      label: "Departemen",
      icon: Building2,
      count: data?.departments.length,
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
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

      <DepartmentModal
        isOpen={departmentModal.isOpen}
        onClose={() => setDepartmentModal({ isOpen: false })}
        onSave={handleSaveDepartment}
        department={departmentModal.department}
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
      <div className="bg-[#2C5F2D] shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white drop-shadow-lg">
                Admin Dashboard
              </h1>
              <p className="text-sm text-yellow-200 mt-1">
                Terakhir diupdate:{" "}
                {data?.lastUpdated
                  ? new Date(data.lastUpdated).toLocaleString("id-ID")
                  : "-"}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleExportData}
                className="px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              <button
                onClick={loadData}
                className="px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-yellow-500 text-gray-900 font-semibold rounded-xl hover:bg-yellow-400 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Dosen</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalProfessors}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Mahasiswa</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalStudents.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Akreditasi Aktif</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.activeAccreditations}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Aset</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalAssets}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Fakultas</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalFaculties}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
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
          <div className="p-6">
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
            {activeTab === "departments" && data && (
              <DepartmentsTable
                departments={data.departments}
                faculties={faculties}
                onAdd={() => setDepartmentModal({ isOpen: true })}
                onEdit={(department) =>
                  setDepartmentModal({ isOpen: true, department })
                }
                onDelete={(department) =>
                  setDeleteModal({
                    isOpen: true,
                    type: "department",
                    id: department.id,
                    name: department.name,
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
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Daftar Dosen ({professors.length})
        </h3>
        <button
          onClick={onAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Tambah Dosen
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                Nama
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                Gelar
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                Fakultas
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                Email
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 uppercase">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {professors.slice(0, 10).map((prof) => (
              <tr key={prof.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900">{prof.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {prof.title}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {prof.faculty}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {prof.email}
                </td>
                <td className="px-4 py-3 text-sm text-right">
                  <button
                    onClick={() => onEdit(prof)}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(prof)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {professors.length > 10 && (
          <div className="mt-4 text-center text-sm text-gray-600">
            Dan {professors.length - 10} dosen lainnya...
          </div>
        )}
      </div>
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
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Daftar Akreditasi ({accreditations.length})
        </h3>
        <button
          onClick={onAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Tambah Akreditasi
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                Program
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                Jenjang
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                Akreditor
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                Berlaku Hingga
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                Status
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 uppercase">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {accreditations.map((acc) => (
              <tr key={acc.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {acc.program}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{acc.level}</td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {acc.accreditor}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {new Date(acc.validUntil).toLocaleDateString("id-ID")}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                      acc.status
                    )}`}
                  >
                    {acc.status === "active"
                      ? "Aktif"
                      : acc.status === "expired"
                      ? "Kadaluarsa"
                      : "Pending"}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-right">
                  <button
                    onClick={() => onEdit(acc)}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(acc)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
  const totalStudents = students.reduce((sum, s) => sum + s.totalStudents, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Data Mahasiswa ({students.length} Fakultas) - Total:{" "}
          {totalStudents.toLocaleString()} mahasiswa
        </h3>
        <button
          onClick={onAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Tambah Data
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                Fakultas
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 uppercase">
                S1/D3
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 uppercase">
                S2
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 uppercase">
                S3
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 uppercase">
                Total
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 uppercase">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {students.map((student, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {student.faculty}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 text-right">
                  {student.undergraduate.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 text-right">
                  {student.graduate.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 text-right">
                  {student.postgraduate.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">
                  {student.totalStudents.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm text-right">
                  <button
                    onClick={() => onEdit(student)}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(student)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50 border-t-2 border-gray-300">
            <tr>
              <td className="px-4 py-3 text-sm font-bold text-gray-900">
                TOTAL
              </td>
              <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">
                {students
                  .reduce((sum, s) => sum + s.undergraduate, 0)
                  .toLocaleString()}
              </td>
              <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">
                {students
                  .reduce((sum, s) => sum + s.graduate, 0)
                  .toLocaleString()}
              </td>
              <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">
                {students
                  .reduce((sum, s) => sum + s.postgraduate, 0)
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
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Daftar Aset ({assets.length} Kategori)
        </h3>
        <button
          onClick={onAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Tambah Kategori
        </button>
      </div>
      <div className="space-y-4">
        {assets.map((category) => (
          <div
            key={category.id}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg bg-${category.color}-100 flex items-center justify-center`}
                >
                  <Package className={`w-5 h-5 text-${category.color}-600`} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {category.name}
                  </h4>
                  <p className="text-sm text-gray-600">{category.count} item</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onAddDetail(category.id, category.name)}
                  className="px-3 py-1.5 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Item
                </button>
                <button
                  onClick={() => onEdit(category)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(category)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <table className="w-full">
                <thead className="text-xs text-gray-500 border-b">
                  <tr>
                    <th className="text-left py-2">Nama</th>
                    <th className="text-left py-2">Ruangan</th>
                    <th className="text-left py-2">Gedung</th>
                    <th className="text-right py-2">Kapasitas</th>
                    <th className="text-right py-2">Aksi</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {category.details.slice(0, 5).map((detail) => (
                    <tr key={detail.id} className="border-b last:border-0">
                      <td className="py-2 text-gray-900">{detail.name}</td>
                      <td className="py-2 text-gray-600">{detail.room}</td>
                      <td className="py-2 text-gray-600">{detail.building}</td>
                      <td className="py-2 text-gray-600 text-right">
                        {detail.capacity ? `${detail.capacity} orang` : "-"}
                      </td>
                      <td className="py-2 text-right">
                        <button
                          onClick={() =>
                            onEditDetail(category.id, category.name, detail)
                          }
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() =>
                            onDeleteDetail(category.id, category.name, detail)
                          }
                          className="p-1 text-red-600 hover:bg-red-50 rounded ml-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {category.details.length > 5 && (
                <div className="mt-2 text-center text-sm text-gray-500">
                  +{category.details.length - 5} item lainnya
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
  const totalStudents = programs.reduce((sum, p) => sum + p.students, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Program Studi ({programs.length}) - Total:{" "}
          {totalStudents.toLocaleString()} mahasiswa
        </h3>
        <button
          onClick={onAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Tambah Program
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                Nama Program
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                Jenjang
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                Fakultas
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 uppercase">
                Mahasiswa
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 uppercase">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {programs.map((program) => (
              <tr key={program.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900">
                  {program.name}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    {program.level}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {program.faculty}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 text-right font-medium">
                  {program.students.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm text-right">
                  <button
                    onClick={() => onEdit(program)}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(program)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {programs.length > 20 && (
          <div className="mt-4 text-center text-sm text-gray-600">
            Showing first 20 of {programs.length} programs
          </div>
        )}
      </div>
    </div>
  );
}

function DepartmentsTable({
  departments,
  onAdd,
  onEdit,
  onDelete,
}: {
  departments: DepartmentData[];
  faculties: FacultyInfo[];
  onAdd: () => void;
  onEdit: (department: DepartmentData) => void;
  onDelete: (department: DepartmentData) => void;
}) {
  const totalProfessors = departments.reduce((sum, d) => sum + d.professors, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Departemen ({departments.length}) - Total: {totalProfessors} dosen
        </h3>
        <button
          onClick={onAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Tambah Departemen
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                Nama Departemen
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                Fakultas
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                Deskripsi
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 uppercase">
                Dosen
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 uppercase">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {departments.map((dept) => (
              <tr key={dept.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {dept.name}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {dept.faculty}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 max-w-md truncate">
                  {dept.description}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 text-right font-medium">
                  {dept.professors}
                </td>
                <td className="px-4 py-3 text-sm text-right">
                  <button
                    onClick={() => onEdit(dept)}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(dept)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
