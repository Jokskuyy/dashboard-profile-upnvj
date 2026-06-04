import { translations } from "../../utils/translations";
import { InMemoryTranslationEngine } from "./translationEngine";

export const translationEngine = new InMemoryTranslationEngine(translations);

export type { TranslationEngine } from "./translationEngine";
