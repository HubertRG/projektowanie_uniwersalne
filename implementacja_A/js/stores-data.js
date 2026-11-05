/**
 * Katalog sklepów i punktów infrastruktury galerii:
 * - Piętro 0: sklepy na górze, na dole i po lewej. Na środku korytarz, po prawej puste wejście.
 * - Piętro 1: obwód pełny, infomat na środku korytarza.
 * - Piętro 2: obwód pełny z kinem i fitness.
 */

const STORES_CATALOG = [
  // ==================== POZIOM 0 ====================
  // Góra
  { id: "s0_stokrotka", name: "Stokrotka", floor: 0, logo: "stokrotka.png", category: "Spożywcze", isLarge: true, col: 1, row: 1, w: 3, h: 3 },
  { id: "s0_rossmann", name: "Rossmann", floor: 0, logo: "rossmann_org.png", category: "Drogeria", isLarge: true, col: 4, row: 1, w: 3, h: 3 },
  { id: "s0_douglas", name: "Douglas", floor: 0, logo: "Zrzut_ekranu_2025_04_24_o_092127.png", category: "Perfumeria", isLarge: true, col: 7, row: 1, w: 3, h: 3 },
  { id: "s0_empik", name: "Empik", floor: 0, logo: "empik.png", category: "Książki", isLarge: true, col: 10, row: 1, w: 3, h: 3 },

  // Lewo
  { id: "s0_apteka", name: "Apteka DR ZDROWIE", floor: 0, logo: "dr_zdrowie.png", category: "Zdrowie", isLarge: true, col: 1, row: 4, w: 3, h: 2 },
  { id: "s0_costa", name: "Costa Coffee", floor: 0, logo: "Costa_Coffee_RED_CMYK_2.jpg", category: "Kawiarnia", isLarge: true, col: 1, row: 6, w: 3, h: 2 },

  // Dół
  { id: "s0_snipes", name: "SNIPES", floor: 0, logo: "snipes.png", category: "Obuwie", isLarge: true, col: 1, row: 8, w: 3, h: 3 },
  { id: "s0_eobuwie", name: "eobuwie", floor: 0, logo: "logo_7.png", category: "Obuwie", isLarge: true, col: 4, row: 8, w: 3, h: 3 },
  { id: "s0_komputronik", name: "Komputronik", floor: 0, logo: "KT_logo_podstawowe_CMYK_1.png", category: "Elektronika", isLarge: true, col: 7, row: 8, w: 3, h: 3 },

  // Mniejsze puzzle (czyste bryły bez napisów)
  { id: "s0_apart", name: "Apart", floor: 0, logo: "Apart_logo_black_RGB_1.jpg", category: "Jubiler", isLarge: false, col: 10, row: 8, w: 1, h: 1 },
  { id: "s0_wkruk", name: "W.KRUK", floor: 0, logo: "WKRUK_logo_braz_1.jpg", category: "Jubiler", isLarge: false, col: 11, row: 8, w: 1, h: 1 },
  { id: "s0_yes", name: "YES", floor: 0, logo: "yes_logo_nowe_czarne.jpg", category: "Jubiler", isLarge: false, col: 12, row: 8, w: 1, h: 1 },
  { id: "s0_calzedonia", name: "Calzedonia", floor: 0, logo: "CALZEDONIA_400x300.jpg", category: "Moda", isLarge: false, col: 10, row: 9, w: 1, h: 1 },
  { id: "s0_intimissimi", name: "Intimissimi", floor: 0, logo: "intimissimi_lingerie_400x300.jpg", category: "Bielizna", isLarge: false, col: 11, row: 9, w: 1, h: 1 },
  { id: "s0_etam", name: "Etam", floor: 0, logo: "ETAM_PARIS__1.jpg", category: "Bielizna", isLarge: false, col: 12, row: 9, w: 1, h: 1 },
  { id: "s0_grycan", name: "Grycan", floor: 0, logo: "Grycan_logo_bez_na_brazowym.png", category: "Lody", isLarge: false, col: 10, row: 10, w: 1, h: 1 },
  { id: "s0_fielmann", name: "Fielmann", floor: 0, logo: "logo_twoj_optyk_1.png", category: "Optyk", isLarge: false, col: 11, row: 10, w: 1, h: 1 },
  { id: "s0_tiger", name: "Flying Tiger", floor: 0, logo: "FTC_logo_800x400.png", category: "Upominki", isLarge: false, col: 12, row: 10, w: 1, h: 1 },

  // ==================== POZIOM 1 ====================
  // Góra
  { id: "s1_reserved", name: "Reserved", floor: 1, logo: "360x216_reservedlogo.jpg", category: "Moda", isLarge: true, col: 1, row: 1, w: 4, h: 3 },
  { id: "s1_halfprice", name: "HalfPrice", floor: 1, logo: "halfprice_logo_great_brands_horizontal.jpeg", category: "Moda", isLarge: true, col: 5, row: 1, w: 4, h: 3 },
  { id: "s1_ccc", name: "CCC", floor: 1, logo: "CCC_LOGO__1.png", category: "Obuwie", isLarge: true, col: 9, row: 1, w: 4, h: 3 },
  // Lewo
  { id: "s1_smyk", name: "Smyk", floor: 1, logo: "logo_SMYK_Cay_dla_maych_NEW_30_VII_2019.jpg", category: "Dzieci", isLarge: true, col: 1, row: 4, w: 3, h: 3 },
  // Prawo (zamknięte)
  { id: "s1_sephora", name: "Sephora", floor: 1, logo: "sephora_org.png", category: "Perfumeria", isLarge: true, col: 10, row: 4, w: 3, h: 3 },
  // Dół
  { id: "s1_mohito", name: "Mohito", floor: 1, logo: "MOHITO_logo_Easy_Resizecom.jpg", category: "Moda", isLarge: true, col: 1, row: 7, w: 3, h: 4 },
  { id: "s1_hebe", name: "Hebe", floor: 1, logo: "hebe_mag_roz.png", category: "Drogeria", isLarge: true, col: 4, row: 8, w: 2, h: 3 },
  { id: "s1_homeyou", name: "home&you", floor: 1, logo: "logo_HOMEYOU.png", category: "Wnętrza", isLarge: true, col: 6, row: 8, w: 3, h: 3 },
  { id: "s1_homla", name: "Homla", floor: 1, logo: "logo_szare.png", category: "Wnętrza", isLarge: true, col: 9, row: 8, w: 4, h: 3 },
  // Mniejsze lokale (czyste)
  { id: "s1_cropp", name: "Cropp", floor: 1, logo: "cropp.png", category: "Moda", isLarge: false, col: 4, row: 7, w: 1, h: 1 },
  { id: "s1_house", name: "House", floor: 1, logo: "HOUSE_LOGO_1.jpg", category: "Moda", isLarge: false, col: 5, row: 7, w: 1, h: 1 },
  { id: "s1_esotiq", name: "Esotiq", floor: 1, logo: "Esotiq_logo_black_800x269px.png", category: "Bielizna", isLarge: false, col: 6, row: 7, w: 1, h: 1 },
  { id: "s1_gatta", name: "Gatta", floor: 1, logo: "GATTA.png", category: "Odzież", isLarge: false, col: 7, row: 7, w: 1, h: 1 },
  { id: "s1_orange", name: "Orange", floor: 1, logo: "LOGO_RGB.png", category: "GSM", isLarge: false, col: 8, row: 7, w: 1, h: 1 },
  { id: "s1_tmobile", name: "T-Mobile", floor: 1, logo: "T_logo_rgb_p_2.png", category: "GSM", isLarge: false, col: 9, row: 7, w: 1, h: 1 },

  // ==================== POZIOM 2 ====================
  // Góra
  { id: "s2_cinema", name: "Cinema City", floor: 2, logo: "cinemacity_color_6.png", category: "Kino", isLarge: true, col: 1, row: 1, w: 6, h: 4 },
  { id: "s2_cityfit", name: "CityFit", floor: 2, logo: "klub_fitness_cityfit_logo.png", category: "Fitness", isLarge: true, col: 7, row: 1, w: 6, h: 4 },
  // Lewo
  { id: "s2_tkmaxx", name: "TK Maxx", floor: 2, logo: "tkmaxx_color.png", category: "Moda", isLarge: true, col: 1, row: 5, w: 3, h: 3 },
  // Prawo
  { id: "s2_mcd", name: "McDonald's", floor: 2, logo: "logo_mcd.png", category: "Gastro", isLarge: true, col: 10, row: 5, w: 3, h: 3 },
  // Dół
  { id: "s2_sinsay", name: "Sinsay", floor: 2, logo: "sinsay.jpg", category: "Moda", isLarge: true, col: 1, row: 8, w: 4, h: 3 },
  { id: "s2_pepco", name: "Pepco", floor: 2, logo: "Pepco_logo_RGB_TAB.png", category: "Dom", isLarge: true, col: 5, row: 8, w: 4, h: 3 },
  { id: "s2_kfc", name: "KFC", floor: 2, logo: "KFC_Polska_Logo.png", category: "Gastro", isLarge: true, col: 9, row: 8, w: 4, h: 3 },
  // Gastro środkowe
  { id: "s2_pizzahut", name: "Pizza Hut", floor: 2, logo: "PH_New_Secondary_Logo_RGB_1_page_0001_1.jpg", category: "Gastro", isLarge: false, col: 4, row: 5, w: 1, h: 1 },
  { id: "s2_marche", name: "Kuchnia Marche", floor: 2, logo: "KM_Logo_KolorClaim_2026pdf.jpg", category: "Gastro", isLarge: false, col: 5, row: 5, w: 1, h: 1 },
  { id: "s2_sushi", name: "Express Sushi", floor: 2, logo: "Zrzut_ekranu_2025_10_1_o_150304.png", category: "Gastro", isLarge: false, col: 6, row: 5, w: 1, h: 1 },
  { id: "s2_thailong", name: "THAI LONG", floor: 2, logo: "THAI LONG", category: "Gastro", isLarge: false, col: 7, row: 5, w: 1, h: 1 },
  { id: "s2_magia", name: "Magia d'Italia", floor: 2, logo: "magia.jpg", category: "Lody", isLarge: false, col: 8, row: 5, w: 1, h: 1 },
  { id: "s2_costa2", name: "Costa Coffee", floor: 2, logo: "Costa_Coffee_RED_CMYK_1.jpg", category: "Kawiarnia", isLarge: false, col: 9, row: 5, w: 1, h: 1 }
];

