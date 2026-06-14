using UnityEngine;
using UnityEngine.AI; // Wajib untuk NavMesh
using UnityEngine.InputSystem; // New Input System
using TMPro;
using System.Collections.Generic;

public class NavigationGuide : MonoBehaviour
{
    [Header("Reference")]
    public Transform player;
    [Tooltip("Garis yang dirender di lantai. Buat GameObject kosong + LineRenderer di scene.")]
    public LineRenderer pathLine;

    [Header("Text Prefab")]
    public GameObject distanceTextPrefab;

    [Header("Settings")]
    public float stopDistance = 5f;
    public Vector3 textOffset = new Vector3(0, 2f, 0);
    [Tooltip("Minimal jarak player bergerak (meter) sebelum rute dihitung ulang agar performa WebGL tetap ringan.")]
    public float pathUpdateDistance = 1.0f; 

    private Transform currentTarget;
    private GameObject currentText;
    private TMP_Text textComponent;
    private string currentBuildingName;

    private NavMeshPath path;
    private Vector3 lastCalculatedPlayerPos;

    private void Start()
    {
        if (player == null)
            Debug.LogError("[NavigationGuide] 'player' belum diassign di Inspector!");
        if (pathLine == null)
            Debug.LogError("[NavigationGuide] 'pathLine' (LineRenderer) belum diassign di Inspector!");
        if (distanceTextPrefab == null)
            Debug.LogWarning("[NavigationGuide] 'distanceTextPrefab' belum diassign.");
        
        path = new NavMeshPath();
    }

    void Update()
    {
        // ==========================================
        // KUNCI KURSOR: Untuk memutar kamera 360 derajat di WebGL
        // Menggunakan New Input System agar tidak error
        var mouse = Mouse.current;
        var keyboard = Keyboard.current;

        if (mouse != null && mouse.leftButton.wasPressedThisFrame)
        {
            Cursor.lockState = CursorLockMode.Locked;
            Cursor.visible = false;
        }

        // LEPASKAN KURSOR: Agar user bisa klik menu di website lagi
        if (keyboard != null && keyboard.escapeKey.wasPressedThisFrame)
        {
            Cursor.lockState = CursorLockMode.None;
            Cursor.visible = true;
        }
        // ==========================================

        if (currentTarget == null || player == null) return;

        float distance = Vector3.Distance(player.position, currentTarget.position);

        // Update Path HANYA jika player berpindah > 1 meter (sangat menghemat performa WebGL)
        if (Vector3.Distance(player.position, lastCalculatedPlayerPos) > pathUpdateDistance)
        {
            CalculateAndDrawPath();
        }

        // Update posisi dan rotasi teks agar selalu menghadap kamera
        if (currentText != null)
        {
            currentText.transform.position = currentTarget.position + textOffset;
            currentText.transform.LookAt(Camera.main.transform);
            currentText.transform.Rotate(0, 180, 0);
        }

        // Update tulisan jarak
        if (textComponent != null)
        {
            textComponent.text = currentBuildingName + "\n" + Mathf.RoundToInt(distance) + "m";
        }

        // Jika sudah sampai tujuan
        if (distance <= stopDistance)
        {
            StopNavigation();
        }
    }

    // Centripetal Catmull-Rom: alpha=0.5 mencegah looping di belokan tajam
    private Vector3 GetCatmullRomPosition(float t, Vector3 p0, Vector3 p1, Vector3 p2, Vector3 p3)
    {
        const float alpha = 0.5f;

        float t0 = 0f;
        float t1 = t0 + Mathf.Pow(Vector3.Distance(p0, p1), alpha);
        float t2 = t1 + Mathf.Pow(Vector3.Distance(p1, p2), alpha);
        float t3 = t2 + Mathf.Pow(Vector3.Distance(p2, p3), alpha);

        // Remap t dari [0,1] ke rentang [t1, t2]
        float tt = Mathf.Lerp(t1, t2, t);

        if (t1 == t0) t1 += 1e-4f;
        if (t2 == t1) t2 += 1e-4f;
        if (t3 == t2) t3 += 1e-4f;

        Vector3 A1 = (t1 - tt) / (t1 - t0) * p0 + (tt - t0) / (t1 - t0) * p1;
        Vector3 A2 = (t2 - tt) / (t2 - t1) * p1 + (tt - t1) / (t2 - t1) * p2;
        Vector3 A3 = (t3 - tt) / (t3 - t2) * p2 + (tt - t2) / (t3 - t2) * p3;

        Vector3 B1 = (t2 - tt) / (t2 - t0) * A1 + (tt - t0) / (t2 - t0) * A2;
        Vector3 B2 = (t3 - tt) / (t3 - t1) * A2 + (tt - t1) / (t3 - t1) * A3;

        return (t2 - tt) / (t2 - t1) * B1 + (tt - t1) / (t2 - t1) * B2;
    }

