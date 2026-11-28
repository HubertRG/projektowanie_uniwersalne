/**
 * Moduł rejestrowania zdarzeń badawczych zgodny ze specyfikacją:
 * PUN_zdarzenia.csv / PUN_slownik_zmiennych.csv
 *
 * 20 kolumn (separator: średnik ';', kodowanie: UTF-8 z BOM):
 * interfejs;uczestnik;wersja;kolejnosc;scenariusz;czas_lokalny;czas_epoch_ms;czas_ms;
 * zdarzenie;ekran;element;etykieta;x;y;szer;wys;trafienie;aoi;sukces;opis
 */

class EyeTrackerLogger {
  constructor() {
    this.events = [];

    this.meta = this.readSessionMetaFromDom();

    this.currentScenario = "";
    this.scenarioStartEpoch = null;
    this.currentScreen = "ekran_plan";
    this.currentFloor = 1;

    this.activeAois = new Map();
    this.allowedAoiNames = new Set(["AOI_cel", "AOI_wstecz", "AOI_dostepnosc", "AOI_blad"]);

    this.bindResearcherPanel();
    this.initGlobalListeners();
    this.initAoiMutationObserver();

    // 1. Zdarzenie startowe: sesja
    this.logSession();

    requestAnimationFrame(() => {
      if (this.meta.scenariusz) {
        this.startScenario(this.meta.scenariusz);
      } else {
        this.logScreenEntry(this.currentScreen);
      }
    });
  }

  readSessionMetaFromDom() {
    const body = document.body.dataset;
    const params = new URLSearchParams(window.location.search);

    return {
      interfejs: parseInt(params.get("interfejs") || body.interfejs || "10", 10),
      uczestnik: (params.get("uczestnik") || body.uczestnik || "P01").trim(),
      wersja: (params.get("wersja") || body.wersja || "B").trim(),
      kolejnosc: (params.get("kolejnosc") || body.kolejnosc || "AB").trim(),
      scenariusz: (params.get("scenariusz") || body.scenariusz || "S1").trim()
    };
  }

  // ========================================================
  // FORMATOWANIE CZASU I LICZB
  // ========================================================

