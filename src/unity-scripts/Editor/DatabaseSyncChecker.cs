using UnityEngine;
using UnityEditor;
using UnityEngine.Networking;
using System.Collections;
using System.Collections.Generic;
using Unity.EditorCoroutines.Editor;

namespace UPNVJ.Editor
{
    /// <summary>
    /// Tool untuk mengecek sinkronisasi antara unity_object_name di database
    /// dengan GameObject yang benar-benar ada di scene Unity.
    /// Buka melalui: Tools > UPNVJ > Check Database Sync
    /// </summary>
    public class DatabaseSyncChecker : EditorWindow
    {
        // URL sama persis dengan yang dipakai BuildingDatabase.cs
        private const string API_URL = "https://dashboard-profile-upnvj.vercel.app/api/unity/names";

        // Format response dari /api/unity/names
        [System.Serializable]
        private class UnityNamesResponse
        {
            public List<string> unityObjectNames;
        }

        private List<string> missingInScene   = new List<string>();
        private List<string> foundInScene     = new List<string>();
        private List<string> missingInDb      = new List<string>();

        private bool isChecking  = false;
        private bool hasDoneCheck = false;
        private string statusMessage = "Klik tombol di bawah untuk memulai pengecekan.";

        private Vector2 scrollMissing;
        private Vector2 scrollFound;
        private Vector2 scrollExtra;

        // ──────────────────────────────────────────
        [MenuItem("Tools/UPNVJ/Check Database Sync")]
        public static void ShowWindow()
        {
            var window = GetWindow<DatabaseSyncChecker>("Database Sync Checker");
            window.minSize = new Vector2(480, 600);
        }

        // ──────────────────────────────────────────
        private void OnGUI()
        {
            // Header
            EditorGUILayout.Space(10);
            GUIStyle titleStyle = new GUIStyle(EditorStyles.boldLabel)
            {
                fontSize = 14,
                alignment = TextAnchor.MiddleCenter
            };
            EditorGUILayout.LabelField("🔍 UPNVJ Database Sync Checker", titleStyle);
            EditorGUILayout.LabelField("Mengecek apakah semua unity_object_name di database sudah ada di scene.", 
                EditorStyles.centeredGreyMiniLabel);
            EditorGUILayout.Space(10);

            // Status
            EditorGUILayout.HelpBox(statusMessage, isChecking ? MessageType.Info : MessageType.None);
            EditorGUILayout.Space(5);

            // Tombol
            EditorGUI.BeginDisabledGroup(isChecking);
            if (GUILayout.Button(isChecking ? "Sedang mengecek..." : "▶  Mulai Pengecekan", GUILayout.Height(36)))
            {
                RunCheck();
            }
            EditorGUI.EndDisabledGroup();

            if (!hasDoneCheck) return;

            EditorGUILayout.Space(15);
            DrawHorizontalLine();

            // ─── Ringkasan ───
            EditorGUILayout.Space(5);
            EditorGUILayout.LabelField("📊 Ringkasan", EditorStyles.boldLabel);
            EditorGUILayout.BeginHorizontal();
            DrawStatBox($"✅ Ditemukan\n{foundInScene.Count}", new Color(0.2f, 0.8f, 0.4f));
            DrawStatBox($"❌ Tidak Ada di Scene\n{missingInScene.Count}", new Color(0.9f, 0.3f, 0.3f));
            DrawStatBox($"⚠️ Tidak Ada di DB\n{missingInDb.Count}", new Color(0.9f, 0.7f, 0.1f));
            EditorGUILayout.EndHorizontal();

            EditorGUILayout.Space(10);

            // ─── Missing in Scene (PALING PENTING) ───
            if (missingInScene.Count > 0)
            {
                DrawSection(
                    $"❌ TIDAK ADA DI SCENE ({missingInScene.Count})",
                    "Object ini ada di database tapi BELUM dibuat / salah nama di Unity:",
                    missingInScene,
                    new Color(1f, 0.85f, 0.85f),
                    ref scrollMissing
                );
            }

            // ─── Found ───
            if (foundInScene.Count > 0)
            {
                DrawSection(
                    $"✅ SUDAH ADA DI SCENE ({foundInScene.Count})",
                    "Object ini sudah cocok antara database dan scene Unity:",
                    foundInScene,
                    new Color(0.85f, 1f, 0.88f),
                    ref scrollFound
                );
            }

            // ─── Extra in Scene (not in DB) ───
            if (missingInDb.Count > 0)
            {
                DrawSection(
                    $"⚠️ ADA DI SCENE TAPI TIDAK DI DATABASE ({missingInDb.Count})",
                    "Object ini ada di scene Unity tapi belum didaftarkan ke database:",
                    missingInDb,
                    new Color(1f, 0.97f, 0.8f),
                    ref scrollExtra
                );
            }
        }

        // ──────────────────────────────────────────
        private void RunCheck()
        {
            isChecking   = true;
            hasDoneCheck = false;
            statusMessage = "Mengambil data dari API...";
            missingInScene.Clear();
            foundInScene.Clear();
            missingInDb.Clear();
            Repaint();

            EditorCoroutineUtility.StartCoroutine(FetchAndCheck(), this);
        }

