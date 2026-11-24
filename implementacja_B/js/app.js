/**
 * Główny kontroler aplikacji infomatu — WERSJA B (Dostępna / WCAG 2.2 AAA):
 * - Płaski widok mapy 2D z większymi lokalami i przyciskami powiększania (+ / −)
 * - Historia nawigacji z przyciskiem Wstecz i wskaźnikiem postępu na każdym ekranie
 * - Ostrzeżenie przed upływem limitu czasu z możliwością przedłużenia (+60 s)
 * - Podsumowanie przed uruchomieniem trasy (wybór schody / winda) i przed płatnością za parking
 * - Pasek dostępności: Wysoki kontrast, Powiększanie tekstu, Tryb wózek, Lektor z napisami
 * - Pełna zgodność z EyeTrackerLogger (data-aoi)
 */

let loggerInstance = null;
let currentActiveFloor = 1;
let selectedStoreId = null;
let activeRouteStoreId = null;
let selectedRouteMode = "escalator"; // "escalator" | "elevator"
let activeRouteSecondFloor = null;
let routeShowingSecondFloor = false;

// Skala mapy (powiększone budynki w widoku 2D)
const DEFAULT_MAP_SCALE = 1.15;
const MIN_MAP_SCALE = 0.95;
const MAX_MAP_SCALE = 2.40;
const BASE_MAX_PAN_X = 420;
const BASE_MAX_PAN_Y = 300;

let mapState = {
  panX: 0,
  panY: 0,
  scale: DEFAULT_MAP_SCALE,
  isDragging: false,
  isPinching: false,
  startX: 0,
  startY: 0,
  initialPinchDist: 0,
  initialPinchScale: DEFAULT_MAP_SCALE
};

// Stan wyszukiwarki i modułów
let currentSearchQuery = "";
let currentStoreCategoryFilter = "ALL";
let selectedStopId = "stop_ogrod_saski_01";
let selectedLineNum = "004";

// Historia nawigacji dla przycisku Wstecz
let navHistory = [];
let currentModuleState = null; // { screenId, titleText }

// Stan dostępności
let a11yState = {
  highContrast: false,
  fontLevel: 0, // 0 = 100%, 1 = 118%, 2 = 134%
  wheelchair: false,
  voiceEnabled: false
};

// Limit czasu bezczynności (WCAG 2.2.1)
const INACTIVITY_LIMIT_SEC = 90;
const WARNING_BEFORE_SEC = 20;
let idleSeconds = 0;
let inactivityInterval = null;
let timeoutModalOpen = false;
let hasUserInteracted = false;

// Stan płatności za parking
let selectedParkingTariff = { hours: "Do 2 godzin", price: "4,00 zł" };

document.addEventListener("DOMContentLoaded", () => {
  updateKioskAspectRatio();
  window.addEventListener("resize", updateKioskAspectRatio);

  loggerInstance = new EyeTrackerLogger();
  loggerInstance.setFloor(1);

  initClock();
  initMapPanning();
  initMapZoomControls();
  renderStoresForFloor(currentActiveFloor);
  updateMapTransform(false);

  initFloorNavigation();
  initTopSquareNavigation();
  initSideNavigation();
  initLegendButtons();
  initModuleScreenWindow();
  initActionBubbleAndModal();
  initRouteSummaryModal();
  initRouteDismissButton();
  initParkingPayModal();
  initAccessibilityBar();
  initInactivityTimer();
  initResearcherDock();

  // Inicjalizacja modułów zakładek
  initStoresDirectoryModule();
  initRestaurantsGridModule();
  initServicesGridModule();
  initCinemaRepertoireModule();
  initSearchModule();
  initNewsModule();
  initPromoModule();
  initTransitModule();
  initNewsPromoModalEvents();
});

// ========================================================
// SKALOWANIE EKRANU 1920x1080
// ========================================================
function updateKioskAspectRatio() {
  const kiosk = document.getElementById("kiosk-app");
  if (!kiosk) return;

  const targetW = 1920;
  const targetH = 1080;
  const winW = window.innerWidth;
  const winH = window.innerHeight;

  if (winW === targetW && winH === targetH) {
    kiosk.style.transform = "scale(1)";
    return;
  }

  const scale = Math.min(winW / targetW, winH / targetH);
  kiosk.style.transform = `scale(${scale})`;
}

// ========================================================
// KOMUNIKATY GŁOSOWE Z NAPISAMI (LEKTOR + NAPISY)
// ========================================================
let captionHideTimer = null;

function announce(text) {
  if (!a11yState.voiceEnabled) return;

  const bar = document.getElementById("voice-caption-bar");
  const textEl = document.getElementById("voice-caption-text");
  if (bar && textEl) {
    textEl.innerText = text;
    bar.classList.remove("hidden");
    if (captionHideTimer) clearTimeout(captionHideTimer);
    captionHideTimer = setTimeout(() => {
      if (a11yState.voiceEnabled) {
        // Zostawiamy ostatni napis widoczny przez 6 sekund
        bar.classList.add("hidden");
      }
    }, 6000);
  }

  if ("speechSynthesis" in window) {
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "pl-PL";
      utter.rate = 0.98;
      window.speechSynthesis.speak(utter);
    } catch (e) {}
  }
}

// ========================================================
// PASEK DOSTĘPNOŚCI (KONTRAST, TEKST, WÓZEK, LEKTOR)
// ========================================================
function initAccessibilityBar() {
  const kiosk = document.getElementById("kiosk-app");
  const btnContrast = document.getElementById("btn-toggle-contrast");
  const btnFont = document.getElementById("btn-toggle-fontsize");
  const fontLabel = document.getElementById("fontsize-label");
  const btnWheelchair = document.getElementById("btn-toggle-wheelchair");
  const btnVoice = document.getElementById("btn-toggle-voice");

  btnContrast.addEventListener("click", () => {
    a11yState.highContrast = !a11yState.highContrast;
    kiosk.classList.toggle("high-contrast", a11yState.highContrast);
    btnContrast.classList.toggle("active", a11yState.highContrast);
    btnContrast.setAttribute("aria-pressed", String(a11yState.highContrast));
    announce(a11yState.highContrast ? "Włączono tryb wysokiego kontrastu." : "Wyłączono tryb wysokiego kontrastu.");
    loggerInstance.logEvent("A11Y_CONTRAST", null, { enabled: a11yState.highContrast });
  });

  btnFont.addEventListener("click", () => {
    a11yState.fontLevel = (a11yState.fontLevel + 1) % 3;
    kiosk.classList.remove("font-normal", "font-large", "font-xlarge");
    const classes = ["font-normal", "font-large", "font-xlarge"];
    const labels = ["Tekst: 100%", "Tekst: 118%", "Tekst: 134%"];
    kiosk.classList.add(classes[a11yState.fontLevel]);
    fontLabel.innerText = labels[a11yState.fontLevel];
    btnFont.classList.toggle("active", a11yState.fontLevel > 0);
    announce(`Zmieniono rozmiar tekstu na ${labels[a11yState.fontLevel]}.`);
    loggerInstance.logEvent("A11Y_FONT_SIZE", null, { level: a11yState.fontLevel });
  });

  btnWheelchair.addEventListener("click", () => {
    a11yState.wheelchair = !a11yState.wheelchair;
    kiosk.classList.toggle("wheelchair-mode", a11yState.wheelchair);
    btnWheelchair.classList.toggle("active", a11yState.wheelchair);
    btnWheelchair.setAttribute("aria-pressed", String(a11yState.wheelchair));
    announce(a11yState.wheelchair ? "Włączono tryb dla osoby na wózku. Przyciski są teraz niżej." : "Wyłączono tryb dla osoby na wózku.");
    loggerInstance.logEvent("A11Y_WHEELCHAIR", null, { enabled: a11yState.wheelchair });
  });

  btnVoice.addEventListener("click", () => {
    a11yState.voiceEnabled = !a11yState.voiceEnabled;
    btnVoice.classList.toggle("active", a11yState.voiceEnabled);
    btnVoice.setAttribute("aria-pressed", String(a11yState.voiceEnabled));
    btnVoice.querySelector("span:last-child").innerText = a11yState.voiceEnabled ? "Lektor: Wł." : "Lektor: Wył.";
    if (a11yState.voiceEnabled) {
      announce("Włączono komunikaty głosowe z napisami.");
    } else {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      document.getElementById("voice-caption-bar").classList.add("hidden");
    }
    loggerInstance.logEvent("A11Y_VOICE", null, { enabled: a11yState.voiceEnabled });
  });
}

// ========================================================
// OSTRZEŻENIE PRZED UPŁYWEM LIMITU CZASU (WCAG 2.2.1)
// ========================================================
function initInactivityTimer() {
  const modal = document.getElementById("timeout-warning-modal");
  const countdownEl = document.getElementById("timeout-countdown");
  const fillEl = document.getElementById("timeout-progress-fill");
  const btnExtend = document.getElementById("btn-timeout-extend");
  const btnReset = document.getElementById("btn-timeout-reset");

  const registerActivity = () => {
    hasUserInteracted = true;
    if (!timeoutModalOpen) {
      idleSeconds = 0;
    }
  };

  ["pointerdown", "touchstart", "keydown", "wheel"].forEach(evt => {
    window.addEventListener(evt, registerActivity, { passive: true });
  });

  btnExtend.addEventListener("click", () => {
    timeoutModalOpen = false;
    idleSeconds = -60; // Dodatkowe +60 sekund
    modal.classList.add("hidden");
    announce("Przedłużono czas korzystania z infomatu o 60 sekund.");
    loggerInstance.logEvent("TIMEOUT_EXTENDED", null, { addedSec: 60 });
  });

  btnReset.addEventListener("click", () => {
    resetKioskToStart();
  });

  inactivityInterval = setInterval(() => {
    if (!hasUserInteracted) return;

    idleSeconds++;
    const remaining = INACTIVITY_LIMIT_SEC - idleSeconds;

    if (remaining <= WARNING_BEFORE_SEC && remaining > 0) {
      if (!timeoutModalOpen) {
        timeoutModalOpen = true;
        modal.classList.remove("hidden");
        announce("Czy nadal korzystasz z infomatu? Dotknij przycisk Przedłuż czas.");
        loggerInstance.logEvent("TIMEOUT_WARNING_SHOWN", null, { remaining });
      }
      countdownEl.innerText = remaining;
      fillEl.style.width = `${(remaining / WARNING_BEFORE_SEC) * 100}%`;
    } else if (remaining <= 0) {
      resetKioskToStart();
    }
  }, 1000);
}

