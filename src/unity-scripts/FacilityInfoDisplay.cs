// ============================================
// FacilityInfoDisplay.cs
// ============================================
// Script untuk menampilkan data FASILITAS dari database ke TMP Text.
// Mirip dengan BuildingInfoDisplay.cs, tapi untuk level fasilitas/ruangan.
//
// SETUP:
// 1. Copy ke Assets/Scripts/Database/ di Unity project
// 2. Attach ke GameObject ruangan/fasilitas di scene
// 3. Set fasilitasId ATAU gedungId + lantai di Inspector
// 4. Drag TMP Text objects ke slot di Inspector
//
// Script ini otomatis mengupdate text saat data diterima dari backend
// ============================================

using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.Networking;
using TMPro;

public class FacilityInfoDisplay : MonoBehaviour
{
    // ============================================
    // MODE 1: Tampilkan SATU fasilitas berdasarkan ID
    // ============================================
    [Header("Mode 1 — Fasilitas Tunggal (by ID)")]
    [Tooltip("ID fasilitas dari tabel 'fasilitas' di Supabase. Set 0 untuk disable mode ini.")]
    public int fasilitasId;

    [Header("TMP Text — Detail Fasilitas")]
    [Tooltip("Text untuk nama fasilitas")]
    public TextMeshProUGUI namaFasilitasText;

    [Tooltip("Text untuk deskripsi fasilitas")]
    public TextMeshProUGUI deskripsiFasilitasText;

    [Tooltip("Text untuk tipe fasilitas (Laboratorium, Ruang Kuliah, dll)")]
    public TextMeshProUGUI tipeFasilitasText;

    [Tooltip("Text untuk lantai")]
    public TextMeshProUGUI lantaiText;

    [Tooltip("Text untuk nama gedung (otomatis dari id_gedung)")]
    public TextMeshProUGUI namaGedungText;

    [Tooltip("Text untuk lokasi gedung")]
    public TextMeshProUGUI lokasiGedungText;

    [Header("Optional — 3D TextMeshPro (World Space)")]
    [Tooltip("TMP 3D untuk nama fasilitas di world space")]
    public TextMeshPro namaFasilitas3DText;

    [Tooltip("TMP 3D untuk tipe fasilitas di world space")]
    public TextMeshPro tipeFasilitas3DText;

    // ============================================
    // MODE 2: Tampilkan DAFTAR fasilitas per gedung/lantai
    // ============================================
    [Header("Mode 2 — Daftar Fasilitas (by Gedung + Lantai)")]
    [Tooltip("ID gedung untuk menampilkan daftar fasilitas. Set 0 untuk disable mode ini.")]
    public int gedungId;

    [Tooltip("Nomor lantai. Set 0 untuk tampilkan semua lantai.")]
    public int lantaiFilter;

    [Tooltip("Text untuk menampilkan daftar fasilitas")]
    public TextMeshProUGUI daftarFasilitasText;

    [Tooltip("Text untuk judul/header daftar")]
    public TextMeshProUGUI daftarHeaderText;

    // ============================================
    // FOTO RUANGAN
    // ============================================
    [Header("Foto Ruangan")]
    [Tooltip("RawImage untuk menampilkan foto ruangan")]
    public RawImage fotoRuanganImage;

    [Tooltip("URL foto manual dari Inspector. Jika diisi, akan dipakai sebagai prioritas utama (mengabaikan foto_url dari database).")]
    public string overrideFotoUrl;

    [Tooltip("Otomatis load foto dari overrideFotoUrl saat Start (tanpa perlu data dari database)")]
    public bool autoLoadOverrideOnStart = true;

    [Tooltip("GameObject loading indicator saat foto sedang diload")]
    public GameObject fotoLoadingIndicator;

    [Tooltip("GameObject placeholder saat tidak ada foto")]
    public GameObject noFotoPlaceholder;

    // Cache texture agar tidak download ulang
    private static Dictionary<string, Texture2D> textureCache = new Dictionary<string, Texture2D>();

    void Start()
    {
        // Jika ada override URL dan autoLoad aktif, langsung load foto
        // tanpa perlu menunggu data dari database
        if (autoLoadOverrideOnStart && !string.IsNullOrEmpty(overrideFotoUrl))
        {
            LoadPhoto(overrideFotoUrl);
        }

        // Subscribe ke event data received
        if (BuildingDataReceiver.Instance != null)
        {
            if (BuildingDataReceiver.Instance.IsDataReady)
            {
                // Data sudah ada
                UpdateDisplay();
            }
            // Subscribe untuk update di masa depan
            BuildingDataReceiver.Instance.OnDataReceived += UpdateDisplay;
        }
    }

    void OnDestroy()
    {
        if (BuildingDataReceiver.Instance != null)
        {
            BuildingDataReceiver.Instance.OnDataReceived -= UpdateDisplay;
        }
    }

