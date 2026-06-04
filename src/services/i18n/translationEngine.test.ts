import { describe, test, expect } from "vitest";
import { InMemoryTranslationEngine } from "./translationEngine";

describe("InMemoryTranslationEngine", () => {
  const dummyTranslations = {
    id: {
      welcome: "Selamat datang!",
      profile: {
        title: "Profil Pengguna",
        greeting: "Halo {name}!",
      },
      common: {
        items: "Kapasitas {count} ruangan",
      },
    },
    en: {
      welcome: "Welcome!",
      profile: {
        title: "User Profile",
        // missing greeting to test fallback
      },
    },
  };

  const engine = new InMemoryTranslationEngine(dummyTranslations);

  test("translates standard top-level key", () => {
    expect(engine.translate("id", "welcome")).toBe("Selamat datang!");
    expect(engine.translate("en", "welcome")).toBe("Welcome!");
  });

  test("translates nested dot-notation keys", () => {
    expect(engine.translate("id", "profile.title")).toBe("Profil Pengguna");
    expect(engine.translate("en", "profile.title")).toBe("User Profile");
  });

  test("falls back to default 'id' language when key is missing in target language", () => {
    // profile.greeting missing in 'en' -> falls back to 'id'
    expect(engine.translate("en", "profile.greeting", { name: "Iman" })).toBe("Halo Iman!");
  });

  test("handles interpolation parameters", () => {
    expect(engine.translate("id", "profile.greeting", { name: "Andi" })).toBe("Halo Andi!");
    expect(engine.translate("id", "common.items", { count: 12 })).toBe("Kapasitas 12 ruangan");
  });

  test("returns key if not found in any language", () => {
    expect(engine.translate("id", "nonexistent.key")).toBe("nonexistent.key");
    expect(engine.translate("en", "nonexistent.key")).toBe("nonexistent.key");
  });

  test("returns available languages list", () => {
    expect(engine.getAvailableLanguages()).toEqual(["id", "en"]);
  });
});
