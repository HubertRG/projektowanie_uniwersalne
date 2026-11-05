/**
 * Główny kontroler aplikacji infomatu (v4):
 * - Pełna obsługa ekranów modułowych (okno po prawej od lewego paska i pod górnym paskiem)
 * - Czerwony 'X' zamykający okno i powracający do planu galerii
 * - Płynne przełączanie zakładek górnych i bocznych
 * - Zachowanie rejestracji eyetrackera dla wszystkich zdarzeń
 */

let loggerInstance = null;
let currentActiveFloor = 1;
let selectedStoreId = null;
let activeRouteStoreId = null;

let mapState = {
  panX: 0,
  panY: 0,
  scale: 0.88,
  isDragging: false,
  startX: 0,
  startY: 0
};

document.addEventListener("DOMContentLoaded", () => {
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
});

function updateMapTransform() {
  const stage = document.getElementById("map-stage");
  if (!stage) return;
  stage.style.transform = `translate(${mapState.panX}px, ${mapState.panY}px) rotateX(46deg) rotateZ(-34deg) scale(${mapState.scale})`;
}

function initMapPanning() {
  const viewport = document.getElementById("map-viewport");

  const startDrag = (e) => {
    if (e.target.closest("button") || e.target.closest(".store-block") || e.target.closest(".map-facility-marker")) return;
    mapState.isDragging = true;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    mapState.startX = clientX - mapState.panX;
    mapState.startY = clientY - mapState.panY;
  };

  const onDrag = (e) => {
    if (!mapState.isDragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    mapState.panX = clientX - mapState.startX;
    mapState.panY = clientY - mapState.startY;
    updateMapTransform();
  };

  const endDrag = () => {
    mapState.isDragging = false;
  };

  viewport.addEventListener("mousedown", startDrag);
  window.addEventListener("mousemove", onDrag);
  window.addEventListener("mouseup", endDrag);

  viewport.addEventListener("touchstart", startDrag, { passive: true });
  window.addEventListener("touchmove", onDrag, { passive: true });
  window.addEventListener("touchend", endDrag);
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
  const gridContainer = document.getElementById("stores-puzzle-grid");
  const amenitiesContainer = document.getElementById("map-amenities-layer");
  gridContainer.innerHTML = "";
  amenitiesContainer.innerHTML = "";

  const pin = document.getElementById("you-are-here-pin");
  if (pin) {
    pin.style.display = (floor === 1) ? "flex" : "none";
  }

  const stores = STORES_CATALOG.filter(s => s.floor === floor);
  stores.forEach(store => {
    const block = document.createElement("div");
    block.className = `store-block ${store.isLarge ? "large-store" : "small-store"}`;
    block.id = `store-${store.id}`;
    block.setAttribute("data-aoi", `aoi_store_${store.id}`);

    block.style.gridColumn = `${store.col} / span ${store.w}`;
    block.style.gridRow = `${store.row} / span ${store.h}`;

    const brandBox = document.createElement("div");
    brandBox.className = "store-brand-box";
    brandBox.innerText = store.name.substring(0, 12);

    const caption = document.createElement("div");
    caption.className = "store-caption";
    caption.innerText = store.name;

    block.appendChild(brandBox);
    block.appendChild(caption);

    block.addEventListener("click", (e) => {
      e.stopPropagation();
      handleStoreClick(store);
    });

    gridContainer.appendChild(block);
  });

  const amenities = AMENITIES_CATALOG.filter(a => a.floor === floor);
  amenities.forEach(am => {
    const marker = document.createElement("div");
    marker.className = "map-facility-marker";
    marker.style.left = `${am.x}%`;
    marker.style.top = `${am.y}%`;
    marker.setAttribute("data-aoi", `aoi_fac_${am.type}_floor${floor}`);

    marker.innerHTML = `
      <svg viewBox="0 0 24 24">${am.icon}</svg>
      <span class="marker-label">${am.label}</span>
    `;

    amenitiesContainer.appendChild(marker);
  });
}

function handleStoreClick(store) {
  const clickedBlock = document.getElementById(`store-${store.id}`);

  if (selectedStoreId === store.id) {
    clickedBlock.classList.remove("selected");
    selectedStoreId = null;
    hideActionBubble();
    dismissActiveRoute();
    mapState.scale = 0.88;
    updateMapTransform();
  } else {
    if (selectedStoreId) {
      const prevBlock = document.getElementById(`store-${selectedStoreId}`);
      if (prevBlock) prevBlock.classList.remove("selected");
    }

    clickedBlock.classList.add("selected");
    selectedStoreId = store.id;
    showActionBubble(store, clickedBlock);

    mapState.scale = 1.04;
    updateMapTransform();
  }
}

function showActionBubble(store, storeElement) {
  const bubble = document.getElementById("store-action-bubble");
  const title = document.getElementById("bubble-store-name");
  title.innerText = `${store.name} (Poziom ${store.floor})`;
  bubble.classList.remove("hidden");
}

function hideActionBubble() {
  document.getElementById("store-action-bubble").classList.add("hidden");
}

function showRouteBanner(msg) {
  const banner = document.getElementById("route-floor-banner");
  document.getElementById("route-banner-text").innerText = msg;
  banner.classList.remove("hidden");
}

function hideRouteBanner() {
  document.getElementById("route-floor-banner").classList.add("hidden");
}

// Obsługa przycisku "OK" trasy
function initRouteDismissButton() {
  const btnOk = document.getElementById("btn-route-ok");
  btnOk.addEventListener("click", () => {
    const storeToReopen = activeRouteStoreId;
    dismissActiveRoute();

    if (storeToReopen) {
      openStoreModal(storeToReopen);
    }
  });
}

function dismissActiveRoute() {
  clearNavigationRoute();
  hideRouteBanner();
  document.getElementById("route-dismiss-container").classList.add("hidden");
}

function showRouteDismissButton(storeId) {
  activeRouteStoreId = storeId;
  document.getElementById("route-dismiss-container").classList.remove("hidden");
}

function executeRouteNavigation(storeId) {
  const store = STORES_CATALOG.find(s => s.id === storeId);
  if (!store) return;

  hideActionBubble();
  showRouteDismissButton(storeId);

  const infomatCoords = { x: 500, y: 350 };
  const escalatorsCoords = { x: 350, y: 385 };

  if (store.floor === 1) {
    switchFloorTab(1);
    const storeX = (store.col + store.w / 2) * (1000 / 12);
    const storeY = (store.row + store.h / 2) * (700 / 10);
    drawSimplePath(infomatCoords.x, infomatCoords.y, storeX, storeY);
    showRouteBanner(`Nawigacja do: ${store.name} (Poziom 1)`);
    return;
  }

  switchFloorTab(1);
  drawSimplePath(infomatCoords.x, infomatCoords.y, escalatorsCoords.x, escalatorsCoords.y);
  showRouteBanner(`Sklep znajduje się na Poziomie ${store.floor}. Idź do schodów ruchomych...`);

  setTimeout(() => {
    if (!activeRouteStoreId) return;
    switchFloorTab(store.floor);
    const targetStoreX = (store.col + store.w / 2) * (1000 / 12);
    const targetStoreY = (store.row + store.h / 2) * (700 / 10);

    drawSimplePath(escalatorsCoords.x, escalatorsCoords.y, targetStoreX, targetStoreY);
    showRouteBanner(`Poziom ${store.floor}: idź ze schodów do ${store.name}`);

    const targetBlock = document.getElementById(`store-${store.id}`);
    if (targetBlock) targetBlock.classList.add("selected");
  }, 2200);
}

function drawSimplePath(x1, y1, x2, y2) {
  const pathSvg = document.getElementById("route-line");
  const midY = 360;
  const dPath = `M ${x1} ${y1} L ${x1} ${midY} L ${x2} ${midY} L ${x2} ${y2}`;
  pathSvg.setAttribute("d", dPath);
}

function clearNavigationRoute() {
  const pathSvg = document.getElementById("route-line");
  if (pathSvg) pathSvg.setAttribute("d", "");
}

function switchFloorTab(floor) {
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
      const floor = parseInt(btn.getAttribute("data-floor"), 10);
      dismissActiveRoute();
      switchFloorTab(floor);
    });
  });

  const whereBtn = document.getElementById("btn-where-am-i");
  whereBtn.addEventListener("click", () => {
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
  dismissActiveRoute();
  hideActionBubble();

  const moduleWindow = document.getElementById("module-screen-window");
  const titleEl = document.getElementById("module-screen-title");
  titleEl.innerText = titleText;

  // Ukryj wszystkie widoki wewnętrzne
  document.querySelectorAll(".tab-view-content").forEach(view => {
    view.classList.add("hidden");
  });

  // Pokaż właściwy widok jeśli istnieje
  const targetView = document.getElementById(`view-${screenId}`);
  if (targetView) {
    targetView.classList.remove("hidden");
  }

  moduleWindow.classList.remove("hidden");
  loggerInstance.setScreen(screenId);
}

function returnToGalleryMap() {
  const moduleWindow = document.getElementById("module-screen-window");
  moduleWindow.classList.add("hidden");

  // Reset aktywnych przycisków górnych
  document.querySelectorAll(".top-square-btn").forEach(b => b.classList.remove("active"));

  // Reset aktywnych przycisków lewych i włączenie 'Plan Galerii'
  document.querySelectorAll(".side-btn").forEach(b => b.classList.remove("active"));
  const planBtn = document.querySelector('.side-btn[data-screen="ekran_plan"]');
  if (planBtn) {
    planBtn.classList.add("active");
  }

  loggerInstance.setScreen("ekran_plan");
}

// Górna nawigacja
function initTopSquareNavigation() {
  const topButtons = document.querySelectorAll(".top-square-btn");
  topButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const screenTarget = btn.getAttribute("data-screen");
      const labelText = btn.querySelector(".label").innerText.replace(/\\n/g, " ");

      // Aktualizuj stany przycisków
      topButtons.forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".side-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      openModuleScreen(screenTarget, labelText);
    });
  });
}

