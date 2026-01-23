# Integrasi Unity dengan Backend API

Panduan lengkap untuk menghubungkan Unity WebGL dengan Backend API Dashboard UPNVJ.

## 📋 Daftar Isi
- [Arsitektur](#arsitektur)
- [Setup Server](#setup-server)
- [API Endpoints](#api-endpoints)
- [Integrasi Unity](#integrasi-unity)
- [Contoh Kode C#](#contoh-kode-c)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

## 🏗️ Arsitektur

```
Unity WebGL
    ↓
HTTP Request (UnityWebRequest)
    ↓
Express API Server (localhost:3001)
    ↓
Supabase Database
```

## 🚀 Setup Server

### 1. Install Dependencies

```bash
npm install
```

Dependency yang dibutuhkan:
- `express` - Web framework untuk Node.js
- `cors` - Enable CORS untuk Unity WebGL
- `dotenv` - Load environment variables
- `@supabase/supabase-js` - Supabase client

### 2. Jalankan API Server

**Opsi 1: Hanya API Server**
```bash
npm run dev:api
```

**Opsi 2: Frontend + API Server (Concurrent)**
```bash
npm run dev:full
```

Server akan berjalan di `http://localhost:3001`

### 3. Verifikasi Server

Buka browser dan akses:
```
http://localhost:3001/api/health
```

Response yang diharapkan:
```json
{
  "success": true,
  "data": {
    "status": "OK",
    "message": "Server is running"
  },
  "timestamp": "2026-01-21T10:30:00.000Z"
}
```

## 📡 API Endpoints

### Base URL
```
http://localhost:3001/api
```

### Endpoints yang Tersedia

#### 1. Health Check
```
GET /api/health
```
Mengecek status server.

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "OK",
    "message": "Server is running"
  },
  "timestamp": "2026-01-21T10:30:00.000Z"
}
```

---

#### 2. Get All Rooms
```
GET /api/rooms
```
Mengambil semua data ruangan dengan informasi gedung.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Ruang Kuliah A101",
      "description": "Ruang kuliah untuk 40 mahasiswa",
      "building": "Gedung A",
      "buildingId": 1,
      "type": "Ruang Kuliah",
      "location": "Lantai 1"
    }
  ],
  "timestamp": "2026-01-21T10:30:00.000Z"
}
```

---

#### 3. Get Room by ID
```
GET /api/rooms/:id
```
Mengambil detail ruangan berdasarkan ID.

**Parameters:**
- `id` (number) - ID ruangan

**Example:**
```
GET /api/rooms/1
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Ruang Kuliah A101",
    "description": "Ruang kuliah untuk 40 mahasiswa",
    "building": "Gedung A",
    "buildingId": 1,
    "type": "Ruang Kuliah",
    "location": "Lantai 1"
  },
  "timestamp": "2026-01-21T10:30:00.000Z"
}
```

---

#### 4. Get All Buildings
```
GET /api/buildings
```
Mengambil semua gedung dengan daftar ruangannya.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Gedung A",
      "description": "Gedung Akademik",
      "location": "Kampus Pusat",
      "rooms": [
        {
          "id": 1,
          "name": "Ruang Kuliah A101",
          "description": "Ruang kuliah untuk 40 mahasiswa",
          "building": "Gedung A",
          "buildingId": 1,
          "type": "Ruang Kuliah"
        }
      ]
    }
  ],
  "timestamp": "2026-01-21T10:30:00.000Z"
}
```

---

#### 5. Get Rooms by Building
```
GET /api/buildings/:id/rooms
```
Mengambil semua ruangan dalam gedung tertentu.

**Parameters:**
- `id` (number) - ID gedung

**Example:**
```
GET /api/buildings/1/rooms
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Ruang Kuliah A101",
      "description": "Ruang kuliah untuk 40 mahasiswa",
      "building": "Gedung A",
      "buildingId": 1,
      "type": "Ruang Kuliah",
      "location": "Lantai 1"
    }
  ],
  "timestamp": "2026-01-21T10:30:00.000Z"
}
```

---

## 🎮 Integrasi Unity

### Setup Unity Project

1. **Import Packages**
   - Pastikan `UnityWebRequest` tersedia (built-in di Unity)
   - Import `Newtonsoft.Json` untuk parsing JSON (atau gunakan JsonUtility)

2. **Build Settings**
   - Platform: WebGL
   - Enable CORS support

### Contoh Kode C#

#### 1. API Manager Class

Buat script baru `APIManager.cs`:

```csharp
using System;
using System.Collections;
using UnityEngine;
using UnityEngine.Networking;

