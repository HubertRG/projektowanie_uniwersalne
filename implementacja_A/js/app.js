/**
 * Główny kontroler aplikacji infomatu (v6):
 * - Pełna implementacja górnych zakładek:
 *   1. SKLEPY: 2 kolumny (kategorie z lewej, kafelki sklepów z logiem i nazwą z prawej).
 *   2. RESTAURACJE I KAWIARNIE: kafelki 4 kolumny x 3 wiersze z logiem i nazwą.
 *   3. KLUB FITNESS: 2 kolumny (logo, kontakt, godziny z lewej; opis i organizacja z prawej).
 *   4. USŁUGI: kafelki 4 kolumny x 3 wiersze z logiem i nazwą.
 *   5. REPERTUAR KINA: 2 kolumny (tytuł filmu | godziny seansów + pojedynczy napis DUBBING).
 *   6. SZUKAJ: lewa ~3/4 (pole tekstowe + klawiatura ekranowa), prawa (proponowane wyniki na żywo).
 * - Kliknięcie w dowolny sklep przenosi bezpośrednio na mapę, ustawia piętro i podświetla lokal.
 * - Zachowanie modułów dolnych (Aktualności, Promocje, Komunikacja, Parking).
 */

let loggerInstance = null;
let currentActiveFloor = 1;
let selectedStoreId = null;
let activeRouteStoreId = null;

const MIN_MAP_SCALE = 0.88; // Maksymalne oddalenie
const MAX_MAP_SCALE = 1.80; // Maksymalne przybliżenie
const BASE_MAX_PAN_X = 350; // Bazowe ograniczenie w osi X
const BASE_MAX_PAN_Y = 250; // Bazowe ograniczenie w osi Y

const NAV_WAYPOINTS = {
  0: [
    { id: "center", x: 421, y: 300 },   // środek głównego korytarza
    { id: "left",   x: 150, y: 300 },   // lewy koniec korytarza
    { id: "right",  x: 700, y: 300 },   // prawy koniec korytarza
    { id: "top_l",  x: 300, y: 200 },   // górny korytarz (lewa)
    { id: "top_r",  x: 550, y: 200 },   // górny korytarz (prawa)
    { id: "bot_l",  x: 300, y: 400 },   // dolny korytarz (lewa)
    { id: "bot_r",  x: 550, y: 400 }    // dolny korytarz (prawa)
  ],
  1: [ /* analogicznie – do uzupełnienia */ ],
  2: [ /* analogicznie – do uzupełnienia */ ]
};

let mapState = {
  panX: 0,
  panY: 0,
  scale: MIN_MAP_SCALE,
  isDragging: false,
  isPinching: false,
  startX: 0,
  startY: 0,
  initialPinchDist: 0,
  initialPinchScale: MIN_MAP_SCALE
};

// Stan wyszukiwarki
let currentSearchQuery = "";
let currentStoreCategoryFilter = "ALL";

let selectedStopId = "stop_ogrod_saski_01";
let selectedLineNum = "20";

document.addEventListener("DOMContentLoaded", () => {
  updateKioskAspectRatio();
  window.addEventListener("resize", updateKioskAspectRatio);

  loggerInstance = new EyeTrackerLogger();
  loggerInstance.setFloor(1);

  initClock();
  initMapPanning();
  renderStoresForFloor(currentActiveFloor);
  initFloorNavigation();
  initTopSquareNavigation();
  initSideNavigation();
  initModuleScreenWindow();
  initActionBubbleAndModal();
  initRouteDismissButton();
  initResearcherDock();

  // Inicjalizacja górnych zakładek
  initStoresDirectoryModule();
  initRestaurantsGridModule();
  initServicesGridModule();
  initCinemaRepertoireModule();
  initSearchModule();

  // Inicjalizacja bocznych zakładek
  initNewsModule();
  initPromoModule();
  initTransitModule();
  initNewsPromoModalEvents();
});

function updateKioskAspectRatio() {
  const kiosk = document.getElementById("kiosk-app");
  if (!kiosk) return;

  const targetW = 1920;
  const targetH = 1080;
  const winW = window.innerWidth;
  const winH = window.innerHeight;

  // Jeśli ekran ma dokładnie 1920x1080 (Full HD), scale = 1 (rzeczywisty rozmiar 1:1)
  if (winW === targetW && winH === targetH) {
    kiosk.style.transform = "scale(1)";
    return;
  }

  // Dla ekranów o innych proporcjach lub rozdzielczościach zachowaj idealne 16:9
  // (nie rozciągając obrazu, resztę wypełnia tło body)
  const scaleX = winW / targetW;
  const scaleY = winH / targetH;
  const scale = Math.min(scaleX, scaleY);

  kiosk.style.transform = `scale(${scale})`;
}

function updateMapTransform(animate = true) {
  const stage = document.getElementById("map-stage");
  if (!stage) return;

  // Podczas gestu wyłączamy transition, aby mapa reagowała natychmiast na ruch palca
  stage.style.transition = animate ? "transform 0.35s cubic-bezier(0.25, 1, 0.5, 1)" : "none";

  // Nałożenie limitów na przesunięcie
  const clamped = clampPan(mapState.panX, mapState.panY, mapState.scale);
  mapState.panX = clamped.x;
  mapState.panY = clamped.y;

  stage.style.transform = `translate(${mapState.panX}px, ${mapState.panY}px) rotateX(46deg) rotateZ(-34deg) scale(${mapState.scale})`;
}

function clampPan(x, y, scale) {
  // Im większy zoom, tym większy margines swobodnego przesuwania
  const currentMaxX = BASE_MAX_PAN_X * (scale / MIN_MAP_SCALE);
  const currentMaxY = BASE_MAX_PAN_Y * (scale / MIN_MAP_SCALE);

  const clampedX = Math.max(-currentMaxX, Math.min(currentMaxX, x));
  const clampedY = Math.max(-currentMaxY, Math.min(currentMaxY, y));

  return { x: clampedX, y: clampedY };
}

// Obliczanie odległości między dwoma punktami dotyku (do gestu pinch)
function getTouchDistance(touches) {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.hypot(dx, dy);
}

