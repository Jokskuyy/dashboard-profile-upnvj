using System;
using System.Collections.Generic;
using UnityEngine;

public class BuildingCulling : MonoBehaviour
{
    public enum AdaptationMode { Fixed, FPS, Speed, Combined }

    [Header("Reference")]
    public Transform player;

    [Header("Navigation (Optional)")]
    public NavigationGuide navigationGuide;

    [Header("Tag Settings")]
    [Tooltip("Tag yang digunakan untuk mendeteksi object yang bisa di-culling. Default: 'Cullable'")]
    public string cullableTag = "Cullable";

    [Header("Distance Bounds")]
    public float minRenderDistance = 100f;
    public float maxRenderDistance = 800f;
    public float startingRenderDistance = 500f;
    [Tooltip("Maksimal perubahan jarak tiap kali diupdate (agar tidak lompat tiba-tiba)")]
    public float maxDistanceStep = 50f;

    [Header("Adaptation Settings")]
    [Tooltip("Pilih bagaimana jarak culling dihitung otomatis")]
    public AdaptationMode adaptationMode = AdaptationMode.Combined;
    public float targetFrameRate = 60f;

    [Header("Performance")]
    [Tooltip("Interval pengecekan dalam detik")]
    public float checkInterval = 1f;

    // Event callbacks
    public event Action<GameObject> OnBuildingEnabled;
    public event Action<GameObject> OnBuildingDisabled;

    private float timer;
    private float currentRenderDistance;
    private List<CullableObject> cullableObjects = new List<CullableObject>();
    
    private Vector3 lastPlayerPos;
    private float smoothFPS = 60f;

    private class RendererState
    {
        public Renderer renderer;
        public bool defaultState;
    }

    private class CullableObject
    {
        public GameObject rootObject;
        public Transform referencePoint;
        public List<RendererState> renderers = new List<RendererState>();
        public bool isCurrentlyActive = true;
    }

    void Start()
    {
        currentRenderDistance = Mathf.Clamp(startingRenderDistance, minRenderDistance, maxRenderDistance);
        if (player != null) lastPlayerPos = player.position;
        
        if (minRenderDistance > maxRenderDistance)
        {
            Debug.LogWarning("[BuildingCulling] Min distance lebih besar dari Max distance. Menukar nilai...");
            float temp = minRenderDistance;
            minRenderDistance = maxRenderDistance;
            maxRenderDistance = temp;
        }
        
        ScanCullableObjects();
    }

    public void ScanCullableObjects()
    {
        cullableObjects.Clear();
        GameObject[] tagged = GameObject.FindGameObjectsWithTag(cullableTag);
        
        foreach (var go in tagged)
        {
            RegisterCullableObject(go);
        }

        ScanInactiveTaggedObjects();
        Debug.Log($"[BuildingCulling] Scanned {cullableObjects.Count} cullable objects (tag: '{cullableTag}')");
    }

    private void RegisterCullableObject(GameObject go)
    {
        CullableObject co = new CullableObject();
        co.rootObject = go;
        
        // Cari CullingPoint sebagai titik referensi (pusat massa / geometri bangunan)
        Transform cullingPoint = go.transform.Find("CullingPoint");
        if (cullingPoint != null)
        {
            co.referencePoint = cullingPoint;
        }
        else
        {
            co.referencePoint = go.transform;
            Debug.LogWarning($"[BuildingCulling] CullingPoint tidak ditemukan di {go.name}. Jarak diukur dari pivot root.");
        }

        // Kumpulkan semua Renderer dan simpan status awalnya
        Renderer[] renderers = go.GetComponentsInChildren<Renderer>(true);
        if (renderers.Length == 0)
        {
            Debug.LogWarning($"[BuildingCulling] {go.name} tidak memiliki Renderer satupun. Dilewati.");
            return;
        }

        foreach (var r in renderers)
        {
            co.renderers.Add(new RendererState { renderer = r, defaultState = r.enabled });
        }

        cullableObjects.Add(co);
    }

    private void ScanInactiveTaggedObjects()
    {
        for (int s = 0; s < UnityEngine.SceneManagement.SceneManager.sceneCount; s++)
        {
            var scene = UnityEngine.SceneManagement.SceneManager.GetSceneAt(s);
            if (!scene.isLoaded) continue;

            foreach (var root in scene.GetRootGameObjects())
            {
                ScanRecursiveForTag(root);
            }
        }
    }

    private void ScanRecursiveForTag(GameObject obj)
    {
        if (obj.CompareTag(cullableTag))
        {
            bool alreadyExists = false;
            foreach(var co in cullableObjects) { if (co.rootObject == obj) { alreadyExists = true; break; } }
            if (!alreadyExists) RegisterCullableObject(obj);
        }

        for (int i = 0; i < obj.transform.childCount; i++)
        {
            ScanRecursiveForTag(obj.transform.GetChild(i).gameObject);
        }
    }

