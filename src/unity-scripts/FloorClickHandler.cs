// ============================================
// FloorClickHandler.cs
// Letakkan di: Assets/Scripts/Interaction/
// Attach ke setiap lantai 3D object di gedung
// ============================================
// Script ini mendeteksi klik pada lantai gedung (3D object)
// sebagai alternatif selain klik tombol lantai di nav panel

using UnityEngine;

/// <summary>
/// Attach ke setiap lantai 3D object di dalam gedung.
/// Alternatif untuk memilih lantai selain dari Floor Navigation Panel.
/// </summary>
public class FloorClickHandler : MonoBehaviour
{
    [Header("Floor Configuration")]
    [Tooltip("ID gedung (harus sama dengan BuildingClickHandler di parent)")]
    public int gedungId;

    [Tooltip("Nomor lantai yang direpresentasikan object ini")]
    public int lantai;

    // Visual feedback
    private Renderer floorRenderer;
    private Color originalColor;

    [Header("Highlight Settings")]
    public Color highlightColor = new Color(0.5f, 0.8f, 1f, 0.7f);

    void Start()
    {
        floorRenderer = GetComponent<Renderer>();
        if (floorRenderer != null)
        {
            originalColor = floorRenderer.material.color;
        }
    }

    void OnMouseEnter()
    {
        if (floorRenderer != null)
        {
            floorRenderer.material.color = highlightColor;
        }
    }

    void OnMouseExit()
    {
        if (floorRenderer != null)
        {
            floorRenderer.material.color = originalColor;
        }
    }

    void OnMouseDown()
    {
        Debug.Log($"[FloorClick] Clicked lantai {lantai} of gedung {gedungId}");

        // Panggil UIManager untuk select floor
        UIManager uiManager = FindObjectOfType<UIManager>();
        if (uiManager != null)
        {
            uiManager.SelectFloor(lantai);
        }
    }
}