// ========================================================
// OBSŁUGA GESTÓW: PRZESUWANIE + PINCH-TO-ZOOM
// ========================================================
function initMapPanning() {
  const viewport = document.getElementById("map-viewport");

  // --- MYSZ (DESKTOP) ---
  const startDragMouse = (e) => {
    if (activeRouteStoreId) return;
    if (e.target.closest("button") || e.target.closest(".store-block") || e.target.closest(".map-facility-marker")) return;

    mapState.isDragging = true;
    mapState.startX = e.clientX - mapState.panX;
    mapState.startY = e.clientY - mapState.panY;
  };

  const onDragMouse = (e) => {
    if (!mapState.isDragging) return;
    mapState.panX = e.clientX - mapState.startX;
    mapState.panY = e.clientY - mapState.startY;
    updateMapTransform(false); // Płynne śledzenie bez opóźnienia CSS
    hideActionBubble();
  };

  const endDragMouse = (e) => {
    if (mapState.isDragging) {
      mapState.isDragging = false;
      updateMapTransform(true); // Płynne zatrzymanie z clampem
      if (e.target.id === "building-base" || e.target.id === "corridor-layer" || e.target.id === "map-viewport") {
        deselectStore(true);
      }
    }
  };

  viewport.addEventListener("mousedown", startDragMouse);
  window.addEventListener("mousemove", onDragMouse);
  window.addEventListener("mouseup", endDragMouse);

  // Dodatkowo: zoom kółkiem myszy (ułatwia testowanie bez ekranu dotykowego)
  viewport.addEventListener("wheel", (e) => {
    if (activeRouteStoreId) return;
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 0.08 : -0.08;
    mapState.scale = Math.max(MIN_MAP_SCALE, Math.min(MAX_MAP_SCALE, mapState.scale + zoomFactor));
    updateMapTransform(true);
    hideActionBubble();
  }, { passive: false });

  // --- EKRAN DOTYKOWY (1 PALEC: PRZESUWANIE, 2 PALCE: PINCH-TO-ZOOM) ---
  viewport.addEventListener("touchstart", (e) => {
    if (activeRouteStoreId) return;

    if (e.touches.length === 2) {
      // Rozpoczęcie gestu Pinch
      mapState.isPinching = true;
      mapState.isDragging = false;
      mapState.initialPinchDist = getTouchDistance(e.touches);
      mapState.initialPinchScale = mapState.scale;
      hideActionBubble();
    } else if (e.touches.length === 1) {
      if (e.target.closest("button") || e.target.closest(".store-block") || e.target.closest(".map-facility-marker")) return;
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
        const factor = currentDist / mapState.initialPinchDist;
        const newScale = mapState.initialPinchScale * factor;
        // Ograniczenie skali
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
      if (e.target.id === "building-base" || e.target.id === "corridor-layer" || e.target.id === "map-viewport") {
        deselectStore(true);
      }
    }
  };

  window.addEventListener("touchend", endTouch);
  window.addEventListener("touchcancel", endTouch);
}

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

function renderStoresForFloor(floor) {
  const svgLayer = document.getElementById("stores-svg-layer");
  const amenitiesContainer = document.getElementById("map-amenities-layer");
  const grid = document.getElementById("stores-puzzle-grid");
  if (!svgLayer || !amenitiesContainer) return;

  // Czyść WSZYSTKO – SVG, grid i amenities
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
    
    // Najpierw renderuj puste (szare) lokale
    Object.entries(plan.emptyShops).forEach(([id, shape]) => {
      const el = createSvgShape(shape);
      el.setAttribute("class", "empty-shop");
      el.setAttribute("pointer-events", "none");
      svgLayer.appendChild(el);
    });

    // Potem Twoje sklepy (klikalne)
    Object.entries(plan.shops).forEach(([id, shop]) => {
      const el = createSvgShape(shop);
      el.setAttribute("class", "shop-polygon");
      el.setAttribute("id", `store-${shop.storeId}`);
      el.setAttribute("data-store-id", shop.storeId);
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        const store = STORES_CATALOG.find(s => s.id === shop.storeId);
        if (store) handleStoreClick(store);
      });
      svgLayer.appendChild(el);

      const bbox = el.getBBox();
      const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
      label.setAttribute("x", bbox.x + bbox.width / 2);
      label.setAttribute("y", bbox.y + bbox.height / 2);
      label.setAttribute("class", "shop-label");
      label.setAttribute("data-label-for", shop.storeId);
      label.textContent = shop.label;
      svgLayer.appendChild(label);
      
    });

    if (plan.iconsSvg) {
   const iconsWrapper = document.createElementNS("http://www.w3.org/2000/svg", "g");
  iconsWrapper.setAttribute("id", "floor-icons");
  iconsWrapper.innerHTML = plan.iconsSvg;
  svgLayer.appendChild(iconsWrapper);

  // Dla KAŻDEJ grupy rysujemy dymek
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
    group.insertBefore(rect, group.firstChild); // W ŚRODKU grupy, jako pierwsze dziecko
  });
}
  } else {
    renderStoresGridFallback(floor, amenitiesContainer);
  }

  // 3. Udogodnienia (div-y nałożone)
  // const amenities = AMENITIES_CATALOG.filter(a => a.floor === floor);
  // amenities.forEach(am => {
  //   const marker = document.createElement("div");
  //   marker.className = "map-facility-marker";
  //   marker.style.left = `${am.x}%`;
  //   marker.style.top = `${am.y}%`;
  //   marker.setAttribute("data-aoi", `aoi_fac_${am.type}_floor${floor}`);
  //   marker.innerHTML = `<svg viewBox="0 0 24 24">${am.icon}</svg><span class="marker-label">${am.label}</span>`;
  //   amenitiesContainer.appendChild(marker);
  // });
  amenitiesContainer.innerHTML = "";
}

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
  }
  return el;
}

function renderStoresGridFallback(floor, amenitiesContainer) {
  const grid = document.getElementById("stores-puzzle-grid");
  if (!grid) return;
  grid.innerHTML = "";
  grid.style.display = "grid";

  const stores = STORES_CATALOG.filter(s => s.floor === floor);
  stores.forEach(store => {
    const block = document.createElement("div");
    block.className = `store-block ${store.isLarge ? "large-store" : "small-store"}`;
    block.id = `store-${store.id}`;
    block.style.gridColumn = `${store.col} / span ${store.w}`;
    block.style.gridRow = `${store.row} / span ${store.h}`;
    block.innerHTML = `<div class="store-brand-box">${store.name.substring(0,12)}</div><div class="store-caption">${store.name}</div>`;
    block.addEventListener("click", (e) => { e.stopPropagation(); handleStoreClick(store); });
    grid.appendChild(block);
  });

  const amenities = AMENITIES_CATALOG.filter(a => a.floor === floor);
  amenities.forEach(am => {
    const marker = document.createElement("div");
    marker.className = "map-facility-marker";
    marker.style.left = `${am.x}%`;
    marker.style.top = `${am.y}%`;
    marker.innerHTML = `<svg viewBox="0 0 24 24">${am.icon}</svg><span class="marker-label">${am.label}</span>`;
    amenitiesContainer.appendChild(marker);
  });
}

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

