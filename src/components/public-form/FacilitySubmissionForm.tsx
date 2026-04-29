import { useState, useEffect, useRef, useCallback } from "react";
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
  Trash2,
  ListPlus,
  Package,
  Search,
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

interface QueueItem extends FacilityFormData {
  _id: number; // local queue id
  _photoFile: File | null;
  _gedungName: string; // for display
}

interface SubmittedItem {
  nama_fasilitas: string;
  tipe_fasilitas: string;
  gedung: string;
  status: "success" | "error";
  message?: string;
}

interface ExistingFacility {
  nama_fasilitas: string;
  id_gedung: number;
  lantai: number | null;
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
  const { showSuccess, showError, showInfo } = useToast();

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

  // Photo
  const [photoMode, setPhotoMode] = useState<PhotoMode>("upload");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Batch queue
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [nextId, setNextId] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submittedItems, setSubmittedItems] = useState<SubmittedItem[]>([]);

  // Duplicate check cache
  const [existingFacilities, setExistingFacilities] = useState<
    ExistingFacility[]
  >([]);
  const [checkingDuplicate, setCheckingDuplicate] = useState(false);

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

  const fetchBuildings = useCallback(async () => {
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
  }, [showError]);

  const fetchExistingFacilities = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("fasilitas")
        .select("nama_fasilitas, id_gedung, lantai");
      if (error) throw error;
      setExistingFacilities(data || []);
    } catch {
      // Non-critical — duplicate check will still work against queue
    }
  }, []);

  useEffect(() => {
    fetchBuildings();
    fetchExistingFacilities();
  }, [fetchBuildings, fetchExistingFacilities]);

  /** Check if facility name+gedung+lantai already exists in DB or local queue */
  const isDuplicate = useCallback(
    (
      nama: string,
      gedungId: number,
      lantai: number | null,
    ): { inDb: boolean; inQueue: boolean } => {
      const normName = nama.trim().toLowerCase();

      const inDb = existingFacilities.some(
        (f) =>
          f.nama_fasilitas.trim().toLowerCase() === normName &&
          f.id_gedung === gedungId &&
          f.lantai === lantai,
      );

      const inQueue = queue.some(
        (q) =>
          q.nama_fasilitas.trim().toLowerCase() === normName &&
          q.id_gedung === gedungId &&
          q.lantai === lantai,
      );

      return { inDb, inQueue };
    },
    [existingFacilities, queue],
  );

  /** Re-check against DB in real-time for a specific name+gedung+lantai */
  const checkDuplicateInDb = async (
    nama: string,
    gedungId: number,
    lantai: number | null,
  ): Promise<boolean> => {
    try {
      setCheckingDuplicate(true);
      let query = supabase
        .from("fasilitas")
        .select("id", { count: "exact", head: true })
        .ilike("nama_fasilitas", nama.trim())
        .eq("id_gedung", gedungId);

      if (lantai !== null) {
        query = query.eq("lantai", lantai);
      } else {
        query = query.is("lantai", null);
      }

      const { count, error } = await query;
      if (error) throw error;
      return (count ?? 0) > 0;
    } catch {
      return false; // fail-open — don't block submission on network error
    } finally {
      setCheckingDuplicate(false);
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

  const getGedungName = (id: number): string => {
    return buildings.find((b) => b.id === id)?.nama_gedung || "-";
  };

  // Add current form data to queue
  const handleAddToQueue = async () => {
    if (!validate()) return;

    // Check duplicates in queue
    const { inQueue, inDb } = isDuplicate(
      formData.nama_fasilitas,
      formData.id_gedung,
      formData.lantai,
    );

    if (inQueue) {
      showError(
        `"${formData.nama_fasilitas}" sudah ada di daftar antrian (gedung & lantai sama).`,
      );
      return;
    }

    if (inDb) {
      showError(
        `"${formData.nama_fasilitas}" sudah ada di database (gedung & lantai sama).`,
      );
      return;
    }

    // Real-time DB check
    const existsInDb = await checkDuplicateInDb(
      formData.nama_fasilitas,
      formData.id_gedung,
      formData.lantai,
    );
    if (existsInDb) {
      showError(
        `"${formData.nama_fasilitas}" sudah ada di database (gedung & lantai sama).`,
      );
      return;
    }

    const item: QueueItem = {
      ...formData,
      _id: nextId,
      _photoFile: photoMode === "upload" ? photoFile : null,
      _gedungName: getGedungName(formData.id_gedung),
      foto_url: photoMode === "url" ? formData.foto_url : "",
    };

    setQueue((prev) => [...prev, item]);
    setNextId((prev) => prev + 1);

    // Reset form but keep gedung selected
    const keepGedung = formData.id_gedung;
    setFormData({ ...initialFacilityData, id_gedung: keepGedung });
    setPhotoFile(null);
    setPhotoPreview("");
    setPhotoMode("upload");
    setErrors({});
    if (fileInputRef.current) fileInputRef.current.value = "";

    showSuccess(
      `"${item.nama_fasilitas}" ditambahkan ke daftar (${queue.length + 1} item)`,
    );
  };

  const handleRemoveFromQueue = (id: number) => {
    setQueue((prev) => prev.filter((item) => item._id !== id));
  };

  // Submit all items in queue
  const handleSubmitAll = async () => {
    if (queue.length === 0) {
      showError("Belum ada data di daftar");
      return;
    }

    setSubmitting(true);
    const results: SubmittedItem[] = [];

    for (const item of queue) {
      try {
        // Real-time duplicate check before each insert
        const exists = await checkDuplicateInDb(
          item.nama_fasilitas,
          item.id_gedung,
          item.lantai,
        );
        if (exists) {
          results.push({
            nama_fasilitas: item.nama_fasilitas,
            tipe_fasilitas: item.tipe_fasilitas,
            gedung: item._gedungName,
            status: "error",
            message: "Data sudah ada di database (duplikat)",
          });
          continue;
        }

        let fotoUrl = item.foto_url;

        // Upload photo if file exists
        if (item._photoFile) {
          try {
            fotoUrl = await uploadFacilityPhoto(item._photoFile);
          } catch {
            // Continue without photo
            fotoUrl = "";
          }
        }

        const { error } = await supabase.from("fasilitas").insert({
          nama_fasilitas: item.nama_fasilitas.trim(),
          deskripsi_fasilitas: item.deskripsi_fasilitas.trim() || null,
          tipe_fasilitas: item.tipe_fasilitas || null,
          id_gedung: item.id_gedung,
          lantai: item.lantai ?? null,
          foto_url: fotoUrl.trim() || null,
        });

        if (error) {
          // Handle unique constraint violation from DB
          if (error.code === "23505") {
            results.push({
              nama_fasilitas: item.nama_fasilitas,
              tipe_fasilitas: item.tipe_fasilitas,
              gedung: item._gedungName,
              status: "error",
              message: "Data sudah ada di database (duplikat)",
            });
            continue;
          }
          throw error;
        }

        // Add to known existing facilities cache
        setExistingFacilities((prev) => [
          ...prev,
          {
            nama_fasilitas: item.nama_fasilitas.trim(),
            id_gedung: item.id_gedung,
            lantai: item.lantai,
          },
        ]);

        results.push({
          nama_fasilitas: item.nama_fasilitas,
          tipe_fasilitas: item.tipe_fasilitas,
          gedung: item._gedungName,
          status: "success",
        });
      } catch (err) {
        results.push({
          nama_fasilitas: item.nama_fasilitas,
          tipe_fasilitas: item.tipe_fasilitas,
          gedung: item._gedungName,
          status: "error",
          message:
            err instanceof Error ? err.message : "Gagal menyimpan data",
        });
      }
    }

    const successCount = results.filter((r) => r.status === "success").length;
    const errorCount = results.filter((r) => r.status === "error").length;

    if (errorCount === 0) {
      showSuccess(`Semua ${successCount} fasilitas berhasil disimpan!`);
    } else if (successCount === 0) {
      showError(`Semua ${errorCount} item gagal disimpan.`);
    } else {
      showInfo(
        `${successCount} berhasil, ${errorCount} gagal disimpan.`,
      );
    }

    setSubmittedItems((prev) => [...prev, ...results]);
    setQueue([]);
    setSubmitting(false);
  };

  // Submit single item directly
  const handleSubmitSingle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Duplicate checks
    const { inQueue } = isDuplicate(
      formData.nama_fasilitas,
      formData.id_gedung,
      formData.lantai,
    );
    if (inQueue) {
      showError(
        `"${formData.nama_fasilitas}" sudah ada di daftar antrian. Hapus dari daftar atau ubah nama.`,
      );
      return;
    }

    const existsInDb = await checkDuplicateInDb(
      formData.nama_fasilitas,
      formData.id_gedung,
      formData.lantai,
    );
    if (existsInDb) {
      showError(
        `"${formData.nama_fasilitas}" sudah ada di database (gedung & lantai sama).`,
      );
      return;
    }

    setSubmitting(true);

    try {
      let fotoUrl = formData.foto_url;

      if (photoMode === "upload" && photoFile) {
        try {
          fotoUrl = await uploadFacilityPhoto(photoFile);
        } catch (err) {
          showError(
            err instanceof Error ? err.message : "Gagal mengupload foto",
          );
          setSubmitting(false);
          return;
        }
      }

      const { error } = await supabase.from("fasilitas").insert({
        nama_fasilitas: formData.nama_fasilitas.trim(),
        deskripsi_fasilitas: formData.deskripsi_fasilitas.trim() || null,
        tipe_fasilitas: formData.tipe_fasilitas || null,
        id_gedung: formData.id_gedung,
        lantai: formData.lantai ?? null,
        foto_url: fotoUrl.trim() || null,
      });

      if (error) {
        if (error.code === "23505") {
          showError("Data fasilitas ini sudah ada di database (duplikat).");
          setSubmitting(false);
          return;
        }
        throw error;
      }

      // Update cache
      setExistingFacilities((prev) => [
        ...prev,
        {
          nama_fasilitas: formData.nama_fasilitas.trim(),
          id_gedung: formData.id_gedung,
          lantai: formData.lantai,
        },
      ]);

      const result: SubmittedItem = {
        nama_fasilitas: formData.nama_fasilitas,
        tipe_fasilitas: formData.tipe_fasilitas,
        gedung: getGedungName(formData.id_gedung),
        status: "success",
      };

      setSubmittedItems((prev) => [...prev, result]);
      showSuccess("Data fasilitas berhasil disimpan!");

      // Reset form but keep gedung
      const keepGedung = formData.id_gedung;
      setFormData({ ...initialFacilityData, id_gedung: keepGedung });
      setPhotoFile(null);
      setPhotoPreview("");
      setPhotoMode("upload");
      setErrors({});
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      showError("Gagal menyimpan data. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 py-8 px-4">
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

      {/* Submitted Items Table — full width above */}
      {submittedItems.length > 0 && (
        <div className="max-w-7xl mx-auto mb-6">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Data yang Sudah Disimpan
                <span className="ml-auto text-sm font-normal text-slate-500">
                  {submittedItems.filter((i) => i.status === "success").length}{" "}
                  berhasil
                </span>
              </h2>
            </div>
            <div className="overflow-x-auto max-h-52 overflow-y-auto">
              <table className="w-full text-left">
                <thead className="sticky top-0 bg-white z-10">
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                    <th className="px-5 py-2.5">#</th>
                    <th className="px-5 py-2.5">Nama Fasilitas</th>
                    <th className="px-5 py-2.5">Tipe</th>
                    <th className="px-5 py-2.5">Gedung</th>
                    <th className="px-5 py-2.5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-100">
                  {submittedItems.map((item, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-5 py-2 text-slate-400">{idx + 1}</td>
                      <td className="px-5 py-2 text-slate-900 font-medium">
                        {item.nama_fasilitas}
                      </td>
                      <td className="px-5 py-2 text-slate-600">
                        {item.tipe_fasilitas}
                      </td>
                      <td className="px-5 py-2 text-slate-600">
                        {item.gedung}
                      </td>
                      <td className="px-5 py-2 text-center">
                        {item.status === "success" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                            <CheckCircle2 className="w-3 h-3" />
                            Berhasil
                          </span>
                        ) : (
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700"
                            title={item.message}
                          >
                            <AlertCircle className="w-3 h-3" />
                            Gagal
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Main layout: Form (left) + Queue (right) */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 items-start">
        {/* Left: Form */}
        <form
          onSubmit={handleSubmitSingle}
          className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden w-full lg:w-[55%] lg:min-w-[480px] flex-shrink-0"
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
            <h2 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-600" />
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
                      {photoPreview && (
                        <img
                          src={photoPreview}
                          alt="Preview"
                          className="w-full h-48 object-cover"
                        />
                      )}
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

          {/* Action Buttons */}
          <div className="px-6 sm:px-8 pb-6 sm:pb-8 space-y-3">
            {/* Add to Queue */}
            <button
              type="button"
              onClick={handleAddToQueue}
              disabled={checkingDuplicate}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white px-6 py-3.5 rounded-2xl font-bold shadow-lg shadow-amber-500/20 transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-3"
            >
              {checkingDuplicate ? (
                <>
                  <Search className="w-5 h-5 animate-pulse" />
                  Memeriksa duplikat...
                </>
              ) : (
                <>
                  <ListPlus className="w-5 h-5" />
                  Tambah ke Daftar
                </>
              )}
            </button>

            {/* Submit Single */}
            <button
              type="submit"
              disabled={submitting || checkingDuplicate}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3.5 rounded-2xl font-bold shadow-xl shadow-emerald-500/25 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Menyimpan data...
                </>
              ) : (
                <>
                  <SendHorizonal className="w-5 h-5" />
                  Simpan Langsung
                </>
              )}
            </button>

            <p className="text-center text-xs text-slate-400">
              "Tambah ke Daftar" untuk mengumpulkan beberapa fasilitas lalu
              simpan sekaligus.
              <br />
              "Simpan Langsung" untuk menyimpan satu fasilitas ini saja.
            </p>
          </div>
        </form>

        {/* Right: Queue Panel */}
        <div className="w-full lg:flex-1 lg:sticky lg:top-8">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ListPlus className="w-5 h-5 text-amber-600" />
                  Daftar Antrian
                  {queue.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                      {queue.length}
                    </span>
                  )}
                </h2>
                {queue.length > 0 && (
                  <button
                    type="button"
                    onClick={handleSubmitAll}
                    disabled={submitting}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-semibold text-xs shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98] disabled:opacity-60 flex items-center gap-1.5 whitespace-nowrap"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <SendHorizonal className="w-3.5 h-3.5" />
                        Simpan Semua
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {queue.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <ListPlus className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-400 font-medium">
                  Belum ada data di antrian
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Isi form lalu klik "Tambah ke Daftar"
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 max-h-[calc(100vh-14rem)] overflow-y-auto">
                {queue.map((item, idx) => (
                  <div
                    key={item._id}
                    className="px-5 py-3 hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold mt-0.5">
                        {idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {item.nama_fasilitas}
                        </p>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-500">
                          <span>{item.tipe_fasilitas}</span>
                          <span className="text-slate-300">|</span>
                          <span>{item._gedungName}</span>
                          {item.lantai && (
                            <>
                              <span className="text-slate-300">|</span>
                              <span>Lt. {item.lantai}</span>
                            </>
                          )}
                          {(item._photoFile || item.foto_url) && (
                            <>
                              <span className="text-slate-300">|</span>
                              {item._photoFile ? (
                                <span className="inline-flex items-center gap-0.5 text-emerald-600">
                                  <ImageIcon className="w-3 h-3" />
                                  Foto
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-0.5 text-blue-600">
                                  <Link className="w-3 h-3" />
                                  URL
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFromQueue(item._id)}
                        className="flex-shrink-0 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        title="Hapus dari daftar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-slate-400 mt-6">
        Dashboard Profile UPNVJ &copy; {new Date().getFullYear()}
      </p>
    </div>
  );
}
