import { useState, useEffect, useRef } from "react";
import {
  Building2,
  Plus,
  Upload,
  Link as LinkIcon,
  Image,
  X,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Loader2,
  Send,
  RotateCcw,
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useToast } from "../../contexts/ToastContext";
import { FACILITY_TYPES, COLOR_OPTIONS } from "../../constants/facilityConstants";
import {
  uploadFacilityPhoto,
  validateImageFile,
} from "../../services/storage/uploadService";

interface Building {
  id: number;
  nama_gedung: string;
}

interface FacilityFormData {
  nama_fasilitas: string;
  deskripsi_fasilitas: string;
  tipe_fasilitas: string;
  id_gedung: number;
  color: string;
  lantai: number | "";
  foto_url: string;
}

interface BuildingFormData {
  nama_gedung: string;
  deskripsi_gedung: string;
  lokasi: string;
  jumlah_lantai: number;
}

const initialFacilityData: FacilityFormData = {
  nama_fasilitas: "",
  deskripsi_fasilitas: "",
  tipe_fasilitas: "Laboratorium",
  id_gedung: 0,
  color: "gray",
  lantai: "",
  foto_url: "",
};

const initialBuildingData: BuildingFormData = {
  nama_gedung: "",
  deskripsi_gedung: "",
  lokasi: "",
  jumlah_lantai: 1,
};