  // Format: RRRR-MM-DD GG:MM:SS.mmm (wg zegara komputera do zgrania z iMotions)
  formatLocalTime(epochMs) {
    const d = new Date(epochMs);
    const pad2 = (n) => String(n).padStart(2, "0");
    const pad3 = (n) => String(n).padStart(3, "0");

    const yyyy = d.getFullYear();
    const mm = pad2(d.getMonth() + 1);
    const dd = pad2(d.getDate());
    const hh = pad2(d.getHours());
    const min = pad2(d.getMinutes());
    const ss = pad2(d.getSeconds());
    const mmm = pad3(d.getMilliseconds());

    return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}.${mmm}`;
  }

  // Czas od startu bieżącego scenariusza [ms] lub puste poza scenariuszem
  getScenarioRelMs(epochMs) {
    if (!this.currentScenario || this.scenarioStartEpoch === null) {
      return "";
    }
    return Math.max(0, Math.round(epochMs - this.scenarioStartEpoch));
  }

  // Oczyszczenie tekstu z separatora ';' i znaków nowej linii
  sanitizeText(val) {
    if (val === null || val === undefined) return "";
    return String(val)
      .replace(/;/g, ",")
      .replace(/[\r\n\t]+/g, " ")
      .replace(/\s{2,}/g, " ")
      .trim();
  }

  // Centralna metoda dopisująca jeden wiersz (20 kolumn)
  pushRow({
    epochMs = Date.now(),
    zdarzenie = "",
    ekran = "",
    element = "",
    etykieta = "",
    x = "",
    y = "",
    szer = "",
    wys = "",
    trafienie = "",
    aoi = "",
    sukces = "",
    opis = ""
  }) {
    const roundedEpoch = Math.round(epochMs);
    const row = {
      interfejs: this.sanitizeText(this.meta.interfejs),
      uczestnik: this.sanitizeText(this.meta.uczestnik),
      wersja: this.sanitizeText(this.meta.wersja),
      kolejnosc: this.sanitizeText(this.meta.kolejnosc),
      scenariusz: this.sanitizeText(this.currentScenario),
      czas_lokalny: this.formatLocalTime(roundedEpoch),
      czas_epoch_ms: roundedEpoch,
      czas_ms: this.getScenarioRelMs(roundedEpoch),
      zdarzenie: this.sanitizeText(zdarzenie),
      ekran: this.sanitizeText(ekran),
      element: this.sanitizeText(element),
      etykieta: this.sanitizeText(etykieta),
      x: x !== "" && x !== null && !Number.isNaN(Number(x)) ? Math.round(Number(x)) : "",
      y: y !== "" && y !== null && !Number.isNaN(Number(y)) ? Math.round(Number(y)) : "",
      szer: szer !== "" && szer !== null && !Number.isNaN(Number(szer)) ? Math.round(Number(szer)) : "",
      wys: wys !== "" && wys !== null && !Number.isNaN(Number(wys)) ? Math.round(Number(wys)) : "",
      trafienie: trafienie === 1 || trafienie === 0 ? trafienie : "",
      aoi: this.sanitizeText(aoi),
      sukces: sukces === 1 || sukces === 0 ? sukces : "",
      opis: this.sanitizeText(opis)
    };

    this.events.push(row);
    this.updateCounterDisplay();
  }

  // ========================================================
  // 8 TYPÓW ZDARZEŃ ZGODNIE ZE SŁOWNIKIEM ZMIENNYCH
  // ========================================================

  // 1. zdarzenie = sesja
  logSession() {
    const scalePct = Math.round((window.devicePixelRatio || 1) * 100);
    const winW = Math.round(window.innerWidth);
    const winH = Math.round(window.innerHeight);
    const scrW = Math.round(window.screen.width);
    const scrH = Math.round(window.screen.height);

    this.pushRow({
      zdarzenie: "sesja",
      opis: `skalowanie=${scalePct}% okno=${winW}x${winH} ekran=${scrW}x${scrH}`
    });
  }

  // 2. zdarzenie = scenariusz_start
  startScenario(scenarioCode = "S1") {
    this.currentScenario = String(scenarioCode).toUpperCase();
    const now = Date.now();
    this.scenarioStartEpoch = now;

    this.pushRow({
      epochMs: now,
      zdarzenie: "scenariusz_start"
    });

    // Odśwież wpis bieżącego ekranu i jego aktywnych AOI na potrzeby liczenia TTFF
    this.logScreenEntry(this.currentScreen);
    this.updateScenarioStatusDisplay();
  }

  // 8. zdarzenie = scenariusz_koniec
  // sukces: 1 = tak, 0 = nie, "" (puste) = przerwanie przez prowadzącego
  endScenario(sukces = "") {
    if (!this.currentScenario) return;
    const now = Date.now();

    this.pushRow({
      epochMs: now,
      zdarzenie: "scenariusz_koniec",
      ekran: this.currentScreen,
      sukces: sukces === 1 || sukces === 0 ? sukces : ""
    });

    this.currentScenario = "";
    this.scenarioStartEpoch = null;
    this.updateScenarioStatusDisplay();
  }

  // 3. zdarzenie = ekran (kończy wszystkie AOI poprzedniego ekranu i rejestruje widoczne AOI nowego)
  setScreen(screenName) {
    this.currentScreen = screenName;
    this.logScreenEntry(screenName);
  }

  setFloor(floor) {
    this.currentFloor = floor;
    // Odśwież widoczne AOI na mapie po zmianie piętra
    requestAnimationFrame(() => this.syncVisibleAois());
  }

  logScreenEntry(screenName) {
    // Wejście na ekran kończy wszystkie AOI poprzedniego ekranu (bez generowania aoi_znika)
    this.activeAois.clear();

    const panel = document.getElementById("kiosk-app") || document.body;
    const rect = panel.getBoundingClientRect();

    this.pushRow({
      zdarzenie: "ekran",
      ekran: screenName,
      x: rect.left,
      y: rect.top,
      szer: rect.width,
      wys: rect.height
    });

    // Po wejściu na ekran powstaje wiersz aoi dla każdego widocznego AOI ze wspólnej listy
    requestAnimationFrame(() => {
      this.scanAndLogScreenAois();
    });
  }

  // ========================================================
  // ZARZĄDZANIE AOI (zdarzenie = aoi oraz zdarzenie = aoi_znika)
  // ========================================================

  // Mapuje element DOM na nazwę AOI ze wspólnej listy: AOI_cel, AOI_wstecz, AOI_dostepnosc, AOI_blad
  resolveStandardAoiName(el) {
    if (!el) return "";
    const explicitStd = el.getAttribute("data-aoi-std");
    if (explicitStd && this.allowedAoiNames.has(explicitStd)) return explicitStd;

    const rawAoi = el.getAttribute("data-aoi") || "";
    if (this.allowedAoiNames.has(rawAoi)) return rawAoi;

    const elId = this.resolveElementId(el);
    if (elId === "wstecz" || rawAoi.includes("back") || rawAoi.includes("wstecz")) {
      return "AOI_wstecz";
    }
    if (el.classList.contains("accessibility-bar") || el.id === "a11y-toolbar") {
      return "AOI_dostepnosc";
    }
    if (rawAoi.includes("blad") || rawAoi.includes("error")) {
      return "AOI_blad";
    }
    if (rawAoi.includes("cel") || el.hasAttribute("data-aoi-target")) {
      return "AOI_cel";
    }
    return "";
  }

  // Identyfikator elementu: data-log, a przy jego braku id; przycisk Wstecz ma zawsze nazwę 'wstecz'
  resolveElementId(el) {
    if (!el) return "";
    if (
      el.id === "btn-map-back" ||
      el.getAttribute("data-log") === "wstecz" ||
      el.getAttribute("data-aoi") === "btn_map_back"
    ) {
      return "wstecz";
    }
    return el.getAttribute("data-log") || el.id || el.getAttribute("data-aoi") || "";
  }

  // Widoczny tekst lub aria-label elementu (nigdy wartość pola tekstowego!)
  resolveElementLabel(el) {
    if (!el) return "";
    if (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT") {
      return el.getAttribute("aria-label") || "";
    }
    return el.getAttribute("aria-label") || el.innerText || "";
  }

  isElementVisible(el) {
    if (!el || !el.isConnected) return false;
    if (el.closest(".hidden") || el.closest("[aria-hidden='true']")) return false;
    const style = window.getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden" || parseFloat(style.opacity) === 0) {
      return false;
    }
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }

  // Skanuje wszystkie widoczne AOI po wejściu na ekran
  scanAndLogScreenAois() {
    const candidates = document.querySelectorAll("[data-aoi], [data-aoi-std], #btn-map-back, #a11y-toolbar button");
    candidates.forEach(el => {
      if (el.closest("[data-log-ignore='true']")) return;
      const stdAoi = this.resolveStandardAoiName(el);
      if (!stdAoi) return;
      if (!this.isElementVisible(el)) return;

      const elemId = this.resolveElementId(el);
      const rect = el.getBoundingClientRect();
      const key = `${stdAoi}::${elemId}`;

      this.activeAois.set(key, {
        element: elemId,
        aoi: stdAoi,
        x: Math.round(rect.left),
        y: Math.round(rect.top),
        szer: Math.round(rect.width),
        wys: Math.round(rect.height)
      });

      this.pushRow({
        zdarzenie: "aoi",
        ekran: this.currentScreen,
        element: elemId,
        etykieta: this.resolveElementLabel(el),
        x: rect.left,
        y: rect.top,
        szer: rect.width,
        wys: rect.height,
        aoi: stdAoi
      });
    });
  }

  // Synchronizuje dynamiczne pojawienie się, przesunięcie lub zniknięcie AOI bez zmiany ekranu
  syncVisibleAois() {
    const currentSnapshot = new Map();
    const candidates = document.querySelectorAll("[data-aoi], [data-aoi-std], #btn-map-back, #a11y-toolbar button");

    candidates.forEach(el => {
      if (el.closest("[data-log-ignore='true']")) return;
      const stdAoi = this.resolveStandardAoiName(el);
      if (!stdAoi || !this.isElementVisible(el)) return;

      const elemId = this.resolveElementId(el);
      const rect = el.getBoundingClientRect();
      const key = `${stdAoi}::${elemId}`;

      currentSnapshot.set(key, {
        el,
        element: elemId,
        aoi: stdAoi,
        x: Math.round(rect.left),
        y: Math.round(rect.top),
        szer: Math.round(rect.width),
        wys: Math.round(rect.height)
      });
    });

    // 1. Sprawdź AOI, które zniknęły bez zmiany ekranu -> zdarzenie = aoi_znika
    for (const [key, prev] of this.activeAois.entries()) {
      if (!currentSnapshot.has(key)) {
        this.pushRow({
          zdarzenie: "aoi_znika",
          ekran: this.currentScreen,
          element: prev.element,
          aoi: prev.aoi
        });
        this.activeAois.delete(key);
      }
    }

    // 2. Sprawdź AOI, które pojawiły się lub zmieniły położenie/wymiar -> zdarzenie = aoi
    for (const [key, curr] of currentSnapshot.entries()) {
      const prev = this.activeAois.get(key);
      const changed =
        !prev ||
        Math.abs(prev.x - curr.x) > 5 ||
        Math.abs(prev.y - curr.y) > 5 ||
        Math.abs(prev.szer - curr.szer) > 5 ||
        Math.abs(prev.wys - curr.wys) > 5;

      if (changed) {
        this.activeAois.set(key, {
          element: curr.element,
          aoi: curr.aoi,
          x: curr.x,
          y: curr.y,
          szer: curr.szer,
          wys: curr.wys
        });

        this.pushRow({
          zdarzenie: "aoi",
          ekran: this.currentScreen,
          element: curr.element,
          etykieta: this.resolveElementLabel(curr.el),
          x: curr.x,
          y: curr.y,
          szer: curr.szer,
          wys: curr.wys,
          aoi: curr.aoi
        });
      }
    }
  }

  // Ręczne zgłoszenie pojawienia się AOI celu (np. docelowy sklep / trasa w scenariuszu)
  registerTargetAoi(domElement, customElementId = null) {
    if (!domElement) return;
    domElement.setAttribute("data-aoi-std", "AOI_cel");
    if (customElementId) domElement.setAttribute("data-log", customElementId);
    this.syncVisibleAois();
  }

  // ========================================================
  // 7. zdarzenie = blad (walidacja lub błąd JavaScript)
  // ========================================================
  logError(errorCode, messageText, errorDomElement = null) {
    this.pushRow({
      zdarzenie: "blad",
      ekran: this.currentScreen,
      element: errorCode,
      etykieta: messageText
    });

    if (errorDomElement) {
      errorDomElement.setAttribute("data-aoi-std", "AOI_blad");
      this.syncVisibleAois();
    }
  }

  // ========================================================
  // 6. zdarzenie = dotkniecie + OBSŁUGA BŁĘDÓW JS
  // ========================================================
  isInteractiveElement(el) {
    if (!el) return null;
    const interactive = el.closest(
      "button, a, input, select, textarea, [role='button'], .shop-polygon, .store-block, .store-dir-card, .grid-tile-card, .transit-line-card, .stop-departure-row, .search-result-item"
    );
    if (!interactive) return null;
    if (interactive.disabled || interactive.getAttribute("aria-disabled") === "true") {
      return null;
    }
    return interactive;
  }

  // Sprawdza, w którym z aktywnych AOI leży punkt dotknięcia (x, y)
  findAoiAtPoint(x, y) {
    for (const item of this.activeAois.values()) {
      if (
        x >= item.x &&
        x <= item.x + item.szer &&
        y >= item.y &&
        y <= item.y + item.wys
      ) {
        return item.aoi;
      }
    }
    return "";
  }

  initGlobalListeners() {
    const handlePointerDown = (e) => {
      // Ignoruj kliknięcia w panel badacza
      if (e.target && e.target.closest("[data-log-ignore='true']")) return;

      const clientX = e.clientX;
      const clientY = e.clientY;

      const rawTarget = document.elementFromPoint(clientX, clientY) || e.target;
      const activeEl = this.isInteractiveElement(rawTarget);

      // trafienie: 1 gdy dotknięto aktywnego elementu, 0 gdy tła lub wyłączonego
      const trafienie = activeEl ? 1 : 0;
      const targetForMeta = activeEl || rawTarget;

      const elemId = this.resolveElementId(targetForMeta);
      const etykieta = activeEl ? this.resolveElementLabel(activeEl) : "";
      const aoiAtPoint = this.findAoiAtPoint(clientX, clientY);
      const pointerType = e.pointerType || "touch";

      this.pushRow({
        zdarzenie: "dotkniecie",
        ekran: this.currentScreen,
        element: elemId,
        etykieta: etykieta,
        x: clientX,
        y: clientY,
        trafienie: trafienie,
        aoi: aoiAtPoint,
        opis: pointerType
      });
    };

    window.addEventListener("pointerdown", handlePointerDown, true);

    // Błąd JavaScript ma zawsze kod JS
    window.addEventListener("error", (e) => {
      this.logError("JS", e.message || "Nieznany błąd skryptu");
    });
  }

  initAoiMutationObserver() {
    let debounceTimer = null;

    const scheduleStabilizedSync = () => {
      clearTimeout(debounceTimer);
      // Czekamy 200 ms, aż zakończą się krótkie animacje CSS dymków i przycisków
      debounceTimer = setTimeout(() => {
        this.syncVisibleAois();
      }, 200);
    };

    const observer = new MutationObserver(() => {
      scheduleStabilizedSync();
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class", "style", "hidden", "aria-hidden"],
      childList: true,
      subtree: true
    });

    window.addEventListener("resize", scheduleStabilizedSync);
  }

  // ========================================================
  // PANEL BADACZA I EKSPORT DO PLIKU CSV
  // ========================================================
  bindResearcherPanel() {
    const bindInput = (id, key, transform = (v) => v) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.value = this.meta[key];
      el.addEventListener("change", () => {
        this.meta[key] = transform(el.value);
      });
    };

    bindInput("cfg-interfejs", "interfejs", (v) => v.trim());
    bindInput("cfg-uczestnik", "uczestnik", (v) => v.trim().toUpperCase());
    bindInput("cfg-wersja", "wersja", (v) => v.trim().toUpperCase());
    bindInput("cfg-kolejnosc", "kolejnosc", (v) => v.trim().toUpperCase());

    const btnStart = document.getElementById("btn-scenario-start");
    const btnEndOk = document.getElementById("btn-scenario-end-ok");
    const btnAbort = document.getElementById("btn-scenario-abort");

    if (btnStart) {
      btnStart.addEventListener("click", () => {
        const sel = document.getElementById("cfg-scenariusz");
        this.startScenario(sel ? sel.value : "S1");
      });
    }
    if (btnEndOk) {
      btnEndOk.addEventListener("click", () => this.endScenario(1));
    }
    if (btnAbort) {
      btnAbort.addEventListener("click", () => this.endScenario(""));
    }
  }

  updateCounterDisplay() {
    const counterEl = document.getElementById("log-count");
    if (counterEl) {
      counterEl.innerText = this.events.length;
    }
  }

  updateScenarioStatusDisplay() {
    const statusEl = document.getElementById("log-scenario-status");
    if (!statusEl) return;
    statusEl.innerText = this.currentScenario ? `Aktywny: ${this.currentScenario}` : "Poza scenariuszem";
  }

  finishAndDownloadCSV(isSuccess = true) {
    if (this.currentScenario) {
      this.endScenario(isSuccess ? 1 : "");
    }
    this.exportEventsCSV();
  }

  // Eksport zgodny z PUN_zdarzenia_I{interfejs}_{uczestnik}_{wersja}.csv
  exportEventsCSV() {
    if (this.events.length === 0) {
      alert("Brak zdarzeń do eksportu.");
      return;
    }

    const headers = [
      "interfejs", "uczestnik", "wersja", "kolejnosc", "scenariusz",
      "czas_lokalny", "czas_epoch_ms", "czas_ms", "zdarzenie", "ekran",
      "element", "etykieta", "x", "y", "szer", "wys",
      "trafienie", "aoi", "sukces", "opis"
    ];

    const rows = this.events.map(ev => headers.map(col => ev[col]));
    const csvContent = "\uFEFF" + [headers.join(";"), ...rows.map(r => r.join(";"))].join("\r\n");

    const scenTag = this.meta.scenariusz ? `_${this.meta.scenariusz}` : "";
    const fileName = `PUN_zdarzenia_I${this.meta.interfejs}_${this.meta.uczestnik}_${this.meta.wersja}${scenTag}.csv`;
    this.downloadFile(fileName, csvContent, "text/csv;charset=utf-8;");
  }

  clearLogs() {
    if (confirm("Rozpocząć nową sesję i wyczyścić zapisane zdarzenia?")) {
      this.events = [];
      this.currentScenario = "";
      this.scenarioStartEpoch = null;
      this.activeAois.clear();
      this.logSession();
      this.logScreenEntry(this.currentScreen);
      this.updateScenarioStatusDisplay();
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