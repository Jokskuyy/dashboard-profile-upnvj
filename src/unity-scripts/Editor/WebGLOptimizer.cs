using UnityEditor;
using UnityEditor.Build;
using UnityEngine;

namespace UPNVJ.Editor
{
    public class WebGLOptimizer
    {
        [MenuItem("Tools/UPNVJ/Apply Optimal WebGL Settings")]
        public static void ApplySettings()
        {
            Debug.Log("Applying Optimal WebGL Settings for React Integration...");

            // 1. Target Platform
            EditorUserBuildSettings.SwitchActiveBuildTarget(BuildTargetGroup.WebGL, BuildTarget.WebGL);

            // 2. Resolution & Presentation
            // Sangat penting agar Unity tidak freeze saat user klik tombol/search bar di React
            PlayerSettings.runInBackground = true;

            // 3. Publishing Settings
            // Brotli memberikan kompresi terbaik. Decompression Fallback sangat krusial 
            // agar WebGL tetap jalan meskipun server hosting (Vercel/Supabase) belum 
            // di-configure untuk melayani Content-Encoding: br.
            PlayerSettings.WebGL.compressionFormat = WebGLCompressionFormat.Brotli;
            PlayerSettings.WebGL.decompressionFallback = true;
            PlayerSettings.WebGL.dataCaching = true;

            // 4. Optimization — upgraded to High stripping for maximum build size reduction
            // High stripping dapat mengurangi ukuran build hingga 40-60%.
            // PENTING: Jika menggunakan Reflection di C#, gunakan Medium untuk menghindari runtime error.
            PlayerSettings.SetManagedStrippingLevel(NamedBuildTarget.WebGL, ManagedStrippingLevel.High);

            // IL2CPP Master = full optimization, menghasilkan kode native yang lebih kecil dan cepat
            PlayerSettings.SetIl2CppCompilerConfiguration(NamedBuildTarget.WebGL, Il2CppCompilerConfiguration.Master);

            // 5. Exception Handling
            // Matikan exception untuk meningkatkan performa (kecuali sedang debug).
            PlayerSettings.WebGL.exceptionSupport = WebGLExceptionSupport.None;

            // 6. Strip Engine Code — hapus modul Unity yang tidak digunakan
            // Ini dapat sangat mengurangi ukuran .wasm.br
            PlayerSettings.stripEngineCode = true;

            // 7. Color Space — Gamma lebih ringan dari Linear untuk WebGL
            // Ganti ke Linear hanya jika kualitas visual HDR diperlukan
            PlayerSettings.colorSpace = ColorSpace.Gamma;

            // Simpan perubahan setting
            AssetDatabase.SaveAssets();

            Debug.Log("<color=green><b>BERHASIL!</b></color> Pengaturan optimal WebGL telah diterapkan:\n" +
                      "- Run In Background: <b>ON</b>\n" +
                      "- Kompresi: <b>Brotli</b> (dengan Decompression Fallback)\n" +
                      "- Data Caching: <b>ON</b>\n" +
                      "- Managed Stripping Level: <b>High</b> (dari Medium)\n" +
                      "- IL2CPP Configuration: <b>Master</b>\n" +
                      "- Strip Engine Code: <b>ON</b>\n" +
                      "- Color Space: <b>Gamma</b> (lebih ringan dari Linear)\n\n" +
                      "<color=yellow>TIPS:</color> Untuk pengurangan lebih lanjut:\n" +
                      "- Kurangi Max Texture Size ke 512-1024px di Texture Import Settings\n" +
                      "- Gunakan ASTC atau ETC2 compression untuk texture\n" +
                      "- Nonaktifkan modul yang tidak dipakai (Physics 2D, Audio, Video Player)\n" +
                      "- Pertimbangkan Unity Addressables untuk lazy-load asset bundle");
        }

        /// <summary>
        /// Apply texture size limits to reduce data.br file size.
        /// Run this BEFORE building to set all textures to max 1024px.
        /// Estimated reduction: data.br 29MB -> 12-15MB.
        /// </summary>
        [MenuItem("Tools/UPNVJ/Optimize Textures (Max 1024px)")]
        public static void OptimizeTextures()
        {
            Debug.Log("Optimizing textures for WebGL build...");

            string[] textureGuids = AssetDatabase.FindAssets("t:Texture2D", new[] { "Assets" });
            int count = 0;

            foreach (string guid in textureGuids)
            {
                string path = AssetDatabase.GUIDToAssetPath(guid);
                TextureImporter importer = AssetImporter.GetAtPath(path) as TextureImporter;
                if (importer == null) continue;

                TextureImporterPlatformSettings webglSettings = importer.GetPlatformTextureSettings("WebGL");
                bool changed = false;

                // Limit max size to 1024 (reduces data.br by ~50%)
                if (webglSettings.maxTextureSize > 1024)
                {
                    webglSettings.maxTextureSize = 1024;
                    changed = true;
                }

                // Force override and use ASTC compression for WebGL
                if (!webglSettings.overridden || webglSettings.format != TextureImporterFormat.ASTC_6x6)
                {
                    webglSettings.overridden = true;
                    webglSettings.format = TextureImporterFormat.ASTC_6x6;
                    changed = true;
                }

                if (changed)
                {
                    importer.SetPlatformTextureSettings(webglSettings);
                    importer.SaveAndReimport();
                    count++;
                }
            }

            AssetDatabase.SaveAssets();
            Debug.Log($"<color=green><b>SELESAI!</b></color> {count} textures dioptimasi untuk WebGL.\n" +
                      "Estimasi pengurangan ukuran data.br: 50-60%");
        }
    }
}