/**
 * Logiczne rozmieszczenie punktów infrastruktury na mapie (w procentach lub siatce):
 * - Schody ruchome (centralny punkt komunikacji korytarzowej)
 * - Winda (przy lewym korytarzu)
 * - Toalety (przy strefach bocznych)
 * - Bankomat (przy wejściu / korytarzu)
 * - Pokój matki z dzieckiem (przy toaletach)
 * - Automat parkingowy (przy wejściu na poziomie 0 i windzie)
 */
const AMENITIES_CATALOG = [
  // Piętro 0
  { type: "stairs", floor: 0, x: 35, y: 55, label: "Schody", icon: '<path d="M19 3v4h-4v4h-4v4H7v4H3v2h6v-4h4v-4h4v-4h4V3h-2z"/>' },
  { type: "elevator", floor: 0, x: 28, y: 55, label: "Winda", icon: '<path d="M7 2h10c1.1 0 2 .9 2 2v16c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2zm0 4v14h10V6H7zm3 3l2-2 2 2h-4zm4 6l-2 2-2-2h4z"/>' },
  { type: "wc", floor: 0, x: 88, y: 38, label: "Toalety", icon: '<path d="M9 22H7V11c-.55 0-1-.45-1-1V5c0-1.1.9-2 2-2h2c1.1 0 2 .9 2 2v5c0 .55-.45 1-1 1v11zm9 0h-2V13h-1l-1.5-6h5l-1.5 6h-1v9zm-1.5-16a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM8 3.5A1.5 1.5 0 1 1 8 .5a1.5 1.5 0 0 1 0 3z"/>' },
  { type: "baby", floor: 0, x: 92, y: 38, label: "Matka/dziecko", icon: '<path d="M12 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm-5.5 9c-.8 0-1.5.7-1.5 1.5v6c0 .8.7 1.5 1.5 1.5H8v2h8v-2h1.5c.8 0 1.5-.7 1.5-1.5v-6c0-.8-.7-1.5-1.5-1.5h-11z"/>' },
  { type: "atm", floor: 0, x: 75, y: 55, label: "Bankomat", icon: '<path d="M2 4v16h20V4H2zm18 14H4V6h16v12zm-3-8h-3V8h3v2zm-5 4H8v-2h4v2zm-2-4H8V8h2v2zm6 4h-2v-2h2v2z"/>' },
  { type: "parking_pay", floor: 0, x: 82, y: 55, label: "Kasa parkingowa", icon: '<path d="M19 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-6 9.5c0 .8-.7 1.5-1.5 1.5H10v3H8V8h3.5c.8 0 1.5.7 1.5 1.5v2zM10 11h1.5c.3 0 .5-.2.5-.5s-.2-.5-.5-.5H10v1z"/>' },

  // Piętro 1
  { type: "stairs", floor: 1, x: 35, y: 55, label: "Schody", icon: '<path d="M19 3v4h-4v4h-4v4H7v4H3v2h6v-4h4v-4h4v-4h4V3h-2z"/>' },
  { type: "elevator", floor: 1, x: 28, y: 55, label: "Winda", icon: '<path d="M7 2h10c1.1 0 2 .9 2 2v16c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2zm0 4v14h10V6H7zm3 3l2-2 2 2h-4zm4 6l-2 2-2-2h4z"/>' },
  { type: "wc", floor: 1, x: 92, y: 38, label: "Toalety", icon: '<path d="M9 22H7V11c-.55 0-1-.45-1-1V5c0-1.1.9-2 2-2h2c1.1 0 2 .9 2 2v5c0 .55-.45 1-1 1v11zm9 0h-2V13h-1l-1.5-6h5l-1.5 6h-1v9zm-1.5-16a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM8 3.5A1.5 1.5 0 1 1 8 .5a1.5 1.5 0 0 1 0 3z"/>' },
  { type: "baby", floor: 1, x: 88, y: 38, label: "Matka/dziecko", icon: '<path d="M12 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm-5.5 9c-.8 0-1.5.7-1.5 1.5v6c0 .8.7 1.5 1.5 1.5H8v2h8v-2h1.5c.8 0 1.5-.7 1.5-1.5v-6c0-.8-.7-1.5-1.5-1.5h-11z"/>' },
  { type: "atm", floor: 1, x: 65, y: 55, label: "Bankomat", icon: '<path d="M2 4v16h20V4H2zm18 14H4V6h16v12zm-3-8h-3V8h3v2zm-5 4H8v-2h4v2zm-2-4H8V8h2v2zm6 4h-2v-2h2v2z"/>' },

  // Piętro 2
  { type: "stairs", floor: 2, x: 35, y: 55, label: "Schody", icon: '<path d="M19 3v4h-4v4h-4v4H7v4H3v2h6v-4h4v-4h4v-4h4V3h-2z"/>' },
  { type: "elevator", floor: 2, x: 28, y: 55, label: "Winda", icon: '<path d="M7 2h10c1.1 0 2 .9 2 2v16c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2zm0 4v14h10V6H7zm3 3l2-2 2 2h-4zm4 6l-2 2-2-2h4z"/>' },
  { type: "wc", floor: 2, x: 92, y: 38, label: "Toalety", icon: '<path d="M9 22H7V11c-.55 0-1-.45-1-1V5c0-1.1.9-2 2-2h2c1.1 0 2 .9 2 2v5c0 .55-.45 1-1 1v11zm9 0h-2V13h-1l-1.5-6h5l-1.5 6h-1v9zm-1.5-16a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM8 3.5A1.5 1.5 0 1 1 8 .5a1.5 1.5 0 0 1 0 3z"/>' },
  { type: "atm", floor: 2, x: 65, y: 55, label: "Bankomat", icon: '<path d="M2 4v16h20V4H2zm18 14H4V6h16v12zm-3-8h-3V8h3v2zm-5 4H8v-2h4v2zm-2-4H8V8h2v2zm6 4h-2v-2h2v2z"/>' },
  { type: "parking_pay", floor: 2, x: 22, y: 55, label: "Kasa parkingowa", icon: '<path d="M19 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-6 9.5c0 .8-.7 1.5-1.5 1.5H10v3H8V8h3.5c.8 0 1.5.7 1.5 1.5v2zM10 11h1.5c.3 0 .5-.2.5-.5s-.2-.5-.5-.5H10v1z"/>' }
];