// Fallback dla pięter 1 i 2 (stara siatka) – do czasu, aż dodasz ich plany
function renderStoresGridFallback(floor, amenitiesContainer) {
  const grid = document.getElementById("stores-puzzle-grid");
  if (!grid) return;
  grid.innerHTML = "";
  grid.style.display = "grid";

  const stores = STORES_CATALOG.filter(s => s.floor === floor);
  stores.forEach(store => {
    const block = document.createElement("div");
    block.className = `store-block ${store.isLarge ? "large-store" : "small-store"}`;
    block.id = `store-${store.id}`;
    block.style.gridColumn = `${store.col} / span ${store.w}`;
    block.style.gridRow = `${store.row} / span ${store.h}`;
    block.innerHTML = `<div class="store-brand-box">${store.name.substring(0,12)}</div><div class="store-caption">${store.name}</div>`;
    block.addEventListener("click", (e) => { e.stopPropagation(); handleStoreClick(store); });
    grid.appendChild(block);
  });

  const amenities = AMENITIES_CATALOG.filter(a => a.floor === floor);
  amenities.forEach(am => {
    const marker = document.createElement("div");
    marker.className = "map-facility-marker";
    marker.style.left = `${am.x}%`;
    marker.style.top = `${am.y}%`;
    marker.innerHTML = `<svg viewBox="0 0 24 24">${am.icon}</svg><span class="marker-label">${am.label}</span>`;
    amenitiesContainer.appendChild(marker);
  });
}

function deselectStore(resetZoom = true) {
  if (selectedStoreId) {
    const prevBlock = document.getElementById(`store-${selectedStoreId}`);
    if (prevBlock) {
      prevBlock.classList.remove("selected");
    }
    selectedStoreId = null;
  }
  hideActionBubble();

  if (resetZoom) {
    mapState.scale = 0.88;
    updateMapTransform();
  }
}

function handleStoreClick(store) {
  const clickedBlock = document.getElementById(`store-${store.id}`);

  if (selectedStoreId === store.id) {
    deselectStore(true);
  } else {
    if (selectedStoreId) {
      const prevBlock = document.getElementById(`store-${selectedStoreId}`);
      if (prevBlock) prevBlock.classList.remove("selected");
    }

    clickedBlock.classList.add("selected");
    selectedStoreId = store.id;

    mapState.scale = 1.04;
    if (store.row <= 3) {
      mapState.panY = Math.max(mapState.panY, 150);
    }
    updateMapTransform(true);

    showActionBubble(store, clickedBlock);
    setTimeout(() => {
      if (selectedStoreId === store.id) {
        positionBubbleOverStore(clickedBlock);
      }
    }, 360);
  }
}

function positionBubbleOverStore(storeElement) {
  const bubble = document.getElementById("store-action-bubble");
  if (!bubble || !storeElement || bubble.classList.contains("hidden")) return;

  const rect = storeElement.getBoundingClientRect();
  const kioskRect = document.getElementById("kiosk-app").getBoundingClientRect();
  const scale = kioskRect.width / 1920;

  const storeScreenX = (rect.left + rect.width / 2 - kioskRect.left) / scale;
  let storeScreenY = (rect.top - kioskRect.top) / scale - 14;

  const bubbleHeight = bubble.offsetHeight || 135;
  const minTopLimit = 165 + bubbleHeight;
  if (storeScreenY < minTopLimit) {
    storeScreenY = minTopLimit;
  }

  const clampedX = Math.max(460, Math.min(1620, storeScreenX));

  bubble.style.left = `${clampedX}px`;
  bubble.style.top = `${storeScreenY}px`;
}

function offsetRelativeTo(el, ancestor) {
  let x = 0, y = 0;
  let node = el;
  while (node && node !== ancestor) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent;
  }
  return { x, y };
}

function showActionBubble(store, storeElement) {
  const bubble = document.getElementById("store-action-bubble");
  const title = document.getElementById("bubble-store-name");
  const subtitle = document.getElementById("bubble-store-cat-floor");
  const logoBox = document.getElementById("bubble-store-logo");

  if (!bubble || !storeElement) return;

  collapseBubbleDetails();

  title.innerText = store.name;
  subtitle.innerText = `Poziom ${store.floor} • ${store.category}`;
  logoBox.innerText = store.name.substring(0, 10);
  bubble.setAttribute("data-aoi", `store_actions_bubble_${store.id}`);

  bubble.classList.remove("hidden");
  positionBubbleOverStore(storeElement);
}

function expandBubbleDetails(storeId) {
  const store = STORES_CATALOG.find(s => s.id === storeId);
  if (!store) return;

  const bubble = document.getElementById("store-action-bubble");
  const panel = document.getElementById("bubble-expanded-details");
  const closeBtn = document.getElementById("btn-collapse-bubble-info");
  const infoBtn = document.getElementById("btn-show-modal");

  if (!bubble || !panel) return; // Bezpieczeństwo

  bubble.classList.add("expanded");
  panel.classList.remove("hidden");
  if (closeBtn) closeBtn.classList.remove("hidden");
  if (infoBtn) infoBtn.innerText = "Zwiń opis";

  loggerInstance.logEvent("EXPAND_STORE_DETAILS_BUBBLE", null, { storeId: store.id, storeName: store.name });
}

function collapseBubbleDetails() {
  const bubble = document.getElementById("store-action-bubble");
  const panel = document.getElementById("bubble-expanded-details");
  const infoBtn = document.getElementById("btn-show-modal");

  if (bubble) bubble.classList.remove("expanded");
  if (panel) panel.classList.add("hidden");
  if (infoBtn) infoBtn.innerText = "O sklepie";
}

function hideActionBubble() {
  const bubble = document.getElementById("store-action-bubble");
  collapseBubbleDetails();
  if (bubble) {
    bubble.classList.add("hidden");
    bubble.setAttribute("data-aoi", "store_actions_bubble");
  }
}

function showRouteBanner(msg) {
  const banner = document.getElementById("route-floor-banner");
  document.getElementById("route-banner-text").innerText = msg;
  banner.classList.remove("hidden");
}

function hideRouteBanner() {
  document.getElementById("route-floor-banner").classList.add("hidden");
}

function initActionBubbleAndModal() {
  const btnShowRoute = document.getElementById("btn-show-route");
  const btnToggleInfo = document.getElementById("btn-show-modal");
  const btnCloseBubble = document.getElementById("btn-close-bubble");

  btnShowRoute.addEventListener("click", () => {
    if (selectedStoreId) executeRouteNavigation(selectedStoreId);
  });

  btnToggleInfo.addEventListener("click", () => {
    if (!selectedStoreId) return;
    const panel = document.getElementById("bubble-expanded-details");
    const storeEl = document.getElementById(`store-${selectedStoreId}`);

    if (panel.classList.contains("hidden")) {
      expandBubbleDetails(selectedStoreId);
    } else {
      collapseBubbleDetails();
    }

    if (storeEl) {
      positionBubbleOverStore(storeEl);
    }
  });

  if (btnCloseBubble) {
    btnCloseBubble.addEventListener("click", (e) => {
      e.stopPropagation();
      deselectStore(true);
    });
  }
}

function initRouteDismissButton() {
  const btnOk = document.getElementById("btn-route-ok");
  btnOk.addEventListener("click", () => {
    const storeToReopen = activeRouteStoreId;
    dismissActiveRoute();

    if (storeToReopen) {
      const store = STORES_CATALOG.find(s => s.id === storeToReopen);
      const storeEl = document.getElementById(`store-${storeToReopen}`);
      if (store && storeEl) {
        selectedStoreId = store.id;
        storeEl.classList.add("selected");
        showActionBubble(store, storeEl);
        expandBubbleDetails(store.id);
      }
    }
  });
}

