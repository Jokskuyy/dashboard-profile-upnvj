# Unity WebGL Campus Map Integration

This document explains how to integrate your Unity APK campus map into the web dashboard as a WebGL build.

## 📁 Current Status

Currently you have: `src/denah/denah.apk` - Unity Android build
What we need: Unity WebGL build files

## 🔄 Conversion Process

### Step 1: Unity Editor Setup

1. Open your Unity project that generates `denah.apk`
2. Go to **File → Build Settings**
3. Select **WebGL** platform
4. Click **Switch Platform**

### Step 2: WebGL Build Settings

1. In Build Settings, click **Player Settings**
2. Configure WebGL settings:
   - **Company Name**: UPN Veteran Jakarta
   - **Product Name**: Campus Map
   - **Resolution**: 1920 x 1080 (or auto)
   - **WebGL Template**: Default or Custom
   - **Compression Format**: Gzip (recommended)

### Step 3: Build for WebGL

1. Create output folder (e.g., `WebGL_Build`)
2. Click **Build** in Build Settings
3. Wait for build to complete (may take several minutes)

### Step 4: Deploy Build Files

After building, you'll get these files:

```
WebGL_Build/
├── Build/
│   ├── denah.data
│   ├── denah.framework.js
│   ├── denah.loader.js
│   └── denah.wasm
├── StreamingAssets/ (if any)
└── index.html
```

Copy the `Build` folder contents to:

```
public/unity-builds/denah/Build/
├── denah.data
├── denah.framework.js
├── denah.loader.js
└── denah.wasm
```

## 🚀 Integration Features

Once WebGL build is deployed, the dashboard will support:

### Interactive Controls

- **Mouse Navigation**: Click and drag to move camera
- **Zoom**: Mouse wheel to zoom in/out
- **Reset View**: Button to return to default view
- **Fullscreen**: Toggle fullscreen mode

### React Integration

- Embedded directly in dashboard
- Loading progress indicator
- Error handling with helpful messages
- Responsive design (desktop/mobile)

### Component Structure

```
CampusMapSection.tsx
├── CampusMapViewer.tsx (Unity WebGL wrapper)
├── Loading states
├── Error handling
└── Controls (zoom, reset, fullscreen)
```

## 🛠️ Unity Script Requirements

For optimal integration, add these methods to your Unity camera controller:

```csharp
// Camera Controller Script
public class CameraController : MonoBehaviour
{
    [System.Runtime.InteropServices.DllImport("__Internal")]
    private static extern void UnityToReact(string message);

    public void ResetView()
    {
        // Reset camera to default position/rotation
        transform.position = defaultPosition;
        transform.rotation = defaultRotation;
    }

    public void ZoomIn()
    {
        // Implement zoom in logic
        Camera.main.fieldOfView = Mathf.Max(Camera.main.fieldOfView - 5, 10);
    }

    public void ZoomOut()
    {
        // Implement zoom out logic
        Camera.main.fieldOfView = Mathf.Min(Camera.main.fieldOfView + 5, 60);
    }

    public void GoHome()
    {
        // Go to main campus view
        transform.position = homePosition;
        transform.rotation = homeRotation;
    }
}
```

## 📱 Mobile Considerations

The WebGL build will automatically adapt for mobile devices:

- Touch controls for navigation
- Responsive canvas sizing
- Optimized rendering for mobile browsers

## 🎯 Expected File Structure

After setup completion:

```
dashboard-profile-upnvj/
├── public/
│   └── unity-builds/
│       └── denah/
│           ├── Build/
│           │   ├── denah.data        (Game data)
│           │   ├── denah.framework.js (Unity framework)
│           │   ├── denah.loader.js   (Unity loader)
│           │   └── denah.wasm        (WebAssembly code)
│           └── index.html           (Standalone viewer)
├── src/
│   └── components/
│       ├── CampusMapSection.tsx     (Main component)
│       └── CampusMapViewer.tsx      (Unity WebGL wrapper)
└── README_UNITY_SETUP.md           (This file)
```

## 🔍 Testing

1. **Local Development**: Run `npm run dev` and navigate to campus map section
2. **Build Check**: Ensure all Unity files load without 404 errors
3. **Interactive Test**: Verify mouse/touch controls work
4. **Performance**: Check loading times and frame rates

## 📞 Troubleshooting

### Common Issues:

**404 Errors**:

- Verify Build folder path is correct
- Check file names match exactly (case-sensitive)

**Loading Failures**:

- Ensure WebGL build targets compatible browser versions
- Check browser console for specific error messages

**Performance Issues**:

- Consider reducing Unity build size
- Optimize textures and models for web
- Use Unity's WebGL optimization settings

## 📋 Next Steps

1. Convert `denah.apk` to WebGL build in Unity
2. Copy build files to specified directories
3. Test integration in development server
4. Optimize performance if needed
5. Deploy to production

---

**Note**: The current dashboard already includes the React components and UI integration. You only need to provide the Unity WebGL build files to complete the setup.