[Serializable]
public class RoomData
{
    public int id;
    public string name;
    public string description;
    public string building;
    public int buildingId;
    public string type;
    public string location;
}

[Serializable]
public class BuildingData
{
    public int id;
    public string name;
    public string description;
    public string location;
    public RoomData[] rooms;
}

[Serializable]
public class APIResponse<T>
{
    public bool success;
    public T data;
    public string timestamp;
}

public class APIManager : MonoBehaviour
{
    private const string BASE_URL = "http://localhost:3001/api";
    
    // Singleton pattern
    public static APIManager Instance { get; private set; }
    
    private void Awake()
    {
        if (Instance == null)
        {
            Instance = this;
            DontDestroyOnLoad(gameObject);
        }
        else
        {
            Destroy(gameObject);
        }
    }
    
    // Get all rooms
    public IEnumerator GetAllRooms(Action<RoomData[]> onSuccess, Action<string> onError)
    {
        string url = $"{BASE_URL}/rooms";
        
        using (UnityWebRequest request = UnityWebRequest.Get(url))
        {
            yield return request.SendWebRequest();
            
            if (request.result == UnityWebRequest.Result.Success)
            {
                try
                {
                    APIResponse<RoomData[]> response = JsonUtility.FromJson<APIResponse<RoomData[]>>(
                        WrapJsonArray(request.downloadHandler.text)
                    );
                    onSuccess?.Invoke(response.data);
                }
                catch (Exception e)
                {
                    onError?.Invoke($"Parse error: {e.Message}");
                }
            }
            else
            {
                onError?.Invoke($"Network error: {request.error}");
            }
        }
    }
    
    // Get room by ID
    public IEnumerator GetRoomById(int roomId, Action<RoomData> onSuccess, Action<string> onError)
    {
        string url = $"{BASE_URL}/rooms/{roomId}";
        
        using (UnityWebRequest request = UnityWebRequest.Get(url))
        {
            yield return request.SendWebRequest();
            
            if (request.result == UnityWebRequest.Result.Success)
            {
                try
                {
                    APIResponse<RoomData> response = JsonUtility.FromJson<APIResponse<RoomData>>(
                        request.downloadHandler.text
                    );
                    onSuccess?.Invoke(response.data);
                }
                catch (Exception e)
                {
                    onError?.Invoke($"Parse error: {e.Message}");
                }
            }
            else
            {
                onError?.Invoke($"Network error: {request.error}");
            }
        }
    }
    
    // Get all buildings
    public IEnumerator GetAllBuildings(Action<BuildingData[]> onSuccess, Action<string> onError)
    {
        string url = $"{BASE_URL}/buildings";
        
        using (UnityWebRequest request = UnityWebRequest.Get(url))
        {
            yield return request.SendWebRequest();
            
            if (request.result == UnityWebRequest.Result.Success)
            {
                try
                {
                    APIResponse<BuildingData[]> response = JsonUtility.FromJson<APIResponse<BuildingData[]>>(
                        WrapJsonArray(request.downloadHandler.text)
                    );
                    onSuccess?.Invoke(response.data);
                }
                catch (Exception e)
                {
                    onError?.Invoke($"Parse error: {e.Message}");
                }
            }
            else
            {
                onError?.Invoke($"Network error: {request.error}");
            }
        }
    }
    