function resetKioskToStart() {
  timeoutModalOpen = false;
  hasUserInteracted = false;
  idleSeconds = 0;

  document.getElementById("timeout-warning-modal").classList.add("hidden");
  document.getElementById("route-summary-modal").classList.add("hidden");
  document.getElementById("parking-pay-modal").classList.add("hidden");
  document.getElementById("news-promo-modal").classList.add("hidden");

  dismissActiveRoute();
  returnToGalleryMap(false);
  navHistory = [];
  updateMapBackButton();

  mapState.panX = 0;
  mapState.panY = 0;
  mapState.scale = DEFAULT_MAP_SCALE;
  updateMapTransform(true);

  if (currentActiveFloor !== 1) switchFloorTab(1);
  updateMapProgress(1);
  announce("Wrócono na ekran startowy.");
  loggerInstance.logEvent("SESSION_RESET_TIMEOUT", null, {});
}

// ========================================================
// MAPA 2D: TRANSFORMACJA, PRZESUWANIE I PRZYCISKI ZOOM
// ========================================================
function updateMapTransform(animate = true) {
  const stage = document.getElementById("map-stage");
  if (!stage) return;

  stage.style.transition = animate ? "transform 0.28s cubic-bezier(0.25, 1, 0.5, 1)" : "none";

  const clamped = clampPan(mapState.panX, mapState.panY, mapState.scale);
  mapState.panX = clamped.x;
  mapState.panY = clamped.y;

  // Płaski widok 2D z góry (bez pochylenia 3D) -> większe, łatwiejsze do kliknięcia budynki
  stage.style.transform = `translate(${mapState.panX}px, ${mapState.panY}px) scale(${mapState.scale})`;
}

function clampPan(x, y, scale) {
  const currentMaxX = BASE_MAX_PAN_X * (scale / MIN_MAP_SCALE);
  const currentMaxY = BASE_MAX_PAN_Y * (scale / MIN_MAP_SCALE);
  return {
    x: Math.max(-currentMaxX, Math.min(currentMaxX, x)),
    y: Math.max(-currentMaxY, Math.min(currentMaxY, y))
  };
}

function getTouchDistance(touches) {
  return Math.hypot(
    touches[0].clientX - touches[1].clientX,
    touches[0].clientY - touches[1].clientY
  );
}

function initMapZoomControls() {
  const btnIn = document.getElementById("btn-zoom-in");
  const btnOut = document.getElementById("btn-zoom-out");

  const applyZoomDelta = (delta) => {
    if (activeRouteStoreId) return;
    mapState.scale = Math.max(MIN_MAP_SCALE, Math.min(MAX_MAP_SCALE, +(mapState.scale + delta).toFixed(2)));
    updateMapTransform(true);
    if (selectedStoreId) {
      const storeEl = document.getElementById(`store-${selectedStoreId}`);
      setTimeout(() => positionBubbleOverStore(storeEl), 300);
    }
    announce(delta > 0 ? "Powiększono mapę." : "Pomniejszono mapę.");
  };

  btnIn.addEventListener("click", () => applyZoomDelta(0.25));
  btnOut.addEventListener("click", () => applyZoomDelta(-0.25));
}

function initMapPanning() {
  const viewport = document.getElementById("map-viewport");

  const startDragMouse = (e) => {
    if (activeRouteStoreId) return;
    if (e.target.closest("button") || e.target.closest(".shop-polygon") || e.target.closest(".store-block")) return;
    mapState.isDragging = true;
    mapState.startX = e.clientX - mapState.panX;
    mapState.startY = e.clientY - mapState.panY;
  };

  const onDragMouse = (e) => {
    if (!mapState.isDragging) return;
    mapState.panX = e.clientX - mapState.startX;
    mapState.panY = e.clientY - mapState.startY;
    updateMapTransform(false);
    hideActionBubble();
  };

  const endDragMouse = () => {
    if (mapState.isDragging) {
      mapState.isDragging = false;
      updateMapTransform(true);
    }
  };

  viewport.addEventListener("mousedown", startDragMouse);
  window.addEventListener("mousemove", onDragMouse);
  window.addEventListener("mouseup", endDragMouse);

  viewport.addEventListener("wheel", (e) => {
    if (activeRouteStoreId) return;
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 0.12 : -0.12;
    mapState.scale = Math.max(MIN_MAP_SCALE, Math.min(MAX_MAP_SCALE, mapState.scale + zoomFactor));
    updateMapTransform(true);
    hideActionBubble();
  }, { passive: false });

  viewport.addEventListener("touchstart", (e) => {
    if (activeRouteStoreId) return;
    if (e.touches.length === 2) {
      mapState.isPinching = true;
      mapState.isDragging = false;
      mapState.initialPinchDist = getTouchDistance(e.touches);
      mapState.initialPinchScale = mapState.scale;
      hideActionBubble();
    } else if (e.touches.length === 1) {
      if (e.target.closest("button") || e.target.closest(".shop-polygon") || e.target.closest(".store-block")) return;
      mapState.isDragging = true;
      mapState.isPinching = false;
      mapState.startX = e.touches[0].clientX - mapState.panX;
      mapState.startY = e.touches[0].clientY - mapState.panY;
    }
  }, { passive: false });

  window.addEventListener("touchmove", (e) => {
    if (activeRouteStoreId) return;
    if (mapState.isPinching && e.touches.length === 2) {
      e.preventDefault();
      const currentDist = getTouchDistance(e.touches);
      if (mapState.initialPinchDist > 0) {
        const newScale = mapState.initialPinchScale * (currentDist / mapState.initialPinchDist);
        mapState.scale = Math.max(MIN_MAP_SCALE, Math.min(MAX_MAP_SCALE, newScale));
        updateMapTransform(false);
      }
    } else if (mapState.isDragging && e.touches.length === 1) {
      mapState.panX = e.touches[0].clientX - mapState.startX;
      mapState.panY = e.touches[0].clientY - mapState.startY;
      updateMapTransform(false);
      hideActionBubble();
    }
  }, { passive: false });

  const endTouch = (e) => {
    if (mapState.isPinching && e.touches.length < 2) {
      mapState.isPinching = false;
      updateMapTransform(true);
    }
    if (mapState.isDragging && e.touches.length === 0) {
      mapState.isDragging = false;
      updateMapTransform(true);
    }
  };

  window.addEventListener("touchend", endTouch);
  window.addEventListener("touchcancel", endTouch);
}

