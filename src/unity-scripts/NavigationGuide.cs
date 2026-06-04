using UnityEngine;
using TMPro;

public class NavigationGuide : MonoBehaviour
{
    [Header("Reference")]
    public Transform player;
    public Transform arrow;

    [Header("Text Prefab")]
    public GameObject distanceTextPrefab;

    [Header("Settings")]
    public float stopDistance = 5f;
    public Vector3 textOffset = new Vector3(0, 2f, 0);

    private Transform currentTarget;
    private GameObject currentText;
    private TMP_Text textComponent;
    private string currentBuildingName;   // Nama asli dari database

    private void Start()
    {
        // Validasi referensi wajib saat scene start
        if (player == null)
            Debug.LogError("[NavigationGuide] 'player' belum diassign di Inspector!");
        if (arrow == null)
            Debug.LogError("[NavigationGuide] 'arrow' belum diassign di Inspector!");
        if (distanceTextPrefab == null)
            Debug.LogWarning("[NavigationGuide] 'distanceTextPrefab' belum diassign — TMP label tidak akan muncul.");
    }

    void Update()
    {
        if (currentTarget == null) return;
        if (player == null || arrow == null) return;

        float distance = Vector3.Distance(player.position, currentTarget.position);

        // Arrow rotation
        Vector3 direction = (currentTarget.position - arrow.position).normalized;
        Quaternion lookRot = Quaternion.LookRotation(direction);
        Vector3 euler = lookRot.eulerAngles;

        float finalX = 90f + euler.x;
        float finalY = euler.y;
        float finalZ = 90f;

        arrow.rotation = Quaternion.Euler(finalX, finalY, finalZ);

        // Update text position & rotation
        if (currentText != null)
        {
            currentText.transform.position = currentTarget.position + textOffset;
            currentText.transform.LookAt(Camera.main.transform);
            currentText.transform.Rotate(0, 180, 0);
        }

        // Update text content
        if (textComponent != null)
        {
            string buildingName = currentBuildingName;
            int dist = Mathf.RoundToInt(distance);

            textComponent.text = buildingName + "\n" + dist + "m";
        }

        // Stop navigation when close enough
        if (distance <= stopDistance)
        {
            StopNavigation();
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

        if (arrow == null)
        {
            Debug.LogError("[NavigationGuide] StartNavigation: 'arrow' belum diassign di Inspector — drag Arrow GameObject ke field ini.");
            return;
        }

        // Clean up previous text
        if (currentText != null)
        {
            Destroy(currentText);
            currentText = null;
            textComponent = null;
        }

        currentTarget = target;
        currentBuildingName = buildingName;     // Simpan nama asli

        if (!target.gameObject.activeSelf)
            target.gameObject.SetActive(true);

        arrow.gameObject.SetActive(true);
        Debug.Log($"[NavigationGuide] Arrow diaktifkan: {arrow.name}");

        if (distanceTextPrefab != null)
        {
            currentText = Instantiate(distanceTextPrefab);
            textComponent = currentText.GetComponent<TMP_Text>();

            if (textComponent == null)
                Debug.LogWarning("[NavigationGuide] distanceTextPrefab tidak punya komponen TMP_Text!");
            else
                Debug.Log("[NavigationGuide] TMP label berhasil di-instantiate.");
        }
        else
        {
            Debug.LogWarning("[NavigationGuide] distanceTextPrefab null — TMP label tidak akan muncul. Assign prefab di Inspector.");
        }
    }

    public void StopNavigation()
    {
        Debug.Log("[NavigationGuide] StopNavigation called.");
        currentTarget = null;
        currentBuildingName = null;

        if (arrow != null)
            arrow.gameObject.SetActive(false);

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