    private void CalculateAndDrawPath()
    {
        if (pathLine == null) return;
        
        lastCalculatedPlayerPos = player.position;

        NavMeshHit startHit, endHit;
        bool validStart = NavMesh.SamplePosition(player.position, out startHit, 5f, NavMesh.AllAreas);
        bool validEnd   = NavMesh.SamplePosition(currentTarget.position, out endHit, 5f, NavMesh.AllAreas);

        if (!validStart)
        {
            Debug.LogWarning("[NavigationGuide] Posisi Player terlalu jauh dari NavMesh.");
            pathLine.positionCount = 0;
            return;
        }
        if (!validEnd)
        {
            Debug.LogWarning($"[NavigationGuide] Posisi Target ({currentTarget.name}) terlalu jauh dari NavMesh.");
            pathLine.positionCount = 0;
            return;
        }

        bool pathFound = NavMesh.CalculatePath(startHit.position, endHit.position, NavMesh.AllAreas, path);

        if (pathFound && path.corners.Length > 0)
        {
            Vector3[] corners = path.corners;
            
            if (corners.Length < 2) return;

            // Override titik PERTAMA ke posisi player saat ini agar garis selalu mengikuti player
            corners[0] = player.position;

            // 1. Setup Spline Control Points (Pad awal & akhir)
            List<Vector3> controlPoints = new List<Vector3>();
            controlPoints.Add(corners[0]); // Pad awal
            controlPoints.AddRange(corners);
            controlPoints.Add(corners[corners.Length - 1]); // Pad akhir

            List<Vector3> splinePoints = new List<Vector3>();
            float resolution = 0.1f; // Jarak tiap titik = 10cm (sangat mulus untuk anak tangga super kecil)

            // 2. Generate Catmull-Rom Spline Points
            for (int i = 1; i < controlPoints.Count - 2; i++)
            {
                Vector3 p0 = controlPoints[i - 1];
                Vector3 p1 = controlPoints[i];
                Vector3 p2 = controlPoints[i + 1];
                Vector3 p3 = controlPoints[i + 2];

                float dist = Vector3.Distance(p1, p2);
                int segments = Mathf.Max(1, Mathf.FloorToInt(dist / resolution));

                for (int j = 1; j <= segments; j++)
                {
                    float t = (float)j / segments;
                    splinePoints.Add(GetCatmullRomPosition(t, p0, p1, p2, p3));
                }
            }

            // 3. Render ke LineRenderer dengan Raycast
            pathLine.positionCount = splinePoints.Count;

            for (int i = 0; i < splinePoints.Count; i++)
            {
                Vector3 point = splinePoints[i];

                RaycastHit surfaceHit;
                Vector3 rayOrigin = point + Vector3.up * 2f;
                float groundY = point.y;

                if (Physics.Raycast(rayOrigin, Vector3.down, out surfaceHit, 5f))
                {
                    groundY = surfaceHit.point.y;
                }

                // Beri offset Y 0.20 meter (20 cm) agar aman dari clipping anak tangga super kecil
                pathLine.SetPosition(i, new Vector3(point.x, groundY + 0.20f, point.z));
            }
        }
        else
        {
            Debug.LogWarning($"[NavigationGuide] Rute ke {currentTarget.name} terputus.");
            pathLine.positionCount = 0;
        }
    }

    public void StartNavigation(Transform target, string buildingName)
    {
        Debug.Log($"[NavigationGuide] StartNavigation called → target='{target?.name}', building='{buildingName}'");

        if (target == null)
        {
            Debug.LogError("[NavigationGuide] StartNavigation: target Transform is null!");
            return;
        }

        if (pathLine == null)
        {
            Debug.LogError("[NavigationGuide] StartNavigation: 'pathLine' belum diassign di Inspector!");
            return;
        }

        // Bersihkan teks lama
        if (currentText != null)
        {
            Destroy(currentText);
            currentText = null;
            textComponent = null;
        }

        currentTarget = target;
        currentBuildingName = buildingName;

        if (!target.gameObject.activeSelf)
            target.gameObject.SetActive(true);

        pathLine.gameObject.SetActive(true);

        // Kalkulasi rute langsung agar user tidak perlu menunggu 0.2 detik
        CalculateAndDrawPath();

        if (distanceTextPrefab != null)
        {
            currentText = Instantiate(distanceTextPrefab);
            textComponent = currentText.GetComponent<TMP_Text>();
        }
    }

    public void StopNavigation()
    {
        Debug.Log("[NavigationGuide] StopNavigation called.");
        currentTarget = null;
        currentBuildingName = null;

        if (pathLine != null)
            pathLine.gameObject.SetActive(false);

        if (currentText != null)
        {
            Destroy(currentText);
            currentText = null;
            textComponent = null;
        }
    }

    public Transform GetCurrentTarget()
    {
        return currentTarget;
    }
}