// ============================================
// UIManager.cs
// Letakkan di: Assets/Scripts/UI/
// Attach ke Canvas atau empty GameObject di scene
// ============================================
// Mengelola semua UI panels untuk interaksi map:
// - Floor Navigation Panel (pilih lantai)
// - Room List Panel (daftar ruangan per lantai)  
// - Room Detail Panel (detail + foto ruangan)

using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.Networking;
using TMPro;

public class UIManager : MonoBehaviour
{
    [Header("Floor Navigation Panel")]
    [Tooltip("Panel navigasi lantai (kiri layar)")]
    public GameObject floorNavigationPanel;
    public TextMeshProUGUI buildingNameText;
    public TextMeshProUGUI buildingDescText;
    public Transform floorButtonContainer;
    public GameObject floorButtonPrefab;

    [Header("Room List Panel")]
    [Tooltip("Panel daftar ruangan per lantai")]
    public GameObject roomListPanel;
    public TextMeshProUGUI selectedFloorText;
    public Transform roomListContainer;
    public GameObject roomListItemPrefab;

    [Header("Room Detail Panel")]
    [Tooltip("Panel detail ruangan + foto")]
    public GameObject roomDetailPanel;
    public TextMeshProUGUI roomNameText;
    public TextMeshProUGUI roomTypeText;
    public TextMeshProUGUI roomDescriptionText;
    public TextMeshProUGUI roomFloorText;
    public RawImage roomPhotoImage;
    public GameObject photoLoadingIndicator;
    public GameObject noPhotoPlaceholder;

    [Header("Close Buttons")]
    public Button closeFloorPanelButton;
    public Button closeRoomDetailButton;
    public Button backToFloorButton;

    // State
    private GedungData currentGedung;
    private int currentLantai = 1;
    private Dictionary<string, Texture2D> textureCache = new Dictionary<string, Texture2D>();

    void Start()
    {
        // Setup close button listeners
        if (closeFloorPanelButton != null)
            closeFloorPanelButton.onClick.AddListener(HideAllPanels);

        if (closeRoomDetailButton != null)
            closeRoomDetailButton.onClick.AddListener(HideRoomDetail);

        if (backToFloorButton != null)
            backToFloorButton.onClick.AddListener(HideRoomDetail);

        // Hide semua panel saat start
        HideAllPanels();
    }

    // ============================================
    // FLOOR NAVIGATION PANEL
    // ============================================

    /// <summary>
    /// Tampilkan panel navigasi lantai untuk suatu gedung
    /// Dipanggil oleh BuildingClickHandler saat gedung diklik
    /// </summary>
    public void ShowFloorPanel(GedungData gedung, List<FasilitasData> allFasilitas)
    {
        currentGedung = gedung;

        // Set building info
        if (buildingNameText != null)
            buildingNameText.text = gedung.nama_gedung;

        if (buildingDescText != null)
            buildingDescText.text = gedung.deskripsi_gedung;

        // Clear existing floor buttons
        if (floorButtonContainer != null)
        {
            foreach (Transform child in floorButtonContainer)
            {
                Destroy(child.gameObject);
            }
        }

        // Generate floor buttons
        int floorCount = gedung.jumlah_lantai > 0 ? gedung.jumlah_lantai : 1;
        for (int i = 1; i <= floorCount; i++)
        {
            CreateFloorButton(i, gedung.id);
        }

        // Show panel
        if (floorNavigationPanel != null)
            floorNavigationPanel.SetActive(true);

        // Auto-select lantai 1
        SelectFloor(1);
    }

    /// <summary>
    /// Buat tombol lantai di navigation panel
    /// </summary>
    private void CreateFloorButton(int lantai, int gedungId)
    {
        if (floorButtonPrefab == null || floorButtonContainer == null) return;

        GameObject btnObj = Instantiate(floorButtonPrefab, floorButtonContainer);
        Button btn = btnObj.GetComponent<Button>();
        TextMeshProUGUI btnText = btnObj.GetComponentInChildren<TextMeshProUGUI>();

        if (btnText != null)
        {
            btnText.text = $"Lantai {lantai}";
        }

        // Hitung jumlah fasilitas di lantai ini
        int fasilitasCount = 0;
        if (BuildingDataReceiver.Instance != null)
        {
            fasilitasCount = BuildingDataReceiver.Instance.GetFasilitasByLantai(gedungId, lantai).Count;
        }

        // Tampilkan jumlah fasilitas di tombol (opsional)
        TextMeshProUGUI countText = btnObj.transform.Find("CountText")?.GetComponent<TextMeshProUGUI>();
        if (countText != null)
        {
            countText.text = $"({fasilitasCount} ruangan)";
        }

        if (btn != null)
        {
            int floor = lantai; // Capture for closure
            btn.onClick.AddListener(() => SelectFloor(floor));
        }
    }

