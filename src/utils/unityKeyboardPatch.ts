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

console.log("[UnityKeyboardPatch] Installed — intercepting keyboard/mouse events on document & window");

export {};