function dismissActiveRoute() {
  clearNavigationRoute();
  hideRouteBanner();
  activeRouteStoreId = null;

  // Schowaj przycisk OK oraz zdejmij blokadę reszty interfejsu
  document.getElementById("route-dismiss-container").classList.add("hidden");
  document.getElementById("route-blocker-overlay").classList.add("hidden");

  // Automatyczne odznaczenie sklepu po zakończeniu trasy
  deselectStore(true);
}

function showRouteDismissButton(storeId) {
  activeRouteStoreId = storeId;
  // Pokaż przycisk OK oraz włącz pełną blokadę reszty interfejsu
  document.getElementById("route-dismiss-container").classList.remove("hidden");
  document.getElementById("route-blocker-overlay").classList.remove("hidden");
}

// ========================================================
// PATHFINDING (A*) – omijanie budynków
// ========================================================

const GRID_CELL_SIZE = 5; // rozmiar komórki w viewBox (10x10 px)

// Sprawdza, czy punkt (x, y) jest w jakimkolwiek budynku
function isPointInAnyBuilding(x, y, plan) {
  // Sprawdzamy wszystkie polygony sklepów i pustych lokali
  const allShapes = [...Object.values(plan.shops), ...Object.values(plan.emptyShops)];
  
  // Używamy SVG do sprawdzenia – tworzymy tymczasowy element
  const testSvg = document.getElementById("stores-svg");
  if (!testSvg) return false;
  
  // Sprawdzamy przez isPointInFill na każdym polygonie
  for (const shape of allShapes) {
    const el = document.getElementById(`store-${shape.storeId}`) || 
               document.querySelector(`[data-shape-id="${shape.storeId}"]`);
    if (el && el.isPointInFill) {
      try {
        if (el.isPointInFill(new DOMPoint(x, y))) return true;
      } catch(e) {}
    }
  }
  return false;
}

function getPathBounds(dString) {
  // Wyciąga wszystkie liczby z ciągu "d" (np. "M120,200l10,10" -> [120, 200, 10, 10])
  const numbers = dString.match(/-?\d+(\.\d+)?/g);
  if (!numbers) return null;
  
  const xs = [];
  const ys = [];
  
  // Parzyste to X, nieparzyste to Y (w przybliżeniu dla większości komend SVG)
  for (let i = 0; i < numbers.length; i += 2) {
    xs.push(parseFloat(numbers[i]));
    if (numbers[i+1]) ys.push(parseFloat(numbers[i+1]));
  }
  
  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys)
  };
}

// Buduje siatkę: true = wolne, false = zablokowane (budynek)
function buildGrid(plan) {
  const cols = Math.ceil(842 / GRID_CELL_SIZE);
  const rows = Math.ceil(595 / GRID_CELL_SIZE);
  const grid = [];
  
  const tempSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  tempSvg.setAttribute("viewBox", "0 0 842 595");
  tempSvg.style.position = "absolute";
  tempSvg.style.visibility = "hidden";
  document.body.appendChild(tempSvg);
  
  // 1. Rysujemy BASE (obrys budynku – zawiera korytarze)
  const baseEl = document.createElementNS("http://www.w3.org/2000/svg", "path");
  baseEl.setAttribute("d", plan.basePath || plan.corridorPath);
  baseEl.setAttribute("fill", "black");
  tempSvg.appendChild(baseEl);

  // 2. Rysujemy BUDYNKI (sklepy) – żeby je odjąć
  const allShapes = [...Object.values(plan.shops), ...Object.values(plan.emptyShops)];
  const elements = [];
  
  allShapes.forEach(shape => {
    let el;
    if (shape.type === "path") {
      el = document.createElementNS("http://www.w3.org/2000/svg", "path");
      el.setAttribute("d", shape.d);
    } else if (shape.type === "polygon") {
      el = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
      el.setAttribute("points", shape.points);
    } else if (shape.type === "polyline") {
      el = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
      el.setAttribute("points", shape.points);
    }
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
      
      // Sprawdzamy, czy jesteśmy w BASE (obrysie budynku)
      let inBase = false;
      try {
        if (baseEl.isPointInFill(new DOMPoint(x, y))) {
          inBase = true;
        }
      } catch(e) {}
      
      // Sprawdzamy, czy jesteśmy w BUDYNKU (sklepie)
      let inBuilding = false;
      for (const el of elements) {
        try {
          if (el.isPointInFill(new DOMPoint(x, y))) {
            inBuilding = true;
            break;
          }
        } catch(e) {}
      }
      
      // Wolne = w BASE, ale NIE w BUDYNKU
      if (inBase && !inBuilding) {
        grid[row][col] = 1; // korytarz
      } else {
        grid[row][col] = 0; // budynek lub czarne tło
      }
    }
  }
  
  document.body.removeChild(tempSvg);
  return grid;
}

// Algorytm A* – znajduje ścieżkę od startu do celu
function findPath(startX, startY, endX, endY, grid) {
  const cols = grid[0].length;
  const rows = grid.length;
  
  let startCol = Math.floor(startX / GRID_CELL_SIZE);
  let startRow = Math.floor(startY / GRID_CELL_SIZE);
  const endCol = Math.floor(endX / GRID_CELL_SIZE);
  const endRow = Math.floor(endY / GRID_CELL_SIZE);
  
  if (startCol < 0 || startCol >= cols || startRow < 0 || startRow >= rows) return null;
  if (endCol < 0 || endCol >= cols || endRow < 0 || endRow >= rows) return null;

  // Odblokowujemy cel
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
      console.log('A* ZNALAZŁ ścieżkę!');
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
      
      // 1. BLOKADA WYJŚCIA POZA MAPĘ
      if (nc < 0 || nc >= cols || nr < 0 || nr >= rows) continue;
      if (closedSet.has(key(nc, nr))) continue;
      
      // 2. KARA ZA BUDYNEK
      // const cellCost = grid[nr][nc] === 0 ? 1000 : 1;
      // Wewnątrz findPath, w pętli sąsiadów:
      const cellCost = grid[nr][nc] === 0 ? 1000 : 1; // Bardzo wysoki koszt za wejście w ścianę/czarne tło 
      
      const cost = (n.dc !== 0 && n.dr !== 0) ? 1.414 : 1;
      const g = current.g + (cost * cellCost);
      const h = heuristic(nc, nr);
      const f = g + h;
      
      const existing = openSet.get(key(nc, nr));
      if (existing) {
        if (g < existing.g) {
          existing.g = g;
          existing.f = f;
          existing.parent = current;
        }
      } else {
        openSet.set(key(nc, nr), { col: nc, row: nr, g, f, parent: current });
      }
    }
  }
  
  console.log('A* NIE znalazł ścieżki.');
  return null;
}

