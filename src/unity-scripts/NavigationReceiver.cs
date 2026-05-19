using UnityEngine;

public class NavigationReceiver : MonoBehaviour
{
    [Header("Reference")]
    public BuildingDatabase database;
    public NavigationGuide navigationGuide;

    // Dipanggil dari JavaScript via SendMessage
    // Contoh: unityInstance.SendMessage("NavigationReceiver", "NavigateTo", "Gedung A")
    public void NavigateTo(string buildingName)
    {
        if (database == null || navigationGuide == null)
        {
            Debug.LogError("[NavigationReceiver] Database atau NavigationGuide belum diassign!");
            return;
        }

        string cleanInput = CleanString(buildingName);

        foreach (var building in database.buildings)
        {
            if (CleanString(building.buildingName).Contains(cleanInput))
            {
                navigationGuide.StartNavigation(building.buildingObject.transform, building.buildingName);
                Debug.Log("[NavigationReceiver] Navigating to: " + building.buildingName);
                return;
            }
        }

        Debug.LogWarning("[NavigationReceiver] Gedung tidak ditemukan: " + buildingName);
    }

    // Opsional: stop navigasi dari JS
    public void StopNavigation(string unused)
    {
        if (navigationGuide != null)
            navigationGuide.StopNavigation();
    }

    private string CleanString(string input)
    {
        input = input.ToLower();
        return System.Text.RegularExpressions.Regex.Replace(input, "[^a-z0-9]", "");
    }
}
