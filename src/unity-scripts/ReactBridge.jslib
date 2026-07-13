mergeInto(LibraryManager.library, {
  DispatchReactEvent__deps: ['$UTF8ToString'],
  DispatchReactEvent: function (eventName, eventData) {
    var eventNameStr = UTF8ToString(eventName);
    var eventDataStr = UTF8ToString(eventData);
    try {
      window.dispatchEvent(new CustomEvent(eventNameStr, { detail: eventDataStr }));
    } catch (e) {
      console.error("Failed to dispatch event: " + eventNameStr, e);
    }
  }
});