    // Get rooms by building
    public IEnumerator GetRoomsByBuilding(int buildingId, Action<RoomData[]> onSuccess, Action<string> onError)
    {
        string url = $"{BASE_URL}/buildings/{buildingId}/rooms";
        
        using (UnityWebRequest request = UnityWebRequest.Get(url))
        {
            yield return request.SendWebRequest();
            
            if (request.result == UnityWebRequest.Result.Success)
            {
                try
                {
                    APIResponse<RoomData[]> response = JsonUtility.FromJson<APIResponse<RoomData[]>>(
                        WrapJsonArray(request.downloadHandler.text)
                    );
                    onSuccess?.Invoke(response.data);
                }
                catch (Exception e)
                {
                    onError?.Invoke($"Parse error: {e.Message}");
                }
            }
            else
            {
                onError?.Invoke($"Network error: {request.error}");
            }
        }
    }
    
    // Helper method untuk wrap JSON array agar bisa di-parse JsonUtility
    private string WrapJsonArray(string json)
    {
        // JsonUtility tidak support top-level array, jadi perlu di-wrap
        // Ekstrak data array dari response
        int dataStart = json.IndexOf("\"data\":") + 7;
        int dataEnd = json.IndexOf(",\"timestamp\"");
        string dataArray = json.Substring(dataStart, dataEnd - dataStart);
        
        return "{\"data\":" + dataArray + "}";
    }
}
```

#### 2. Example Usage Script

Buat script `RoomController.cs`:

```csharp
using UnityEngine;
using UnityEngine.UI;

public class RoomController : MonoBehaviour
{
    [Header("UI References")]
    public Text roomNameText;
    public Text roomDescriptionText;
    public Text buildingNameText;
    
    [Header("Settings")]
    public int roomIdToLoad = 1;
    
    private void Start()
    {
        LoadRoomData();
    }
    
    private void LoadRoomData()
    {
        StartCoroutine(
            APIManager.Instance.GetRoomById(
                roomIdToLoad,
                OnRoomDataReceived,
                OnError
            )
        );
    }
    
    private void OnRoomDataReceived(RoomData room)
    {
        Debug.Log($"Room loaded: {room.name}");
        
        if (roomNameText != null)
            roomNameText.text = room.name;
            
        if (roomDescriptionText != null)
            roomDescriptionText.text = room.description;
            
        if (buildingNameText != null)
            buildingNameText.text = $"{room.building} - {room.location}";
    }
    
    private void OnError(string error)
    {
        Debug.LogError($"Failed to load room: {error}");
    }
    
    // Method untuk load semua rooms
    public void LoadAllRooms()
    {
        StartCoroutine(
            APIManager.Instance.GetAllRooms(
                OnAllRoomsReceived,
                OnError
            )
        );
    }
    
    private void OnAllRoomsReceived(RoomData[] rooms)
    {
        Debug.Log($"Loaded {rooms.Length} rooms");
        
        foreach (var room in rooms)
        {
            Debug.Log($"- {room.name} ({room.building})");
        }
    }
}
```

#### 3. Building Navigator Script

Buat script untuk navigasi antar gedung:

```csharp
using UnityEngine;
using System.Collections.Generic;

public class BuildingNavigator : MonoBehaviour
{
    [Header("UI")]
    public GameObject buildingButtonPrefab;
    public Transform buildingListContainer;
    
    private List<BuildingData> buildings = new List<BuildingData>();
    
    private void Start()
    {
        LoadBuildings();
    }
    
    private void LoadBuildings()
    {
        StartCoroutine(
            APIManager.Instance.GetAllBuildings(
                OnBuildingsReceived,
                OnError
            )
        );
    }
    
    private void OnBuildingsReceived(BuildingData[] buildingsData)
    {
        buildings.Clear();
        buildings.AddRange(buildingsData);
        
        CreateBuildingButtons();
    }
    
    private void CreateBuildingButtons()
    {
        // Clear existing buttons
        foreach (Transform child in buildingListContainer)
        {
            Destroy(child.gameObject);
        }
        
        // Create button for each building
        foreach (var building in buildings)
        {
            GameObject button = Instantiate(buildingButtonPrefab, buildingListContainer);
            
            // Setup button
            var text = button.GetComponentInChildren<Text>();
            if (text != null)
            {
                text.text = $"{building.name}\n{building.rooms.Length} ruangan";
            }
            
            // Add click event
            int buildingId = building.id; // Local copy for closure
            button.GetComponent<Button>().onClick.AddListener(() => {
                OnBuildingSelected(buildingId);
            });
        }
    }
    
