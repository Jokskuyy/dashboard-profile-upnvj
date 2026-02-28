// ============================================
// FotoTest.cs — Script test sederhana
// ============================================
// Buat Canvas + RawImage + download foto SEPENUHNYA dari code.
// Tidak butuh setup Inspector sama sekali.
//
// CARA PAKAI:
// 1. Buat Empty GameObject di scene
// 2. Add Component → FotoTest
// 3. Play
// Foto harus muncul di tengah layar.
// ============================================

using System.Collections;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.Networking;

public class FotoTest : MonoBehaviour
{
    [Header("URL gambar untuk test")]
    public string testUrl = "https://picsum.photos/400/300";

    private RawImage rawImage;
    private Text statusText;

    void Start()
    {
        Debug.Log("[FotoTest] === MULAI TEST ===");
        Debug.Log($"[FotoTest] Screen: {Screen.width}x{Screen.height}");

        // ============================================
        // STEP 1: Buat Canvas dari code
        // ============================================
        GameObject canvasObj = new GameObject("TestCanvas");
        Canvas canvas = canvasObj.AddComponent<Canvas>();
        canvas.renderMode = RenderMode.ScreenSpaceOverlay;
        canvas.sortingOrder = 9999; // paling depan
        canvasObj.AddComponent<CanvasScaler>();
        canvasObj.AddComponent<GraphicRaycaster>();
        Debug.Log("[FotoTest] Canvas created: ScreenSpaceOverlay, sortingOrder=9999");

        // ============================================
        // STEP 2: Buat Background hitam semi-transparan
        // ============================================
        GameObject bgObj = new GameObject("Background");
        bgObj.transform.SetParent(canvasObj.transform, false);
        Image bg = bgObj.AddComponent<Image>();
        bg.color = new Color(0, 0, 0, 0.7f);
        RectTransform bgRect = bgObj.GetComponent<RectTransform>();
        bgRect.anchorMin = Vector2.zero;
        bgRect.anchorMax = Vector2.one;
        bgRect.sizeDelta = Vector2.zero;
        Debug.Log("[FotoTest] Background created");

        // ============================================
        // STEP 3: Buat RawImage di tengah layar
        // ============================================
        GameObject imgObj = new GameObject("TestRawImage");
        imgObj.transform.SetParent(canvasObj.transform, false);
        rawImage = imgObj.AddComponent<RawImage>();
        rawImage.color = Color.white;

        RectTransform imgRect = imgObj.GetComponent<RectTransform>();
        imgRect.anchorMin = new Vector2(0.5f, 0.5f);
        imgRect.anchorMax = new Vector2(0.5f, 0.5f);
        imgRect.pivot = new Vector2(0.5f, 0.5f);
        imgRect.anchoredPosition = Vector2.zero;
        imgRect.sizeDelta = new Vector2(400, 300);
        Debug.Log("[FotoTest] RawImage created: 400x300, center screen");

        // ============================================
        // STEP 4: Buat status text
        // ============================================
        GameObject textObj = new GameObject("StatusText");
        textObj.transform.SetParent(canvasObj.transform, false);
        statusText = textObj.AddComponent<Text>();
        statusText.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
        if (statusText.font == null)
            statusText.font = Resources.GetBuiltinResource<Font>("Arial.ttf");
        statusText.fontSize = 24;
        statusText.color = Color.yellow;
        statusText.alignment = TextAnchor.UpperCenter;
        statusText.text = "Downloading foto...";

        RectTransform textRect = textObj.GetComponent<RectTransform>();
        textRect.anchorMin = new Vector2(0.5f, 0.5f);
        textRect.anchorMax = new Vector2(0.5f, 0.5f);
        textRect.pivot = new Vector2(0.5f, 0.5f);
        textRect.anchoredPosition = new Vector2(0, 200);
        textRect.sizeDelta = new Vector2(600, 50);
        Debug.Log("[FotoTest] Status text created");

        // ============================================
        // STEP 5: Test warna dulu — set RawImage ke warna MERAH
        // Jika kotak merah muncul = Canvas & RawImage bekerja
        // ============================================
        Texture2D redTexture = new Texture2D(2, 2);
        redTexture.SetPixel(0, 0, Color.red);
        redTexture.SetPixel(1, 0, Color.red);
        redTexture.SetPixel(0, 1, Color.red);
        redTexture.SetPixel(1, 1, Color.red);
        redTexture.Apply();
        rawImage.texture = redTexture;
        Debug.Log("[FotoTest] RED TEXTURE set — kotak merah harus terlihat di tengah layar!");

        if (statusText != null)
            statusText.text = "Kotak MERAH harus terlihat!\nDownloading foto dalam 2 detik...";

        // Download foto setelah 2 detik (biar bisa lihat kotak merah dulu)
        StartCoroutine(DelayedDownload());
    }

    private IEnumerator DelayedDownload()
    {
        yield return new WaitForSeconds(2f);

        if (statusText != null)
            statusText.text = $"Downloading: {testUrl}";

        Debug.Log($"[FotoTest] Starting download: {testUrl}");

        using (UnityWebRequest request = UnityWebRequestTexture.GetTexture(testUrl))
        {
            yield return request.SendWebRequest();

            if (request.result == UnityWebRequest.Result.Success)
            {
                Texture2D texture = DownloadHandlerTexture.GetContent(request);
                Debug.Log($"[FotoTest] SUCCESS! Size: {texture.width}x{texture.height}");

                if (rawImage != null)
                {
                    rawImage.texture = texture;
                    Debug.Log("[FotoTest] Texture applied to RawImage!");
                }

                if (statusText != null)
                    statusText.text = $"SUKSES! Foto {texture.width}x{texture.height}";
            }
            else
            {
                Debug.LogError($"[FotoTest] FAILED: {request.error}");
                if (statusText != null)
                    statusText.text = $"GAGAL: {request.error}";
            }
        }
    }
}
