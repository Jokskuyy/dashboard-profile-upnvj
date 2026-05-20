/**
 * Unity WebGL Keyboard & Mouse Patch
 *
 * Monkey-patches EventTarget.prototype.addEventListener on document and window
 * to intercept keyboard and mouse events registered by Unity's framework.
 * When an HTML input element is focused, these events are suppressed so that
 * typing works normally in the React overlay.
 *
 * MUST be imported at the module level BEFORE Unity's framework loads.
 */

const INTERCEPTED_KEYBOARD = [
  "keydown",
  "keyup",
  "keypress",
];

const INTERCEPTED_MOUSE = [
  "mousedown",
  "mouseup",
  "mousemove",
  "wheel",
  "contextmenu",
  "pointerdown",
  "pointerup",
  "pointermove",
];

const ALL_INTERCEPTED = [...INTERCEPTED_KEYBOARD, ...INTERCEPTED_MOUSE];

function isHtmlInputFocused(): boolean {
  const el = document.activeElement;
  return (
    el instanceof HTMLInputElement ||
    el instanceof HTMLTextAreaElement ||
    el instanceof HTMLSelectElement ||
    (el !== null && (el as HTMLElement).isContentEditable === true)
  );
}

const originalAddEventListener = EventTarget.prototype.addEventListener;

EventTarget.prototype.addEventListener = function (
  this: EventTarget,
  type: string,
  listener: EventListenerOrEventListenerObject | null,
  options?: boolean | AddEventListenerOptions
) {
  // Only intercept on document and window (where Unity registers its listeners)
  if (
    (this === document || this === window) &&
    ALL_INTERCEPTED.includes(type)
  ) {
    const wrappedListener = function (this: EventTarget, event: Event) {
      if (isHtmlInputFocused()) {
        // Block the event from reaching Unity
        return;
      }
      if (typeof listener === "function") {
        listener.call(this, event);
      } else if (listener && typeof listener.handleEvent === "function") {
        listener.handleEvent(event);
      }
    };

    return originalAddEventListener.call(this, type, wrappedListener, options);
  }

  return originalAddEventListener.call(this, type, listener, options);
};

// Mark as patched for debugging
(document.addEventListener as any).__patched = true;

/**
 * Pointer Lock Patch
 *
 * Unity WebGL calls canvas.requestPointerLock() automatically when
 * Cursor.lockState = CursorLockMode.Locked is set in C# code.
 * Browsers require this to happen inside a user gesture (click/keydown).
 * If Unity calls it outside a gesture (e.g. on scene load, or via
 * SendMessage), the browser throws NotAllowedError.
 *
 * This patch wraps requestPointerLock to silently ignore the error
 * since the campus map doesn't need FPS-style cursor locking.
 */
const originalRequestPointerLock = HTMLElement.prototype.requestPointerLock;

HTMLElement.prototype.requestPointerLock = function (
  this: HTMLElement,
  ...args: any[]
): Promise<void> {
  try {
    const result = originalRequestPointerLock.apply(this, args as any);
    // requestPointerLock may return a Promise in modern browsers
    if (result && typeof (result as any).catch === "function") {
      return (result as any).catch((err: Error) => {
        if (err.name === "NotAllowedError") {
          // Silently ignore — not triggered by user gesture
          return;
        }
        console.warn("[PointerLockPatch] Unexpected error:", err);
      });
    }
    return result || Promise.resolve();
  } catch (err: any) {
    if (err?.name === "NotAllowedError") {
      // Silently ignore
      return Promise.resolve();
    }
    throw err;
  }
};

console.log("[UnityKeyboardPatch] Installed — intercepting keyboard/mouse events on document & window");
console.log("[PointerLockPatch] Installed — suppressing non-gesture pointer lock errors");

export {};