export default function FacilitySubmissionForm() {
  const { showSuccess, showError } = useToast();

  // Buildings
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loadingBuildings, setLoadingBuildings] = useState(true);
  const [showNewBuilding, setShowNewBuilding] = useState(false);
  const [buildingForm, setBuildingForm] = useState<BuildingFormData>(initialBuildingData);
  const [savingBuilding, setSavingBuilding] = useState(false);

  // Facility form
  const [formData, setFormData] = useState<FacilityFormData>(initialFacilityData);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Photo upload
  const [photoMode, setPhotoMode] = useState<"upload" | "url">("upload");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchBuildings();
  }, []);

  const fetchBuildings = async () => {
    try {
      setLoadingBuildings(true);
      const { data, error } = await supabase
        .from("gedung")
        .select("id, nama_gedung")
        .order("nama_gedung", { ascending: true });

      if (error) throw error;
      setBuildings(data || []);
    } catch (error) {
      console.error("Error fetching buildings:", error);
      showError("Gagal memuat data gedung");
    } finally {
      setLoadingBuildings(false);
    }
  };

  // === Building Sub-form ===
  const handleSaveBuilding = async () => {
    if (!buildingForm.nama_gedung.trim()) {
      showError("Nama gedung wajib diisi");
      return;
    }

    try {
      setSavingBuilding(true);
      const { data, error } = await supabase
        .from("gedung")
        .insert({
          nama_gedung: buildingForm.nama_gedung.trim(),
          deskripsi_gedung: buildingForm.deskripsi_gedung.trim() || null,
          lokasi: buildingForm.lokasi.trim() || null,
          jumlah_lantai: buildingForm.jumlah_lantai,
        })
        .select("id, nama_gedung")
        .single();

      if (error) throw error;

      // Add to buildings list and auto-select
      setBuildings((prev) => [...prev, data].sort((a, b) => a.nama_gedung.localeCompare(b.nama_gedung)));
      setFormData((prev) => ({ ...prev, id_gedung: data.id }));
      setBuildingForm(initialBuildingData);
      setShowNewBuilding(false);
      showSuccess(`Gedung "${data.nama_gedung}" berhasil ditambahkan`);
    } catch (error) {
      console.error("Error creating building:", error);
      showError("Gagal menambahkan gedung. Pastikan nama gedung belum ada.");
    } finally {
      setSavingBuilding(false);
    }
  };

  // === Photo Handling ===
  const handleFileSelect = (file: File) => {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      showError(validation.error || "File tidak valid");
      return;
    }

    setPhotoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
    setErrors((prev) => ({ ...prev, foto: "" }));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => setDragActive(false);

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // === Validation ===
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nama_fasilitas.trim()) {
      newErrors.nama_fasilitas = "Nama fasilitas wajib diisi";
    }
    if (!formData.id_gedung || formData.id_gedung === 0) {
      newErrors.id_gedung = "Gedung wajib dipilih";
    }
    if (!formData.tipe_fasilitas) {
      newErrors.tipe_fasilitas = "Tipe fasilitas wajib dipilih";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // === Submit ===
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      let fotoUrl = formData.foto_url;

      // Upload photo file if exists
      if (photoMode === "upload" && photoFile) {
        setUploading(true);
        try {
          fotoUrl = await uploadFacilityPhoto(photoFile);
        } catch (uploadError) {
          console.error("Upload error:", uploadError);
          showError("Gagal upload foto. Data tetap akan disimpan tanpa foto.");
          fotoUrl = "";
        } finally {
          setUploading(false);
        }
      }

      // Insert facility
      const { error } = await supabase
        .from("fasilitas")
        .insert({
          nama_fasilitas: formData.nama_fasilitas.trim(),
          deskripsi_fasilitas: formData.deskripsi_fasilitas.trim() || null,
          tipe_fasilitas: formData.tipe_fasilitas,
          id_gedung: formData.id_gedung,
          color: formData.color,
          lantai: formData.lantai === "" ? null : Number(formData.lantai),
          foto_url: fotoUrl || null,
        })
        .select()
        .single();

      if (error) throw error;

      setSubmitted(true);
      showSuccess("Data fasilitas berhasil disimpan!");
    } catch (error) {
      console.error("Error submitting facility:", error);
      showError("Gagal menyimpan data fasilitas. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(initialFacilityData);
    setPhotoFile(null);
    setPhotoPreview("");
    setPhotoMode("upload");
    setErrors({});
    setSubmitted(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // === Success Screen ===
  if (submitted) {
    return (
      <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Data Berhasil Disimpan!
          </h2>
          <p className="text-slate-500 mb-8">
            Data fasilitas telah berhasil dikirim ke database. Terima kasih atas kontribusinya.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Input Data Lagi
            </button>
            <a
              href="/"
              className="px-6 py-3 border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
            >
              Ke Beranda
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-50">
      {/* Header Bar */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">
                Input Data Fasilitas
              </h1>
              <p className="text-xs text-slate-500">
                UPN Veteran Jakarta
              </p>
            </div>
          </div>
          <a
            href="/"
            className="text-sm text-slate-500 hover:text-emerald-600 transition-colors"
          >
            ← Kembali
          </a>
        </div>
      </div>

      {/* Form Container */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section: Gedung */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-600" />
                Gedung
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Pilih gedung yang ada atau tambahkan gedung baru
              </p>
            </div>
            <div className="p-6 space-y-4">
              {/* Building Select */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Pilih Gedung <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.id_gedung}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      id_gedung: Number(e.target.value),
                    }));
                    setErrors((prev) => ({ ...prev, id_gedung: "" }));
                  }}
                  className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors ${
                    errors.id_gedung
                      ? "border-red-300 bg-red-50"
                      : "border-slate-200"
                  }`}
                  disabled={loadingBuildings}
                >
                  <option value={0}>
                    {loadingBuildings ? "Memuat..." : "-- Pilih Gedung --"}
                  </option>
                  {buildings.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.nama_gedung}
                    </option>
                  ))}
                </select>
                {errors.id_gedung && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.id_gedung}
                  </p>
                )}
              </div>

              {/* Toggle New Building Form */}
              <button
                type="button"
                onClick={() => setShowNewBuilding(!showNewBuilding)}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1 transition-colors"
              >
                {showNewBuilding ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
                {showNewBuilding
                  ? "Tutup form gedung baru"
                  : "Tambah gedung baru"}
              </button>

              {/* New Building Sub-form */}
              {showNewBuilding && (
                <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-5 space-y-4">
                  <h3 className="text-sm font-bold text-emerald-800">
                    Gedung Baru
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Nama Gedung <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={buildingForm.nama_gedung}
                        onChange={(e) =>
                          setBuildingForm((prev) => ({
                            ...prev,
                            nama_gedung: e.target.value,
                          }))
                        }
                        placeholder="Contoh: Gedung Rektorat"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Deskripsi
                      </label>
                      <textarea
                        value={buildingForm.deskripsi_gedung}
                        onChange={(e) =>
                          setBuildingForm((prev) => ({
                            ...prev,
                            deskripsi_gedung: e.target.value,
                          }))
                        }
                        placeholder="Deskripsi singkat gedung..."
                        rows={2}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Lokasi
                      </label>
                      <input
                        type="text"
                        value={buildingForm.lokasi}
                        onChange={(e) =>
                          setBuildingForm((prev) => ({
                            ...prev,
                            lokasi: e.target.value,
                          }))
                        }
                        placeholder="Contoh: Kampus Pondok Labu"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Jumlah Lantai
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={buildingForm.jumlah_lantai}
                        onChange={(e) =>
                          setBuildingForm((prev) => ({
                            ...prev,
                            jumlah_lantai: Number(e.target.value) || 1,
                          }))
                        }
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleSaveBuilding}
                      disabled={savingBuilding}
                      className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                      {savingBuilding ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                      {savingBuilding ? "Menyimpan..." : "Simpan Gedung"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Section: Data Fasilitas */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-600" />
                Data Fasilitas
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Isi informasi detail fasilitas
              </p>
            </div>
            <div className="p-6 space-y-5">
              {/* Nama Fasilitas */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Nama Fasilitas <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nama_fasilitas}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      nama_fasilitas: e.target.value,
                    }));
                    setErrors((prev) => ({ ...prev, nama_fasilitas: "" }));
                  }}
                  placeholder="Contoh: Laboratorium Komputer 1"
                  className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors ${
                    errors.nama_fasilitas
                      ? "border-red-300 bg-red-50"
                      : "border-slate-200"
                  }`}
                />
                {errors.nama_fasilitas && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.nama_fasilitas}
                  </p>
                )}
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Deskripsi Fasilitas
                </label>
                <textarea
                  value={formData.deskripsi_fasilitas}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      deskripsi_fasilitas: e.target.value,
                    }))
                  }
                  placeholder="Deskripsi singkat tentang fasilitas ini..."
                  rows={3}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Tipe & Lantai */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Tipe Fasilitas <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.tipe_fasilitas}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        tipe_fasilitas: e.target.value,
                      }));
                      setErrors((prev) => ({ ...prev, tipe_fasilitas: "" }));
                    }}
                    className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors ${
                      errors.tipe_fasilitas
                        ? "border-red-300 bg-red-50"
                        : "border-slate-200"
                    }`}
                  >
                    {FACILITY_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {errors.tipe_fasilitas && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />{" "}
                      {errors.tipe_fasilitas}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Lantai
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.lantai}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        lantai: e.target.value === "" ? "" : Number(e.target.value),
                      }))
                    }
                    placeholder="Contoh: 2"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Warna */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Warna Penanda
                </label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_OPTIONS.map((colorOpt) => (
                    <button
                      key={colorOpt.value}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          color: colorOpt.value,
                        }))
                      }
                      className={`w-9 h-9 rounded-full ${colorOpt.class} flex items-center justify-center transition-all ${
                        formData.color === colorOpt.value
                          ? "ring-4 ring-offset-2 ring-emerald-500 scale-110"
                          : "hover:scale-105 opacity-70 hover:opacity-100"
                      }`}
                      title={colorOpt.label}
                    >
                      {formData.color === colorOpt.value && (
                        <span className="text-white text-sm font-bold">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Section: Foto */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Image className="w-5 h-5 text-emerald-600" />
                Foto Fasilitas
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Upload foto atau masukkan URL gambar (opsional)
              </p>
            </div>
            <div className="p-6 space-y-4">
              {/* Mode Toggle */}
              <div className="flex gap-2 p-1 bg-slate-100 rounded-xl w-fit">
                <button
                  type="button"
                  onClick={() => setPhotoMode("upload")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                    photoMode === "upload"
                      ? "bg-white text-emerald-700 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoMode("url")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                    photoMode === "url"
                      ? "bg-white text-emerald-700 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <LinkIcon className="w-4 h-4" />
                  URL Manual
                </button>
              </div>

              {/* Upload Mode */}
              {photoMode === "upload" && (
                <div>
                  {!photoPreview ? (
                    <div
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                        dragActive
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30"
                      }`}
                    >
                      <Upload
                        className={`w-10 h-10 mx-auto mb-3 ${
                          dragActive ? "text-emerald-500" : "text-slate-300"
                        }`}
                      />
                      <p className="text-sm font-medium text-slate-600">
                        Drag & drop foto di sini, atau{" "}
                        <span className="text-emerald-600">klik untuk pilih file</span>
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        JPG, PNG, WebP, GIF — Maks. 5MB
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileSelect(file);
                        }}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    <div className="relative rounded-xl overflow-hidden border border-slate-200">
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-full h-48 object-cover"
                      />
                      <button
                        type="button"
                        onClick={removePhoto}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="p-3 bg-slate-50 text-xs text-slate-500">
                        {photoFile?.name} —{" "}
                        {((photoFile?.size || 0) / 1024).toFixed(1)} KB
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* URL Mode */}
              {photoMode === "url" && (
                <div>
                  <input
                    type="url"
                    value={formData.foto_url}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        foto_url: e.target.value,
                      }))
                    }
                    placeholder="https://contoh.com/foto-fasilitas.jpg"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  {formData.foto_url && (
                    <div className="mt-3 rounded-xl overflow-hidden border border-slate-200">
                      <img
                        src={formData.foto_url}
                        alt="Preview URL"
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-6 py-3.5 bg-emerald-600 text-white rounded-xl font-bold text-base hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {uploading ? "Mengupload foto..." : "Menyimpan..."}
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Kirim Data Fasilitas
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={submitting}
              className="px-6 py-3.5 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </form>

        {/* Footer Note */}
        <p className="text-center text-xs text-slate-400 mt-8 pb-8">
          Data yang diinput akan langsung tersimpan ke database kampus.
          <br />
          Pastikan data yang diisi sudah benar sebelum mengirim.
        </p>
      </div>
    </div>
  );
}
