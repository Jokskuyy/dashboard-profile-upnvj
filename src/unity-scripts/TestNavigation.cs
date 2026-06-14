// TestNavigation.cs — hapus setelah testing
using UnityEngine;
using UnityEngine.InputSystem;  // ← pakai ini, bukan UnityEngine.Input

public class TestNavigation : MonoBehaviour
{
    public NavigationReceiver receiver;

    void Update()
    {
        if (Keyboard.current != null && Keyboard.current.tKey.wasPressedThisFrame)
        {
            receiver.NavigateTo("Gedung Rektorat"); // ganti dengan nama gedung yang ada
        }
    }
}
