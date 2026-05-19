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

    void Update()
    {
        if (currentTarget == null) return;

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

        if (distanceTextPrefab != null)
        {
            currentText = Instantiate(distanceTextPrefab);
            textComponent = currentText.GetComponent<TMP_Text>();
        }
    }

    public void StopNavigation()
    {
        currentTarget = null;
        currentBuildingName = null;

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