        private IEnumerator FetchAndCheck()
        {
            using (UnityWebRequest req = UnityWebRequest.Get(API_URL))
            {
                yield return req.SendWebRequest();

                if (req.result != UnityWebRequest.Result.Success)
                {
                    statusMessage = $"❌ Gagal mengambil data dari API: {req.error}";
                    isChecking = false;
                    Repaint();
                    yield break;
                }

                // Parse JSON — format: {"unityObjectNames": ["nama1", "nama2", ...]}
                UnityNamesResponse response = null;
                string rawJson = req.downloadHandler.text;
                
                // Tampilkan 200 karakter pertama JSON untuk debug
                string jsonPreview = rawJson.Length > 200 ? rawJson.Substring(0, 200) + "..." : rawJson;
                Debug.Log($"[DatabaseSyncChecker] Raw API Response: {jsonPreview}");
                
                try
                {
                    response = JsonUtility.FromJson<UnityNamesResponse>(rawJson);
                }
                catch (System.Exception ex)
                {
                    statusMessage = $"❌ Gagal parse JSON: {ex.Message}\nRaw: {jsonPreview}";
                    isChecking = false;
                    Repaint();
                    yield break;
                }

                if (response == null || response.unityObjectNames == null || response.unityObjectNames.Count == 0)
                {
                    statusMessage = $"❌ API mengembalikan data kosong.\nRaw: {jsonPreview}";
                    isChecking = false;
                    Repaint();
                    yield break;
                }

                // Isi dbNames dari unityObjectNames
                var dbNames = new HashSet<string>(System.StringComparer.OrdinalIgnoreCase);
                foreach (var name in response.unityObjectNames)
                    if (!string.IsNullOrWhiteSpace(name))
                        dbNames.Add(name.Trim());

                statusMessage = $"Data diambil: {dbNames.Count} unity_object_name dari database. Mengecek scene...";
                Repaint();

                // Kumpulkan SEMUA nama GameObject di scene secara rekursif (termasuk child di dalam Gedung, dll)
                var sceneNames = new HashSet<string>(System.StringComparer.OrdinalIgnoreCase);
                var activeScene = UnityEngine.SceneManagement.SceneManager.GetActiveScene();
                var rootObjects = activeScene.GetRootGameObjects();

                foreach (var root in rootObjects)
                    CollectAllNames(root.transform, sceneNames);

                // Bandingkan DB vs Scene
                foreach (var name in dbNames)
                {
                    if (sceneNames.Contains(name))
                        foundInScene.Add(name);
                    else
                        missingInScene.Add(name);
                }

                // Cek root objects yang tidak ada di DB
                foreach (var root in rootObjects)
                    if (!dbNames.Contains(root.name.Trim()))
                        missingInDb.Add(root.name.Trim());

                // Sorting agar rapi
                missingInScene.Sort();
                foundInScene.Sort();
                missingInDb.Sort();

                isChecking   = true;
                hasDoneCheck = true;

                if (missingInScene.Count == 0)
                    statusMessage = $"✅ SEMPURNA! Semua {foundInScene.Count} object di database sudah ada di scene.";
                else
                    statusMessage = $"⚠️ Selesai! {missingInScene.Count} object BELUM ADA di scene dari total {dbNames.Count} di database.";

                isChecking = false;
                Repaint();
            }
        }

        // ──────────────────────────────────────────────────────
        // Rekursif: kumpulkan nama SEMUA GameObject (root + seluruh child-nya)
        // ──────────────────────────────────────────────────────
        private void CollectAllNames(Transform t, HashSet<string> names)
        {
            names.Add(t.name.Trim());
            foreach (Transform child in t)
                CollectAllNames(child, names);
        }

        // ──────────────────────────────────────────────────────
        // Helper UI Methods
        // ──────────────────────────────────────────────────────

        private void DrawSection(string title, string subtitle, List<string> items, Color bgColor, ref Vector2 scroll)
        {
            EditorGUILayout.Space(5);
            EditorGUILayout.LabelField(title, EditorStyles.boldLabel);
            EditorGUILayout.LabelField(subtitle, EditorStyles.miniLabel);

            var oldColor = GUI.backgroundColor;
            GUI.backgroundColor = bgColor;

            scroll = EditorGUILayout.BeginScrollView(scroll, GUILayout.MaxHeight(150));
            foreach (var item in items)
            {
                EditorGUILayout.SelectableLabel(item, EditorStyles.textField, GUILayout.Height(18));
            }
            EditorGUILayout.EndScrollView();

            GUI.backgroundColor = oldColor;

            // Tombol copy
            if (GUILayout.Button("📋 Copy semua ke Clipboard", GUILayout.Height(22)))
                GUIUtility.systemCopyBuffer = string.Join("\n", items);

            EditorGUILayout.Space(5);
        }

        private void DrawStatBox(string text, Color color)
        {
            var style = new GUIStyle(EditorStyles.helpBox)
            {
                alignment = TextAnchor.MiddleCenter,
                fontSize = 12,
                fontStyle = FontStyle.Bold
            };
            var oldBg = GUI.backgroundColor;
            GUI.backgroundColor = color;
            GUILayout.Box(text, style, GUILayout.ExpandWidth(true), GUILayout.Height(55));
            GUI.backgroundColor = oldBg;
        }

        private void DrawHorizontalLine()
        {
            var rect = EditorGUILayout.GetControlRect(false, 1);
            EditorGUI.DrawRect(rect, new Color(0.5f, 0.5f, 0.5f, 0.5f));
        }
    }
}
