using UnityEngine;

public class WebPlatformSync : MonoBehaviour
{
    [Tooltip("Drag the Joystick GameObject (e.g. Floating Joystick) here")]
    public GameObject joystickUI;

    // This method is called from React via SendMessage
    public void SetDevice(string deviceType)
    {
        if (joystickUI != null)
        {
            if (deviceType == "desktop")
            {
                joystickUI.SetActive(false);
                Debug.Log("WebPlatformSync: Desktop detected, hiding joystick.");
            }
            else if (deviceType == "mobile")
            {
                joystickUI.SetActive(true);
                Debug.Log("WebPlatformSync: Mobile detected, showing joystick.");
            }
        }
        else
        {
            Debug.LogWarning("WebPlatformSync: Joystick UI is not assigned in the inspector!");
        }
    }
}
