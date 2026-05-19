using System.Collections.Generic;
using UnityEngine;

[System.Serializable]
public class BuildingData
{
    public string buildingName;
    public GameObject buildingObject;
}

public class BuildingDatabase : MonoBehaviour
{
    public List<BuildingData> buildings = new List<BuildingData>();
}