import { useState, useEffect, useRef } from "react";
import {
  Building2,
  Upload,
  Link,
  Plus,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ImageIcon,
  X,
  SendHorizonal,
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useToast } from "../../contexts/ToastContext";
import { FACILITY_TYPES } from "../../constants/facilityConstants";
import { uploadFacilityPhoto } from "../../services/storage/uploadService";

interface Building {
  id: number;
  nama_gedung: string;
}

interface FacilityFormData {
  nama_fasilitas: string;
  deskripsi_fasilitas: string;
  tipe_fasilitas: string;
  id_gedung: number;
  lantai: number | null;
  foto_url: string;
}

interface BuildingFormData {
  nama_gedung: string;
  deskripsi_gedung: string;
  lokasi: string;
  jumlah_lantai: number;
}

type PhotoMode = "upload" | "url";

const initialFacilityData: FacilityFormData = {
  nama_fasilitas: "",
  deskripsi_fasilitas: "",
  tipe_fasilitas: "Laboratorium",
  id_gedung: 0,
  lantai: null,
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
  const [buildingForm, setBuildingForm] =
    useState<BuildingFormData>(initialBuildingData);
  const [savingBuilding, setSavingBuilding] = useState(false);

  // Facility form
  const [formData, setFormData] =
    useState<FacilityFormData>(initialFacilityData);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Photo
  const [photoMode, setPhotoMode] = useState<PhotoMode>("upload");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchBuildings();
  }, []);

  // Generate preview when file changes
  useEffect(() => {
    if (photoFile) {
      const url = URL.createObjectURL(photoFile);
      setPhotoPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [photoFile]);

  // Generate preview when URL changes
  useEffect(() => {
    if (photoMode === "url" && formData.foto_url) {
      setPhotoPreview(formData.foto_url);
    }
  }, [formData.foto_url, photoMode]);

  const fetchBuildings = async () => {
    try {
      setLoadingBuildings(true);
      const { data, error } = await supabase
        .from("gedung")
        .select("id, nama_gedung")
        .order("nama_gedung", { ascending: true });
      if (error) throw error;
      setBuildings(data || []);
    } catch {
      showError("Gagal memuat data gedung");
    } finally {
      setLoadingBuildings(false);
    }
  };

  const handleSaveBuilding = async () => {
    if (!buildingForm.nama_gedung.trim()) {
      showError("Nama gedung harus diisi");
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
          jumlah_lantai: buildingForm.jumlah_lantai || 1,
        })
        .select("id, nama_gedung")
        .single();

      if (error) {
        if (error.code === "23505") {
          showError("Gedung dengan nama ini sudah ada");
        } else {
          throw error;
        }
        return;
      }

      // Add to list and auto-select
      setBuildings((prev) =>
        [...prev, data].sort((a, b) =>
          a.nama_gedung.localeCompare(b.nama_gedung),
        ),
      );
      setFormData((prev) => ({ ...prev, id_gedung: data.id }));
      setBuildingForm(initialBuildingData);
      setShowNewBuilding(false);
      showSuccess(`Gedung "${data.nama_gedung}" berhasil ditambahkan`);
    } catch {
      showError("Gagal menyimpan gedung. Silakan coba lagi.");
    } finally {
      setSavingBuilding(false);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nama_fasilitas.trim()) {
      newErrors.nama_fasilitas = "Nama fasilitas harus diisi";
    }
    if (!formData.id_gedung) {
      newErrors.id_gedung = "Gedung harus dipilih";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);

      let fotoUrl = formData.foto_url;

      // Upload photo if file selected
      if (photoMode === "upload" && photoFile) {
        setUploading(true);
        try {
          fotoUrl = await uploadFacilityPhoto(photoFile);
        } catch (err) {
          showError(
            err instanceof Error ? err.message : "Gagal mengupload foto",
          );
          setUploading(false);
          setSubmitting(false);
          return;
        }
        setUploading(false);
      }

      // Insert facility
      const { error } = await supabase.from("fasilitas").insert({
        nama_fasilitas: formData.nama_fasilitas.trim(),
        deskripsi_fasilitas: formData.deskripsi_fasilitas.trim() || null,
        tipe_fasilitas: formData.tipe_fasilitas || null,
        id_gedung: formData.id_gedung,
        lantai: formData.lantai ?? null,
        foto_url: fotoUrl.trim() || null,
      });

      if (error) throw error;

      showSuccess("Data fasilitas berhasil disimpan!");
      setSubmitted(true);
    } catch {
      showError("Gagal menyimpan data. Silakan coba lagi.");
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
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setPhotoFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
    }
  };

  const clearPhoto = () => {
    setPhotoFile(null);
    setPhotoPreview("");
    setFormData((prev) => ({ ...prev, foto_url: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Success screen
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Data Berhasil Disimpan!
          </h2>
          <p className="text-slate-600 mb-8">
            Terima kasih, data fasilitas telah berhasil ditambahkan ke database.
          </p>
          <button
            onClick={handleReset}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3.5 rounded-xl font-semibold shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98]"
          >
            Submit Data Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Input Data Fasilitas
          </h1>
          <p className="text-slate-600 mt-2">
            UPN Veteran Jakarta — Formulir Pendataan Fasilitas Kampus
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
        >
          {/* Section: Gedung */}
          <div className="p-6 sm:p-8 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-600" />
              Gedung
            </h2>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Pilih Gedung <span className="text-red-500">*</span>
              </label>
              {loadingBuildings ? (
                <div className="flex items-center gap-2 text-slate-500 py-3">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Memuat data gedung...</span>
                </div>
              ) : (
                <select
                  value={formData.id_gedung}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      id_gedung: parseInt(e.target.value),
                    });
                    setErrors((prev) => {
                      const next = { ...prev };
                      delete next.id_gedung;
                      return next;
                    });
                  }}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
                    errors.id_gedung
                      ? "border-red-300 bg-red-50"
                      : "border-slate-300"
                  }`}
                >
                  <option value={0}>— Pilih Gedung —</option>
                  {buildings.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.nama_gedung}
                    </option>
                  ))}
                </select>
              )}
              {errors.id_gedung && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.id_gedung}
                </p>
              )}
            </div>

            {/* Toggle: Add New Building */}
            <button
              type="button"
              onClick={() => setShowNewBuilding(!showNewBuilding)}
              className="mt-4 text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5 transition-colors"
            >
              {showNewBuilding ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
              {showNewBuilding
                ? "Tutup form gedung baru"
                : "Tambah Gedung Baru"}
            </button>

            {/* New Building Sub-form */}
            {showNewBuilding && (
              <div className="mt-4 p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-emerald-600" />
                  Gedung Baru
                </h3>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Nama Gedung <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={buildingForm.nama_gedung}
                    onChange={(e) =>
                      setBuildingForm({
                        ...buildingForm,
                        nama_gedung: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
                    placeholder="Contoh: Gedung Rektorat"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Deskripsi
                  </label>
                  <textarea
                    value={buildingForm.deskripsi_gedung}
                    onChange={(e) =>
                      setBuildingForm({
                        ...buildingForm,
                        deskripsi_gedung: e.target.value,
                      })
                    }
                    rows={2}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm resize-none"
                    placeholder="Deskripsi singkat gedung..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Lokasi
                    </label>
                    <input
                      type="text"
                      value={buildingForm.lokasi}
                      onChange={(e) =>
                        setBuildingForm({
                          ...buildingForm,
                          lokasi: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
                      placeholder="Contoh: Kampus Pondok Labu"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Jumlah Lantai
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={buildingForm.jumlah_lantai}
                      onChange={(e) =>
                        setBuildingForm({
                          ...buildingForm,
                          jumlah_lantai: parseInt(e.target.value) || 1,
                        })
                      }
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSaveBuilding}
                  disabled={savingBuilding}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {savingBuilding ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Simpan Gedung
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Section: Fasilitas */}
          <div className="p-6 sm:p-8 space-y-5">
            <h2 className="text-lg font-bold text-slate-900 mb-1">
              Data Fasilitas
            </h2>

            {/* Nama Fasilitas */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Nama Fasilitas <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.nama_fasilitas}
                onChange={(e) => {
                  setFormData({ ...formData, nama_fasilitas: e.target.value });
                  setErrors((prev) => {
                    const next = { ...prev };
                    delete next.nama_fasilitas;
                    return next;
                  });
                }}
                maxLength={255}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all ${
                  errors.nama_fasilitas
                    ? "border-red-300 bg-red-50"
                    : "border-slate-300"
                }`}
                placeholder="Contoh: Laboratorium Komputer 1"
              />
              {errors.nama_fasilitas && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.nama_fasilitas}
                </p>
              )}
            </div>

            {/* Deskripsi */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Deskripsi Fasilitas
              </label>
              <textarea
                value={formData.deskripsi_fasilitas}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    deskripsi_fasilitas: e.target.value,
                  })
                }
                rows={3}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
                placeholder="Deskripsi detail tentang fasilitas ini..."
              />
            </div>

            {/* Tipe & Lantai */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Tipe Fasilitas
                </label>
                <select
                  value={formData.tipe_fasilitas}
                  onChange={(e) =>
                    setFormData({ ...formData, tipe_fasilitas: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                >
                  {FACILITY_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Lantai
                </label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={formData.lantai ?? ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      lantai: e.target.value ? parseInt(e.target.value) : null,
                    })
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="Contoh: 2"
                />
              </div>
            </div>

            {/* Photo Section */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Foto Fasilitas
              </label>

              {/* Photo Mode Tabs */}
              <div className="flex bg-slate-100 rounded-xl p-1 mb-4">
                <button
                  type="button"
                  onClick={() => {
                    setPhotoMode("upload");
                    if (photoMode !== "upload") {
                      setPhotoPreview("");
                      setFormData((prev) => ({ ...prev, foto_url: "" }));
                    }
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
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
                  onClick={() => {
                    setPhotoMode("url");
                    if (photoMode !== "url") {
                      setPhotoFile(null);
                      setPhotoPreview("");
                    }
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    photoMode === "url"
                      ? "bg-white text-emerald-700 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Link className="w-4 h-4" />
                  URL Manual
                </button>
              </div>

              {/* Upload Mode */}
              {photoMode === "upload" && (
                <div>
                  {!photoFile ? (
                    <div
                      onDrop={handleDrop}
                      onDragOver={(e) => e.preventDefault()}
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30 transition-all"
                    >
                      <ImageIcon className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                      <p className="text-sm font-medium text-slate-700">
                        Drag & drop foto di sini
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        atau klik untuk memilih file (JPEG, PNG, WebP, GIF —
                        maks 5MB)
                      </p>
                    </div>
                  ) : (
                    <div className="relative rounded-2xl overflow-hidden border border-slate-200">
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-full h-48 object-cover"
                      />
                      <button
                        type="button"
                        onClick={clearPhoto}
                        className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="px-4 py-2 bg-slate-50 text-xs text-slate-600 truncate">
                        {photoFile.name} (
                        {(photoFile.size / 1024 / 1024).toFixed(2)} MB)
                      </div>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              )}

              {/* URL Mode */}
              {photoMode === "url" && (
                <div className="space-y-3">
                  <input
                    type="url"
                    value={formData.foto_url}
                    onChange={(e) =>
                      setFormData({ ...formData, foto_url: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="https://example.com/foto-fasilitas.jpg"
                  />
                  {photoPreview && (
                    <div className="relative rounded-2xl overflow-hidden border border-slate-200">
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-full h-48 object-cover"
                        onError={() => setPhotoPreview("")}
                      />
                      <button
                        type="button"
                        onClick={clearPhoto}
                        className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="px-6 sm:px-8 pb-6 sm:pb-8">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-emerald-500/25 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {uploading ? "Mengupload foto..." : "Menyimpan data..."}
                </>
              ) : (
                <>
                  <SendHorizonal className="w-5 h-5" />
                  Simpan Data Fasilitas
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400 mt-6">
          Dashboard Profile UPNVJ &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
