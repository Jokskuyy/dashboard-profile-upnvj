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

            // 4. Optimization
            // Gunakan stripping Medium untuk memperkecil ukuran build WebGL.
            PlayerSettings.SetManagedStrippingLevel(NamedBuildTarget.WebGL, ManagedStrippingLevel.Medium);
            PlayerSettings.SetIl2CppCompilerConfiguration(NamedBuildTarget.WebGL, Il2CppCompilerConfiguration.Master);

            // 5. Exception Handling
            // Matikan exception untuk meningkatkan performa (kecuali sedang debug).
            PlayerSettings.WebGL.exceptionSupport = WebGLExceptionSupport.None;

            // Simpan perubahan setting
            AssetDatabase.SaveAssets();

            Debug.Log("<color=green><b>BERHASIL!</b></color> Pengaturan optimal WebGL telah diterapkan:\n" +
                      "- Run In Background: <b>ON</b>\n" +
                      "- Kompresi: <b>Brotli</b> (dengan Decompression Fallback)\n" +
                      "- Data Caching: <b>ON</b>\n" +
                      "- Stripping Level: <b>Medium</b>");
        }
    }
}