// ========================================================
// ZEGAR
// ========================================================
function initClock() {
  const timeEl = document.getElementById("live-time");
  const dateEl = document.getElementById("live-date");

  function tick() {
    const now = new Date();
    timeEl.innerText = now.toLocaleTimeString("pl-PL", { hour12: false });
    dateEl.innerText = now.toLocaleDateString("pl-PL", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  }
  tick();
  setInterval(tick, 1000);
}

// ========================================================
// RENDEROWANIE MAPY PIĘTRA
// ========================================================
function createSvgShape(shape) {
  const NS = "http://www.w3.org/2000/svg";
  let el;
  if (shape.type === "path") {
    el = document.createElementNS(NS, "path");
    el.setAttribute("d", shape.d);
  } else if (shape.type === "polygon") {
    el = document.createElementNS(NS, "polygon");
    el.setAttribute("points", shape.points);
  } else if (shape.type === "polyline") {
    el = document.createElementNS(NS, "polyline");
    el.setAttribute("points", shape.points);
  } else if (shape.type === "rect") {
    el = document.createElementNS(NS, "rect");
    el.setAttribute("x", shape.x);
    el.setAttribute("y", shape.y);
    el.setAttribute("width", shape.width);
    el.setAttribute("height", shape.height);
  }
  return el;
}

function renderStoresForFloor(floor) {
  const svgLayer = document.getElementById("stores-svg-layer");
  const amenitiesContainer = document.getElementById("map-amenities-layer");
  const grid = document.getElementById("stores-puzzle-grid");
  if (!svgLayer || !amenitiesContainer) return;

  svgLayer.innerHTML = "";
  amenitiesContainer.innerHTML = "";
  if (grid) { grid.innerHTML = ""; grid.style.display = "none"; }

  const pin = document.getElementById("you-are-here-pin");
  if (pin) pin.style.display = (floor === 1) ? "flex" : "none";

  let plan = null;
  if (floor === 0 && typeof FLOOR_PLAN_0 !== "undefined") plan = FLOOR_PLAN_0;
  else if (floor === 1 && typeof FLOOR_PLAN_1 !== "undefined") plan = FLOOR_PLAN_1;
  else if (floor === 2 && typeof FLOOR_PLAN_2 !== "undefined") plan = FLOOR_PLAN_2;

  if (plan) {
    const svg = document.getElementById("stores-svg");
    svg.setAttribute("viewBox", plan.viewBox);

    Object.entries(plan.emptyShops).forEach(([, shape]) => {
      const el = createSvgShape(shape);
      el.setAttribute("class", "empty-shop");
      el.setAttribute("pointer-events", "none");
      svgLayer.appendChild(el);
    });

    Object.entries(plan.shops).forEach(([, shop]) => {
      const el = createSvgShape(shop);
      el.setAttribute("class", "shop-polygon");
      el.setAttribute("id", `store-${shop.storeId}`);
      el.setAttribute("data-store-id", shop.storeId);
      el.setAttribute("data-aoi", `map_store_${shop.storeId}`);
      el.setAttribute("tabindex", "0");
      el.setAttribute("role", "button");
      el.setAttribute("aria-label", `Sklep ${shop.label}, poziom ${floor}`);

      const onActivate = (e) => {
        e.stopPropagation();
        const store = STORES_CATALOG.find(s => s.id === shop.storeId);
        if (store) handleStoreClick(store);
      };
      el.addEventListener("click", onActivate);
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") onActivate(e);
      });
      svgLayer.appendChild(el);

      if (shop.logo) {
        const bbox = el.getBBox();
        let logoSize = Math.min(bbox.width, bbox.height) * 0.65;
        logoSize *= (shop.logoScale || 1);

        const offsetX = shop.logoOffset?.x || 0;
        const offsetY = shop.logoOffset?.y || 0;
        const rotation = shop.logoRotation || 0;

        const baseX = bbox.x + (bbox.width - logoSize) / 2 + offsetX;
        const baseY = bbox.y + (bbox.height - logoSize) / 2 + offsetY;
        const centerX = baseX + logoSize / 2;
        const centerY = baseY + logoSize / 2;

        const img = document.createElementNS("http://www.w3.org/2000/svg", "image");
        img.setAttribute("href", shop.logo);
        img.setAttribute("x", baseX);
        img.setAttribute("y", baseY);
        img.setAttribute("width", logoSize);
        img.setAttribute("height", logoSize);
        img.setAttribute("class", "shop-logo");
        img.setAttribute("pointer-events", "none");
        img.setAttribute("preserveAspectRatio", "xMidYMid meet");
        if (rotation !== 0) {
          img.setAttribute("transform", `rotate(${rotation}, ${centerX}, ${centerY})`);
        }
        svgLayer.appendChild(img);
      }
    });

    if (plan.iconsSvg) {
      const iconsWrapper = document.createElementNS("http://www.w3.org/2000/svg", "g");
      iconsWrapper.setAttribute("id", "floor-icons");
      iconsWrapper.innerHTML = plan.iconsSvg;
      svgLayer.appendChild(iconsWrapper);

      iconsWrapper.querySelectorAll("g").forEach(group => {
        const bbox = group.getBBox();
        const padding = 8;
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", bbox.x - padding);
        rect.setAttribute("y", bbox.y - padding);
        rect.setAttribute("width", bbox.width + padding * 2);
        rect.setAttribute("height", bbox.height + padding * 2);
        rect.setAttribute("rx", 6);
        rect.setAttribute("ry", 6);
        rect.setAttribute("class", "facility-bubble");
        group.insertBefore(rect, group.firstChild);
      });
    }
  }
}

// ========================================================
// PODŚWIETLANIE SYMBOLI Z LEGENDY (PRAWY PANEL)
// ========================================================
function initLegendButtons() {
  const cards = document.querySelectorAll("#side-symbols-right .symbol-card");
  cards.forEach(card => {
    card.addEventListener("click", () => {
      const facKey = card.getAttribute("data-facility");
      const wasActive = card.classList.contains("active");

      cards.forEach(c => c.classList.remove("active"));
      document.querySelectorAll(".facility-icon-group").forEach(g => g.classList.remove("highlighted"));

      if (!wasActive && facKey) {
        card.classList.add("active");
        const matches = document.querySelectorAll(`.facility-icon-group[id^="${facKey}"]`);
        matches.forEach(g => g.classList.add("highlighted"));
        const label = card.querySelector(".symbol-label").innerText.replace(/\n/g, " ");
        if (matches.length > 0) {
          announce(`Podświetlono na mapie: ${label}, liczba punktów na tym piętrze: ${matches.length}.`);
        } else {
          announce(`Brak punktu ${label} na tym piętrze. Sprawdź inne piętro.`);
        }
      }
    });
  });
}

// ========================================================
// PASEK POSTĘPU I PRZYCISK WSTECZ
// ========================================================
function updateMapProgress(stepNum) {
  const s1 = document.getElementById("step-1");
  const s2 = document.getElementById("step-2");
  const s3 = document.getElementById("step-3");
  [s1, s2, s3].forEach((el, idx) => {
    if (!el) return;
    el.classList.remove("active", "done");
    if (idx + 1 < stepNum) el.classList.add("done");
    if (idx + 1 === stepNum) el.classList.add("active");
  });
}

function updateMapBackButton() {
  const btn = document.getElementById("btn-map-back");
  if (!btn) return;
  const shouldShow = navHistory.length > 0 || Boolean(selectedStoreId);
  btn.classList.toggle("hidden", !shouldShow);
}

function updateModuleBreadcrumb(screenId, titleText, extra = "") {
  const bc = document.getElementById("module-breadcrumb");
  if (!bc) return;
  const stepText = extra ? `Krok 2 z 2: Plan Galerii › ${titleText} › ${extra}` : `Krok 1 z 2: Plan Galerii › ${titleText}`;
  bc.innerText = stepText;
}

// ========================================================
// WYBÓR SKLEPU I DYMEK AKCJI
// ========================================================
function deselectStore(resetZoom = true) {
  if (selectedStoreId) {
    const prevBlock = document.getElementById(`store-${selectedStoreId}`);
    if (prevBlock) prevBlock.classList.remove("selected");
    selectedStoreId = null;
  }
  hideActionBubble();
  updateMapProgress(1);
  updateMapBackButton();

  if (resetZoom) {
    mapState.scale = DEFAULT_MAP_SCALE;
    updateMapTransform(true);
  }
}

function handleStoreClick(store) {
  const clickedBlock = document.getElementById(`store-${store.id}`);
  if (!clickedBlock) return;

  if (selectedStoreId === store.id) {
    deselectStore(true);
    return;
  }

  if (selectedStoreId) {
    const prevBlock = document.getElementById(`store-${selectedStoreId}`);
    if (prevBlock) prevBlock.classList.remove("selected");
  }

  clickedBlock.classList.add("selected");
  selectedStoreId = store.id;
  updateMapProgress(2);
  updateMapBackButton();

  if (mapState.scale < 1.35) {
    mapState.scale = 1.35;
    updateMapTransform(true);
  }

  showActionBubble(store, clickedBlock);
  setTimeout(() => {
    if (selectedStoreId === store.id) positionBubbleOverStore(clickedBlock);
  }, 300);

  announce(`Wybrano lokal ${store.name}, poziom ${store.floor}, kategoria ${store.category}.`);
}

function positionBubbleOverStore(storeElement) {
  const bubble = document.getElementById("store-action-bubble");
  if (!bubble || !storeElement || bubble.classList.contains("hidden")) return;

  const rect = storeElement.getBoundingClientRect();
  const kioskRect = document.getElementById("kiosk-app").getBoundingClientRect();
  const scale = kioskRect.width / 1920;

  const storeScreenX = (rect.left + rect.width / 2 - kioskRect.left) / scale;
  let storeScreenY = (rect.top - kioskRect.top) / scale - 16;

  const bubbleHeight = bubble.offsetHeight || 165;
  const minTopLimit = 190 + bubbleHeight;
  if (storeScreenY < minTopLimit) storeScreenY = minTopLimit;

  const clampedX = Math.max(460, Math.min(1560, storeScreenX));
  bubble.style.left = `${clampedX}px`;
  bubble.style.top = `${storeScreenY}px`;
}

function showActionBubble(store, storeElement) {
  const bubble = document.getElementById("store-action-bubble");
  collapseBubbleDetails();

  document.getElementById("bubble-store-name").innerText = store.name;
  document.getElementById("bubble-store-cat-floor").innerText = `Poziom ${store.floor} • ${store.category}`;
  document.getElementById("bubble-store-logo").innerText = store.name.substring(0, 10);
  bubble.setAttribute("data-aoi", `store_actions_bubble_${store.id}`);

  bubble.classList.remove("hidden");
  positionBubbleOverStore(storeElement);
}

function expandBubbleDetails(storeId) {
  const store = STORES_CATALOG.find(s => s.id === storeId);
  if (!store) return;

  document.getElementById("bubble-expanded-details").classList.remove("hidden");
  document.getElementById("btn-show-modal").innerHTML = `<span aria-hidden="true">▲</span> Zwiń opis`;
  announce(`Szczegóły sklepu ${store.name}. Czynne od 9 do 21.`);
  loggerInstance.logEvent("EXPAND_STORE_DETAILS_BUBBLE", null, { storeId: store.id, storeName: store.name });
}

function collapseBubbleDetails() {
  const panel = document.getElementById("bubble-expanded-details");
  const infoBtn = document.getElementById("btn-show-modal");
  if (panel) panel.classList.add("hidden");
  if (infoBtn) infoBtn.innerHTML = `<span aria-hidden="true">ℹ️</span> O sklepie`;
}

function hideActionBubble() {
  const bubble = document.getElementById("store-action-bubble");
  collapseBubbleDetails();
  if (bubble) {
    bubble.classList.add("hidden");
    bubble.setAttribute("data-aoi", "store_actions_bubble");
  }
}

