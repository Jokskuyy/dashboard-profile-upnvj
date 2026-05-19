using System.Collections.Generic;
using UnityEngine;

[System.Serializable]
public class BuildingData
{
    [Tooltip("Nama tampilan (boleh berubah, untuk debug saja)")]
    public string buildingName;

    [Tooltip("Nama unik yang dikirim dari JavaScript via SendMessage — harus EXACT MATCH dengan unity_object_name di Supabase")]
    public string unityObjectName;

    [Tooltip("GameObject target navigasi di scene")]
    public GameObject buildingObject;
}

public class BuildingDatabase : MonoBehaviour
{
    public List<BuildingData> buildings = new List<BuildingData>();
}