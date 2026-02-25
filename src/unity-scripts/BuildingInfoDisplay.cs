// ============================================
// BuildingInfoDisplay.cs
// ============================================
// CONTOH script untuk menampilkan data dari database ke TMP Text
// yang sudah ada di Unity scene Anda.
//
// SETUP:
// 1. Copy ke Assets/Scripts/
// 2. Attach ke GameObject gedung yang sudah ada
// 3. Set gedungId sesuai ID di database  
// 4. Drag TMP Text objects ke slot di Inspector
//
// Script ini akan otomatis mengupdate text saat data diterima dari React
// ============================================

using System.Collections.Generic;
using UnityEngine;
using TMPro;

public class BuildingInfoDisplay : MonoBehaviour
{
    [Header("Building ID (sesuaikan dengan database)")]
    [Tooltip("ID gedung dari tabel 'gedung' di Supabase")]
    public int gedungId;

    [Header("TMP Text References (drag dari Hierarchy)")]
    [Tooltip("Text untuk menampilkan nama gedung")]
    public TextMeshProUGUI namaGedungText;

    [Tooltip("Text untuk menampilkan deskripsi gedung")]
    public TextMeshProUGUI deskripsiGedungText;

    [Tooltip("Text untuk menampilkan lokasi")]
    public TextMeshProUGUI lokasiText;

    [Tooltip("Text untuk menampilkan jumlah lantai")]
    public TextMeshProUGUI jumlahLantaiText;

    [Tooltip("Text untuk menampilkan daftar fasilitas")]
    public TextMeshProUGUI daftarFasilitasText;

    [Header("Optional - TextMeshPro 3D (bukan UI)")]
    [Tooltip("Jika pakai TextMeshPro 3D di world space")]
    public TextMeshPro namaGedung3DText;

    void Start()
    {
        // Subscribe ke event data received
        if (BuildingDataReceiver.Instance != null)
        {
            if (BuildingDataReceiver.Instance.IsDataReady)
            {
                // Data sudah ada (Unity load lebih lambat dari fetch)
                UpdateDisplay();
            }
            // Subscribe untuk update di masa depan
            BuildingDataReceiver.Instance.OnDataReceived += UpdateDisplay;
        }
    }

    void OnDestroy()
    {
        // Unsubscribe
        if (BuildingDataReceiver.Instance != null)
        {
            BuildingDataReceiver.Instance.OnDataReceived -= UpdateDisplay;
        }
    }

    /// <summary>
    /// Update semua TMP text dengan data dari database
    /// </summary>
    public void UpdateDisplay()
    {
        if (BuildingDataReceiver.Instance == null || !BuildingDataReceiver.Instance.IsDataReady)
        {
            Debug.LogWarning($"[BuildingInfo] Data belum siap untuk gedung ID {gedungId}");
            return;
        }

        // Ambil data gedung
        GedungData gedung = BuildingDataReceiver.Instance.GetGedung(gedungId);
        if (gedung == null)
        {
            Debug.LogWarning($"[BuildingInfo] Gedung ID {gedungId} tidak ditemukan di database");
            return;
        }

        Debug.Log($"[BuildingInfo] Updating display for: {gedung.nama_gedung}");

        // === Update Text Elements ===

        if (namaGedungText != null)
            namaGedungText.text = gedung.nama_gedung;

        if (namaGedung3DText != null)
            namaGedung3DText.text = gedung.nama_gedung;

        if (deskripsiGedungText != null)
            deskripsiGedungText.text = gedung.deskripsi_gedung;

        if (lokasiText != null)
            lokasiText.text = gedung.lokasi;

        if (jumlahLantaiText != null)
            jumlahLantaiText.text = $"{gedung.jumlah_lantai} Lantai";

        // === Daftar Fasilitas ===
        if (daftarFasilitasText != null)
        {
            List<FasilitasData> fasilitas = BuildingDataReceiver.Instance.GetFasilitasByGedung(gedungId);
            
            if (fasilitas.Count == 0)
            {
                daftarFasilitasText.text = "Tidak ada fasilitas terdaftar";
            }
            else
            {
                System.Text.StringBuilder sb = new System.Text.StringBuilder();
                int currentLantai = -1;

                foreach (var f in fasilitas)
                {
                    // Header lantai (jika lantai berubah)
                    if (f.lantai != currentLantai)
                    {
                        currentLantai = f.lantai;
                        if (sb.Length > 0) sb.AppendLine();
                        sb.AppendLine($"<b>── Lantai {currentLantai} ──</b>");
                    }

                    // Nama fasilitas + tipe
                    sb.AppendLine($"• {f.nama_fasilitas} <color=#888>({f.tipe_fasilitas})</color>");
                }

                daftarFasilitasText.text = sb.ToString();
            }
        }
    }

    /// <summary>
    /// Bisa dipanggil dari button atau event untuk menampilkan info lantai tertentu
    /// </summary>
    public void ShowFasilitasLantai(int lantai)
    {
        if (BuildingDataReceiver.Instance == null || !BuildingDataReceiver.Instance.IsDataReady) return;

        List<FasilitasData> fasilitas = BuildingDataReceiver.Instance.GetFasilitasByLantai(gedungId, lantai);

        if (daftarFasilitasText != null)
        {
            if (fasilitas.Count == 0)
            {
                daftarFasilitasText.text = $"Tidak ada fasilitas di lantai {lantai}";
                return;
            }

            System.Text.StringBuilder sb = new System.Text.StringBuilder();
            sb.AppendLine($"<b>Lantai {lantai}</b>");
            sb.AppendLine();

            foreach (var f in fasilitas)
            {
                sb.AppendLine($"<b>{f.nama_fasilitas}</b>");
                sb.AppendLine($"<color=#888>Tipe: {f.tipe_fasilitas}</color>");
                if (!string.IsNullOrEmpty(f.deskripsi_fasilitas))
                {
                    // Potong deskripsi jika terlalu panjang
                    string desc = f.deskripsi_fasilitas;
                    if (desc.Length > 100) desc = desc.Substring(0, 100) + "...";
                    sb.AppendLine($"<size=80%>{desc}</size>");
                }
                sb.AppendLine();
            }

            daftarFasilitasText.text = sb.ToString();
        }
    }
}