function initActionBubbleAndModal() {
  document.getElementById("btn-show-route").addEventListener("click", () => {
    if (selectedStoreId) openRouteSummaryModal(selectedStoreId);
  });

  document.getElementById("btn-show-modal").addEventListener("click", () => {
    if (!selectedStoreId) return;
    const panel = document.getElementById("bubble-expanded-details");
    const storeEl = document.getElementById(`store-${selectedStoreId}`);
    if (panel.classList.contains("hidden")) {
      expandBubbleDetails(selectedStoreId);
    } else {
      collapseBubbleDetails();
    }
    if (storeEl) positionBubbleOverStore(storeEl);
  });

  document.getElementById("btn-close-bubble").addEventListener("click", (e) => {
    e.stopPropagation();
    deselectStore(true);
  });

  document.getElementById("btn-map-back").addEventListener("click", () => {
    if (selectedStoreId && navHistory.length === 0) {
      deselectStore(true);
      return;
    }
    const prev = navHistory.pop();
    if (prev && prev.type === "module") {
      deselectStore(false);
      openModuleScreen(prev.screenId, prev.titleText, false);
    } else {
      deselectStore(true);
    }
    updateMapBackButton();
  });
}

// ========================================================
// PODSUMOWANIE TRASY (WCAG 3.3.4 + WYBÓR SCHODY / WINDA)
// ========================================================
function openRouteSummaryModal(storeId) {
  const store = STORES_CATALOG.find(s => s.id === storeId);
  if (!store) return;

  document.getElementById("summary-dest-name").innerText = store.name;
  document.getElementById("summary-dest-floor").innerText = store.floor === 0 ? "Poziom 0 (Parter)" : `Poziom ${store.floor}`;
  document.getElementById("summary-walk-time").innerText = store.floor === 1 ? "ok. 1–2 min" : "ok. 3–4 min (zmiana piętra)";

  const modeSelector = document.getElementById("route-mode-selector");
  if (store.floor !== 1) {
    modeSelector.classList.remove("hidden");
    // W trybie wózek domyślnie podpowiadamy windę
    setRouteMode(a11yState.wheelchair ? "elevator" : "escalator");
  } else {
    modeSelector.classList.add("hidden");
  }

  document.getElementById("route-summary-modal").classList.remove("hidden");
  announce(`Podsumowanie trasy do ${store.name}. Potwierdź lub anuluj.`);
}

function setRouteMode(mode) {
  selectedRouteMode = mode;
  document.getElementById("btn-mode-escalator").classList.toggle("active", mode === "escalator");
  document.getElementById("btn-mode-elevator").classList.toggle("active", mode === "elevator");
}

function initRouteSummaryModal() {
  const modal = document.getElementById("route-summary-modal");
  const close = () => modal.classList.add("hidden");

  document.getElementById("btn-close-route-summary").addEventListener("click", close);
  document.getElementById("btn-cancel-route-summary").addEventListener("click", () => {
    close();
    announce("Anulowano wyznaczanie trasy.");
  });

  document.getElementById("btn-mode-escalator").addEventListener("click", () => setRouteMode("escalator"));
  document.getElementById("btn-mode-elevator").addEventListener("click", () => setRouteMode("elevator"));

  document.getElementById("btn-confirm-route-summary").addEventListener("click", () => {
    close();
    if (selectedStoreId) executeRouteNavigation(selectedStoreId);
  });
}

// ========================================================
// PATHFINDING A* I AKTYWNA NAWIGACJA
// ========================================================
const GRID_CELL_SIZE = 5;

function buildGrid(plan) {
  const cols = Math.ceil(842 / GRID_CELL_SIZE);
  const rows = Math.ceil(595 / GRID_CELL_SIZE);
  const grid = [];

  const tempSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  tempSvg.setAttribute("viewBox", "0 0 842 595");
  tempSvg.style.position = "absolute";
  tempSvg.style.visibility = "hidden";
  document.body.appendChild(tempSvg);

  const baseEl = document.createElementNS("http://www.w3.org/2000/svg", "path");
  baseEl.setAttribute("d", plan.basePath || plan.corridorPath);
  baseEl.setAttribute("fill", "black");
  tempSvg.appendChild(baseEl);

  const allShapes = [...Object.values(plan.shops), ...Object.values(plan.emptyShops)];
  const elements = [];
  allShapes.forEach(shape => {
    const el = createSvgShape(shape);
    if (el) {
      el.setAttribute("fill", "black");
      tempSvg.appendChild(el);
      elements.push(el);
    }
  });

  for (let row = 0; row < rows; row++) {
    grid[row] = [];
    for (let col = 0; col < cols; col++) {
      const x = col * GRID_CELL_SIZE + GRID_CELL_SIZE / 2;
      const y = row * GRID_CELL_SIZE + GRID_CELL_SIZE / 2;
      let inBase = false;
      try { if (baseEl.isPointInFill(new DOMPoint(x, y))) inBase = true; } catch (e) {}
      let inBuilding = false;
      for (const el of elements) {
        try { if (el.isPointInFill(new DOMPoint(x, y))) { inBuilding = true; break; } } catch (e) {}
      }
      grid[row][col] = (inBase && !inBuilding) ? 1 : 0;
    }
  }

  document.body.removeChild(tempSvg);
  return grid;
}

function findPath(startX, startY, endX, endY, grid) {
  const cols = grid[0].length;
  const rows = grid.length;
  const startCol = Math.floor(startX / GRID_CELL_SIZE);
  const startRow = Math.floor(startY / GRID_CELL_SIZE);
  const endCol = Math.floor(endX / GRID_CELL_SIZE);
  const endRow = Math.floor(endY / GRID_CELL_SIZE);

  if (startCol < 0 || startCol >= cols || startRow < 0 || startRow >= rows) return null;
  if (endCol < 0 || endCol >= cols || endRow < 0 || endRow >= rows) return null;
  grid[endRow][endCol] = 1;

  const openSet = new Map();
  openSet.set(`${startCol},${startRow}`, { col: startCol, row: startRow, g: 0, f: 0, parent: null });
  const closedSet = new Set();
  const key = (c, r) => `${c},${r}`;
  const heuristic = (c, r) => Math.abs(c - endCol) + Math.abs(r - endRow);

  while (openSet.size > 0) {
    let currentKey = null;
    let currentF = Infinity;
    for (const [k, node] of openSet) {
      if (node.f < currentF) { currentF = node.f; currentKey = k; }
    }
    const current = openSet.get(currentKey);
    openSet.delete(currentKey);

    if (current.col === endCol && current.row === endRow) {
      const path = [];
      let node = current;
      while (node) {
        path.unshift({
          x: node.col * GRID_CELL_SIZE + GRID_CELL_SIZE / 2,
          y: node.row * GRID_CELL_SIZE + GRID_CELL_SIZE / 2
        });
        node = node.parent;
      }
      return path;
    }

    closedSet.add(key(current.col, current.row));
    const neighbors = [
      { dc: 0, dr: -1 }, { dc: 0, dr: 1 }, { dc: -1, dr: 0 }, { dc: 1, dr: 0 },
      { dc: -1, dr: -1 }, { dc: 1, dr: -1 }, { dc: -1, dr: 1 }, { dc: 1, dr: 1 }
    ];

    for (const n of neighbors) {
      const nc = current.col + n.dc;
      const nr = current.row + n.dr;
      if (nc < 0 || nc >= cols || nr < 0 || nr >= rows) continue;
      if (closedSet.has(key(nc, nr))) continue;

      const cellCost = grid[nr][nc] === 0 ? 1000 : 1;
      const cost = (n.dc !== 0 && n.dr !== 0) ? 1.414 : 1;
      const g = current.g + (cost * cellCost);
      const f = g + heuristic(nc, nr);

      const existing = openSet.get(key(nc, nr));
      if (existing) {
        if (g < existing.g) { existing.g = g; existing.f = f; existing.parent = current; }
      } else {
        openSet.set(key(nc, nr), { col: nc, row: nr, g, f, parent: current });
      }
    }
  }
  return null;
}

function getCenterOf(selector) {
  const layer = document.getElementById("stores-svg-layer");
  if (!layer) return null;
  const el = layer.querySelector(selector) || document.querySelector(selector);
  if (!el) return null;

  if (el instanceof SVGElement) {
    try {
      const bbox = el.getBBox();
      if (bbox.width === 0 && bbox.height === 0) return null;
      return { x: bbox.x + bbox.width / 2, y: bbox.y + bbox.height / 2 };
    } catch (e) { return null; }
  }

  const rect = el.getBoundingClientRect();
  if (rect.width === 0 && rect.height === 0) return null;
  const svg = document.getElementById("stores-svg");
  const svgRect = svg.getBoundingClientRect();
  return {
    x: (rect.left + rect.width / 2 - svgRect.left) / svgRect.width * 842,
    y: (rect.top + rect.height / 2 - svgRect.top) / svgRect.height * 595
  };
}

function drawSimplePath(x1, y1, x2, y2) {
  const pathSvg = document.getElementById("route-line");
  if (!pathSvg) return;

  let plan = null;
  if (currentActiveFloor === 0 && typeof FLOOR_PLAN_0 !== "undefined") plan = FLOOR_PLAN_0;
  else if (currentActiveFloor === 1 && typeof FLOOR_PLAN_1 !== "undefined") plan = FLOOR_PLAN_1;
  else if (currentActiveFloor === 2 && typeof FLOOR_PLAN_2 !== "undefined") plan = FLOOR_PLAN_2;

  if (!plan) {
    pathSvg.setAttribute("d", `M ${x1} ${y1} L ${x2} ${y2}`);
    return;
  }

  const grid = buildGrid(plan);
  const endCol = Math.floor(x2 / GRID_CELL_SIZE);
  const endRow = Math.floor(y2 / GRID_CELL_SIZE);
  if (grid[endRow] && grid[endRow][endCol] === 0) grid[endRow][endCol] = 1;

  const path = findPath(x1, y1, x2, y2, grid);
  if (!path || path.length === 0) {
    pathSvg.setAttribute("d", `M ${x1} ${y1} L ${x2} ${y2}`);
    return;
  }

  let d = `M ${x1} ${y1}`;
  path.forEach(pt => { d += ` L ${pt.x} ${pt.y}`; });
  d += ` L ${x2} ${y2}`;
  pathSvg.setAttribute("d", d);
}