    /// <summary>
    /// Update tampilan berdasarkan mode yang aktif
    /// </summary>
    public void UpdateDisplay()
    {
        if (BuildingDataReceiver.Instance == null || !BuildingDataReceiver.Instance.IsDataReady)
        {
            Debug.LogWarning("[FacilityInfo] Data belum siap");
            return;
        }

        // Mode 1: Fasilitas tunggal
        if (fasilitasId > 0)
        {
            UpdateSingleFacility();
        }

        // Mode 2: Daftar fasilitas per gedung
        if (gedungId > 0)
        {
            UpdateFacilityList();
        }
    }

    // ============================================
    // MODE 1: SINGLE FACILITY DISPLAY
    // ============================================

    /// <summary>
    /// Tampilkan data satu fasilitas berdasarkan fasilitasId
    /// </summary>
    private void UpdateSingleFacility()
    {
        FasilitasData fasilitas = BuildingDataReceiver.Instance.GetFasilitasById(fasilitasId);
        if (fasilitas == null)
        {
            Debug.LogWarning($"[FacilityInfo] Fasilitas ID {fasilitasId} tidak ditemukan di database");
            return;
        }

        Debug.Log($"[FacilityInfo] Updating display for: {fasilitas.nama_fasilitas}");

        // Populate fasilitas fields
        DisplayFacilityData(fasilitas);
    }

    /// <summary>
    /// Isi semua TMP text dengan data fasilitas
    /// Bisa dipanggil dari luar (misal saat user klik ruangan di denah)
    /// </summary>
    public void DisplayFacilityData(FasilitasData fasilitas)
    {
        if (fasilitas == null) return;

        // === Nama Fasilitas ===
        if (namaFasilitasText != null)
            namaFasilitasText.text = fasilitas.nama_fasilitas;

        if (namaFasilitas3DText != null)
            namaFasilitas3DText.text = fasilitas.nama_fasilitas;

        // === Deskripsi ===
        if (deskripsiFasilitasText != null)
            deskripsiFasilitasText.text = !string.IsNullOrEmpty(fasilitas.deskripsi_fasilitas)
                ? fasilitas.deskripsi_fasilitas
                : "Tidak ada deskripsi";

        // === Tipe Fasilitas ===
        if (tipeFasilitasText != null)
            tipeFasilitasText.text = fasilitas.tipe_fasilitas;

        if (tipeFasilitas3DText != null)
            tipeFasilitas3DText.text = fasilitas.tipe_fasilitas;

        // === Lantai ===
        if (lantaiText != null)
            lantaiText.text = $"Lantai {fasilitas.lantai}";

        // === Info Gedung (dari id_gedung) ===
        GedungData gedung = BuildingDataReceiver.Instance?.GetGedung(fasilitas.id_gedung);
        if (gedung != null)
        {
            if (namaGedungText != null)
                namaGedungText.text = gedung.nama_gedung;

            if (lokasiGedungText != null)
                lokasiGedungText.text = gedung.lokasi;
        }

        // === Foto Ruangan ===
        // Prioritas: overrideFotoUrl (Inspector) > foto_url (database)
        if (fotoRuanganImage != null)
        {
            string fotoUrl = !string.IsNullOrEmpty(overrideFotoUrl)
                ? overrideFotoUrl
                : fasilitas.foto_url;

            if (!string.IsNullOrEmpty(fotoUrl))
            {
                LoadPhoto(fotoUrl);
            }
            else
            {
                fotoRuanganImage.gameObject.SetActive(false);
                if (noFotoPlaceholder != null) noFotoPlaceholder.SetActive(true);
                if (fotoLoadingIndicator != null) fotoLoadingIndicator.SetActive(false);
            }
        }
    }

    /// <summary>
    /// Set fasilitas ID dari script lain dan refresh tampilan
    /// Berguna saat user klik ruangan di denah 2D
    /// </summary>
    public void SetFasilitasId(int id)
    {
        fasilitasId = id;
        if (BuildingDataReceiver.Instance != null && BuildingDataReceiver.Instance.IsDataReady)
        {
            UpdateSingleFacility();
        }
    }

    // ============================================
    // MODE 2: FACILITY LIST DISPLAY
    // ============================================

