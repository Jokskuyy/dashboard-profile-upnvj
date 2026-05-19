// ============================================
// BuildingClickHandler.cs
// Letakkan di: Assets/Scripts/Interaction/
// Attach ke setiap GameObject gedung di scene 3D
// ============================================
// Script ini mendeteksi klik pada gedung dan memicu:
// 1. Kamera zoom ke gedung
// 2. Floor Navigation Panel muncul

using System.Collections.Generic;
using UnityEngine;

/// <summary>
/// Attach ke setiap 3D gedung GameObject.
/// Set gedungId di Inspector sesuai ID di database.
/// </summary>
public class BuildingClickHandler : MonoBehaviour
{
    [Header("Building Configuration")]
    [Tooltip("ID gedung sesuai database (tabel gedung)")]
    public int gedungId;

    [Tooltip("Posisi kamera saat zoom ke gedung ini (set di Inspector)")]
    public Transform cameraTarget;

    // Referensi ke UI Manager (di-set via Inspector atau FindObjectOfType)
    private UIManager uiManager;
    private BuildingDataReceiver dataReceiver;

    // Visual feedback
    private Renderer buildingRenderer;
    private Color originalColor;

    [Header("Highlight Settings")]
    public Color highlightColor = new Color(0.3f, 0.6f, 1f, 1f);

    void Start()
    {
        uiManager = FindObjectOfType<UIManager>();
        dataReceiver = BuildingDataReceiver.Instance;
        buildingRenderer = GetComponent<Renderer>();

        if (buildingRenderer != null)
        {
            originalColor = buildingRenderer.material.color;
        }
    }

    void OnMouseEnter()
    {
        // Highlight saat hover
        if (buildingRenderer != null)
        {
            buildingRenderer.material.color = highlightColor;
        }

        // Ubah cursor (opsional)
        // Cursor.SetCursor(hoverCursor, Vector2.zero, CursorMode.Auto);
    }

    void OnMouseExit()
    {
        // Reset highlight
        if (buildingRenderer != null)
        {
            buildingRenderer.material.color = originalColor;
        }
    }

    void OnMouseDown()
    {
        Debug.Log($"[BuildingClick] Clicked building with gedungId: {gedungId}");

        if (dataReceiver == null || !dataReceiver.IsDataReady)
        {
            Debug.LogWarning("[BuildingClick] Data belum tersedia dari database");
            return;
        }

        // Ambil data gedung
        GedungData gedung = dataReceiver.GetGedung(gedungId);
        if (gedung == null)
        {
            Debug.LogWarning($"[BuildingClick] Gedung dengan ID {gedungId} tidak ditemukan di data");
            return;
        }

        // 1. Zoom kamera ke gedung
        CameraController cameraController = FindObjectOfType<CameraController>();
        if (cameraController != null && cameraTarget != null)
        {
            cameraController.ZoomToTarget(cameraTarget.position, cameraTarget.rotation);
        }

        // 2. Tampilkan Floor Navigation Panel
        if (uiManager != null)
        {
            List<FasilitasData> fasilitasList = dataReceiver.GetFasilitasByGedung(gedungId);
            uiManager.ShowFloorPanel(gedung, fasilitasList);
        }
    }
}