function showRouteBanner(msg) {
  document.getElementById("route-banner-text").innerText = msg;
  document.getElementById("route-floor-banner").classList.remove("hidden");
}

function hideRouteBanner() {
  document.getElementById("route-floor-banner").classList.add("hidden");
}

function executeRouteNavigation(storeId) {
  const store = STORES_CATALOG.find(s => s.id === storeId);
  if (!store) return;

  hideActionBubble();
  updateMapProgress(3);
  activeRouteStoreId = storeId;
  activeRouteSecondFloor = store.floor !== 1 ? store.floor : null;
  routeShowingSecondFloor = false;

  document.getElementById("route-dismiss-container").classList.remove("hidden");
  document.getElementById("route-blocker-overlay").classList.remove("hidden");

  const switchBtn = document.getElementById("btn-route-switch-floor");
  const connectorSelector = selectedRouteMode === "elevator" ? "#elevators" : "#escalator-1";
  const connectorName = selectedRouteMode === "elevator" ? "windy" : "schodów ruchomych";

  if (store.floor === 1) {
    switchBtn.classList.add("hidden");
    if (currentActiveFloor !== 1) switchFloorTab(1);
    setTimeout(() => {
      const storeEl = document.getElementById(`store-${storeId}`);
      if (storeEl) {
        const bbox = storeEl.getBBox();
        const INFOMAT = getCenterOf("#you-are-here-pin") || { x: 421, y: 297.5 };
        drawSimplePath(INFOMAT.x, INFOMAT.y, bbox.x + bbox.width / 2, bbox.y + bbox.height / 2);
        const msg = `Trasa do: ${store.name} (Poziom 1)`;
        showRouteBanner(msg);
        announce(msg);
      }
    }, 200);
    return;
  }

  // Trasa wielopiętrowa z ręcznym przełączaniem pięter (brak pośpiechu dla użytkownika)
  switchBtn.classList.remove("hidden");
  renderMultiFloorLeg(store, connectorSelector, connectorName, false);
}

function renderMultiFloorLeg(store, connectorSelector, connectorName, showTargetFloor) {
  const switchBtn = document.getElementById("btn-route-switch-floor");
  routeShowingSecondFloor = showTargetFloor;

  if (!showTargetFloor) {
    if (currentActiveFloor !== 1) switchFloorTab(1);
    setTimeout(() => {
      const INFOMAT = getCenterOf("#you-are-here-pin") || { x: 421, y: 297.5 };
      const CONN = getCenterOf(connectorSelector) || { x: 421, y: 297.5 };
      drawSimplePath(INFOMAT.x, INFOMAT.y, CONN.x, CONN.y);
      const msg = `Część 1 z 2 (Poziom 1): Idź do ${connectorName}.`;
      showRouteBanner(msg);
      switchBtn.innerText = `Pokaż część 2 (Poziom ${store.floor}) →`;
      announce(msg);
    }, 200);
  } else {
    if (currentActiveFloor !== store.floor) switchFloorTab(store.floor);
    setTimeout(() => {
      const CONN = getCenterOf(connectorSelector) || { x: 421, y: 297.5 };
      const storeEl = document.getElementById(`store-${store.id}`);
      if (storeEl) {
        const bbox = storeEl.getBBox();
        drawSimplePath(CONN.x, CONN.y, bbox.x + bbox.width / 2, bbox.y + bbox.height / 2);
        const msg = `Część 2 z 2 (Poziom ${store.floor}): Idź od ${connectorName} do ${store.name}.`;
        showRouteBanner(msg);
        switchBtn.innerText = `← Pokaż część 1 (Poziom 1)`;
        announce(msg);
      }
    }, 200);
  }
}

function initRouteDismissButton() {
  document.getElementById("btn-route-switch-floor").addEventListener("click", () => {
    if (!activeRouteStoreId) return;
    const store = STORES_CATALOG.find(s => s.id === activeRouteStoreId);
    if (!store) return;
    const connectorSelector = selectedRouteMode === "elevator" ? "#elevators" : "#escalator-1";
    const connectorName = selectedRouteMode === "elevator" ? "windy" : "schodów ruchomych";
    renderMultiFloorLeg(store, connectorSelector, connectorName, !routeShowingSecondFloor);
  });

  document.getElementById("btn-route-ok").addEventListener("click", () => {
    dismissActiveRoute();
    announce("Zakończono prowadzenie po trasie.");
  });
}

function dismissActiveRoute() {
  const pathSvg = document.getElementById("route-line");
  if (pathSvg) pathSvg.setAttribute("d", "");
  hideRouteBanner();
  activeRouteStoreId = null;
  activeRouteSecondFloor = null;
  document.getElementById("route-dismiss-container").classList.add("hidden");
  document.getElementById("route-blocker-overlay").classList.add("hidden");
  deselectStore(true);
}

// ========================================================
// ZMIANA PIĘTER I "GDZIE JESTEM?"
// ========================================================
function switchFloorTab(floor) {
  const pathSvg = document.getElementById("route-line");
  if (pathSvg) pathSvg.setAttribute("d", "");
  if (!activeRouteStoreId) deselectStore(false);

  currentActiveFloor = floor;
  document.querySelectorAll(".floor-btn").forEach(btn => {
    btn.classList.toggle("active", parseInt(btn.getAttribute("data-floor"), 10) === floor);
  });
  loggerInstance.setFloor(floor);
  renderStoresForFloor(floor);
}

function initFloorNavigation() {
  document.querySelectorAll(".floor-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      if (activeRouteStoreId) return;
      const floor = parseInt(btn.getAttribute("data-floor"), 10);
      switchFloorTab(floor);
      announce(floor === 0 ? "Wybrano Poziom 0, Parter." : `Wybrano Poziom ${floor}.`);
    });
  });

  const whereBtn = document.getElementById("btn-where-am-i");
  whereBtn.addEventListener("click", () => {
    if (activeRouteStoreId) return;
    deselectStore(false);
    mapState.panX = 0;
    mapState.panY = 0;
    mapState.scale = DEFAULT_MAP_SCALE;
    updateMapTransform(true);

    if (currentActiveFloor !== 1) switchFloorTab(1);
    announce("Jesteś na Poziomie 1, przy głównym infomacie.");
  });
}

// ========================================================
// OKNA MODUŁOWE + PRZYCISK WSTECZ
// ========================================================
function initModuleScreenWindow() {
  document.getElementById("btn-close-screen-window").addEventListener("click", () => {
    navHistory = [];
    returnToGalleryMap(true);
  });

  document.getElementById("btn-module-back").addEventListener("click", () => {
    const prev = navHistory.pop();
    if (prev && prev.type === "module") {
      openModuleScreen(prev.screenId, prev.titleText, false);
    } else {
      returnToGalleryMap(true);
    }
  });
}

function openModuleScreen(screenId, titleText, pushHistory = true) {
  if (pushHistory && currentModuleState && currentModuleState.screenId !== screenId) {
    navHistory.push({ type: "module", ...currentModuleState });
  } else if (pushHistory && !currentModuleState) {
    navHistory.push({ type: "map", floor: currentActiveFloor });
  }

  deselectStore(false);
  dismissActiveRoute();

  currentModuleState = { screenId, titleText };
  document.getElementById("module-screen-title").innerText = titleText;
  updateModuleBreadcrumb(screenId, titleText);

  document.querySelectorAll(".tab-view-content").forEach(view => view.classList.add("hidden"));
  const targetView = document.getElementById(`view-${screenId}`);
  if (targetView) targetView.classList.remove("hidden");

  document.getElementById("module-screen-window").classList.remove("hidden");
  loggerInstance.setScreen(screenId);
  announce(`Otwarto zakładkę ${titleText}.`);
}

function returnToGalleryMap(announceBack = false) {
  document.getElementById("module-screen-window").classList.add("hidden");
  currentModuleState = null;

  document.querySelectorAll(".top-square-btn").forEach(b => b.classList.remove("active"));
  document.querySelectorAll(".side-btn").forEach(b => b.classList.remove("active"));
  const planBtn = document.querySelector('.side-btn[data-screen="ekran_plan"]');
  if (planBtn) planBtn.classList.add("active");

  updateMapBackButton();
  loggerInstance.setScreen("ekran_plan");
  if (announceBack) announce("Powrót do planu galerii.");
}

function initTopSquareNavigation() {
  const topButtons = document.querySelectorAll(".top-square-btn");
  topButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const screenTarget = btn.getAttribute("data-screen");
      const labelText = btn.querySelector(".label").innerText.replace(/\n/g, " ");
      topButtons.forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".side-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      openModuleScreen(screenTarget, labelText, true);
    });
  });
}

function initSideNavigation() {
  const sideButtons = document.querySelectorAll(".side-btn");
  sideButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const screenTarget = btn.getAttribute("data-screen");
      const labelText = btn.querySelector(".side-title").innerText;
      document.querySelectorAll(".top-square-btn").forEach(b => b.classList.remove("active"));
      sideButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      if (screenTarget === "ekran_plan") {
        navHistory = [];
        returnToGalleryMap(true);
      } else {
        openModuleScreen(screenTarget, labelText, true);
      }
    });
  });
}

