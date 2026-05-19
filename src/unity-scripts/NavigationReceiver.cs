using System.Collections.Generic;
using UnityEngine;

/// <summary>
/// Menerima perintah navigasi dari JavaScript via SendMessage.
/// Secara otomatis mencari dan menyimpan cache GameObject dari scene
/// berdasarkan unityObjectName — tidak perlu drag-drop manual.
/// </summary>
public class NavigationReceiver : MonoBehaviour
{
    [Header("References")]
    public BuildingDatabase database;
    public NavigationGuide navigationGuide;

    // Cache: unityObjectName (lowercase) → Transform target
    private Dictionary<string, Transform> buildingCache = new Dictionary<string, Transform>();

    private void Start()
    {
        BuildCache();
    }

    /// <summary>
    /// Cari semua GameObject di scene berdasarkan nama di BuildingDatabase
    /// dan simpan ke dictionary untuk akses cepat.
    /// </summary>
    private void BuildCache()
    {
        if (database == null)
        {
            Debug.LogError("[NavigationReceiver] BuildingDatabase belum diassign!");
            return;
        }

        buildingCache.Clear();
        int found = 0;

        foreach (string objName in database.unityObjectNames)
        {
            if (string.IsNullOrWhiteSpace(objName)) continue;

            // Cari GameObject di seluruh scene (termasuk yang inactive)
            GameObject go = FindInactiveByName(objName);

            if (go != null)
            {
                buildingCache[objName.ToLower()] = go.transform;
                found++;
                Debug.Log($"[NavigationReceiver] Cached: '{objName}'");
            }
            else
            {
                Debug.LogWarning($"[NavigationReceiver] GameObject tidak ditemukan: '{objName}' — pastikan nama di Hierarchy EXACT MATCH");
            }
        }

        Debug.Log($"[NavigationReceiver] Cache built: {found}/{database.unityObjectNames.Count} gedung ditemukan");
    }

    /// <summary>
    /// Dipanggil dari JavaScript:
    /// unityInstance.SendMessage("NavigationReceiver", "NavigateTo", "Gedung_Rektorat")
    ///
    /// Parameter adalah unity_object_name dari Supabase.
    /// </summary>
    public void NavigateTo(string unityObjectName)
    {
        if (navigationGuide == null)
        {
            Debug.LogError("[NavigationReceiver] NavigationGuide belum diassign!");
            return;
        }

        string key = unityObjectName.Trim().ToLower();

        if (buildingCache.TryGetValue(key, out Transform target))
        {
            navigationGuide.StartNavigation(target, unityObjectName);
            Debug.Log($"[NavigationReceiver] Navigating to: {unityObjectName}");
        }
        else
        {
            // Coba rebuild cache dan cari lagi (fallback jika scene dimuat ulang)
            BuildCache();
            if (buildingCache.TryGetValue(key, out Transform retryTarget))
            {
                navigationGuide.StartNavigation(retryTarget, unityObjectName);
                Debug.Log($"[NavigationReceiver] Navigating to (after rebuild): {unityObjectName}");
            }
            else
            {
                Debug.LogWarning($"[NavigationReceiver] '{unityObjectName}' tidak ditemukan di cache maupun scene.");
            }
        }
    }

    /// <summary>
    /// Stop navigasi dari JavaScript:
    /// unityInstance.SendMessage("NavigationReceiver", "StopNavigation", "")
    /// </summary>
    public void StopNavigation(string unused)
    {
        if (navigationGuide != null)
            navigationGuide.StopNavigation();
    }

    /// <summary>
    /// Cari GameObject termasuk yang inactive menggunakan Resources.FindObjectsOfTypeAll.
    /// GameObject.Find() tidak bisa menemukan object yang inactive.
    /// </summary>
    private GameObject FindInactiveByName(string name)
    {
        // Coba dulu yang aktif (lebih cepat)
        GameObject go = GameObject.Find(name);
        if (go != null) return go;

        // Fallback: cari semua termasuk inactive
        GameObject[] all = Resources.FindObjectsOfTypeAll<GameObject>();
        foreach (var obj in all)
        {
            if (obj.name == name && obj.scene.isLoaded)
                return obj;
        }

        return null;
    }

    /// <summary>
    /// Rebuild cache — panggil dari Inspector atau setelah scene berubah.
    /// </summary>
    [ContextMenu("Rebuild Building Cache")]
    public void RebuildCache()
    {
        BuildCache();
    }
}
