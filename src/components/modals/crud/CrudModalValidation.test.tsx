// @vitest-environment jsdom
import { afterEach, describe, expect, test, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import BuildingModal from "./BuildingModal";
import FacilityModal from "./FacilityModal";
import ProgramModal from "./ProgramModal";

vi.mock("../../../lib/supabase", () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      })),
    })),
  },
}));

afterEach(() => {
  cleanup();
  document.body.style.overflow = "unset";
});

describe("CRUD modal required-field validation", () => {
  test("menampilkan warning nama gedung di bawah field dan menghapusnya saat diisi", () => {
    render(
      <BuildingModal
        isOpen
        onClose={vi.fn()}
        onSave={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Simpan" }));

    expect(screen.getByText("Nama gedung wajib diisi")).toBeDefined();
    const nameInput = screen.getByLabelText(/Nama Gedung/);
    expect(nameInput.getAttribute("aria-invalid")).toBe("true");

    fireEvent.change(nameInput, { target: { value: "Gedung Rektorat" } });

    expect(screen.queryByText("Nama gedung wajib diisi")).toBeNull();
    expect(nameInput.getAttribute("aria-invalid")).toBe("false");
  });

  test("menampilkan warning nama fasilitas dan gedung secara bersamaan", async () => {
    render(
      <FacilityModal
        isOpen
        onClose={vi.fn()}
        onSave={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Simpan" }));

    expect(screen.getByText("Nama fasilitas wajib diisi")).toBeDefined();
    expect(screen.getByText("Gedung wajib dipilih")).toBeDefined();

    fireEvent.change(screen.getByLabelText(/Nama Fasilitas/), {
      target: { value: "Laboratorium Komputer" },
    });

    await waitFor(() => {
      expect(screen.queryByText("Nama fasilitas wajib diisi")).toBeNull();
    });
  });

  test("menampilkan warning nama program studi dan fakultas secara bersamaan", () => {
    render(
      <ProgramModal
        isOpen
        onClose={vi.fn()}
        onSave={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Simpan" }));

    expect(screen.getByText("Nama program studi wajib diisi")).toBeDefined();
    expect(screen.getByText("Fakultas wajib dipilih")).toBeDefined();

    fireEvent.change(screen.getByLabelText(/Nama Program Studi/), {
      target: { value: "Teknik Informatika" },
    });

    expect(screen.queryByText("Nama program studi wajib diisi")).toBeNull();
  });
});