function navigateToStoreOnMap(storeId) {
  const store = STORES_CATALOG.find(s => s.id === storeId);
  if (!store) return;

  if (currentModuleState) {
    navHistory.push({ type: "module", ...currentModuleState });
  }
  returnToGalleryMap(false);

  if (currentActiveFloor !== store.floor) switchFloorTab(store.floor);
  setTimeout(() => {
    handleStoreClick(store);
  }, 120);

  loggerInstance.logEvent("NAVIGATE_STORE_FROM_TAB", null, { storeId, storeName: store.name });
}

// ========================================================
// OPŁATA ZA PARKING (PODSUMOWANIE PRZED PŁATNOŚCIĄ + ANULOWANIE)
// ========================================================
function initParkingPayModal() {
  const modal = document.getElementById("parking-pay-modal");
  const stepLabel = document.getElementById("parking-pay-step-label");
  const s1 = document.getElementById("parking-step-1");
  const s2 = document.getElementById("parking-step-2");
  const s3 = document.getElementById("parking-step-3");

  const showStep = (num) => {
    s1.classList.toggle("hidden", num !== 1);
    s2.classList.toggle("hidden", num !== 2);
    s3.classList.toggle("hidden", num !== 3);
    const titles = {
      1: "Krok 1 z 3 • Wybierz czas postoju",
      2: "Krok 2 z 3 • Podsumowanie przed płatnością",
      3: "Krok 3 z 3 • Potwierdzenie opłaty"
    };
    stepLabel.innerText = titles[num];
  };

  const closeModal = () => {
    modal.classList.add("hidden");
  };

  document.getElementById("btn-open-parking-pay").addEventListener("click", () => {
    showStep(1);
    modal.classList.remove("hidden");
    announce("Opłata za bilet parkingowy. Krok 1: wybierz czas postoju.");
  });

  document.querySelectorAll(".tariff-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tariff-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      selectedParkingTariff = {
        hours: btn.querySelector("strong").innerText,
        price: btn.getAttribute("data-price")
      };
    });
  });

  document.getElementById("btn-parking-next-2").addEventListener("click", () => {
    document.getElementById("pay-summary-hours").innerText = selectedParkingTariff.hours;
    document.getElementById("pay-summary-price").innerText = selectedParkingTariff.price;
    showStep(2);
    announce(`Podsumowanie przed płatnością. Kwota ${selectedParkingTariff.price}. Potwierdź lub anuluj.`);
  });

  document.getElementById("btn-parking-back-1").addEventListener("click", () => showStep(1));
  document.getElementById("btn-parking-cancel-1").addEventListener("click", closeModal);
  document.getElementById("btn-parking-cancel-2").addEventListener("click", () => {
    closeModal();
    announce("Anulowano płatność za parking.");
  });
  document.getElementById("btn-close-parking-pay").addEventListener("click", closeModal);

  document.getElementById("btn-parking-confirm-pay").addEventListener("click", () => {
    showStep(3);
    announce("Płatność zakończona pomyślnie. Masz 15 minut na wyjazd.");
    loggerInstance.logEvent("PARKING_PAY_CONFIRMED", null, selectedParkingTariff);
  });

  document.getElementById("btn-parking-done").addEventListener("click", closeModal);
}

// ========================================================
// MODUŁY ZAKŁADEK (SKLEPY, GASTRO, USŁUGI, KINO, SZUKAJ, AKTUALNOŚCI, PROMOCJE, AUTOBUSY)
// ========================================================
function initStoresDirectoryModule() {
  const categoriesContainer = document.getElementById("stores-categories-list");
  if (!categoriesContainer) return;

  const allCategories = Array.from(new Set(STORES_CATALOG.map(s => s.category))).sort();
  categoriesContainer.innerHTML = "";

  const createCatBtn = (label, count, value) => {
    const btn = document.createElement("button");
    btn.className = `category-filter-btn ${value === "ALL" ? "active" : ""}`;
    btn.setAttribute("data-aoi", `btn_cat_${value}`);
    btn.innerHTML = `<span>${label}</span><span class="cat-count-badge">${count}</span>`;
    btn.addEventListener("click", () => {
      document.querySelectorAll(".category-filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentStoreCategoryFilter = value;
      renderFilteredStoresCatalog(value);
      updateModuleBreadcrumb("ekran_sklepy", "SKLEPY", label);
    });
    return btn;
  };

  categoriesContainer.appendChild(createCatBtn("Wszystkie", STORES_CATALOG.length, "ALL"));
  allCategories.forEach(cat => {
    const count = STORES_CATALOG.filter(s => s.category === cat).length;
    categoriesContainer.appendChild(createCatBtn(cat, count, cat));
  });

  renderFilteredStoresCatalog("ALL");
}

function renderFilteredStoresCatalog(category) {
  const catalogGrid = document.getElementById("stores-catalog-grid");
  const labelEl = document.getElementById("stores-active-cat-label");
  catalogGrid.innerHTML = "";

  const filtered = category === "ALL" ? STORES_CATALOG : STORES_CATALOG.filter(s => s.category === category);
  labelEl.innerText = category === "ALL" ? `Wszystkie sklepy (${filtered.length})` : `${category} (${filtered.length})`;

  filtered.forEach(store => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "store-dir-card";
    card.setAttribute("data-aoi", `card_store_dir_${store.id}`);
    card.innerHTML = `
      <div class="store-dir-logo-box">${store.name.substring(0, 10)}</div>
      <div class="store-dir-name">${store.name}</div>
      <div class="store-dir-floor">Poziom ${store.floor} • ${store.category}</div>
    `;
    card.addEventListener("click", () => navigateToStoreOnMap(store.id));
    catalogGrid.appendChild(card);
  });
}

function initRestaurantsGridModule() {
  const container = document.getElementById("restaurants-grid");
  if (!container) return;
  container.innerHTML = "";

  const gastroCategories = ["Kawiarnia", "Lody", "Gastronomia", "Gastro", "Kawiarnia/Lody", "Piekarnia", "Herbata"];
  STORES_CATALOG.filter(s => gastroCategories.includes(s.category)).forEach(store => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "grid-tile-card";
    card.setAttribute("data-aoi", `card_gastro_${store.id}`);
    card.innerHTML = `
      <div class="grid-tile-logo-box">${store.name.substring(0, 12)}</div>
      <div class="grid-tile-name">${store.name}</div>
      <div class="grid-tile-cat">${store.category}</div>
      <div class="grid-tile-floor">Poziom ${store.floor}</div>
    `;
    card.addEventListener("click", () => navigateToStoreOnMap(store.id));
    container.appendChild(card);
  });
}

function initServicesGridModule() {
  const container = document.getElementById("services-grid");
  if (!container) return;
  container.innerHTML = "";

  const serviceCategories = ["Usługi", "Finanse", "Bankowość", "Telekomunikacja", "GSM", "Optyk", "Zdrowie", "Podróże", "Upominki", "Kwiaty"];
  STORES_CATALOG.filter(s => serviceCategories.includes(s.category)).forEach(store => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "grid-tile-card";
    card.setAttribute("data-aoi", `card_service_${store.id}`);
    card.innerHTML = `
      <div class="grid-tile-logo-box">${store.name.substring(0, 12)}</div>
      <div class="grid-tile-name">${store.name}</div>
      <div class="grid-tile-cat">${store.category}</div>
      <div class="grid-tile-floor">Poziom ${store.floor}</div>
    `;
    card.addEventListener("click", () => navigateToStoreOnMap(store.id));
    container.appendChild(card);
  });

  const locateFitnessBtn = document.querySelector(".locate-store-btn");
  if (locateFitnessBtn) locateFitnessBtn.addEventListener("click", () => navigateToStoreOnMap("s2_cityfit"));

  const locateCinemaBtn = document.querySelector(".locate-cinema-btn");
  if (locateCinemaBtn) locateCinemaBtn.addEventListener("click", () => navigateToStoreOnMap("s2_cinema"));
}

let selectedCinemaLetter = "ALL";

function initCinemaRepertoireModule() {
  const filterBar = document.getElementById("cinema-alpha-filter");
  if (!filterBar) return;

  // Wyodrębnij tylko te pierwsze litery, dla których istnieją filmy w repertuarze
  const letters = Array.from(
    new Set(CINEMA_REPERTOIRE_DATA.map(m => m.title.trim().charAt(0).toUpperCase()))
  ).sort((a, b) => a.localeCompare(b, "pl"));

  filterBar.innerHTML = "";

  const allBtn = document.createElement("button");
  allBtn.type = "button";
  allBtn.className = "alpha-filter-btn active";
  allBtn.setAttribute("data-aoi", "btn_cinema_letter_ALL");
  allBtn.innerText = `WSZYSTKIE (${CINEMA_REPERTOIRE_DATA.length})`;
  allBtn.addEventListener("click", () => {
    selectedCinemaLetter = "ALL";
    setActiveCinemaLetterBtn(allBtn);
    renderCinemaMovies("ALL");
  });
  filterBar.appendChild(allBtn);

  letters.forEach(letter => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "alpha-filter-btn";
    btn.setAttribute("data-aoi", `btn_cinema_letter_${letter}`);
    btn.innerText = letter;
    btn.addEventListener("click", () => {
      selectedCinemaLetter = letter;
      setActiveCinemaLetterBtn(btn);
      renderCinemaMovies(letter);
    });
    filterBar.appendChild(btn);
  });

  renderCinemaMovies("ALL");
}

function setActiveCinemaLetterBtn(activeBtn) {
  document.querySelectorAll(".alpha-filter-btn").forEach(b => b.classList.remove("active"));
  activeBtn.classList.add("active");
}

