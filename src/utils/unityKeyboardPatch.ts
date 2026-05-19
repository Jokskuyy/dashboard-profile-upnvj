/**
 * Unity WebGL Input Patch
 *
 * Unity WebGL (Emscripten + Input System) memasang keyboard DAN mouse
 * event listeners di document/window level. Patch ini membungkus
 * EventTarget.prototype.addEventListener sehingga semua listeners
 * untuk keyboard & mouse events pada document/window bisa di-intercept.
 *
 * Saat #campus-search-input fokus, SEMUA Unity input handlers dilewati
 * (keyboard + mouse), sehingga:
 * - User bisa mengetik di search bar tanpa karakter "dicuri" Unity
 * - Kamera Unity tidak bergerak mengikuti mouse
 *
 * PENTING: Harus di-install SEBELUM Unity framework.js di-load.
 */

const SEARCH_INPUT_ID = "campus-search-input";

const KEYBOARD_EVENTS = ["keydown", "keyup", "keypress"];
const MOUSE_EVENTS = [
  "mousemove",
  "mousedown",
  "mouseup",
  "wheel",
  "contextmenu",
  "pointerdown",
  "pointermove",
  "pointerup",
  "pointerrawupdate",
];
const ALL_BLOCKED_EVENTS = [...KEYBOARD_EVENTS, ...MOUSE_EVENTS];

let installed = false;

/** Cek apakah search input sedang fokus */
function isSearchInputFocused(): boolean {
  const active = document.activeElement;
  return active instanceof HTMLElement && active.id === SEARCH_INPUT_ID;
}

export function installUnityKeyboardPatch(): void {
  if (installed) return;
  installed = true;

  const origAddEventListener = EventTarget.prototype.addEventListener;

  EventTarget.prototype.addEventListener = function (
    this: EventTarget,
    type: string,
    listener: EventListenerOrEventListenerObject | null,
    options?: boolean | AddEventListenerOptions
  ): void {
    // Hanya wrap events pada document dan window
    if (
      (this === document || this === window) &&
      ALL_BLOCKED_EVENTS.includes(type) &&
      typeof listener === "function"
    ) {
      const origListener = listener;
      const wrappedListener = function (this: EventTarget, event: Event): void {
        if (isSearchInputFocused()) {
          return; // Skip Unity handler saat search input fokus
        }
        origListener.call(this, event);
      };
      origAddEventListener.call(this, type, wrappedListener, options);
      return;
    }

    origAddEventListener.call(this, type, listener, options);
  };
}
