export interface TranslationEngine {
  translate(
    language: string,
    key: string,
    params?: Record<string, string | number>
  ): string;
  getAvailableLanguages(): string[];
}

export class InMemoryTranslationEngine implements TranslationEngine {
  readonly translations: Record<string, Record<string, unknown>>;

  constructor(
    translations: Record<string, Record<string, unknown>>
  ) {
    this.translations = translations;
  }

  translate(
    language: string,
    key: string,
    params?: Record<string, string | number>
  ): string {
    const keys = key.split(".");

    // 1. Try to find the translation in the specified language
    let value: unknown = this.translations[language];
    let found = true;

    for (const k of keys) {
      if (value && typeof value === "object") {
        value = (value as Record<string, unknown>)[k];
      } else {
        found = false;
        break;
      }
    }

    // 2. If not found and language is not 'id', try fallback to 'id'
    if ((!found || typeof value !== "string") && language !== "id") {
      value = this.translations["id"];
      found = true;
      for (const k of keys) {
        if (value && typeof value === "object") {
          value = (value as Record<string, unknown>)[k];
        } else {
          found = false;
          break;
        }
      }
    }

    // 3. If translation is found and is a string, do interpolation if params exist
    if (found && typeof value === "string") {
      let result = value;
      if (params) {
        for (const [paramKey, paramVal] of Object.entries(params)) {
          result = result.replace(
            new RegExp(`\\{${paramKey}\\}`, "g"),
            String(paramVal)
          );
        }
      }
      return result;
    }

    return key;
  }

  getAvailableLanguages(): string[] {
    return Object.keys(this.translations);
  }
}