function renderCinemaMovies(letterFilter) {
  const container = document.getElementById("cinema-repertoire-body");
  if (!container) return;
  container.innerHTML = "";

  const now = new Date();
  const currentTotalMins = now.getHours() * 60 + now.getMinutes();

  const filtered = letterFilter === "ALL"
    ? CINEMA_REPERTOIRE_DATA
    : CINEMA_REPERTOIRE_DATA.filter(m => m.title.trim().charAt(0).toUpperCase() === letterFilter);

  filtered.forEach(movie => {
    const card = document.createElement("div");
    card.className = "cinema-movie-card";
    card.setAttribute("data-aoi", `cinema_movie_${movie.title.replace(/\s+/g, "_")}`);

    let foundNext = false;
    const hoursHtml = movie.hours.map(h => {
      const [hh, mm] = h.split(":").map(Number);
      const seanceMins = hh * 60 + mm;
      if (seanceMins < currentTotalMins) {
        return `<span class="seance-chip past">${h}</span>`;
      }
      if (!foundNext) {
        foundNext = true;
        return `<span class="seance-chip next-up" title="Najbliższy seans">${h}</span>`;
      }
      return `<span class="seance-chip">${h}</span>`;
    }).join("");

    const dubbingHtml = movie.dubbing
      ? `<span class="dubbing-badge">DUBBING</span>`
      : `<span class="subtitles-badge">NAPISY</span>`;

    card.innerHTML = `
      <div class="cinema-movie-left">
        <div class="cinema-movie-title-row">
          <span class="movie-title-text">${movie.title}</span>
          ${dubbingHtml}
        </div>
        <span class="movie-meta-text">${movie.genre} • Czas trwania: ${movie.duration}</span>
      </div>
      <div class="cinema-movie-right">
        <div class="seance-hours-group">${hoursHtml}</div>
      </div>
    `;

    container.appendChild(card);
  });
}

function initSearchModule() {
  const keyboardWrapper = document.getElementById("onscreen-keyboard");
  const inputEl = document.getElementById("virtual-search-input");
  const clearBtn = document.getElementById("btn-clear-search");
  if (!keyboardWrapper || !inputEl) return;

  const keyboardLayout = [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ł"],
    ["Z", "X", "C", "V", "B", "N", "M", "Ą", "Ę", "Ó"],
    ["Ś", "Ć", "Ż", "Ź", "Ń", "SPACJA", "COFNIJ"]
  ];

  keyboardWrapper.innerHTML = "";
  keyboardLayout.forEach(rowKeys => {
    const rowEl = document.createElement("div");
    rowEl.className = "keyboard-row";

    rowKeys.forEach(key => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "key-btn";
      btn.setAttribute("data-aoi", `key_${key}`);

      if (key === "SPACJA") {
        btn.classList.add("key-space", "key-action");
        btn.innerText = "SPACJA";
        btn.addEventListener("click", () => {
          currentSearchQuery += " ";
          inputEl.value = currentSearchQuery;
          updateSearchResults(currentSearchQuery);
        });
      } else if (key === "COFNIJ") {
        btn.classList.add("key-backspace", "key-action");
        btn.innerText = "⌫ COFNIJ";
        btn.addEventListener("click", () => {
          currentSearchQuery = currentSearchQuery.slice(0, -1);
          inputEl.value = currentSearchQuery;
          updateSearchResults(currentSearchQuery);
        });
      } else {
        btn.innerText = key;
        btn.addEventListener("click", () => {
          currentSearchQuery += key;
          inputEl.value = currentSearchQuery;
          updateSearchResults(currentSearchQuery);
        });
      }
      rowEl.appendChild(btn);
    });
    keyboardWrapper.appendChild(rowEl);
  });

  clearBtn.addEventListener("click", () => {
    currentSearchQuery = "";
    inputEl.value = "";
    updateSearchResults("");
  });

  updateSearchResults("");
}

function updateSearchResults(query) {
  const resultsContainer = document.getElementById("search-results-list");
  const countBadge = document.getElementById("search-results-count");
  if (!resultsContainer) return;
  resultsContainer.innerHTML = "";

  const clean = query.trim().toLowerCase();
  const matched = clean === ""
    ? STORES_CATALOG
    : STORES_CATALOG.filter(s => s.name.toLowerCase().includes(clean) || s.category.toLowerCase().includes(clean));

  countBadge.innerText = `${matched.length} lokali`;

  if (matched.length === 0) {
    resultsContainer.innerHTML = `<div style="text-align:center;padding:24px;font-weight:700;">Nie znaleziono lokalu dla „${query}”. Spróbuj wpisać inną nazwę.</div>`;
    return;
  }

  matched.forEach(store => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "search-result-item";
    item.setAttribute("data-aoi", `search_result_${store.id}`);
    item.innerHTML = `
      <div class="res-logo-box">${store.name.substring(0, 8)}</div>
      <div class="res-info">
        <span class="res-name">${store.name}</span>
        <span class="res-cat">${store.category}</span>
      </div>
      <div class="res-floor">Poziom ${store.floor} →</div>
    `;
    item.addEventListener("click", () => navigateToStoreOnMap(store.id));
    resultsContainer.appendChild(item);
  });
}

function initNewsModule() {
  const container = document.getElementById("news-cards-container");
  if (!container) return;
  container.innerHTML = "";

  NEWS_DATA.forEach(item => {
    const card = document.createElement("div");
    card.className = "feed-card";
    card.innerHTML = `
      <div class="feed-thumbnail" style="background:${item.bgGradient};">
        <span class="feed-thumb-badge">${item.category}</span>
        <svg class="feed-thumb-svg" viewBox="0 0 24 24"><path fill="#FFFFFF" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
      </div>
      <div class="feed-details">
        <span class="feed-date">${item.date}</span>
        <h3 class="feed-title">${item.title}</h3>
        <p class="feed-desc">${item.desc}</p>
        <button class="btn-read-more" data-aoi="btn_read_news_${item.id}">Czytaj więcej →</button>
      </div>
    `;
    card.querySelector(".btn-read-more").addEventListener("click", () => {
      openNewsPromoModal({
        date: item.date,
        title: item.title,
        badge: item.category,
        bgGradient: item.bgGradient,
        fullText: item.fullText
      });
    });
    container.appendChild(card);
  });
}

function initPromoModule() {
  const container = document.getElementById("promo-cards-container");
  if (!container) return;
  container.innerHTML = "";

  PROMO_DATA.forEach(item => {
    const card = document.createElement("div");
    card.className = "feed-card";
    card.innerHTML = `
      <div class="feed-thumbnail" style="background:${item.bgGradient};">
        <span class="feed-thumb-badge">${item.category}</span>
        <svg class="feed-thumb-svg" viewBox="0 0 24 24"><path fill="#FFFFFF" d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z"/></svg>
      </div>
      <div class="feed-details">
        <span class="feed-date">${item.date}</span>
        <div class="feed-store-tag">Sklep: ${item.store}</div>
        <h3 class="feed-title">${item.title}</h3>
        <p class="feed-desc">${item.desc}</p>
        <button class="btn-read-more" data-aoi="btn_read_promo_${item.id}">Czytaj więcej →</button>
      </div>
    `;
    card.querySelector(".btn-read-more").addEventListener("click", () => {
      openNewsPromoModal({
        date: item.date,
        title: `${item.store} — ${item.title}`,
        badge: item.category,
        bgGradient: item.bgGradient,
        fullText: item.fullText
      });
    });
    container.appendChild(card);
  });
}

// ========================================================
// KOMUNIKACJA — ROZKŁAD PRZYSTANKU LUB ROZKŁAD LINII
// ========================================================
let transitViewMode = "stop"; // "stop" = wyłącznie tablica odjazdów z przystanku | "line" = wyłącznie rozkład linii

function initTransitModule() {
  const btnStopMode = document.getElementById("btn-mode-stop-departures");
  const btnLineMode = document.getElementById("btn-mode-line-schedule");

  if (btnStopMode && btnLineMode) {
    btnStopMode.addEventListener("click", () => switchTransitViewMode("stop"));
    btnLineMode.addEventListener("click", () => switchTransitViewMode("line"));
  }

  renderTransitStopsList();
  renderTransitLinesList(selectedStopId);
  switchTransitViewMode("stop");
}

function switchTransitViewMode(mode) {
  transitViewMode = mode;
  const btnStopMode = document.getElementById("btn-mode-stop-departures");
  const btnLineMode = document.getElementById("btn-mode-line-schedule");
  const stopBoard = document.getElementById("transit-stop-board");
  const lineWrapper = document.getElementById("transit-line-schedule-wrapper");

  if (btnStopMode) btnStopMode.classList.toggle("active", mode === "stop");
  if (btnLineMode) btnLineMode.classList.toggle("active", mode === "line");

  // Wyświetlanie TYLKO jednego widoku naraz
  if (mode === "stop") {
    stopBoard.classList.remove("hidden");
    lineWrapper.classList.add("hidden");
    renderStopDeparturesBoard(selectedStopId);
  } else {
    stopBoard.classList.add("hidden");
    lineWrapper.classList.remove("hidden");
    renderTransitSchedule(selectedStopId, selectedLineNum);
  }
}

function renderTransitStopsList() {
  const container = document.getElementById("transit-stops-list");
  if (!container) return;
  container.innerHTML = "";

  TRANSIT_DATA.forEach(stop => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `transit-stop-btn ${stop.stopId === selectedStopId ? "active" : ""}`;
    btn.setAttribute("data-aoi", `btn_transit_stop_${stop.stopId}`);
    btn.innerHTML = `<span>📍 ${stop.stopName}</span><span>${stop.lines.length} linii</span>`;

    btn.addEventListener("click", () => {
      selectedStopId = stop.stopId;
      selectedLineNum = stop.lines[0].num;
      renderTransitStopsList();
      renderTransitLinesList(selectedStopId);
      // Wybór przystanku wyświetla tablicę odjazdów dla tego przystanku
      switchTransitViewMode("stop");
    });

    container.appendChild(btn);
  });
}

