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

let mapState = {
  panX: 0,
  panY: 0,
  scale: 0.88,
  isDragging: false,
  startX: 0,
  startY: 0
};

// Stan wyszukiwarki
let currentSearchQuery = "";
let currentStoreCategoryFilter = "ALL";

let selectedStopId = "stop_galeria_01";
let selectedLineNum = "115";

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

function updateMapTransform() {
  const stage = document.getElementById("map-stage");
  if (!stage) return;
  stage.style.transform = `translate(${mapState.panX}px, ${mapState.panY}px) rotateX(46deg) rotateZ(-34deg) scale(${mapState.scale})`;
}

function initMapPanning() {
  const viewport = document.getElementById("map-viewport");

  const startDrag = (e) => {
    // Jeśli trasa jest aktywna, blokuj przesuwanie
    if (activeRouteStoreId) return;

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

    // Schowaj dymek podczas ruchu kamery
    hideActionBubble();
  };

  const endDrag = (e) => {
    if (mapState.isDragging) {
      mapState.isDragging = false;
      // Kliknięcie w tło mapy (nie w sklep) powoduje automatyczne odznaczenie
      if (e.target.id === "building-base" || e.target.id === "corridor-layer" || e.target.id === "map-viewport") {
        deselectStore(true);
      }
    }
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
    // Odznacz poprzedni sklep
    if (selectedStoreId) {
      const prevBlock = document.getElementById(`store-${selectedStoreId}`);
      if (prevBlock) prevBlock.classList.remove("selected");
    }

    clickedBlock.classList.add("selected");
    selectedStoreId = store.id;

    // Pokaż dymek w pionie 2D nad sklepem
    showActionBubble(store, clickedBlock);

    mapState.scale = 1.04;
    updateMapTransform();
  }
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

  title.innerText = store.name;
  subtitle.innerText = `Poziom ${store.floor} • ${store.category}`;
  logoBox.innerText = store.name.substring(0, 10);
  bubble.setAttribute("data-aoi", `store_actions_bubble_${store.id}`);

  // Pobierz rzeczywiste współrzędne 2D na ekranie monitora kiosku
  const rect = storeElement.getBoundingClientRect();
  const kioskRect = document.getElementById("kiosk-app").getBoundingClientRect();

  // Środek sklepu w układzie kontenera aplikacji
  const storeScreenX = rect.left + rect.width / 2 - kioskRect.left;
  let storeScreenY = rect.top - kioskRect.top - 12; // 12px ponad górną krawędzią sklepu

  // Zabezpieczenie przed wyjechaniem poza górną krawędź ekranu (pod nagłówek)
  if (storeScreenY < 130) {
    storeScreenY = rect.bottom - kioskRect.top + 130; // Wyświetl poniżej sklepu
  }

  bubble.style.left = `${storeScreenX}px`;
  bubble.style.top = `${storeScreenY}px`;
  bubble.classList.remove("hidden");
}

function hideActionBubble() {
  const bubble = document.getElementById("store-action-bubble");
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