// Lewa nawigacja
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

function initActionBubbleAndModal() {
  const btnShowRoute = document.getElementById("btn-show-route");
  const btnShowModal = document.getElementById("btn-show-modal");
  const modal = document.getElementById("store-modal");
  const btnCloseModal = document.getElementById("btn-close-modal");
  const btnCloseBottom = document.getElementById("modal-btn-close-bottom");
  const btnModalRoute = document.getElementById("modal-btn-route");

  btnShowRoute.addEventListener("click", () => {
    if (selectedStoreId) executeRouteNavigation(selectedStoreId);
  });

  btnShowModal.addEventListener("click", () => {
    if (selectedStoreId) openStoreModal(selectedStoreId);
  });

  btnCloseModal.addEventListener("click", () => modal.classList.add("hidden"));
  btnCloseBottom.addEventListener("click", () => modal.classList.add("hidden"));

  btnModalRoute.addEventListener("click", () => {
    modal.classList.add("hidden");
    if (selectedStoreId) executeRouteNavigation(selectedStoreId);
  });
}

function openStoreModal(storeId) {
  const store = STORES_CATALOG.find(s => s.id === storeId);
  if (!store) return;

  document.getElementById("modal-store-name").innerText = store.name;
  document.getElementById("modal-store-cat").innerText = store.category;
  document.getElementById("modal-store-floor").innerText = `Poziom ${store.floor}`;
  document.getElementById("modal-store-logo").innerText = store.logo;

  document.getElementById("store-modal").classList.remove("hidden");
}

function initResearcherDock() {
  const btnToggle = document.getElementById("btn-toggle-researcher");
  const menu = document.getElementById("researcher-menu");
  btnToggle.addEventListener("click", () => menu.classList.toggle("hidden"));

  document.getElementById("btn-export-events").addEventListener("click", () => loggerInstance.exportEventsCSV());
  document.getElementById("btn-export-aoi").addEventListener("click", () => loggerInstance.exportAoiCSV());
  document.getElementById("btn-clear-events").addEventListener("click", () => loggerInstance.clearLogs());
}