    /// <summary>
    /// Tampilkan daftar fasilitas berdasarkan gedungId + lantaiFilter
    /// </summary>
    private void UpdateFacilityList()
    {
        if (daftarFasilitasText == null) return;

        List<FasilitasData> fasilitasList;
        string headerLabel;

        if (lantaiFilter > 0)
        {
            // Filter per lantai
            fasilitasList = BuildingDataReceiver.Instance.GetFasilitasByLantai(gedungId, lantaiFilter);
            headerLabel = $"Fasilitas Lantai {lantaiFilter}";
        }
        else
        {
            // Semua lantai
            fasilitasList = BuildingDataReceiver.Instance.GetFasilitasByGedung(gedungId);
            headerLabel = "Semua Fasilitas";
        }

        // Update header
        GedungData gedung = BuildingDataReceiver.Instance.GetGedung(gedungId);
        if (daftarHeaderText != null && gedung != null)
        {
            daftarHeaderText.text = $"{gedung.nama_gedung} — {headerLabel}";
        }

        // Build daftar
        if (fasilitasList.Count == 0)
        {
            daftarFasilitasText.text = lantaiFilter > 0
                ? $"Tidak ada fasilitas di lantai {lantaiFilter}"
                : "Tidak ada fasilitas terdaftar";
            return;
        }

        System.Text.StringBuilder sb = new System.Text.StringBuilder();
        int currentLantai = -1;

        foreach (var f in fasilitasList)
        {
            // Header lantai (jika filter semua lantai dan lantai berubah)
            if (lantaiFilter == 0 && f.lantai != currentLantai)
            {
                currentLantai = f.lantai;
                if (sb.Length > 0) sb.AppendLine();
                sb.AppendLine($"<b>── Lantai {currentLantai} ──</b>");
            }

            // Nama + tipe
            sb.Append($"• <b>{f.nama_fasilitas}</b>");
            sb.AppendLine($"  <color=#888>({f.tipe_fasilitas})</color>");

            // Deskripsi singkat (opsional)
            if (!string.IsNullOrEmpty(f.deskripsi_fasilitas))
            {
                string desc = f.deskripsi_fasilitas;
                if (desc.Length > 80) desc = desc.Substring(0, 80) + "...";
                sb.AppendLine($"  <size=80%><color=#aaa>{desc}</color></size>");
            }
        }

        daftarFasilitasText.text = sb.ToString();
        Debug.Log($"[FacilityInfo] Listed {fasilitasList.Count} fasilitas for gedung {gedungId}" +
            (lantaiFilter > 0 ? $" lantai {lantaiFilter}" : ""));
    }

    /// <summary>
    /// Ganti filter lantai dari luar (misal dari tombol lantai)
    /// </summary>
    public void SetLantaiFilter(int lantai)
    {
        lantaiFilter = lantai;
        if (BuildingDataReceiver.Instance != null && BuildingDataReceiver.Instance.IsDataReady)
        {
            UpdateFacilityList();
        }
    }

    /// <summary>
    /// Ganti gedung + reset lantai filter
    /// </summary>
    public void SetGedung(int newGedungId)
    {
        gedungId = newGedungId;
        lantaiFilter = 0;
        if (BuildingDataReceiver.Instance != null && BuildingDataReceiver.Instance.IsDataReady)
        {
            UpdateFacilityList();
        }
    }

    // ============================================
    // FOTO / IMAGE LOADING
    // ============================================

    /// <summary>
    /// Load foto dari URL dengan caching
    /// </summary>
    private void LoadPhoto(string url)
    {
        if (fotoRuanganImage == null) return;

        // Cek cache
        if (textureCache.TryGetValue(url, out Texture2D cachedTexture))
        {
            fotoRuanganImage.texture = cachedTexture;
            fotoRuanganImage.gameObject.SetActive(true);
            if (noFotoPlaceholder != null) noFotoPlaceholder.SetActive(false);
            if (fotoLoadingIndicator != null) fotoLoadingIndicator.SetActive(false);
            return;
        }

        // Loading state
        fotoRuanganImage.gameObject.SetActive(false);
        if (fotoLoadingIndicator != null) fotoLoadingIndicator.SetActive(true);
        if (noFotoPlaceholder != null) noFotoPlaceholder.SetActive(false);

        StartCoroutine(DownloadPhoto(url));
    }

    private IEnumerator DownloadPhoto(string url)
    {
        using (UnityWebRequest request = UnityWebRequestTexture.GetTexture(url))
        {
            yield return request.SendWebRequest();

            if (request.result == UnityWebRequest.Result.Success)
            {
                Texture2D texture = DownloadHandlerTexture.GetContent(request);
                textureCache[url] = texture;

                if (fotoRuanganImage != null)
                {
                    fotoRuanganImage.texture = texture;
                    fotoRuanganImage.gameObject.SetActive(true);
                }
                if (noFotoPlaceholder != null) noFotoPlaceholder.SetActive(false);
            }
            else
            {
                Debug.LogWarning($"[FacilityInfo] Gagal load foto: {url} — {request.error}");
                if (fotoRuanganImage != null) fotoRuanganImage.gameObject.SetActive(false);
                if (noFotoPlaceholder != null) noFotoPlaceholder.SetActive(true);
            }

            if (fotoLoadingIndicator != null) fotoLoadingIndicator.SetActive(false);
        }
    }
}