    /// <summary>
    /// Dipanggil saat user memilih lantai (dari tombol atau klik 3D)
    /// </summary>
    public void SelectFloor(int lantai)
    {
        currentLantai = lantai;

        if (selectedFloorText != null)
            selectedFloorText.text = $"Lantai {lantai} - {currentGedung?.nama_gedung ?? ""}";

        // Ambil fasilitas untuk lantai ini
        List<FasilitasData> fasilitasLantai = new List<FasilitasData>();
        if (BuildingDataReceiver.Instance != null && currentGedung != null)
        {
            fasilitasLantai = BuildingDataReceiver.Instance.GetFasilitasByLantai(currentGedung.id, lantai);
        }

        // Populate room list
        PopulateRoomList(fasilitasLantai);

        // Show room list panel
        if (roomListPanel != null)
            roomListPanel.SetActive(true);

        // Hide room detail if open
        HideRoomDetail();

        Debug.Log($"[UIManager] Selected lantai {lantai}: {fasilitasLantai.Count} fasilitas");
    }

    // ============================================
    // ROOM LIST
    // ============================================

    /// <summary>
    /// Populate daftar ruangan untuk lantai yang dipilih
    /// </summary>
    private void PopulateRoomList(List<FasilitasData> fasilitasList)
    {
        if (roomListContainer == null) return;

        // Clear existing items
        foreach (Transform child in roomListContainer)
        {
            Destroy(child.gameObject);
        }

        if (fasilitasList.Count == 0)
        {
            // Tampilkan pesan "Tidak ada fasilitas"
            if (roomListItemPrefab != null)
            {
                GameObject emptyObj = Instantiate(roomListItemPrefab, roomListContainer);
                TextMeshProUGUI emptyText = emptyObj.GetComponentInChildren<TextMeshProUGUI>();
                if (emptyText != null)
                {
                    emptyText.text = "Tidak ada fasilitas di lantai ini";
                }
                // Disable button jika ada
                Button emptyBtn = emptyObj.GetComponent<Button>();
                if (emptyBtn != null) emptyBtn.interactable = false;
            }
            return;
        }

        // Create room list items
        foreach (var fasilitas in fasilitasList)
        {
            CreateRoomListItem(fasilitas);
        }
    }

    /// <summary>
    /// Buat satu item di daftar ruangan
    /// </summary>
    private void CreateRoomListItem(FasilitasData fasilitas)
    {
        if (roomListItemPrefab == null || roomListContainer == null) return;

        GameObject itemObj = Instantiate(roomListItemPrefab, roomListContainer);

        // Set nama fasilitas
        TextMeshProUGUI nameText = itemObj.transform.Find("NameText")?.GetComponent<TextMeshProUGUI>();
        if (nameText != null)
        {
            nameText.text = fasilitas.nama_fasilitas;
        }
        else
        {
            // Fallback: gunakan TextMeshProUGUI pertama yang ditemukan
            TextMeshProUGUI fallbackText = itemObj.GetComponentInChildren<TextMeshProUGUI>();
            if (fallbackText != null) fallbackText.text = fasilitas.nama_fasilitas;
        }

        // Set tipe fasilitas
        TextMeshProUGUI typeText = itemObj.transform.Find("TypeText")?.GetComponent<TextMeshProUGUI>();
        if (typeText != null)
        {
            typeText.text = fasilitas.tipe_fasilitas;
        }

        // Setup click handler
        Button btn = itemObj.GetComponent<Button>();
        if (btn != null)
        {
            FasilitasData capturedFasilitas = fasilitas; // Capture for closure
            btn.onClick.AddListener(() => ShowRoomDetail(capturedFasilitas));
        }
    }

    // ============================================
    // ROOM DETAIL PANEL
    // ============================================

