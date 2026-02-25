// ============================================
// DatabaseFetcher.cs
// ============================================
// Script ini membuat Unity LANGSUNG fetch data dari backend Express API.
// Cocok untuk debugging di Unity Editor — tidak perlu build WebGL.
//
// SETUP:
// 1. Copy ke Assets/Scripts/Database/ di Unity project
// 2. Buat empty GameObject → rename "DataReceiver"
// 3. Attach BuildingDataReceiver.cs DAN DatabaseFetcher.cs ke GameObject tersebut
// 4. Jalankan backend: cd server && node index.js (port 3001)
// 5. Play di Unity Editor → data otomatis di-fetch
//
// CATATAN:
// - Di Unity Editor: fetch dari backend (localhost:3001)
// - Di WebGL Build: data dikirim dari React via SendMessage (BuildingDataReceiver.cs)
// - Kedua cara menggunakan BuildingDataReceiver yang sama untuk simpan data
// ============================================

using System.Collections;
using UnityEngine;
using UnityEngine.Networking;

public class DatabaseFetcher : MonoBehaviour
{
    [Header("Backend API Configuration")]
    [Tooltip("URL backend Express API")]
    public string apiUrl = "http://localhost:3001/api/unity/data";

    [Tooltip("Otomatis fetch saat Start?")]
    public bool fetchOnStart = true;

    [Tooltip("Retry jika gagal")]
    public int maxRetries = 3;

    [Tooltip("Delay antar retry (detik)")]
    public float retryDelay = 2f;

    [Header("Debug")]
    [Tooltip("Tampilkan JSON di console")]
    public bool logRawJson = false;

    private BuildingDataReceiver dataReceiver;

    void Start()
    {
        dataReceiver = GetComponent<BuildingDataReceiver>();
        if (dataReceiver == null)
        {
            dataReceiver = BuildingDataReceiver.Instance;
        }

        if (dataReceiver == null)
        {
            Debug.LogError("[DatabaseFetcher] BuildingDataReceiver tidak ditemukan! " +
                "Pastikan script BuildingDataReceiver.cs juga di-attach ke GameObject ini.");
            return;
        }

        // Hanya auto-fetch di Editor atau Standalone, bukan di WebGL
        // Di WebGL, data dikirim dari React via SendMessage
        if (fetchOnStart && !IsWebGL())
        {
            Debug.Log("[DatabaseFetcher] Fetching data from backend API...");
            StartCoroutine(FetchDataWithRetry());
        }
        else if (IsWebGL())
        {
            Debug.Log("[DatabaseFetcher] Running in WebGL — waiting for data from React via SendMessage");
        }
    }

    /// <summary>
    /// Cek apakah running di WebGL
    /// </summary>
    private bool IsWebGL()
    {
        #if UNITY_WEBGL && !UNITY_EDITOR
            return true;
        #else
            return false;
        #endif
    }

    /// <summary>
    /// Fetch data dengan retry mechanism
    /// </summary>
    private IEnumerator FetchDataWithRetry()
    {
        int attempt = 0;

        while (attempt < maxRetries)
        {
            attempt++;
            Debug.Log($"[DatabaseFetcher] Attempt {attempt}/{maxRetries} — GET {apiUrl}");

            bool success = false;
            yield return StartCoroutine(FetchData((result) => { success = result; }));

            if (success)
            {
                yield break; // Berhasil, stop retry
            }

            if (attempt < maxRetries)
            {
                Debug.LogWarning($"[DatabaseFetcher] Retry in {retryDelay}s...");
                yield return new WaitForSeconds(retryDelay);
            }
        }

        Debug.LogError($"[DatabaseFetcher] Failed after {maxRetries} attempts. " +
            "Pastikan backend berjalan: cd server && node index.js");
    }

    /// <summary>
    /// Fetch data dari backend API
    /// </summary>
    private IEnumerator FetchData(System.Action<bool> onComplete)
    {
        using (UnityWebRequest request = UnityWebRequest.Get(apiUrl))
        {
            // Set timeout
            request.timeout = 10;

            yield return request.SendWebRequest();

            if (request.result == UnityWebRequest.Result.Success)
            {
                string json = request.downloadHandler.text;

                if (logRawJson)
                {
                    Debug.Log($"[DatabaseFetcher] Raw JSON:\n{json}");
                }

                Debug.Log($"[DatabaseFetcher] Received {json.Length} chars from API");

                // Kirim JSON ke BuildingDataReceiver untuk di-parse
                if (dataReceiver != null)
                {
                    dataReceiver.ReceiveBuildingsData(json);
                    onComplete?.Invoke(true);
                }
                else
                {
                    Debug.LogError("[DatabaseFetcher] BuildingDataReceiver is null!");
                    onComplete?.Invoke(false);
                }
            }
            else
            {
                Debug.LogWarning($"[DatabaseFetcher] Request failed: {request.error}");
                Debug.LogWarning($"[DatabaseFetcher] Response code: {request.responseCode}");

                if (request.responseCode == 0)
                {
                    Debug.LogWarning("[DatabaseFetcher] Connection refused — backend belum jalan?");
                }

                onComplete?.Invoke(false);
            }
        }
    }

    /// <summary>
    /// Manual fetch — bisa dipanggil dari button atau script lain
    /// </summary>
    public void FetchNow()
    {
        StartCoroutine(FetchDataWithRetry());
    }

    /// <summary>
    /// Manual fetch — bisa dipanggil dari Inspector button
    /// </summary>
    [ContextMenu("Fetch Data Now")]
    public void FetchFromInspector()
    {
        if (Application.isPlaying)
        {
            FetchNow();
        }
        else
        {
            Debug.LogWarning("[DatabaseFetcher] Hanya bisa fetch saat Play Mode");
        }
    }
}
