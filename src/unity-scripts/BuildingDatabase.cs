using System.Collections.Generic;
using UnityEngine;

/// <summary>
/// Daftar gedung yang terdaftar di sistem navigasi.
/// Unity akan otomatis mencari GameObject berdasarkan unityObjectName di scene —
/// tidak perlu drag-drop manual di Inspector.
/// </summary>
public class BuildingDatabase : MonoBehaviour
{
    [Tooltip("Daftar unityObjectName — harus EXACT MATCH dengan nama GameObject di Hierarchy DAN unity_object_name di Supabase")]
    public List<string> unityObjectNames = new List<string>();
}