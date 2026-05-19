// ============================================
// BuildingDataReceiver.cs
// ============================================
// SETUP:
// 1. Copy file ini ke Assets/Scripts/ di Unity project
// 2. Buat empty GameObject di scene, RENAME menjadi "DataReceiver"
// 3. Drag script ini ke GameObject "DataReceiver"
// 4. Build WebGL → data akan otomatis diterima dari React/Supabase
//
// Script ini menerima data JSON dari React (via SendMessage)
// dan menyimpannya agar bisa diakses oleh script lain di Unity
// ============================================

using System;
using System.Collections.Generic;
using UnityEngine;

/// <summary>
/// Singleton yang menerima data gedung & fasilitas dari React via SendMessage.
/// GameObject HARUS bernama "DataReceiver" agar SendMessage dari JS bisa menemukannya.
/// </summary>
public class BuildingDataReceiver : MonoBehaviour
{
    // === Singleton ===
    public static BuildingDataReceiver Instance { get; private set; }

    // === Raw Data (public agar bisa diakses langsung) ===
    public GedungData[] AllGedung { get; private set; }
    public FasilitasData[] AllFasilitas { get; private set; }

    // === Data Storage ===
    public Dictionary<int, GedungData> GedungMap { get; private set; } = new Dictionary<int, GedungData>();
    public Dictionary<int, List<FasilitasData>> FasilitasByGedung { get; private set; } = new Dictionary<int, List<FasilitasData>>();
    public Dictionary<string, List<FasilitasData>> FasilitasByGedungLantai { get; private set; } = new Dictionary<string, List<FasilitasData>>();

    // Event — script lain bisa subscribe untuk tahu kapan data sudah siap
    public event Action OnDataReceived;

    // Status
    public bool IsDataReady { get; private set; } = false;

    void Awake()
    {
        if (Instance != null && Instance != this)
        {
            Destroy(gameObject);
            return;
        }
        Instance = this;
        DontDestroyOnLoad(gameObject);
    }

    /// <summary>
    /// Dipanggil otomatis oleh React setelah Unity selesai loading.
    /// React memanggil: unityInstance.SendMessage("DataReceiver", "ReceiveBuildingsData", jsonString)
    /// </summary>
    public void ReceiveBuildingsData(string json)
    {
        Debug.Log("[DataReceiver] ========================================");
        Debug.Log("[DataReceiver] Received data from React/Supabase!");
        Debug.Log($"[DataReceiver] JSON length: {json.Length} chars");

        try
        {
            // JsonUtility perlu wrapper object — format dari React sudah benar:
            // { "gedung": [...], "fasilitas": [...] }
            AllData allData = JsonUtility.FromJson<AllData>(json);

            if (allData == null)
            {
                Debug.LogError("[DataReceiver] Failed to parse JSON - result is null");
                return;
            }

            // Simpan raw arrays
            AllGedung = allData.gedung ?? new GedungData[0];
            AllFasilitas = allData.fasilitas ?? new FasilitasData[0];

            // Clear & rebuild dictionaries
            GedungMap.Clear();
            FasilitasByGedung.Clear();
            FasilitasByGedungLantai.Clear();

            // Process gedung
            foreach (var gedung in AllGedung)
            {
                GedungMap[gedung.id] = gedung;
                FasilitasByGedung[gedung.id] = new List<FasilitasData>();
            }

            // Process fasilitas
            foreach (var fasilitas in AllFasilitas)
            {
                // Group by id_gedung
                if (!FasilitasByGedung.ContainsKey(fasilitas.id_gedung))
                    FasilitasByGedung[fasilitas.id_gedung] = new List<FasilitasData>();
                FasilitasByGedung[fasilitas.id_gedung].Add(fasilitas);

                // Group by id_gedung + lantai
                string key = $"{fasilitas.id_gedung}_{fasilitas.lantai}";
                if (!FasilitasByGedungLantai.ContainsKey(key))
                    FasilitasByGedungLantai[key] = new List<FasilitasData>();
                FasilitasByGedungLantai[key].Add(fasilitas);
            }

            IsDataReady = true;

            // Log summary
            Debug.Log($"[DataReceiver] ✓ Loaded {AllGedung.Length} gedung, {AllFasilitas.Length} fasilitas");
            foreach (var gedung in AllGedung)
            {
                int count = FasilitasByGedung.ContainsKey(gedung.id) ? FasilitasByGedung[gedung.id].Count : 0;
                Debug.Log($"  - {gedung.nama_gedung} (ID:{gedung.id}, {gedung.jumlah_lantai} lantai, {count} fasilitas)");
            }
            Debug.Log("[DataReceiver] ========================================");

            // Notify semua listener bahwa data sudah siap
            OnDataReceived?.Invoke();
        }
        catch (Exception e)
        {
            Debug.LogError($"[DataReceiver] Error parsing JSON: {e.Message}\n{e.StackTrace}");
        }
    }

    // === Helper Methods ===

    public GedungData GetGedung(int gedungId)
    {
        GedungMap.TryGetValue(gedungId, out GedungData gedung);
        return gedung;
    }

    public List<FasilitasData> GetFasilitasByGedung(int gedungId)
    {
        if (FasilitasByGedung.TryGetValue(gedungId, out List<FasilitasData> list))
            return list;
        return new List<FasilitasData>();
    }

    public List<FasilitasData> GetFasilitasByLantai(int gedungId, int lantai)
    {
        string key = $"{gedungId}_{lantai}";
        if (FasilitasByGedungLantai.TryGetValue(key, out List<FasilitasData> list))
            return list;
        return new List<FasilitasData>();
    }

    /// <summary>
    /// Cari satu fasilitas berdasarkan ID
    /// </summary>
    public FasilitasData GetFasilitasById(int fasilitasId)
    {
        if (AllFasilitas == null) return null;
        foreach (var f in AllFasilitas)
        {
            if (f.id == fasilitasId) return f;
        }
        return null;
    }
}

// ============================================
// Data Classes — field names HARUS sama persis dengan JSON key
// ============================================

[Serializable]
public class AllData
{
    public GedungData[] gedung;
    public FasilitasData[] fasilitas;
}

[Serializable]
public class GedungData
{
    public int id;
    public string nama_gedung;
    public string deskripsi_gedung;
    public string lokasi;
    public int jumlah_lantai;
}

[Serializable]
public class FasilitasData
{
    public int id;
    public string nama_fasilitas;
    public string deskripsi_fasilitas;
    public string tipe_fasilitas;
    public int id_gedung;
    public int lantai;
    public string foto_url;
}