    void Update()
    {
        // Kalkulasi FPS rata-rata secara smooth
        float currentFPS = 1.0f / Time.unscaledDeltaTime;
        smoothFPS = Mathf.Lerp(smoothFPS, currentFPS, Time.deltaTime * 5f);

        timer += Time.deltaTime;

        if (timer >= (checkInterval <= 0f ? 0f : checkInterval))
        {
            timer = 0f;
            AdaptRenderDistance();
            CheckBuildings();
        }
    }

    private void AdaptRenderDistance()
    {
        if (player == null) return;
        if (adaptationMode == AdaptationMode.Fixed) return;

        float playerSpeed = Vector3.Distance(player.position, lastPlayerPos) / (checkInterval > 0 ? checkInterval : Time.deltaTime);
        lastPlayerPos = player.position;

        float targetDistance = currentRenderDistance;

        // 1. Adaptasi berdasarkan FPS
        if (adaptationMode == AdaptationMode.FPS || adaptationMode == AdaptationMode.Combined)
        {
            if (smoothFPS < targetFrameRate - 2f)
            {
                targetDistance -= maxDistanceStep * 0.5f; // Turunkan jarak jika FPS drop
            }
            else if (smoothFPS > targetFrameRate + 2f)
            {
                targetDistance += maxDistanceStep * 0.2f; // Naikkan perlahan jika FPS berlebih
            }
        }

        // 2. Adaptasi berdasarkan Kecepatan Player
        if (adaptationMode == AdaptationMode.Speed || adaptationMode == AdaptationMode.Combined)
        {
            if (playerSpeed > 5f)
            {
                targetDistance += (playerSpeed * 2f); // Expand kalau lari kencang
            }
            else if (playerSpeed < 1f)
            {
                targetDistance -= maxDistanceStep * 0.1f; // Shrink kalau jalan lambat/diam
            }
        }

        // Batasi perubahan maksimum tiap update
        float newDistance = Mathf.Clamp(targetDistance, currentRenderDistance - maxDistanceStep, currentRenderDistance + maxDistanceStep);
        
        // Jaga agar tetap dalam batas absolut min & max
        currentRenderDistance = Mathf.Clamp(newDistance, minRenderDistance, maxRenderDistance);
    }

    void CheckBuildings()
    {
        if (player == null) return;

        Transform currentTarget = null;
        if (navigationGuide != null)
        {
            currentTarget = navigationGuide.GetCurrentTarget();
        }

        // Gunakan kuadrat jarak (sqrMagnitude) untuk komputasi lebih ringan dari Vector3.Distance
        float sqrDistanceThreshold = currentRenderDistance * currentRenderDistance;
        Vector3 playerPos = player.position;

        for (int i = cullableObjects.Count - 1; i >= 0; i--)
        {
            var co = cullableObjects[i];

            if (co == null || co.rootObject == null)
            {
                cullableObjects.RemoveAt(i);
                continue;
            }

            bool shouldBeActive = false;
            
            // Pengecualian navigasi (target navigasi selalu dirender)
            if (currentTarget != null && co.rootObject.transform == currentTarget)
            {
                shouldBeActive = true;
            }
            else
            {
                float sqrDist = (co.referencePoint.position - playerPos).sqrMagnitude;
                shouldBeActive = sqrDist <= sqrDistanceThreshold;
            }

            // Jika status berubah, terapkan ke semua Renderer
            if (co.isCurrentlyActive != shouldBeActive)
            {
                co.isCurrentlyActive = shouldBeActive;
                
                foreach (var rs in co.renderers)
                {
                    if (rs.renderer != null)
                    {
                        // Kembalikan ke default (menyala jika aslinya nyala) atau matikan
                        rs.renderer.enabled = shouldBeActive ? rs.defaultState : false;
                    }
                }

                if (shouldBeActive)
                    OnBuildingEnabled?.Invoke(co.rootObject);
                else
                    OnBuildingDisabled?.Invoke(co.rootObject);
            }
        }
    }

    [ContextMenu("Rescan Cullable Objects")]
    public void Rescan()
    {
        ScanCullableObjects();
    }

    private void OnDrawGizmosSelected()
    {
        if (player != null)
        {
            Gizmos.color = new Color(0f, 1f, 1f, 0.3f);
            float drawDist = Application.isPlaying ? currentRenderDistance : startingRenderDistance;
            Gizmos.DrawWireSphere(player.position, drawDist);
        }
    }
}