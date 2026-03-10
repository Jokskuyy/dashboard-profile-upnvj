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

    [Header("Debug")]
    [Tooltip("Centang untuk test: paksa foto ke tengah layar saat berhasil download")]
    public bool debugForceCenterScreen = true;

    void Start()
    {
        Debug.Log($"[FacilityInfo] === START pada '{gameObject.name}' ===");
        Debug.Log($"[FacilityInfo] fasilitasId={fasilitasId}, gedungId={gedungId}, lantaiFilter={lantaiFilter}");
        Debug.Log($"[FacilityInfo] overrideFotoUrl='{overrideFotoUrl}', autoLoadOverrideOnStart={autoLoadOverrideOnStart}");
        Debug.Log($"[FacilityInfo] fotoRuanganImage assigned? {fotoRuanganImage != null}");
        Debug.Log($"[FacilityInfo] fotoLoadingIndicator assigned? {fotoLoadingIndicator != null}");
        Debug.Log($"[FacilityInfo] noFotoPlaceholder assigned? {noFotoPlaceholder != null}");

        // Log info Canvas
        if (fotoRuanganImage != null)
        {
            Canvas canvas = fotoRuanganImage.GetComponentInParent<Canvas>();
            if (canvas != null)
            {
                CanvasScaler scaler = canvas.GetComponent<CanvasScaler>();
                Debug.Log($"[FacilityInfo] Canvas: renderMode={canvas.renderMode}, sortingOrder={canvas.sortingOrder}");
                if (scaler != null)
                {
                    Debug.Log($"[FacilityInfo] CanvasScaler: uiScaleMode={scaler.uiScaleMode}, refResolution={scaler.referenceResolution}, scaleFactor={scaler.scaleFactor}");
                }
                Debug.Log($"[FacilityInfo] Screen resolution: {Screen.width}x{Screen.height}");
            }
        }

        // Jika ada override URL dan autoLoad aktif, langsung load foto
        // tanpa perlu menunggu data dari database
        if (autoLoadOverrideOnStart && !string.IsNullOrEmpty(overrideFotoUrl))
        {
            Debug.Log($"[FacilityInfo] Auto-loading override foto: {overrideFotoUrl}");
            LoadPhoto(overrideFotoUrl);
        }
        else
        {
            Debug.Log($"[FacilityInfo] Auto-load SKIP — autoLoad={autoLoadOverrideOnStart}, overrideFotoUrl empty={string.IsNullOrEmpty(overrideFotoUrl)}");
        }

        // Subscribe ke event data received
        if (BuildingDataReceiver.Instance != null)
        {
            Debug.Log($"[FacilityInfo] BuildingDataReceiver found. IsDataReady={BuildingDataReceiver.Instance.IsDataReady}");
            if (BuildingDataReceiver.Instance.IsDataReady)
            {
                // Data sudah ada
                UpdateDisplay();
            }
            // Subscribe untuk update di masa depan
            BuildingDataReceiver.Instance.OnDataReceived += UpdateDisplay;
        }
        else
        {
            Debug.LogWarning("[FacilityInfo] BuildingDataReceiver.Instance is NULL! Pastikan ada GameObject dengan BuildingDataReceiver di scene.");
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

            Debug.Log($"[FacilityInfo] Foto URL decision: override='{overrideFotoUrl}', db='{fasilitas.foto_url}', final='{fotoUrl}'");

            if (!string.IsNullOrEmpty(fotoUrl))
            {
                Debug.Log($"[FacilityInfo] Calling LoadPhoto with URL: {fotoUrl}");
                LoadPhoto(fotoUrl);
            }
            else
            {
                Debug.LogWarning("[FacilityInfo] Tidak ada foto URL (override maupun database). Showing placeholder.");
                fotoRuanganImage.gameObject.SetActive(false);
                if (noFotoPlaceholder != null) noFotoPlaceholder.SetActive(true);
                if (fotoLoadingIndicator != null) fotoLoadingIndicator.SetActive(false);
            }
        }
        else
        {
            Debug.LogWarning("[FacilityInfo] fotoRuanganImage is NULL — slot RawImage belum di-assign di Inspector!");
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
        Debug.Log($"[FacilityInfo] >>> LoadPhoto called with URL: {url}");

        if (fotoRuanganImage == null)
        {
            Debug.LogError("[FacilityInfo] GAGAL: fotoRuanganImage is NULL! Pastikan RawImage sudah di-drag ke slot Inspector.");
            return;
        }

        Debug.Log($"[FacilityInfo] RawImage GameObject: '{fotoRuanganImage.gameObject.name}', active={fotoRuanganImage.gameObject.activeSelf}");
        Debug.Log($"[FacilityInfo] RawImage RectTransform size: {fotoRuanganImage.rectTransform.sizeDelta}");

        // Cek cache
        if (textureCache.TryGetValue(url, out Texture2D cachedTexture))
        {
            Debug.Log($"[FacilityInfo] Texture found in CACHE. Size: {cachedTexture.width}x{cachedTexture.height}");
            fotoRuanganImage.texture = cachedTexture;
            fotoRuanganImage.gameObject.SetActive(true);
            if (noFotoPlaceholder != null) noFotoPlaceholder.SetActive(false);
            if (fotoLoadingIndicator != null) fotoLoadingIndicator.SetActive(false);
            return;
        }

        Debug.Log($"[FacilityInfo] Not in cache. Starting download: {url}");

        // Loading state
        fotoRuanganImage.gameObject.SetActive(false);
        if (fotoLoadingIndicator != null) fotoLoadingIndicator.SetActive(true);
        if (noFotoPlaceholder != null) noFotoPlaceholder.SetActive(false);

        StartCoroutine(DownloadPhoto(url));
    }

    private IEnumerator DownloadPhoto(string url)
    {
        Debug.Log($"[FacilityInfo] === DOWNLOAD START === URL: {url}");

        using (UnityWebRequest request = UnityWebRequestTexture.GetTexture(url))
        {
            yield return request.SendWebRequest();

            Debug.Log($"[FacilityInfo] Download result: {request.result}, HTTP {request.responseCode}");

            if (request.result == UnityWebRequest.Result.Success)
            {
                Texture2D texture = DownloadHandlerTexture.GetContent(request);
                Debug.Log($"[FacilityInfo] SUCCESS! Texture size: {texture.width}x{texture.height}, format: {texture.format}");
                textureCache[url] = texture;

                if (fotoRuanganImage != null)
                {
                    fotoRuanganImage.texture = texture;
                    fotoRuanganImage.gameObject.SetActive(true);

                    // AUTO-FIX: Pastikan color alpha tidak 0 (transparan)
                    if (fotoRuanganImage.color.a < 0.01f)
                    {
                        Debug.LogWarning("[FacilityInfo] AUTO-FIX: RawImage alpha was 0 (invisible)! Setting to white.");
                        fotoRuanganImage.color = Color.white;
                    }

                    // AUTO-FIX: Pastikan ukuran tidak 0
                    Vector2 size = fotoRuanganImage.rectTransform.sizeDelta;
                    if (size.x < 1f || size.y < 1f)
                    {
                        Debug.LogWarning($"[FacilityInfo] AUTO-FIX: RawImage size too small ({size})! Setting to 300x200.");
                        fotoRuanganImage.rectTransform.sizeDelta = new Vector2(300f, 200f);
                    }

                    // Pastikan parent juga aktif
                    Transform parent = fotoRuanganImage.transform.parent;
                    if (parent != null && !parent.gameObject.activeInHierarchy)
                    {
                        Debug.LogWarning($"[FacilityInfo] WARNING: Parent '{parent.name}' is INACTIVE! Foto tidak akan terlihat.");
                    }

                    // Cek Canvas
                    Canvas canvas = fotoRuanganImage.GetComponentInParent<Canvas>();
                    if (canvas == null)
                    {
                        Debug.LogError("[FacilityInfo] ERROR: RawImage tidak berada di dalam Canvas! Tambahkan Canvas sebagai parent.");
                    }
                    else
                    {
                        Debug.Log($"[FacilityInfo] Canvas found: '{canvas.name}', renderMode={canvas.renderMode}");
                    }

                    Debug.Log($"[FacilityInfo] Texture applied to RawImage '{fotoRuanganImage.gameObject.name}'. SetActive(true)");
                    Debug.Log($"[FacilityInfo] RawImage color: {fotoRuanganImage.color}, UV Rect: {fotoRuanganImage.uvRect}");
                    Debug.Log($"[FacilityInfo] RawImage sizeDelta: {fotoRuanganImage.rectTransform.sizeDelta}");
                    Debug.Log($"[FacilityInfo] RawImage position: {fotoRuanganImage.rectTransform.position}");
                    Debug.Log($"[FacilityInfo] RawImage anchoredPosition: {fotoRuanganImage.rectTransform.anchoredPosition}");
                    Debug.Log($"[FacilityInfo] RawImage activeInHierarchy: {fotoRuanganImage.gameObject.activeInHierarchy}");

                    // DEBUG: Paksa ke tengah layar agar pasti terlihat
                    if (debugForceCenterScreen)
                    {
                        Debug.LogWarning("[FacilityInfo] DEBUG MODE: Forcing RawImage ke tengah layar!");
                        fotoRuanganImage.rectTransform.anchorMin = new Vector2(0.5f, 0.5f);
                        fotoRuanganImage.rectTransform.anchorMax = new Vector2(0.5f, 0.5f);
                        fotoRuanganImage.rectTransform.pivot = new Vector2(0.5f, 0.5f);
                        fotoRuanganImage.rectTransform.anchoredPosition = Vector2.zero;
                        fotoRuanganImage.rectTransform.sizeDelta = new Vector2(400f, 300f);
                        fotoRuanganImage.color = Color.white;

                        // Pastikan Canvas sorting order tinggi
                        Canvas canvas2 = fotoRuanganImage.GetComponentInParent<Canvas>();
                        if (canvas2 != null)
                        {
                            canvas2.sortingOrder = 999;
                        }

                        Debug.Log($"[FacilityInfo] FORCED position: center, size: 400x300, anchor: center");
                    }
                }
                else
                {
                    Debug.LogError("[FacilityInfo] fotoRuanganImage became NULL after download! GameObject mungkin destroyed.");
                }
                if (noFotoPlaceholder != null) noFotoPlaceholder.SetActive(false);
            }
            else
            {
                Debug.LogError($"[FacilityInfo] DOWNLOAD FAILED: {url}");
                Debug.LogError($"[FacilityInfo] Error: {request.error}");
                Debug.LogError($"[FacilityInfo] Response Code: {request.responseCode}");
                if (request.downloadHandler != null && request.downloadHandler.text != null)
                {
                    string responseText = request.downloadHandler.text;
                    if (responseText.Length > 200) responseText = responseText.Substring(0, 200) + "...";
                    Debug.LogError($"[FacilityInfo] Response body: {responseText}");
                }
                if (fotoRuanganImage != null) fotoRuanganImage.gameObject.SetActive(false);
                if (noFotoPlaceholder != null) noFotoPlaceholder.SetActive(true);
            }

            if (fotoLoadingIndicator != null) fotoLoadingIndicator.SetActive(false);
            Debug.Log($"[FacilityInfo] === DOWNLOAD END === URL: {url}");
        }
    }
}
