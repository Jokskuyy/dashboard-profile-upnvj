# Unity WebGL Integration Guide

## 📁 File Structure

```
dashboard-profile-upnvj/
├── public/
│   └── unity-builds/
│       └── downloads/
│           ├── Build/
│           │   ├── Downloads.data.br
│           │   ├── Downloads.framework.js.br
│           │   ├── Downloads.loader.js
│           │   └── Downloads.wasm.br
│           └── TemplateData/
│               └── style.css
├── src/
│   └── components/
│       └── campus-map/
│           ├── CampusMapViewer.tsx      # Full-featured viewer with controls
│           ├── UnityWebGLViewer.tsx     # Reusable Unity WebGL component
│           ├── SimpleUnityDemo.tsx      # Simple example
│           └── index.ts
└── index.html                           # Unity loader script included here
```

## 🚀 Quick Start

### 1. Files Already Copied ✅
Unity WebGL build files from `WebGL/` folder have been copied to `public/unity-builds/downloads/`

### 2. Loader Script Included ✅
The Unity WebGL loader script has been added to `index.html`:
```html
<script src="/unity-builds/downloads/Build/Downloads.loader.js"></script>
```

### 3. Usage Examples

#### A. Using UnityWebGLViewer (Recommended)
```tsx
import { UnityWebGLViewer } from '@/components/campus-map';

function MyComponent() {
  return (
    <UnityWebGLViewer
      buildPath="/unity-builds/downloads/Build"
      buildName="Downloads"
      height="600px"
      companyName="DefaultCompany"
      productName="Proposal"
      productVersion="0.1.0"
      onUnityLoaded={(instance) => {
        console.log('Unity loaded!', instance);
      }}
    />
  );
}
```

#### B. Using CampusMapViewer (Dashboard Integration)
```tsx
import { CampusMapViewer } from '@/components/campus-map';

function Dashboard() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <CampusMapViewer
      isFullscreen={isFullscreen}
      onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
    />
  );
}
```

#### C. Using SimpleUnityDemo (Complete Example)
```tsx
import SimpleUnityDemo from '@/components/campus-map/SimpleUnityDemo';

function App() {
  return <SimpleUnityDemo />;
}
```

## 🔧 Configuration

### Unity Build Settings
When building Unity for WebGL, use these settings:

1. **Compression Format**: Brotli (results in .br files)
2. **Build Location**: Build to `public/unity-builds/downloads/`
3. **Template**: Default WebGL Template

### Custom Configuration
```tsx
const unityConfig = {
  dataUrl: "/path/to/build.data.br",
  frameworkUrl: "/path/to/build.framework.js.br",
  codeUrl: "/path/to/build.wasm.br",
  streamingAssetsUrl: "StreamingAssets",
  companyName: "YourCompany",
  productName: "YourProduct",
  productVersion: "1.0",
  showBanner: (msg: string, type: string) => {
    console.log(`[Unity ${type}]: ${msg}`);
  },
};
```

## 📡 Unity Communication

### Send Messages to Unity (React → Unity)
```tsx
const handleButtonClick = () => {
  if (window.unityInstance) {
    // Send message to Unity
    window.unityInstance.SendMessage(
      'GameObjectName',  // GameObject name in Unity
      'MethodName',      // Public method name
      'parameter'        // Parameter value
    );
  }
};
```

### Example: Camera Control
```tsx
const zoomIn = () => {
  unityInstance?.SendMessage('CameraController', 'ZoomIn');
};

const resetCamera = () => {
  unityInstance?.SendMessage('CameraController', 'ResetView');
};

const goToLocation = (locationId: string) => {
  unityInstance?.SendMessage('MapController', 'GoToLocation', locationId);
};
```

### Receive Messages from Unity (Unity → React)
In your Unity C# script:
```csharp
// Unity C# code
public void SendToReact(string data) {
    Application.ExternalCall("receiveFromUnity", data);
}
```

In React:
```tsx
useEffect(() => {
  window.receiveFromUnity = (data: string) => {
    console.log('Received from Unity:', data);
    // Handle data from Unity
  };

  return () => {
    delete window.receiveFromUnity;
  };
}, []);
```

## 🎮 Controls