    /// <summary>
    /// Tampilkan detail ruangan + foto
    /// Dipanggil saat user klik ruangan di list atau di denah
    /// </summary>
    public void ShowRoomDetail(FasilitasData fasilitas)
    {
        if (roomDetailPanel == null) return;

        Debug.Log($"[UIManager] Showing detail for: {fasilitas.nama_fasilitas}");

        // Set text fields
        if (roomNameText != null)
            roomNameText.text = fasilitas.nama_fasilitas;

        if (roomTypeText != null)
            roomTypeText.text = fasilitas.tipe_fasilitas;

        if (roomDescriptionText != null)
            roomDescriptionText.text = fasilitas.deskripsi_fasilitas;

        if (roomFloorText != null)
        {
            string gedungName = "";
            if (currentGedung != null) gedungName = currentGedung.nama_gedung;
            roomFloorText.text = $"Lantai {fasilitas.lantai} • {gedungName}";
        }

        // Load foto
        if (!string.IsNullOrEmpty(fasilitas.foto_url))
        {
            LoadRoomPhoto(fasilitas.foto_url);
        }
        else
        {
            // Tampilkan placeholder "no photo"
            if (roomPhotoImage != null) roomPhotoImage.gameObject.SetActive(false);
            if (noPhotoPlaceholder != null) noPhotoPlaceholder.SetActive(true);
            if (photoLoadingIndicator != null) photoLoadingIndicator.SetActive(false);
        }

        // Show panel
        roomDetailPanel.SetActive(true);
    }

    /// <summary>
    /// Load foto ruangan dari URL (dengan caching)
    /// </summary>
    private void LoadRoomPhoto(string url)
    {
        if (roomPhotoImage == null) return;

        // Cek cache dulu
        if (textureCache.TryGetValue(url, out Texture2D cachedTexture))
        {
            roomPhotoImage.texture = cachedTexture;
            roomPhotoImage.gameObject.SetActive(true);
            if (noPhotoPlaceholder != null) noPhotoPlaceholder.SetActive(false);
            if (photoLoadingIndicator != null) photoLoadingIndicator.SetActive(false);
            return;
        }

        // Show loading, hide photo
        if (photoLoadingIndicator != null) photoLoadingIndicator.SetActive(true);
        if (noPhotoPlaceholder != null) noPhotoPlaceholder.SetActive(false);
        roomPhotoImage.gameObject.SetActive(false);

        StartCoroutine(DownloadImage(url));
    }

    /// <summary>
    /// Coroutine untuk download gambar dari URL
    /// </summary>
    private IEnumerator DownloadImage(string url)
    {
        using (UnityWebRequest request = UnityWebRequestTexture.GetTexture(url))
        {
            yield return request.SendWebRequest();

            if (request.result == UnityWebRequest.Result.Success)
            {
                Texture2D texture = DownloadHandlerTexture.GetContent(request);

                // Cache texture
                textureCache[url] = texture;

                // Apply ke RawImage
                if (roomPhotoImage != null)
                {
                    roomPhotoImage.texture = texture;
                    roomPhotoImage.gameObject.SetActive(true);
                }
                if (noPhotoPlaceholder != null) noPhotoPlaceholder.SetActive(false);
            }
            else
            {
                Debug.LogWarning($"[UIManager] Failed to load image: {url} - {request.error}");
                if (noPhotoPlaceholder != null) noPhotoPlaceholder.SetActive(true);
            }

            if (photoLoadingIndicator != null) photoLoadingIndicator.SetActive(false);
        }
    }

    // ============================================
    // PANEL VISIBILITY
    // ============================================

    public void HideRoomDetail()
    {
        if (roomDetailPanel != null)
            roomDetailPanel.SetActive(false);
    }

    public void HideAllPanels()
    {
        if (floorNavigationPanel != null)
            floorNavigationPanel.SetActive(false);
        if (roomListPanel != null)
            roomListPanel.SetActive(false);
        if (roomDetailPanel != null)
            roomDetailPanel.SetActive(false);

        currentGedung = null;
    }

    /// <summary>
    /// Cleanup cached textures saat destroy
    /// </summary>
    void OnDestroy()
    {
        foreach (var texture in textureCache.Values)
        {
            if (texture != null) Destroy(texture);
        }
        textureCache.Clear();
    }
}
