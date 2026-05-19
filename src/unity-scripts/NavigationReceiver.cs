using UnityEngine;

public class NavigationReceiver : MonoBehaviour
{
    [Header("Reference")]
    public BuildingDatabase database;
    public NavigationGuide navigationGuide;

    // Dipanggil dari JavaScript via SendMessage
    // Contoh: unityInstance.SendMessage("NavigationReceiver", "NavigateTo", "Gedung_Rektorat")
    // Parameter yang dikirim adalah unity_object_name dari Supabase (EXACT MATCH)
    public void NavigateTo(string unityObjectName)
    {
        if (database == null || navigationGuide == null)
        {
            Debug.LogError("[NavigationReceiver] Database atau NavigationGuide belum diassign!");
            return;
        }

        // Cari berdasarkan unityObjectName (exact match, case-insensitive)
        string input = unityObjectName.Trim().ToLower();

        foreach (var building in database.buildings)
        {
            if (building.unityObjectName.Trim().ToLower() == input)
            {
                navigationGuide.StartNavigation(building.buildingObject.transform, building.buildingName);
                Debug.Log("[NavigationReceiver] Navigating to: " + building.buildingName + " (id: " + building.unityObjectName + ")");
                return;
            }
        }

        Debug.LogWarning("[NavigationReceiver] Gedung tidak ditemukan untuk unityObjectName: " + unityObjectName);
    }

    // Opsional: stop navigasi dari JS
    public void StopNavigation(string unused)
    {
        if (navigationGuide != null)
            navigationGuide.StopNavigation();
    }
}
