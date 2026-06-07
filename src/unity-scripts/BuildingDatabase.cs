using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;

/// <summary>
/// Daftar gedung yang terdaftar di sistem navigasi.
/// Secara default akan memuat list secara otomatis dari Vercel API,
/// namun juga mendukung pengisian list manual di Inspector sebagai fallback.
/// </summary>
public class BuildingDatabase : MonoBehaviour
{
    [Header("API Configuration")]
    [Tooltip("URL API Vercel untuk mendapatkan nama-nama gedung")]
    public string apiUrl = "https://dashboard-profile-upnvj.vercel.app/api/unity/names";

    [Tooltip("Centang jika ingin memuat data otomatis dari API saat aplikasi dimulai")]
    public bool loadAutomatically = true;

    [Header("Database List")]
    [Tooltip("Daftar unityObjectName — harus EXACT MATCH dengan nama GameObject di Hierarchy DAN unity_object_name di Supabase")]
    public List<string> unityObjectNames = new List<string>();

    // Event penanda data selesai dimuat (untuk mensinkronkan cache di NavigationReceiver)
    public Action OnDatabaseLoaded;

    private void Awake()
    {
        // Mengabaikan input Inspector dan memaksa URL production
        apiUrl = "https://dashboard-profile-upnvj.vercel.app/api/unity/names";

        if (loadAutomatically && !string.IsNullOrEmpty(apiUrl))
        {
            StartCoroutine(FetchUnityObjectNames());
        }
    }

    private IEnumerator FetchUnityObjectNames()
    {
        Debug.Log($"[BuildingDatabase] Memuat daftar gedung dari API: {apiUrl}");
        
        using (UnityWebRequest webRequest = UnityWebRequest.Get(apiUrl))
        {
            yield return webRequest.SendWebRequest();

            if (webRequest.result == UnityWebRequest.Result.Success)
            {
                string jsonResult = webRequest.downloadHandler.text;
                
                try
                {
                    // Deserialisasi JSON wrapper { "unityObjectNames": [...] }
                    UnityObjectNamesResponse response = JsonUtility.FromJson<UnityObjectNamesResponse>(jsonResult);
                    
                    if (response != null && response.unityObjectNames != null && response.unityObjectNames.Count > 0)
                    {
                        unityObjectNames = response.unityObjectNames;
                        Debug.Log($"[BuildingDatabase] Sukses memuat {unityObjectNames.Count} gedung secara dinamis.");
                    }
                }
                catch (Exception ex)
                {
                    Debug.LogError($"[BuildingDatabase] Error parsing JSON: {ex.Message}. Raw: {jsonResult}");
                }
            }
            else
            {
                Debug.LogWarning($"[BuildingDatabase] Gagal memuat API ({webRequest.error}). Menggunakan list manual di Inspector.");
            }

            // Panggil event callback, entah sukses API atau fallback ke manual
            OnDatabaseLoaded?.Invoke();
        }
    }
}

/// <summary>
/// Wrapper class untuk serialisasi JSON Unity
/// </summary>
[System.Serializable]
public class UnityObjectNamesResponse
{
    public List<string> unityObjectNames;
}