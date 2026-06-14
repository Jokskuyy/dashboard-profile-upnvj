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
    private List<GameObject> buildingObjects = new List<GameObject>();

    void Start()
    {
        CacheBuildingObjects();
    }

    void CacheBuildingObjects()
    {
        if (database == null) return;
        buildingObjects.Clear();
        foreach (string name in database.unityObjectNames)
        {
            if (string.IsNullOrWhiteSpace(name)) continue;
            GameObject go = FindInactiveByName(name);
            if (go != null)
            {
                buildingObjects.Add(go);
            }
        }
    }

    public void RebuildCullingCache()
    {
        CacheBuildingObjects();
    }

    private GameObject FindInactiveByName(string name)
    {
        GameObject go = GameObject.Find(name);
        if (go != null) return go;

        GameObject[] all = Resources.FindObjectsOfTypeAll<GameObject>();
        foreach (var obj in all)
        {
            if (obj.name == name && obj.scene.isLoaded)
                return obj;
        }
        return null;
    }

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

        foreach (var go in buildingObjects)
        {
            if (go == null) continue;

            Transform buildingTransform = go.transform;

            if (currentTarget != null && buildingTransform == currentTarget)
            {
                if (!go.activeSelf)
                    go.SetActive(true);

                continue;
            }

            float distance = Vector3.Distance(player.position, buildingTransform.position);

            bool shouldBeActive = distance <= activeDistance;

            if (go.activeSelf != shouldBeActive)
            {
                go.SetActive(shouldBeActive);
            }
        }
    }
}