function renderTransitLinesList(stopId) {
  const container = document.getElementById("transit-lines-list");
  if (!container) return;
  container.innerHTML = "";

  const stopData = TRANSIT_DATA.find(s => s.stopId === stopId);
  if (!stopData) return;

  stopData.lines.forEach(line => {
    const card = document.createElement("button");
    card.type = "button";
    // Podświetlenie aktywnej linii tylko wtedy, gdy oglądamy rozkład linii
    const isActive = (transitViewMode === "line" && line.num === selectedLineNum);
    card.className = `transit-line-card ${isActive ? "active" : ""}`;
    card.setAttribute("data-aoi", `card_transit_line_${line.num}`);

    // Wyłącznie numer linii oraz kierunek końcowy (bez powtarzania nazwy przystanku)
    card.innerHTML = `
      <div class="transit-line-num">${line.num}</div>
      <div class="transit-line-route">
        <span class="transit-route-arrow">➔</span>
        <span>Kierunek: ${line.dest}</span>
      </div>
    `;

    card.addEventListener("click", () => {
      selectedLineNum = line.num;
      switchTransitViewMode("line");
      renderTransitLinesList(stopId);
    });

    container.appendChild(card);
  });
}

function getUpcomingDeparturesForLine(lineData, nowDate, count = 3) {
  const nowTotalMins = nowDate.getHours() * 60 + nowDate.getMinutes();
  const allDepartures = [];

  lineData.schedule.forEach(row => {
    const h = parseInt(row.hour, 10);
    const minsArray = row.mins.split(",").map(m => parseInt(m.trim(), 10));
    minsArray.forEach(m => {
      const total = h * 60 + m;
      allDepartures.push({
        hourStr: row.hour,
        minStr: String(m).padStart(2, "0"),
        totalMins: total,
        diffMins: total - nowTotalMins
      });
    });
  });

  const upcoming = allDepartures.filter(d => d.diffMins >= 0).slice(0, count);
  if (upcoming.length === 0 && allDepartures.length > 0) {
    return allDepartures.slice(0, count).map(d => ({
      ...d,
      diffMins: d.totalMins + (24 * 60 - nowTotalMins),
      tomorrow: true
    }));
  }
  return upcoming;
}

// WIDOK 1: Rozkład przystanku (POSORTOWANY PO CZASIE DO ODJAZDU)
function renderStopDeparturesBoard(stopId) {
  const stopData = TRANSIT_DATA.find(s => s.stopId === stopId);
  const board = document.getElementById("transit-stop-board");
  if (!stopData || !board) return;

  const now = new Date();
  const timeStr = now.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" });

  document.getElementById("selected-line-badge").innerText = `${stopData.lines.length} LINIE`;
  document.getElementById("selected-stop-name").innerText = `Najbliższe odjazdy z przystanku:`;
  document.getElementById("selected-dest-name").innerText = stopData.stopName;
  document.getElementById("transit-now-pill").innerText = `Teraz: ${timeStr}`;

  board.innerHTML = "";
  board.scrollTop = 0;

  // Przygotowanie danych i SORTOWANIE ROSNĄCO PO CZASIE DO NAJBLIŻSZEGO ODJAZDU
  const sortedLines = stopData.lines
    .map(line => {
      const upcoming = getUpcomingDeparturesForLine(line, now, 3);
      const nextDiff = upcoming.length > 0 ? upcoming[0].diffMins : Number.MAX_SAFE_INTEGER;
      return { line, upcoming, nextDiff };
    })
    .sort((a, b) => a.nextDiff - b.nextDiff);

  sortedLines.forEach(({ line, upcoming }) => {
    const next = upcoming[0];

    let countdownLabel = "Brak kursów";
    let isImminent = false;

    if (next) {
      if (next.diffMins === 0) {
        countdownLabel = "ODJEŻDŻA TERAZ";
        isImminent = true;
      } else if (next.diffMins <= 60) {
        countdownLabel = `za ${next.diffMins} min (${next.hourStr}:${next.minStr})`;
        if (next.diffMins <= 5) isImminent = true;
      } else {
        countdownLabel = `${next.hourStr}:${next.minStr}${next.tomorrow ? " (jutro)" : ""}`;
      }
    }

    const followingStr = upcoming.length > 1
      ? "Kolejne: " + upcoming.slice(1).map(u => `${u.hourStr}:${u.minStr}`).join(", ")
      : "Ostatni kurs dzisiaj";

    const row = document.createElement("div");
    row.className = "stop-departure-row";
    row.setAttribute("data-aoi", `stop_board_line_${line.num}`);
    row.innerHTML = `
      <div class="stop-departure-left">
        <div class="transit-line-num">${line.num}</div>
        <div>
          <div class="stop-dep-dest">Kierunek: ${line.dest}</div>
          <div class="stop-dep-next-list">${followingStr}</div>
        </div>
      </div>
      <div class="stop-dep-countdown ${isImminent ? "imminent" : ""}">
        ${countdownLabel}
      </div>
    `;

    row.addEventListener("click", () => {
      selectedLineNum = line.num;
      switchTransitViewMode("line");
      renderTransitLinesList(stopId);
    });

    board.appendChild(row);
  });
}

// WIDOK 2: Rozkład godzinowy wybranej linii (BEZ PRZESUWANIA CAŁEGO EKRANU)
function renderTransitSchedule(stopId, lineNum) {
  const stopData = TRANSIT_DATA.find(s => s.stopId === stopId);
  if (!stopData) return;
  const lineData = stopData.lines.find(l => l.num === lineNum) || stopData.lines[0];
  if (!lineData) return;

  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const timeStr = now.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" });

  document.getElementById("selected-line-badge").innerText = lineData.num;
  document.getElementById("selected-stop-name").innerText = `Przystanek: ${lineData.stop}`;
  document.getElementById("selected-dest-name").innerText = `Kierunek: ${lineData.dest}`;
  document.getElementById("transit-now-pill").innerText = `Teraz: ${timeStr}`;

  const wrapper = document.getElementById("transit-line-schedule-wrapper");
  const tbody = document.getElementById("transit-schedule-body");
  tbody.innerHTML = "";

  let highlightedNextMinute = false;
  let currentRowElement = null;

  lineData.schedule.forEach(row => {
    const rowHour = parseInt(row.hour, 10);
    const tr = document.createElement("tr");

    if (rowHour < currentHour) {
      tr.classList.add("past-hour-row");
    } else if (rowHour === currentHour) {
      tr.classList.add("current-hour-row");
      currentRowElement = tr;
    }

    const minsChips = row.mins.split(",").map(mStr => {
      const mVal = parseInt(mStr.trim(), 10);
      const formattedMin = String(mVal).padStart(2, "0");

      if (rowHour < currentHour || (rowHour === currentHour && mVal < currentMinute)) {
        return `<span class="min-chip past-min">${formattedMin}</span>`;
      }
      if (!highlightedNextMinute) {
        highlightedNextMinute = true;
        return `<span class="min-chip next-min" title="Najbliższy odjazd">${formattedMin}</span>`;
      }
      return `<span class="min-chip">${formattedMin}</span>`;
    }).join("");

    const nowBadge = (rowHour === currentHour) ? `<span class="now-tag">TERAZ</span>` : "";

    tr.innerHTML = `
      <td class="td-hour">${row.hour}:00 ${nowBadge}</td>
      <td class="td-minutes">${minsChips}</td>
    `;
    tbody.appendChild(tr);
  });

  // Bezpieczne przewinięcie WYŁĄCZNIE wewnątrz tabeli (nie rusza głównego okna #kiosk-app!)
  if (wrapper && currentRowElement) {
    requestAnimationFrame(() => {
      const targetOffset = currentRowElement.offsetTop - wrapper.clientHeight / 2 + currentRowElement.clientHeight / 2;
      wrapper.scrollTop = Math.max(0, targetOffset);
    });
  }
}

function initNewsPromoModalEvents() {
  const modal = document.getElementById("news-promo-modal");
  const close = () => modal.classList.add("hidden");
  document.getElementById("btn-close-news-modal").addEventListener("click", close);
  document.getElementById("btn-close-news-modal-bottom").addEventListener("click", close);
}

function openNewsPromoModal(data) {
  const modal = document.getElementById("news-promo-modal");
  document.getElementById("news-modal-date").innerText = data.date;
  document.getElementById("news-modal-title").innerText = data.title;
  document.getElementById("news-modal-badge").innerText = data.badge;
  document.getElementById("news-modal-img").style.background = data.bgGradient;
  document.getElementById("news-modal-text").innerText = data.fullText;
  modal.classList.remove("hidden");
  loggerInstance.logEvent("MODAL_OPEN_NEWS_PROMO", null, { title: data.title });
}

function initResearcherDock() {
  const btnToggle = document.getElementById("btn-toggle-researcher");
  const menu = document.getElementById("researcher-menu");
  btnToggle.addEventListener("click", () => menu.classList.toggle("hidden"));
  document.getElementById("btn-export-events").addEventListener("click", () => loggerInstance.exportEventsCSV());
  document.getElementById("btn-export-aoi").addEventListener("click", () => loggerInstance.exportAoiCSV());
  document.getElementById("btn-clear-events").addEventListener("click", () => loggerInstance.clearLogs());
}
