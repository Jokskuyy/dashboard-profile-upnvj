// @vitest-environment jsdom
import React from "react";
import { afterEach, describe, expect, test, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import SearchOverlay from "./SearchOverlay";

vi.mock("../../contexts/LanguageContext", () => ({
  useLanguage: () => ({ language: "id" }),
}));

vi.mock("../../hooks/useBuildingSearch", () => ({
  useBuildingSearch: (() => {
    const search = (query: string) =>
      query.trim()
        ? [
            {
              label: "Gedung Yos Sudarso",
              type: "gedung",
              unityObjectName: "yos_sudarso",
              buildingId: 9,
            },
          ]
        : [];

    return () => ({
      loading: false,
      error: null,
      allResults: [],
      search,
    });
  })(),
}));

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

async function selectDestination(onCancelNavigation = vi.fn()) {
  const onNavigate = vi.fn();
  render(
    <React.StrictMode>
      <SearchOverlay
        isUnityLoaded
        onNavigate={onNavigate}
        onCancelNavigation={onCancelNavigation}
      />
    </React.StrictMode>,
  );

  fireEvent.change(screen.getByRole("textbox"), {
    target: { value: "Yos Sudarso" },
  });

  const result = await screen.findByText("Gedung Yos Sudarso");
  fireEvent.mouseDown(result);

  await waitFor(() => {
    expect(onNavigate).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Navigasi ke")).toBeDefined();
  });

  return { onCancelNavigation, onNavigate };
}

function dispatchCompletion(detail: string) {
  fireEvent(
    window,
    new CustomEvent<string>("OnNavigationCompleted", { detail }),
  );
}

describe("SearchOverlay navigation completion contract", () => {
  test("menampilkan popup hanya untuk unity_object_name tujuan aktif setelah normalisasi", async () => {
    await selectDestination();

    dispatchCompletion(
      JSON.stringify({ unity_object_name: "  YoS_SuDaRsO  " }),
    );

    expect(screen.getByText("Tiba di Tujuan")).toBeDefined();
    expect(screen.getByText(/Anda telah sampai di/)).toBeDefined();
  });

  test("mengabaikan completion untuk tujuan yang berbeda", async () => {
    await selectDestination();

    dispatchCompletion(
      JSON.stringify({ unity_object_name: "gedung_rektorat" }),
    );

    expect(screen.queryByText("Tiba di Tujuan")).toBeNull();
  });

  test.each([
    ["payload kosong", ""],
    ["JSON tidak valid", "{bukan-json"],
    ["key kosong", JSON.stringify({ unity_object_name: "   " })],
    ["field hilang", JSON.stringify({})],
  ])("mengabaikan %s", async (_label, detail) => {
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    await selectDestination();

    dispatchCompletion(detail);

    expect(screen.queryByText("Tiba di Tujuan")).toBeNull();
  });

  test("mengabaikan event ketika belum ada tujuan yang dipilih", () => {
    render(<SearchOverlay isUnityLoaded />);

    dispatchCompletion(JSON.stringify({ unity_object_name: "yos_sudarso" }));

    expect(screen.queryByText("Tiba di Tujuan")).toBeNull();
  });

  test("cancel tidak memunculkan popup dan navigasi kedua ke tujuan sama tetap bisa selesai", async () => {
    const onCancelNavigation = vi.fn();
    await selectDestination(onCancelNavigation);

    fireEvent.click(screen.getByRole("button", { name: "Batalkan navigasi" }));
    expect(onCancelNavigation).toHaveBeenCalledTimes(1);

    dispatchCompletion(JSON.stringify({ unity_object_name: "yos_sudarso" }));
    expect(screen.queryByText("Tiba di Tujuan")).toBeNull();

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Yos Sudarso" },
    });
    fireEvent.mouseDown(await screen.findByText("Gedung Yos Sudarso"));
    dispatchCompletion(JSON.stringify({ unity_object_name: "yos_sudarso" }));

    expect(screen.getByText("Tiba di Tujuan")).toBeDefined();
  });

  test("tidak kehilangan completion yang datang langsung setelah SendMessage", async () => {
    const onNavigate = vi.fn(() => {
      dispatchCompletion(JSON.stringify({ unity_object_name: "yos_sudarso" }));
    });

    render(
      <SearchOverlay
        isUnityLoaded
        onNavigate={onNavigate}
        onCancelNavigation={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Yos Sudarso" },
    });
    fireEvent.mouseDown(await screen.findByText("Gedung Yos Sudarso"));

    expect(onNavigate).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Tiba di Tujuan")).toBeDefined();
  });

  test("mereset search setelah notifikasi tanpa mengirim cancel ke Unity", async () => {
    const onCancelNavigation = vi.fn();
    await selectDestination(onCancelNavigation);
    vi.useFakeTimers();

    dispatchCompletion(JSON.stringify({ unity_object_name: "yos_sudarso" }));
    expect(screen.getByText("Tiba di Tujuan")).toBeDefined();

    await act(async () => {
      vi.advanceTimersByTime(4000);
    });

    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input.value).toBe("");
    expect(onCancelNavigation).not.toHaveBeenCalled();
  });

  test("melepas seluruh listener completion ketika Strict Mode component di-unmount", () => {
    const addListener = vi.spyOn(window, "addEventListener");
    const removeListener = vi.spyOn(window, "removeEventListener");
    const { unmount } = render(
      <React.StrictMode>
        <SearchOverlay isUnityLoaded />
      </React.StrictMode>,
    );

    unmount();

    const completionAdds = addListener.mock.calls.filter(
      ([eventName]) => eventName === "OnNavigationCompleted",
    );
    const completionRemovals = removeListener.mock.calls.filter(
      ([eventName]) => eventName === "OnNavigationCompleted",
    );
    expect(completionAdds.length).toBeGreaterThan(0);
    expect(completionRemovals).toHaveLength(completionAdds.length);
  });
});
