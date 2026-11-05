class EyeTrackerLogger {
  constructor() {
    this.events = [];
    this.sessionStartTime = Date.now();
    this.currentFloor = 0;
    this.currentScreen = "ekran_plan";

    this.initGlobalListeners();
    this.logScreenEntry("ekran_plan");
  }

  setFloor(floor) {
    this.currentFloor = floor;
    this.logEvent("FLOOR_CHANGE", null, { floor: floor });
  }

  setScreen(screenName) {
    this.currentScreen = screenName;
    this.logScreenEntry(screenName);
  }

  logScreenEntry(screenName) {
    this.logEvent("SCREEN_ENTRY", null, { screen: screenName });
  }

  initGlobalListeners() {
    const handleInteraction = (e) => {
      let clientX = e.clientX;
      let clientY = e.clientY;

      if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      }

      const target = document.elementFromPoint(clientX, clientY) || e.target;
      const aoiElement = target ? target.closest("[data-aoi]") : null;
      const aoiName = aoiElement ? aoiElement.getAttribute("data-aoi") : "OUTSIDE_AOI";
      
      const payload = {
        tagName: target ? target.tagName : "UNKNOWN",
        id: target && target.id ? target.id : "",
        className: target && target.className ? target.className : "",
        text: target ? (target.innerText || "").substring(0, 30).trim() : ""
      };

      this.logEvent("TOUCH_CLICK", { x: clientX, y: clientY, aoi: aoiName }, payload);
    };

    window.addEventListener("pointerdown", handleInteraction, true);

    window.addEventListener("error", (e) => {
      this.logEvent("JS_ERROR", null, {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno
      });
    });
  }

  logEvent(eventType, coords, details) {
    const timestamp = Date.now();
    const relTimeMs = timestamp - this.sessionStartTime;

    const record = {
      timestamp: timestamp,
      rel_time_ms: relTimeMs,
      event_type: eventType,
      screen: this.currentScreen,
      floor: this.currentFloor,
      x: coords ? Math.round(coords.x) : "",
      y: coords ? Math.round(coords.y) : "",
      aoi: coords ? coords.aoi : "",
      details: details ? JSON.stringify(details).replace(/"/g, '""') : ""
    };

    this.events.push(record);
    this.updateCounterDisplay();
  }

  updateCounterDisplay() {
    const counterEl = document.getElementById("log-count");
    if (counterEl) {
      counterEl.innerText = this.events.length;
    }
  }

  exportEventsCSV() {
    if (this.events.length === 0) {
      alert("Brak zdarzeń do eksportu.");
      return;
    }

    const headers = ["Timestamp", "RelTimeMs", "EventType", "Screen", "Floor", "ScreenX", "ScreenY", "AOI", "Details"];
    const rows = this.events.map(ev => [
      ev.timestamp,
      ev.rel_time_ms,
      ev.event_type,
      ev.screen,
      ev.floor,
      ev.x,
      ev.y,
      ev.aoi,
      `"${ev.details}"`
    ]);

    const csvContent = "\uFEFF" + [headers.join(";"), ...rows.map(r => r.join(";"))].join("\n");
    this.downloadFile("eyetracker_events_" + Date.now() + ".csv", csvContent, "text/csv;charset=utf-8;");
  }

  exportAoiCSV() {
    const aoiNodes = document.querySelectorAll("[data-aoi]");
    const headers = ["AOI_Name", "Screen", "Viewport_X", "Viewport_Y", "Width", "Height", "Tag"];
    const rows = [];

    aoiNodes.forEach(el => {
      const rect = el.getBoundingClientRect();
      const aoiName = el.getAttribute("data-aoi");
      rows.push([
        aoiName,
        this.currentScreen,
        Math.round(rect.left),
        Math.round(rect.top),
        Math.round(rect.width),
        Math.round(rect.height),
        el.tagName
      ]);
    });

    const csvContent = "\uFEFF" + [headers.join(";"), ...rows.map(r => r.join(";"))].join("\n");
    this.downloadFile("eyetracker_aoi_definitions_" + Date.now() + ".csv", csvContent, "text/csv;charset=utf-8;");
  }

  clearLogs() {
    if (confirm("Wyczyścić historię zdarzeń?")) {
      this.events = [];
      this.updateCounterDisplay();
    }
  }

  downloadFile(fileName, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}