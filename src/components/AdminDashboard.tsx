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
} from "lucide-react";
import {
  fetchDashboardData,
  fetchFaculties,
  saveDashboardData,
  clearCache,
  getTotalStats,
  type DashboardData,
  type FacultyInfo,
} from "../services/dataService";
import type {
  Professor,
  Accreditation,
  StudentData,
  AssetCategory,
  ProgramData,
  DepartmentData,
} from "../types";

type TabType =
  | "professors"
  | "accreditations"
  | "students"
  | "assets"
  | "programs"
  | "departments";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("professors");
  const [data, setData] = useState<DashboardData | null>(null);
  const [faculties, setFaculties] = useState<FacultyInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Terakhir diupdate:{" "}
                {data?.lastUpdated
                  ? new Date(data.lastUpdated).toLocaleString("id-ID")
                  : "-"}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleExportData}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              <button
                onClick={loadData}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl hover:from-blue-700 hover:to-green-700 transition-all flex items-center gap-2 disabled:opacity-50"
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
              />
            )}
            {activeTab === "accreditations" && data && (
              <AccreditationsTable accreditations={data.accreditations} />
            )}
            {activeTab === "students" && data && (
              <StudentsTable students={data.students} />
            )}
            {activeTab === "assets" && data && (
              <AssetsTable assets={data.assets} />
            )}
            {activeTab === "programs" && data && (
              <ProgramsTable programs={data.programs} faculties={faculties} />
            )}
            {activeTab === "departments" && data && (
              <DepartmentsTable
                departments={data.departments}
                faculties={faculties}
              />
            )}
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
}: {
  professors: Professor[];
  faculties: FacultyInfo[];
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Daftar Dosen ({professors.length})
        </h3>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
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
                  <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-red-600 hover:bg-red-50 rounded ml-2">
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
}: {
  accreditations: Accreditation[];
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
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
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
                  <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-red-600 hover:bg-red-50 rounded ml-2">
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

function StudentsTable({ students }: { students: StudentData[] }) {
  const totalStudents = students.reduce((sum, s) => sum + s.totalStudents, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Data Mahasiswa ({students.length} Fakultas) - Total:{" "}
          {totalStudents.toLocaleString()} mahasiswa
        </h3>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
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
                  <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-red-600 hover:bg-red-50 rounded ml-2">
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

function AssetsTable({ assets }: { assets: AssetCategory[] }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Daftar Aset ({assets.length} Kategori)
        </h3>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
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
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
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
}: {
  programs: ProgramData[];
  faculties: FacultyInfo[];
}) {
  const totalStudents = programs.reduce((sum, p) => sum + p.students, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Program Studi ({programs.length}) - Total:{" "}
          {totalStudents.toLocaleString()} mahasiswa
        </h3>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
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
                  <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-red-600 hover:bg-red-50 rounded ml-2">
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
}: {
  departments: DepartmentData[];
  faculties: FacultyInfo[];
}) {
  const totalProfessors = departments.reduce((sum, d) => sum + d.professors, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Departemen ({departments.length}) - Total: {totalProfessors} dosen
        </h3>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
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
                  <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-red-600 hover:bg-red-50 rounded ml-2">
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
