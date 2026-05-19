using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;
using UnityEngine.UI;
using System.Text.RegularExpressions;
using UnityEngine.InputSystem;

public class BuildingSearch : MonoBehaviour
{
    [Header("Reference")]
    public BuildingDatabase database;
    public TMP_InputField inputField;

    [Header("UI Result")]
    public GameObject resultPrefab;
    public Transform resultParent;
    public GameObject dropdownPanel;

    [Header("Placeholder")]
    public GameObject placeholderObject;

    [Header("Navigation")]
    public NavigationGuide navigationGuide;

    [Header("Player Control")]
    public MonoBehaviour playerMovement; 

    [Header("Settings")]
    public float searchDelay = 1.0f;

    private Coroutine searchCoroutine;
    private bool isSelectingResult = false;

    void Start()
    {
        inputField.onValueChanged.AddListener(OnSearchChanged);
        inputField.onSelect.AddListener(OnInputSelected);
        inputField.onDeselect.AddListener(OnInputDeselected);
        inputField.onSubmit.AddListener(OnInputSubmit);

        if (dropdownPanel != null)
            dropdownPanel.SetActive(false);

        HideCursor();
        UpdatePlaceholder();
    }

    void Update()
    {
        if (Keyboard.current != null)
        {
            if ((Keyboard.current.enterKey.wasPressedThisFrame || Keyboard.current.numpadEnterKey.wasPressedThisFrame) 
                && !inputField.isFocused)
            {
                inputField.ActivateInputField();
            }
        }
    }

    private void ShowCursor()
    {
        Cursor.visible = true;
        Cursor.lockState = CursorLockMode.None;
    }

    private void HideCursor()
    {
        Cursor.visible = false;
        Cursor.lockState = CursorLockMode.Locked;
    }

    // ================== PLACEHOLDER CONTROL ==================
    private void UpdatePlaceholder()
    {
        if (placeholderObject != null)
        {
            bool showPlaceholder = !inputField.isFocused && string.IsNullOrEmpty(inputField.text);
            placeholderObject.SetActive(showPlaceholder);
        }
    }

    void OnInputSelected(string text)
    {
        ShowCursor();
        if (playerMovement != null)
            playerMovement.enabled = false;

        UpdatePlaceholder();
        inputField.placeholder.gameObject.SetActive(false);
    }

    void OnInputDeselected(string text)
    {
        if (string.IsNullOrEmpty(inputField.text))
        {
            HideCursor();
            if (playerMovement != null)
                playerMovement.enabled = true;
            inputField.DeactivateInputField();
        }
        else
        {
            ShowCursor();
            if (playerMovement != null)
                playerMovement.enabled = false;
        }

        UpdatePlaceholder();
        
        if (inputField.placeholder != null)
            inputField.placeholder.gameObject.SetActive(string.IsNullOrEmpty(inputField.text) && !inputField.isFocused);
    }

    void OnInputSubmit(string text)
    {
        if (string.IsNullOrWhiteSpace(text) || isSelectingResult)
            return;

        string cleanInput = CleanString(text);

        foreach (var building in database.buildings)
        {
            if (CleanString(building.buildingName).Contains(cleanInput))
            {
                inputField.text = building.buildingName;
                dropdownPanel.SetActive(false);
                inputField.DeactivateInputField();

                if (playerMovement != null)
                    playerMovement.enabled = true;

                if (navigationGuide != null)
                    navigationGuide.StartNavigation(building.buildingObject.transform, building.buildingName);  // Updated

                HideCursor();
                StartCoroutine(ResetSelectionFlag());
                return;
            }
        }

        ShowResults(text);
    }

    void OnSearchChanged(string text)
    {
        if (isSelectingResult) return;

        UpdatePlaceholder();

        if (searchCoroutine != null)
            StopCoroutine(searchCoroutine);

        searchCoroutine = StartCoroutine(DelayedSearch(text));
    }

    IEnumerator DelayedSearch(string text)
    {
        yield return new WaitForSeconds(searchDelay);
        ShowResults(text);
    }

    void ShowResults(string text)
    {
        if (database == null || resultParent == null || resultPrefab == null || dropdownPanel == null)
        {
            Debug.LogError("Ada yang belum di-assign di Inspector!");
            return;
        }

        string cleanInput = CleanString(text);

        foreach (Transform child in resultParent)
            Destroy(child.gameObject);

        if (string.IsNullOrEmpty(cleanInput))
        {
            dropdownPanel.SetActive(false);
            return;
        }

        bool foundAny = false;

        foreach (var building in database.buildings)
        {
            string cleanName = CleanString(building.buildingName);

            if (cleanName.Contains(cleanInput))
            {
                foundAny = true;

                GameObject item = Instantiate(resultPrefab, resultParent);

                TMP_Text textComp = item.GetComponentInChildren<TMP_Text>();
                if (textComp != null)
                    textComp.text = building.buildingName;

                Button btn = item.GetComponent<Button>();
                if (btn != null)
                {
                    btn.onClick.AddListener(() =>
                    {
                        isSelectingResult = true;

                        inputField.text = building.buildingName;
                        dropdownPanel.SetActive(false);
                        inputField.DeactivateInputField();

                        if (playerMovement != null)
                            playerMovement.enabled = true;

                        if (navigationGuide != null)
                            navigationGuide.StartNavigation(building.buildingObject.transform, building.buildingName);  // Updated

                        HideCursor();
                        StartCoroutine(ResetSelectionFlag());
                    });
                }
            }
        }

        if (!foundAny)
        {
            GameObject item = Instantiate(resultPrefab, resultParent);

            TMP_Text textComp = item.GetComponentInChildren<TMP_Text>();
            if (textComp != null)
                textComp.text = "\"" + text + "\" tidak dapat ditemukan";

            Button btn = item.GetComponent<Button>();
            if (btn != null)
                btn.interactable = false;
        }

        dropdownPanel.SetActive(true);
    }

    IEnumerator ResetSelectionFlag()
    {
        yield return null;
        isSelectingResult = false;
    }

    string CleanString(string input)
    {
        input = input.ToLower();
        return Regex.Replace(input, "[^a-z0-9]", "");
    }
}