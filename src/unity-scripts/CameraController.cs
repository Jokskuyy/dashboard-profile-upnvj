// ============================================
// CameraController.cs
// Letakkan di: Assets/Scripts/Camera/
// Attach ke Main Camera di scene
// ============================================
// Mengatur transisi kamera saat user klik gedung (zoom in)
// dan tombol back (zoom out ke overview)

using UnityEngine;

public class CameraController : MonoBehaviour
{
    [Header("Camera Settings")]
    [Tooltip("Posisi & rotasi default kamera (overview seluruh kampus)")]
    public Transform defaultPosition;

    [Tooltip("Kecepatan transisi kamera")]
    public float transitionSpeed = 3f;

    [Tooltip("Threshold jarak untuk dianggap sudah sampai")]
    public float arrivalThreshold = 0.1f;

    // State
    private Vector3 targetPosition;
    private Quaternion targetRotation;
    private bool isTransitioning = false;
    private bool isZoomedIn = false;

    void Start()
    {
        // Simpan posisi default
        if (defaultPosition == null)
        {
            // Buat default dari posisi kamera saat ini
            GameObject defaultObj = new GameObject("DefaultCameraPosition");
            defaultObj.transform.position = transform.position;
            defaultObj.transform.rotation = transform.rotation;
            defaultPosition = defaultObj.transform;
        }

        targetPosition = transform.position;
        targetRotation = transform.rotation;
    }

    void Update()
    {
        if (isTransitioning)
        {
            // Smooth transition
            transform.position = Vector3.Lerp(transform.position, targetPosition, Time.deltaTime * transitionSpeed);
            transform.rotation = Quaternion.Slerp(transform.rotation, targetRotation, Time.deltaTime * transitionSpeed);

            // Cek apakah sudah sampai
            float distance = Vector3.Distance(transform.position, targetPosition);
            float angleDiff = Quaternion.Angle(transform.rotation, targetRotation);

            if (distance < arrivalThreshold && angleDiff < 1f)
            {
                transform.position = targetPosition;
                transform.rotation = targetRotation;
                isTransitioning = false;
            }
        }
    }

    /// <summary>
    /// Zoom kamera ke posisi target (dipanggil saat gedung diklik)
    /// </summary>
    public void ZoomToTarget(Vector3 position, Quaternion rotation)
    {
        targetPosition = position;
        targetRotation = rotation;
        isTransitioning = true;
        isZoomedIn = true;

        Debug.Log($"[Camera] Zooming to position: {position}");
    }

    /// <summary>
    /// Kembali ke posisi overview (dipanggil saat panel ditutup)
    /// </summary>
    public void ZoomOut()
    {
        if (defaultPosition != null)
        {
            targetPosition = defaultPosition.position;
            targetRotation = defaultPosition.rotation;
            isTransitioning = true;
            isZoomedIn = false;

            Debug.Log("[Camera] Zooming out to default position");
        }
    }

    /// <summary>
    /// Cek apakah kamera sedang zoom in ke gedung
    /// </summary>
    public bool IsZoomedIn()
    {
        return isZoomedIn;
    }

    /// <summary>
    /// Toggle zoom (untuk tombol back)
    /// </summary>
    public void ToggleZoom()
    {
        if (isZoomedIn)
        {
            ZoomOut();
        }
    }
}