### Built-in Controls
- **Mouse Drag**: Rotate/Pan camera
- **Mouse Scroll**: Zoom in/out
- **Fullscreen Button**: Toggle fullscreen mode
- **Reload Button**: Restart Unity instance

### Custom Controls
You can add custom controls by sending messages to Unity:

```tsx
<div className="controls">
  <button onClick={() => unityInstance?.SendMessage('Player', 'MoveForward')}>
    Move Forward
  </button>
  <button onClick={() => unityInstance?.SendMessage('Player', 'MoveBackward')}>
    Move Backward
  </button>
  <button onClick={() => unityInstance?.SendMessage('Camera', 'ResetPosition')}>
    Reset Camera
  </button>
</div>
```

## 🐛 Troubleshooting

### Issue: Unity Not Loading
**Solution:**
1. Check browser console for errors
2. Verify files exist in `/public/unity-builds/downloads/Build/`
3. Check if loader script is loaded in index.html
4. Try clearing browser cache

### Issue: Black Screen
**Solution:**
1. Wait for loading to complete (check progress bar)
2. Check browser console for WebGL errors
3. Verify browser supports WebGL 2.0
4. Check GPU/graphics driver compatibility

### Issue: Slow Loading
**Solution:**
1. Files are Brotli compressed (.br) - ensure server supports Brotli
2. Consider using CDN for faster delivery
3. Optimize Unity build size in Unity Editor

### Issue: Communication Not Working
**Solution:**
1. Ensure Unity instance is fully loaded before sending messages
2. Verify GameObject names match exactly (case-sensitive)
3. Check method names in Unity C# scripts
4. Use try-catch blocks around SendMessage calls

## 📊 Performance Tips

1. **Loading Optimization**
   - Use Brotli compression (.br files)
   - Enable streaming asset loading
   - Show progress bar during load

2. **Runtime Optimization**
   - Limit canvas size for better performance
   - Use mobile-optimized builds for mobile devices
   - Implement quality settings toggle

3. **Memory Management**
   - Always call `unityInstance.Quit()` on unmount
   - Avoid creating multiple instances simultaneously
   - Monitor memory usage in production

## 🌐 Server Configuration

### Vite (Development)
Already configured - no changes needed!

### Production Server
Ensure your server supports:
- Brotli compression (.br files)
- Proper MIME types for .data, .wasm, .js files
- CORS headers if loading from different domain

### Nginx Example
```nginx
location /unity-builds/ {
    # Enable Brotli
    brotli on;
    brotli_types application/octet-stream application/wasm;
    
    # MIME types
    types {
        application/octet-stream data;
        application/wasm wasm;
        application/javascript js;
    }
    
    # Cache control
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## 📱 Mobile Support

The viewer automatically adapts for mobile devices:
```tsx
// Automatically detected
if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
  // Mobile optimizations applied
  // Touch controls enabled
  // Responsive canvas sizing
}
```

## 🔐 Security Considerations

1. **Content Security Policy**: Add Unity domains to CSP if needed
2. **CORS**: Ensure proper CORS headers for cross-origin resources
3. **Input Validation**: Validate data sent between React and Unity
4. **XSS Protection**: Sanitize any user input sent to Unity

## 📝 Next Steps

1. **Test the Integration**
   ```bash
   npm run dev
   ```
   Navigate to the campus map section

2. **Customize UI**
   - Modify `CampusMapViewer.tsx` for custom controls
   - Add your branding and styling
   - Implement custom loading screens

3. **Add Interactivity**
   - Implement building info popups
   - Add navigation waypoints
   - Create interactive tours

4. **Deploy**
   - Build for production: `npm run build`
   - Test on target servers
   - Monitor performance and errors

## 📚 Resources

- [Unity WebGL Documentation](https://docs.unity3d.com/Manual/webgl.html)
- [React + Unity Best Practices](https://docs.unity3d.com/Manual/webgl-interactingwithbrowserscripting.html)
- [WebGL Browser Compatibility](https://caniuse.com/webgl2)

## 🤝 Support

If you encounter issues:
1. Check browser console for errors
2. Review Unity build settings
3. Test in different browsers
4. Check network tab for failed resources

---

**Status**: ✅ Integration Complete
**Last Updated**: November 6, 2025
**Version**: 1.0.0