function findNearestFreeCell(grid, col, row) {
  if (grid[row] && grid[row][col] !== null) return { col, row };
  for (let r = 1; r < 20; r++) {
    for (let dc = -r; dc <= r; dc++) {
      for (let dr = -r; dr <= r; dr++) {
        const nc = col + dc;
        const nr = row + dr;
        if (nc >= 0 && nc < grid[0].length && nr >= 0 && nr < grid.length && grid[nr][nc] !== null) {
          return { col: nc, row: nr };
        }
      }
    }
  }
  return null;
}

function getCenterOf(selector) {
  // Szukamy TYLKO w aktualnie wyrenderowanej warstwie piętra
  const layer = document.getElementById('stores-svg-layer');
  if (!layer) return null;
  
  const el = layer.querySelector(selector);
  if (!el) return null;
  
  if (el instanceof SVGElement) {
    try {
      const bbox = el.getBBox();
      if (bbox.width === 0 && bbox.height === 0) return null; // ukryty
      return { x: bbox.x + bbox.width / 2, y: bbox.y + bbox.height / 2 };
    } catch(e) { return null; }
  }
  
  // Dla zwykłych divów (np. pinezki)
  const rect = el.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return null;
  
  const svg = document.getElementById("stores-svg");
  const svgRect = svg.getBoundingClientRect();
  const svgX = (rect.left + rect.width / 2 - svgRect.left) / svgRect.width * 842;
  const svgY = (rect.top + rect.height / 2 - svgRect.top) / svgRect.height * 595;
  
  return { x: svgX, y: svgY };
}

function executeRouteNavigation(storeId) {
  const store = STORES_CATALOG.find(s => s.id === storeId);
  if (!store) return;

  hideActionBubble();
  showRouteDismissButton(storeId);

  // 1. Zawsze przechodzimy na piętro 1 (tam jest infomat)
  if (currentActiveFloor !== 1) {
    switchFloorTab(1);
  }

  setTimeout(() => {
    // 2. Pobieramy infomat i schody Z PIĘTRA 1
    const INFOMAT = getCenterOf('#you-are-here-pin') || { x: 421, y: 297.5 };
    const ESCALATORS_F1 = getCenterOf('#escalator-1') || { x: 421, y: 297.5 };

    console.log('Piętro 1. Infomat:', INFOMAT, 'Schody F1:', ESCALATORS_F1);

    // 3. Rysujemy od infomatu do schodów (na piętrze 1)
    drawSimplePath(INFOMAT.x, INFOMAT.y, ESCALATORS_F1.x, ESCALATORS_F1.y);
    showRouteBanner(`Idź do schodów ruchomych...`);

    // 4. Przełączamy na piętro sklepu
    setTimeout(() => {
      if (!activeRouteStoreId) return;
      
      switchFloorTab(store.floor);

      setTimeout(() => {
        // 5. Pobieramy schody Z PIĘTRA SKLEPU (nie z piętra 1!)
        const ESCALATORS_TARGET = getCenterOf('#escalator-1') || { x: 421, y: 297.5 };
        console.log('Piętro', store.floor, 'Schody docelowe:', ESCALATORS_TARGET);

        // 6. Pobieramy sklep
        const newStoreEl = document.getElementById(`store-${storeId}`);
        if (newStoreEl) {
          const bbox2 = newStoreEl.getBBox();
          const target2 = { x: bbox2.x + bbox2.width / 2, y: bbox2.y + bbox2.height / 2 };
          
          // 7. Rysujemy od schodów NA TYM PIĘTRZE do sklepu
          drawSimplePath(ESCALATORS_TARGET.x, ESCALATORS_TARGET.y, target2.x, target2.y);
          showRouteBanner(`Poziom ${store.floor}: idź do ${store.name}`);
        }
      }, 300);
    }, 1800);
  }, 300);
}

function drawSimplePath(x1, y1, x2, y2) {
  const pathSvg = document.getElementById("route-line");
  if (!pathSvg) return;

  // LOG: sprawdzamy, skąd startuje linia
  console.log('Rysowanie trasy od:', x1, y1, 'do:', x2, y2);

  let plan = null;
  if (currentActiveFloor === 0 && typeof FLOOR_PLAN_0 !== "undefined") plan = FLOOR_PLAN_0;
  else if (currentActiveFloor === 1 && typeof FLOOR_PLAN_1 !== "undefined") plan = FLOOR_PLAN_1;
  else if (currentActiveFloor === 2 && typeof FLOOR_PLAN_2 !== "undefined") plan = FLOOR_PLAN_2;

  if (!plan) {
    // Fallback jeśli nie ma planu (prosta linia)
    pathSvg.setAttribute("d", `M ${x1} ${y1} L ${x2} ${y2}`);
    return;
  }

  const grid = buildGrid(plan);

  // Odblokowujemy cel, żeby A* mógł tam dojść
  const endCol = Math.floor(x2 / GRID_CELL_SIZE);
  const endRow = Math.floor(y2 / GRID_CELL_SIZE);
  if (grid[endRow] && grid[endRow][endCol] === 0) {
    grid[endRow][endCol] = 1;
  }

  const path = findPath(x1, y1, x2, y2, grid);

  if (!path || path.length === 0) {
    // Jeśli A* nie znalazł, rysujemy prostą linię awaryjnie
    console.log('A* nie znalazł, rysuję prostą.');
    pathSvg.setAttribute("d", `M ${x1} ${y1} L ${x2} ${y2}`);
    return;
  }

  // Rysowanie
  let d = `M ${x1} ${y1}`;
  path.forEach(pt => {
    d += ` L ${pt.x} ${pt.y}`;
  });
  d += ` L ${x2} ${y2}`;
  pathSvg.setAttribute("d", d);
}

function clearNavigationRoute() {
  const pathSvg = document.getElementById("route-line");
  if (pathSvg) pathSvg.setAttribute("d", "");
}

function switchFloorTab(floor) {
  const routeLine = document.getElementById("route-line");
  if (routeLine) routeLine.setAttribute("d", "");
  // Automatycznie odznacz sklep przy zmianie piętra
  deselectStore(false);

  currentActiveFloor = floor;
  document.querySelectorAll(".floor-btn").forEach(btn => {
    const f = parseInt(btn.getAttribute("data-floor"), 10);
    btn.classList.toggle("active", f === floor);
  });
  loggerInstance.setFloor(floor);
  renderStoresForFloor(floor);
}