    private void OnBuildingSelected(int buildingId)
    {
        Debug.Log($"Building {buildingId} selected");
        
        StartCoroutine(
            APIManager.Instance.GetRoomsByBuilding(
                buildingId,
                OnBuildingRoomsReceived,
                OnError
            )
        );
    }
    
    private void OnBuildingRoomsReceived(RoomData[] rooms)
    {
        Debug.Log($"Loaded {rooms.Length} rooms for building");
        
        // Display rooms or navigate to them
        foreach (var room in rooms)
        {
            Debug.Log($"- {room.name} ({room.type})");
        }
    }
    
    private void OnError(string error)
    {
        Debug.LogError($"Error: {error}");
    }
}
```

## 🧪 Testing

### 1. Test dengan Browser

Buka browser dan test setiap endpoint:

```bash
# Health check
http://localhost:3001/api/health

# Get all rooms
http://localhost:3001/api/rooms

# Get specific room
http://localhost:3001/api/rooms/1

# Get all buildings
http://localhost:3001/api/buildings

# Get rooms by building
http://localhost:3001/api/buildings/1/rooms
```

### 2. Test dengan Unity

1. Attach `APIManager` script ke GameObject (buat empty GameObject bernama "APIManager")
2. Attach `RoomController` atau `BuildingNavigator` ke GameObject lain
3. Jalankan Unity Editor dengan server API running
4. Check Console untuk log output

### 3. Test dengan Unity WebGL Build

1. Build Unity project sebagai WebGL
2. Pastikan API server running di `localhost:3001`
3. Jalankan WebGL build
4. Buka browser console untuk melihat network requests

## 🔧 Troubleshooting

### CORS Error

**Problem:**
```
Access to XMLHttpRequest at 'http://localhost:3001/api/rooms' from origin 'http://localhost:5173' 
has been blocked by CORS policy
```

**Solution:**
Server sudah menggunakan CORS middleware. Pastikan:
1. Server API berjalan di port 3001
2. CORS enabled di [server/index.js](server/index.js)

### Connection Refused

**Problem:**
```
Network error: Connection refused
```

**Solution:**
1. Pastikan API server running: `npm run dev:api`
2. Check port 3001 tidak digunakan aplikasi lain
3. Verify dengan `http://localhost:3001/api/health`

### JSON Parse Error

**Problem:**
```
Parse error: Unexpected token
```

**Solution:**
1. Check response format dari API
2. Pastikan menggunakan `WrapJsonArray()` untuk array responses
3. Atau gunakan Newtonsoft.Json package untuk Unity

### Supabase Connection Error

**Problem:**
```
Error: Missing Supabase credentials
```

**Solution:**
1. Check file `.env` ada di root project
2. Verify `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` terisi
3. Restart API server setelah update `.env`

### Build URL Different in Production

**Problem:**
API works in editor but not in WebGL build.

**Solution:**
1. Update `BASE_URL` di APIManager.cs sesuai production URL
2. Atau buat config file untuk environment-specific URLs:

```csharp
#if UNITY_EDITOR
    private const string BASE_URL = "http://localhost:3001/api";
#else
    private const string BASE_URL = "https://your-production-api.com/api";
#endif
```

## 📝 Catatan Penting

1. **Security**: API key Supabase yang digunakan adalah `anon` key yang aman untuk public access
2. **Rate Limiting**: Pertimbangkan menambahkan rate limiting di production
3. **Caching**: Implement caching di Unity untuk mengurangi API calls
4. **Error Handling**: Selalu handle error dengan callback `onError`
5. **HTTPS**: Untuk production, gunakan HTTPS untuk API endpoint

## 🎯 Next Steps

1. Implementasi caching di Unity
2. Add loading indicators
3. Implement error retry logic
4. Add authentication jika diperlukan
5. Deploy API server ke cloud (Heroku, Railway, dll)

## 📚 Resources

- [Unity WebRequest Documentation](https://docs.unity3d.com/ScriptReference/Networking.UnityWebRequest.html)
- [Express.js Documentation](https://expressjs.com/)
- [Supabase Documentation](https://supabase.com/docs)
- [CORS Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

---

**Happy Coding! 🚀**
