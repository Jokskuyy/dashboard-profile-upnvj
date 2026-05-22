// @vitest-environment jsdom
import { describe, test, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import DeleteConfirmModal from "./DeleteConfirmModal";

afterEach(cleanup);

describe("DeleteConfirmModal Component", () => {
  test("renders nothing when isOpen is false", () => {
    const { container } = render(
      <DeleteConfirmModal
        isOpen={false}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        title="Hapus Gedung"
        message="Apakah Anda yakin?"
      />
    );
    expect(container.firstChild).toBeNull();
  });

  test("renders correctly with title, message, and item name when open", () => {
    render(
      <DeleteConfirmModal
        isOpen={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        title="Hapus Gedung"
        message="Apakah Anda yakin ingin menghapus?"
        itemName="Gedung Rektorat"
      />
    );

    expect(screen.getByText("Hapus Gedung")).toBeDefined();
    expect(screen.getByText("Apakah Anda yakin ingin menghapus?")).toBeDefined();
    expect(screen.getByText("Gedung Rektorat")).toBeDefined();
  });

  test("calls onClose when Batal (Cancel) is clicked", () => {
    const onClose = vi.fn();
    render(
      <DeleteConfirmModal
        isOpen={true}
        onClose={onClose}
        onConfirm={vi.fn()}
        title="Hapus Gedung"
        message="Apakah Anda yakin?"
      />
    );

    const cancelButton = screen.getByText("Batal");
    fireEvent.click(cancelButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("calls onConfirm and shows loading state when Hapus is clicked", async () => {
    const onConfirmResolved = vi.fn().mockImplementation(() => new Promise((r) => setTimeout(r, 50)));
    const onClose = vi.fn();

    render(
      <DeleteConfirmModal
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirmResolved}
        title="Hapus Gedung"
        message="Apakah Anda yakin?"
      />
    );

    const deleteButton = screen.getByRole("button", { name: /Hapus/i });
    fireEvent.click(deleteButton);

    // Should show loading text
    expect(screen.getByText("Menghapus...")).toBeDefined();
    // Buttons should be disabled during loading
    expect(screen.getByText("Batal").hasAttribute("disabled")).toBe(true);
    expect(deleteButton.hasAttribute("disabled")).toBe(true);

    expect(onConfirmResolved).toHaveBeenCalledTimes(1);

    // Wait for the async operation to complete
    await waitFor(() => {
      expect(screen.queryByText("Menghapus...")).toBeNull();
    });
  });

  test("calls onClose when backdrop is clicked", () => {
    const onClose = vi.fn();
    const { container } = render(
      <DeleteConfirmModal
        isOpen={true}
        onClose={onClose}
        onConfirm={vi.fn()}
        title="Hapus Gedung"
        message="Apakah Anda yakin?"
      />
    );

    // The root div is the backdrop
    const backdrop = container.firstChild as HTMLElement;
    fireEvent.click(backdrop);

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