function initFloorNavigation() {
  const floorButtons = document.querySelectorAll(".floor-btn");
  floorButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      // Ignoruj, jeśli trwa nawigacja (zabezpieczenie programistyczne)
      if (activeRouteStoreId) return;
      const floor = parseInt(btn.getAttribute("data-floor"), 10);
      switchFloorTab(floor);
    });
  });

  const whereBtn = document.getElementById("btn-where-am-i");
  whereBtn.addEventListener("click", () => {
    if (activeRouteStoreId) return;

    // Automatycznie odznacz zaznaczony sklep przy lokalizacji użytkownika
    deselectStore(false);

    // 2. WYŚRODKOWANIE I RESET SKALI MAPY (płynny powrót na środek ekranu)
    mapState.panX = 0;
    mapState.panY = 0;
    mapState.scale = 0.88; // Domyślna skala w stanie spoczynku
    updateMapTransform();

    whereBtn.classList.add("active");
    setTimeout(() => whereBtn.classList.remove("active"), 400);

    if (currentActiveFloor !== 1) {
      switchFloorTab(1);
    }

    const pin = document.getElementById("you-are-here-pin");
    if (pin) {
      pin.style.transform = "translate(-50%, -50%) translateZ(35px) scale(1.2)";
      setTimeout(() => {
        pin.style.transform = "translate(-50%, -50%) translateZ(16px) scale(1.0)";
      }, 700);
    }
  });
}
// ========================================================
// OBSŁUGA OKNA POZOSTAŁYCH EKRANÓW (CZERWONY 'X')
// ========================================================
function initModuleScreenWindow() {
  const closeBtn = document.getElementById("btn-close-screen-window");
  closeBtn.addEventListener("click", () => {
    returnToGalleryMap();
  });
}

function openModuleScreen(screenId, titleText) {
  // Automatycznie odznacz sklep i zamknij dymek
  deselectStore(false);
  dismissActiveRoute();

  const moduleWindow = document.getElementById("module-screen-window");
  const titleEl = document.getElementById("module-screen-title");
  titleEl.innerText = titleText;

  document.querySelectorAll(".tab-view-content").forEach(view => view.classList.add("hidden"));
  const targetView = document.getElementById(`view-${screenId}`);
  if (targetView) targetView.classList.remove("hidden");

  moduleWindow.classList.remove("hidden");
  loggerInstance.setScreen(screenId);
}

function returnToGalleryMap() {
  const moduleWindow = document.getElementById("module-screen-window");
  moduleWindow.classList.add("hidden");

  document.querySelectorAll(".top-square-btn").forEach(b => b.classList.remove("active"));
  document.querySelectorAll(".side-btn").forEach(b => b.classList.remove("active"));

  const planBtn = document.querySelector('.side-btn[data-screen="ekran_plan"]');
  if (planBtn) {
    planBtn.classList.add("active");
  }

  loggerInstance.setScreen("ekran_plan");
}

function initTopSquareNavigation() {
  const topButtons = document.querySelectorAll(".top-square-btn");
  topButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const screenTarget = btn.getAttribute("data-screen");
      const labelText = btn.querySelector(".label").innerText.replace(/\\n/g, " ");

      topButtons.forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".side-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      openModuleScreen(screenTarget, labelText);
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
        returnToGalleryMap();
      } else {
        openModuleScreen(screenTarget, labelText);
      }
    });
  });
}

// ========================================================
// PRZEJŚCIE Z KAFELKA DO MAPY Z PODŚWIETLONYM SKLEPEM
// ========================================================
function navigateToStoreOnMap(storeId) {
  const store = STORES_CATALOG.find(s => s.id === storeId);
  if (!store) return;

  // 1. Zamknij okno modułowe
  returnToGalleryMap();

  // 2. Jeśli sklep jest na innym piętrze, przełącz piętro
  if (currentActiveFloor !== store.floor) {
    switchFloorTab(store.floor);
  }

  // 3. Zaznacz sklep i przybliż
  setTimeout(() => {
    const storeEl = document.getElementById(`store-${store.id}`);
    if (storeEl) {
      handleStoreClick(store);
    }
  }, 100);

  loggerInstance.logEvent("NAVIGATE_STORE_FROM_TAB", null, { storeId: storeId, storeName: store.name });
}

