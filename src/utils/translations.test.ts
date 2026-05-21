import { describe, test, expect } from "vitest";
import { getTranslation, translations } from "./translations";

describe("getTranslation Utility", () => {
  test("translates standard key", () => {
    expect(getTranslation("id", "dashboard")).toBe("Dashboard");
    expect(getTranslation("en", "dashboard")).toBe("Dashboard");
  });

  test("translates nested key", () => {
    expect(getTranslation("id", "footer.phoneLabel")).toBe("Telepon");
    expect(getTranslation("en", "footer.phoneLabel")).toBe("Phone");
  });

  test("returns key if not found in any language", () => {
    expect(getTranslation("id", "nonexistent.key")).toBe("nonexistent.key");
    expect(getTranslation("en", "nonexistent.key")).toBe("nonexistent.key");
  });

  test("falls back to default language ('id') if key is missing in target language", () => {
    // Add custom test keys directly to translations
    (translations.id as any).testOnlyKey = "Indonesian Only Value";
    // Ensure it's not present in 'en'
    delete (translations.en as any).testOnlyKey;

    expect(getTranslation("en", "testOnlyKey")).toBe("Indonesian Only Value");
  });

  test("interpolates parameters in translation strings", () => {
    (translations.id as any).testInterpolation = "Halo {name}, selamat datang di {campus}!";
    (translations.en as any).testInterpolation = "Hello {name}, welcome to {campus}!";

    expect(
      getTranslation("id", "testInterpolation", { name: "Iman", campus: "UPNVJ" })
    ).toBe("Halo Iman, selamat datang di UPNVJ!");

    expect(
      getTranslation("en", "testInterpolation", { name: "Iman", campus: "UPNVJ" })
    ).toBe("Hello Iman, welcome to UPNVJ!");
  });

  test("handles numeric parameters in interpolation", () => {
    (translations.id as any).testNumber = "Kapasitas: {count} orang";
    expect(getTranslation("id", "testNumber", { count: 50 })).toBe("Kapasitas: 50 orang");
  });

  test("leaves unresolved placeholders intact", () => {
    (translations.id as any).testUnresolved = "Halo {name} dan {friend}!";
    expect(getTranslation("id", "testUnresolved", { name: "Iman" })).toBe("Halo Iman dan {friend}!");
  });
});
