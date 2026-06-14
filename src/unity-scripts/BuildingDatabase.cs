using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;

[System.Serializable]
public class UnityGedungData
{
    public int id;
    public string nama_gedung;
    public string deskripsi_gedung;
    public string lokasi;
    public int jumlah_lantai;
    public string unity_object_name;
}

[System.Serializable]
public class UnityFasilitasData
{
    public int id;
    public string nama_fasilitas;
    public string deskripsi_fasilitas;
    public string tipe_fasilitas;
    public int id_gedung;
    public int lantai;
    public string foto_url;
    public string unity_object_name;
}

[System.Serializable]
public class UnityApiResponse
{
    public List<UnityGedungData> gedung;
    public List<UnityFasilitasData> fasilitas;
}

/// <summary>
/// Daftar gedung yang terdaftar di sistem navigasi.
/// Mengambil data secara dinamis dari API Backend Dashboard UPNVJ.
/// </summary>
public class BuildingDatabase : MonoBehaviour
{
    [Header("API Config")]
    [Tooltip("URL API Backend untuk mengambil data. Kosongkan jika ingin menggunakan relative URL saat WebGL build.")]
    public string apiEndpoint = "http://localhost:3000/api/unity/data";

    [Header("Database")]
    [Tooltip("Daftar unityObjectName — disinkronkan secara otomatis dari API Backend")]
    public List<string> unityObjectNames = new List<string>();

    // Cache nama asli untuk ditampilkan di UI
    public Dictionary<string, string> realNames = new Dictionary<string, string>();

    [Header("Status")]
    public bool isLoaded = false;

    private void Awake()
    {
        // Override paksa ke URL production — mencegah error net::ERR_CONNECTION_REFUSED
        // jika Inspector masih menyimpan localhost:3000
        apiEndpoint = "https://dashboard-profile-upnvj.vercel.app/api/unity/data";
    }

    private void Start()
    {
        StartCoroutine(LoadDatabaseFromApi());
    }

    public IEnumerator LoadDatabaseFromApi()
    {
        string url = apiEndpoint;
        
        // Di WebGL Build, gunakan relative URL jika apiEndpoint kosong atau tidak diawali http
        #if !UNITY_EDITOR && UNITY_WEBGL
        if (string.IsNullOrEmpty(url) || !url.StartsWith("http"))
        {
            url = "/api/unity/data";
        }
        #endif

        Debug.Log($"[BuildingDatabase] Fetching data from: {url}");

        using (UnityWebRequest webRequest = UnityWebRequest.Get(url))
        {
            yield return webRequest.SendWebRequest();

            if (webRequest.result == UnityWebRequest.Result.ConnectionError || 
                webRequest.result == UnityWebRequest.Result.ProtocolError)
            {
                Debug.LogError($"[BuildingDatabase] API Error: {webRequest.error}");
            }
            else
            {
                string jsonText = webRequest.downloadHandler.text;
                ParseJsonData(jsonText);
            }
        }
    }

    private void ParseJsonData(string json)
    {
        try
        {
            // Karena JsonUtility tidak mendukung root array/object secara langsung jika ada list di dalamnya,
            // kita gunakan class wrapper UnityApiResponse
            UnityApiResponse response = JsonUtility.FromJson<UnityApiResponse>(json);

            if (response != null)
            {
                unityObjectNames.Clear();
                realNames.Clear();

                // Tambahkan dari gedung
                if (response.gedung != null)
                {
                    foreach (var g in response.gedung)
                    {
                        if (!string.IsNullOrWhiteSpace(g.unity_object_name))
                        {
                            if (!unityObjectNames.Contains(g.unity_object_name))
                                unityObjectNames.Add(g.unity_object_name);
                                
                            realNames[g.unity_object_name.ToLower()] = g.nama_gedung;
                        }
                    }
                }

                // Tambahkan dari fasilitas
                if (response.fasilitas != null)
                {
                    foreach (var f in response.fasilitas)
                    {
                        if (!string.IsNullOrWhiteSpace(f.unity_object_name))
                        {
                            if (!unityObjectNames.Contains(f.unity_object_name))
                                unityObjectNames.Add(f.unity_object_name);
                                
                            realNames[f.unity_object_name.ToLower()] = f.nama_fasilitas;
                        }
                    }
                }

                isLoaded = true;
                Debug.Log($"[BuildingDatabase] Loaded {unityObjectNames.Count} unityObjectNames from API.");

                // Beritahu NavigationReceiver untuk me-rebuild cache setelah database terisi
                NavigationReceiver receiver = FindAnyObjectByType<NavigationReceiver>();
                if (receiver != null)
                {
                    receiver.RebuildCache();
                }

                // Beritahu BuildingCulling untuk me-rebuild cache
                BuildingCulling culling = FindAnyObjectByType<BuildingCulling>();
                if (culling != null)
                {
                    culling.RebuildCullingCache();
                }
            }
        }
        catch (System.Exception ex)
        {
            Debug.LogError($"[BuildingDatabase] Gagal parsing JSON: {ex.Message}");
        }
    }

    [ContextMenu("Fetch Data From API Now")]
    public void FetchNow()
    {
        StartCoroutine(LoadDatabaseFromApi());
    }

    public string GetRealName(string unityObjectName)
    {
        if (string.IsNullOrWhiteSpace(unityObjectName)) return unityObjectName;
        
        string key = unityObjectName.Trim().ToLower();
        if (realNames.TryGetValue(key, out string realName))
        {
            // Pastikan jika dari API kosong, kembalikan object name
            if (!string.IsNullOrWhiteSpace(realName))
                return realName;
        }
        
        return unityObjectName; // Fallback
    }
}