// ========================================================
// GÓRNA ZAKŁADKA 1: SKLEPY (2 KOLUMNY: KATEGORIE + KAFELKI)
// ========================================================
function initStoresDirectoryModule() {
  const categoriesContainer = document.getElementById("stores-categories-list");
  const catalogGrid = document.getElementById("stores-catalog-grid");
  if (!categoriesContainer || !catalogGrid) return;

  // Wyodrębnij unikalne kategorie
  const allCategories = Array.from(new Set(STORES_CATALOG.map(s => s.category))).sort();

  // Renderowanie listy kategorii
  categoriesContainer.innerHTML = "";

  // Przycisk "Wszystkie kategorie"
  const allBtn = document.createElement("button");
  allBtn.className = "category-filter-btn active";
  allBtn.setAttribute("data-aoi", "btn_cat_all");
  allBtn.innerHTML = `
    <span>Wszystkie</span>
    <span class="cat-count-badge">${STORES_CATALOG.length}</span>
  `;
  allBtn.addEventListener("click", () => {
    document.querySelectorAll(".category-filter-btn").forEach(b => b.classList.remove("active"));
    allBtn.classList.add("active");
    currentStoreCategoryFilter = "ALL";
    renderFilteredStoresCatalog("ALL");
  });
  categoriesContainer.appendChild(allBtn);

  allCategories.forEach(cat => {
    const count = STORES_CATALOG.filter(s => s.category === cat).length;
    const btn = document.createElement("button");
    btn.className = "category-filter-btn";
    btn.setAttribute("data-aoi", `btn_cat_${cat}`);
    btn.innerHTML = `
      <span>${cat}</span>
      <span class="cat-count-badge">${count}</span>
    `;

    btn.addEventListener("click", () => {
      document.querySelectorAll(".category-filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentStoreCategoryFilter = cat;
      renderFilteredStoresCatalog(cat);
    });

    categoriesContainer.appendChild(btn);
  });

  renderFilteredStoresCatalog("ALL");
}

function renderFilteredStoresCatalog(category) {
  const catalogGrid = document.getElementById("stores-catalog-grid");
  const labelEl = document.getElementById("stores-active-cat-label");
  catalogGrid.innerHTML = "";

  const filteredStores = category === "ALL" 
    ? STORES_CATALOG 
    : STORES_CATALOG.filter(s => s.category === category);

  labelEl.innerText = category === "ALL" ? `Wszystkie sklepy (${filteredStores.length})` : `${category} (${filteredStores.length})`;

  filteredStores.forEach(store => {
    const card = document.createElement("div");
    card.className = "store-dir-card";
    card.setAttribute("data-aoi", `card_store_dir_${store.id}`);

    card.innerHTML = `
      <div class="store-dir-logo-box">${store.name.substring(0, 10)}</div>
      <div class="store-dir-name">${store.name}</div>
      <div class="store-dir-floor">Poziom ${store.floor} • ${store.category}</div>
    `;

    card.addEventListener("click", () => {
      navigateToStoreOnMap(store.id);
    });

    catalogGrid.appendChild(card);
  });
}

// ========================================================
// GÓRNA ZAKŁADKA 2: RESTAURACJE I KAWIARNIE (4 KOLUMNY x 3 WIERSZE)
// ========================================================
function initRestaurantsGridModule() {
  const container = document.getElementById("restaurants-grid");
  if (!container) return;
  container.innerHTML = "";

  // Pobierz restauracje i kawiarnie
  const gastroCategories = ["Kawiarnia", "Lody", "Gastronomia", "Gastro", "Kawiarnia/Lody", "Piekarnia", "Herbata"];
  const restaurants = STORES_CATALOG.filter(s => gastroCategories.includes(s.category));

  restaurants.forEach(store => {
    const card = document.createElement("div");
    card.className = "grid-tile-card";
    card.setAttribute("data-aoi", `card_gastro_${store.id}`);

    card.innerHTML = `
      <div class="grid-tile-logo-box">${store.name.substring(0, 12)}</div>
      <div class="grid-tile-name">${store.name}</div>
      <div class="grid-tile-cat">${store.category}</div>
      <div class="grid-tile-floor">Lokalizacja: Poziom ${store.floor}</div>
    `;

    card.addEventListener("click", () => {
      navigateToStoreOnMap(store.id);
    });

    container.appendChild(card);
  });
}

// ========================================================
// GÓRNA ZAKŁADKA 4: USŁUGI (4 KOLUMNY x 3 WIERSZE)
// ========================================================
function initServicesGridModule() {
  const container = document.getElementById("services-grid");
  if (!container) return;
  container.innerHTML = "";

  const serviceCategories = ["Usługi", "Finanse", "Bankowość", "Telekomunikacja", "GSM", "Optyk", "Zdrowie", "Podróże", "Upominki", "Kwiaty"];
  const services = STORES_CATALOG.filter(s => serviceCategories.includes(s.category));

  services.forEach(store => {
    const card = document.createElement("div");
    card.className = "grid-tile-card";
    card.setAttribute("data-aoi", `card_service_${store.id}`);

    card.innerHTML = `
      <div class="grid-tile-logo-box">${store.name.substring(0, 12)}</div>
      <div class="grid-tile-name">${store.name}</div>
      <div class="grid-tile-cat">${store.category}</div>
      <div class="grid-tile-floor">Lokalizacja: Poziom ${store.floor}</div>
    `;

    card.addEventListener("click", () => {
      navigateToStoreOnMap(store.id);
    });

    container.appendChild(card);
  });

  // Dodatkowa obsługa przycisku w zakładce Fitness
  const locateFitnessBtn = document.querySelector(".locate-store-btn");
  if (locateFitnessBtn) {
    locateFitnessBtn.addEventListener("click", () => {
      navigateToStoreOnMap("s2_cityfit");
    });
  }

  const locateCinemaBtn = document.querySelector(".locate-cinema-btn");
  if (locateCinemaBtn) {
    locateCinemaBtn.addEventListener("click", () => {
      navigateToStoreOnMap("s2_cinema");
    });
  }
}

// ========================================================
// GÓRNA ZAKŁADKA 5: REPERTUAR KINA (2 KOLUMNY, DUBBING)
// ========================================================
function initCinemaRepertoireModule() {
  const tbody = document.getElementById("cinema-repertoire-body");
  if (!tbody) return;
  tbody.innerHTML = "";

  CINEMA_REPERTOIRE_DATA.forEach(movie => {
    const tr = document.createElement("tr");
    tr.setAttribute("data-aoi", `cinema_row_${movie.title.replace(/\\s+/g, "_")}`);

    const hoursHtml = movie.hours.map(h => `<span class="seance-chip">${h}</span>`).join("");
    const dubbingHtml = movie.dubbing 
      ? `<span class="dubbing-badge">DUBBING</span>` 
      : `<span class="subtitles-badge">NAPISY</span>`;

    tr.innerHTML = `
      <td>
        <div class="td-movie-info">
          <span class="movie-title-text">${movie.title}</span>
          <span class="movie-meta-text">${movie.genre} • Czas trwania: ${movie.duration}</span>
        </div>
      </td>
      <td>
        <div class="seances-cell">
          <div class="seance-hours-group">${hoursHtml}</div>
          ${dubbingHtml}
        </div>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

// ========================================================
// GÓRNA ZAKŁADKA 6: SZUKAJ (KLAWIATURA EKRANOWA + PROPOZYCJE NA ŻYWO)
// ========================================================
function initSearchModule() {
  const keyboardWrapper = document.getElementById("onscreen-keyboard");
  const inputEl = document.getElementById("virtual-search-input");
  const clearBtn = document.getElementById("btn-clear-search");
  if (!keyboardWrapper || !inputEl) return;

  // Układ klawiatury ekranowej z polskimi znakami
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

  const cleanQuery = query.trim().toLowerCase();

  const matchedStores = cleanQuery === ""
    ? STORES_CATALOG
    : STORES_CATALOG.filter(s => 
        s.name.toLowerCase().includes(cleanQuery) || 
        s.category.toLowerCase().includes(cleanQuery)
      );

  countBadge.innerText = `${matchedStores.length} lokali`;

  if (matchedStores.length === 0) {
    resultsContainer.innerHTML = `
      <div style="text-align: center; padding: 24px; color: #777;">
        Brak wyników dla frazy "<strong>${query}</strong>". Spróbuj wpisać inną nazwę.
      </div>
    `;
    return;
  }

  matchedStores.forEach(store => {
    const item = document.createElement("div");
    item.className = "search-result-item";
    item.setAttribute("data-aoi", `search_result_${store.id}`);

    item.innerHTML = `
      <div class="res-logo-box">${store.name.substring(0, 8)}</div>
      <div class="res-info">
        <span class="res-name">${store.name}</span>
        <span class="res-cat">${store.category}</span>
      </div>
      <div class="res-floor">Poziom ${store.floor} ➔</div>
    `;

    item.addEventListener("click", () => {
      navigateToStoreOnMap(store.id);
    });

    resultsContainer.appendChild(item);
  });
}

// ========================================================
// BOCZNE ZAKŁADKI: AKTUALNOŚCI, PROMOCJE, KOMUNIKACJA
// ========================================================
function initNewsModule() {
  const container = document.getElementById("news-cards-container");
  if (!container) return;
  container.innerHTML = "";

  NEWS_DATA.forEach(item => {
    const card = document.createElement("div");
    card.className = "feed-card";
    card.setAttribute("data-aoi", `aoi_news_card_${item.id}`);

    card.innerHTML = `
      <div class="feed-thumbnail" style="background: ${item.bgGradient};">
        <span class="feed-thumb-badge">${item.category}</span>
        <svg class="feed-thumb-svg" viewBox="0 0 24 24"><path fill="#FFFFFF" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
      </div>
      <div class="feed-details">
        <span class="feed-date">${item.date}</span>
        <h3 class="feed-title">${item.title}</h3>
        <p class="feed-desc">${item.desc}</p>
        <button class="btn-read-more" data-aoi="btn_read_news_${item.id}" data-id="${item.id}">CZYTAJ WIĘCEJ</button>
      </div>
    `;

    const readMoreBtn = card.querySelector(".btn-read-more");
    readMoreBtn.addEventListener("click", (e) => {
      e.stopPropagation();
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
    card.setAttribute("data-aoi", `aoi_promo_card_${item.id}`);

    card.innerHTML = `
      <div class="feed-thumbnail" style="background: ${item.bgGradient};">
        <span class="feed-thumb-badge">${item.category}</span>
        <svg class="feed-thumb-svg" viewBox="0 0 24 24"><path fill="#FFFFFF" d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z"/></svg>
      </div>
      <div class="feed-details">
        <span class="feed-date">${item.date}</span>
        <div class="feed-store-tag">Salony: ${item.store}</div>
        <h3 class="feed-title">${item.title}</h3>
        <p class="feed-desc">${item.desc}</p>
        <button class="btn-read-more" data-aoi="btn_read_promo_${item.id}" data-id="${item.id}">CZYTAJ WIĘCEJ</button>
      </div>
    `;

    const readMoreBtn = card.querySelector(".btn-read-more");
    readMoreBtn.addEventListener("click", (e) => {
      e.stopPropagation();
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

function initTransitModule() {
  renderTransitStopsList();
  renderTransitLinesList(selectedStopId);
  renderTransitSchedule(selectedStopId, selectedLineNum);
}

function renderTransitStopsList() {
  const container = document.getElementById("transit-stops-list");
  if (!container) return;
  container.innerHTML = "";

  TRANSIT_DATA.forEach(stop => {
    const btn = document.createElement("button");
    btn.className = `transit-stop-btn ${stop.stopId === selectedStopId ? "active" : ""}`;
    btn.setAttribute("data-aoi", `btn_transit_stop_${stop.stopId}`);
    btn.innerHTML = `
      <span>📍 ${stop.stopName}</span>
      <span class="badge-count">${stop.lines.length} linie</span>
    `;

    btn.addEventListener("click", () => {
      selectedStopId = stop.stopId;
      selectedLineNum = stop.lines[0].num;
      renderTransitStopsList();
      renderTransitLinesList(selectedStopId);
      renderTransitSchedule(selectedStopId, selectedLineNum);
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
    const card = document.createElement("div");
    card.className = `transit-line-card ${line.num === selectedLineNum ? "active" : ""}`;
    card.setAttribute("data-aoi", `card_transit_line_${line.num}`);

    card.innerHTML = `
      <div class="transit-line-num">${line.num}</div>
      <div class="transit-line-route">
        <span class="transit-route-stop">${line.stop}</span>
        <span class="transit-route-arrow">➔</span>
        <span class="transit-route-dest">${line.dest}</span>
      </div>
    `;

    card.addEventListener("click", () => {
      selectedLineNum = line.num;
      renderTransitLinesList(stopId);
      renderTransitSchedule(stopId, selectedLineNum);
    });

    container.appendChild(card);
  });
}

function renderTransitSchedule(stopId, lineNum) {
  const stopData = TRANSIT_DATA.find(s => s.stopId === stopId);
  if (!stopData) return;
  const lineData = stopData.lines.find(l => l.num === lineNum) || stopData.lines[0];
  if (!lineData) return;

  document.getElementById("selected-line-badge").innerText = lineData.num;
  document.getElementById("selected-stop-name").innerText = `Przystanek: ${lineData.stop}`;
  document.getElementById("selected-dest-name").innerText = `Kierunek: ${lineData.dest}`;

  const tbody = document.getElementById("transit-schedule-body");
  tbody.innerHTML = "";

  lineData.schedule.forEach(row => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="td-hour">${row.hour}:00</td>
      <td class="td-minutes">${row.mins}</td>
    `;
    tbody.appendChild(tr);
  });
}

function initNewsPromoModalEvents() {
  const modal = document.getElementById("news-promo-modal");
  const closeTop = document.getElementById("btn-close-news-modal");
  const closeBottom = document.getElementById("btn-close-news-modal-bottom");

  const closeModal = () => modal.classList.add("hidden");
  closeTop.addEventListener("click", closeModal);
  closeBottom.addEventListener("click", closeModal);
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

// function initActionBubbleAndModal() {
//   const btnShowRoute = document.getElementById("btn-show-route");
//   const btnShowModal = document.getElementById("btn-show-modal");
//   const modal = document.getElementById("store-modal");
//   const btnCloseModal = document.getElementById("btn-close-modal");
//   const btnCloseBottom = document.getElementById("modal-btn-close-bottom");
//   const btnModalRoute = document.getElementById("modal-btn-route");

//   btnShowRoute.addEventListener("click", () => {
//     if (selectedStoreId) executeRouteNavigation(selectedStoreId);
//   });

//   btnShowModal.addEventListener("click", () => {
//     if (selectedStoreId) openStoreModal(selectedStoreId);
//   });

//   btnCloseModal.addEventListener("click", () => modal.classList.add("hidden"));
//   btnCloseBottom.addEventListener("click", () => modal.classList.add("hidden"));

//   btnModalRoute.addEventListener("click", () => {
//     modal.classList.add("hidden");
//     if (selectedStoreId) executeRouteNavigation(selectedStoreId);
//   });
// }

// function openStoreModal(storeId) {
//   const store = STORES_CATALOG.find(s => s.id === storeId);
//   if (!store) return;

//   document.getElementById("modal-store-name").innerText = store.name;
//   document.getElementById("modal-store-cat").innerText = store.category;
//   document.getElementById("modal-store-floor").innerText = `Poziom ${store.floor}`;
//   document.getElementById("modal-store-logo").innerText = store.logo;

//   document.getElementById("store-modal").classList.remove("hidden");
// }

function initResearcherDock() {
  const btnToggle = document.getElementById("btn-toggle-researcher");
  const menu = document.getElementById("researcher-menu");
  btnToggle.addEventListener("click", () => menu.classList.toggle("hidden"));

  document.getElementById("btn-export-events").addEventListener("click", () => loggerInstance.exportEventsCSV());
  document.getElementById("btn-export-aoi").addEventListener("click", () => loggerInstance.exportAoiCSV());
  document.getElementById("btn-clear-events").addEventListener("click", () => loggerInstance.clearLogs());
}

function drawRouteViaCorridors(x1, y1, x2, y2, floor) {
  const pathSvg = document.getElementById("route-line");
  if (!pathSvg) return;

  const waypoints = NAV_WAYPOINTS[floor] || NAV_WAYPOINTS[0];

  // Znajdź najbliższy węzeł dla startu i celu
  const findNearest = (x, y) => {
    let minDist = Infinity;
    let nearest = null;
    waypoints.forEach(wp => {
      const dist = Math.hypot(wp.x - x, wp.y - y);
      if (dist < minDist) { minDist = dist; nearest = wp; }
    });
    return nearest;
  };

  const startNode = findNearest(x1, y1);
  const endNode = findNearest(x2, y2);

  // Buduj ścieżkę: start -> najbliższy węzeł -> (środek, jeśli trzeba) -> węzeł końcowy -> cel
  let d = `M ${x1} ${y1} L ${startNode.x} ${startNode.y}`;

  if (startNode.id !== endNode.id) {
    const centerNode = waypoints.find(wp => wp.id === "center");
    d += ` L ${centerNode.x} ${centerNode.y} L ${endNode.x} ${endNode.y}`;
  }

  d += ` L ${x2} ${y2}`;
  pathSvg.setAttribute("d", d);
}