using System.Collections.Generic;
using UnityEngine;

public class BuildingCulling : MonoBehaviour
{
    [Header("Reference")]
    public Transform player;
    public BuildingDatabase database;

    [Header("Navigation (Optional)")]
    public NavigationGuide navigationGuide;

    [Header("Settings")]
    public float activeDistance = 500f;
    public float checkInterval = 1f;

    private float timer;

    void Update()
    {
        timer += Time.deltaTime;

        if (timer >= checkInterval)
        {
            timer = 0f;
            CheckBuildings();
        }
    }

    void CheckBuildings()
    {
        if (database == null || player == null) return;

        Transform currentTarget = null;

        if (navigationGuide != null)
        {
            currentTarget = navigationGuide.GetCurrentTarget();
        }

        foreach (var building in database.buildings)
        {
            if (building.buildingObject == null) continue;

            Transform buildingTransform = building.buildingObject.transform;

            if (currentTarget != null && buildingTransform == currentTarget)
            {
                if (!building.buildingObject.activeSelf)
                    building.buildingObject.SetActive(true);

                continue;
            }

            float distance = Vector3.Distance(player.position, buildingTransform.position);

            bool shouldBeActive = distance <= activeDistance;

            if (building.buildingObject.activeSelf != shouldBeActive)
            {
                building.buildingObject.SetActive(shouldBeActive);
            }
        }
    }
}