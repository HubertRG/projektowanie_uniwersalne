// ========================================================
// REPERTUAR KINA (CINEMA CITY)
// ========================================================
const CINEMA_REPERTOIRE_DATA = [
  {
    title: "Diuna: Część Druga",
    genre: "Sci-Fi / Przygodowy",
    duration: "166 min",
    dubbing: false,
    hours: ["13:30", "16:45", "19:15", "21:30"]
  },
  {
    title: "Kung Fu Panda 4",
    genre: "Animacja / Komedia",
    duration: "94 min",
    dubbing: true,
    hours: ["10:15", "12:30", "14:45", "17:00"]
  },
  {
    title: "Gladiator II",
    genre: "Dramat historyczny / Akcja",
    duration: "148 min",
    dubbing: false,
    hours: ["14:00", "17:15", "20:30"]
  },
  {
    title: "W głowie się nie mieści 2",
    genre: "Animacja / Familijny",
    duration: "100 min",
    dubbing: true,
    hours: ["11:00", "13:15", "15:30", "17:45"]
  },
  {
    title: "Joker: Folie à Deux",
    genre: "Dramat / Kryminał",
    duration: "138 min",
    dubbing: false,
    hours: ["16:00", "18:45", "21:15"]
  },
  {
    title: "Garfield",
    genre: "Animacja / Przygodowy",
    duration: "101 min",
    dubbing: true,
    hours: ["10:30", "12:45", "15:00"]
  },
  {
    title: "Deadpool & Wolverine",
    genre: "Akcja / Komedia Sci-Fi",
    duration: "127 min",
    dubbing: false,
    hours: ["17:30", "20:00", "22:15"]
  }
];

// ========================================================
// DANE DLA AKTUALNOŚCI I PROMOCJI
// ========================================================
const NEWS_DATA = [
  {
    id: "n1",
    date: "10.11.2026",
    title: "Otwarcie nowej strefy gastronomicznej i kawiarni Costa",
    desc: "Z radością informujemy o otwarciu powiększonej strefy Taste Gallery na poziomie +2 z nowymi konceptami kulinarnymi z całego świata.",
    fullText: "Z radością informujemy o uroczystym otwarciu zmodernizowanej strefy gastronomicznej Taste Gallery na poziomie +2! W nowej aranżacji przygotowano ponad 300 dodatkowych miejsc siedzących, strefę relaksu z gniazdkami do ładowania urządzeń mobilnych oraz zielone ogrody wertykalne. Do dyspozycji gości oddano również powiększoną kawiarnię Costa Coffee z autorskim menu śniadaniowym. Zapraszamy do wspólnego świętowania!",
    category: "Wydarzenia",
    bgGradient: "linear-gradient(135deg, #2E0854, #6A1B9A)"
  },
  {
    id: "n2",
    date: "08.11.2026",
    title: "Akcja charytatywna 'Paka dla Zwierzaka'",
    desc: "Przez cały weekend na parterze przy wejściu głównym prowadzimy zbiórkę karmy i akcesoriów dla lokalnego schroniska.",
    fullText: "Przez cały najbliższy weekend na placu głównym (poziom 0) prowadzona będzie coroczna zbiórka darów na rzecz podopiecznych Schroniska dla Bezdomnych Zwierząt. Zbieramy karmę mokrą i suchą, koce, smycze oraz bezpieczne zabawki. Dla każdego darczyńcy przygotowano pamiątkowe przypinki oraz kupony rabatowe do sklepów zoologicznych w galerii.",
    category: "Społeczność",
    bgGradient: "linear-gradient(135deg, #004D40, #00897B)"
  },
  {
    id: "n3",
    date: "04.11.2026",
    title: "Nocne seanse i maratony filmowe w Cinema City",
    desc: "Sprawdź specjalny listopadowy repertuar przedpremierowych pokazów filmowych oraz maratonów science-fiction.",
    fullText: "Kino Cinema City na 2. piętrze zaprasza na cykl piątkowych maratonów filmowych! W repertuarze znajdą się długo wyczekiwane premiery światowego kina oraz maratony kultowych serii z nagłośnieniem Dolby Atmos. Bilety dostępne w kasach kina oraz w biletomatach na terenie galerii.",
    category: "Kultura",
    bgGradient: "linear-gradient(135deg, #B71C1C, #E53935)"
  },
  {
    id: "n4",
    date: "01.11.2026",
    title: "Godziny otwarcia galerii w okresie świątecznym",
    desc: "Zapoznaj się z harmonogramem pracy sklepów, kina oraz klubu fitness w nadchodzące dni wolne.",
    fullText: "Uprzejmie informujemy, że w dniach świątecznych galeria handlowa funkcjonuje w zmienionych godzinach. Sklepy i punkty usługowe pozostają nieczynne w święta ustawowe, natomiast strefa rozrywki (kino Cinema City oraz klub CityFit 24/7) funkcjonują zgodnie z indywidualnymi harmonogramami. Szczegółowy harmonogram dostępny jest w zakładce Komunikacja i Informacja.",
    category: "Komunikat",
    bgGradient: "linear-gradient(135deg, #1A237E, #3949AB)"
  },
  {
    id: "n5",
    date: "28.10.2026",
    title: "Nowy salon biżuterii YES już otwarty na poziomie 0",
    desc: "Zapraszamy do nowo otwartego salonu jubilerskiego YES. W pierwszych dniach specjalne upominki dla klientów.",
    fullText: "Na poziomie 0 w centralnym pasażu otwarty został elegancki salon jubilerski YES. W ofercie dostępna jest najnowsza kolekcja pierścionków, naszyjników oraz biżuterii autorskiej. Z okazji otwarcia przez pierwsze dwa tygodnie do każdego zakupu powyżej 300 zł dodawany jest ekskluzywny upominek.",
    category: "Nowy lokal",
    bgGradient: "linear-gradient(135deg, #4A148C, #8E24AA)"
  },
  {
    id: "n6",
    date: "24.10.2026",
    title: "Bezpłatne warsztaty ekologiczne dla dzieci w Smyku",
    desc: "Kreatywne zajęcia plastyczne z recyklingu i tworzenia zabawek w każdą sobotę miesiąca.",
    fullText: "W każdą sobotę listopada w salonie Smyk na poziomie 1 odbywają się bezpłatne warsztaty kreatywne dla najmłodszych. Dzieci pod okiem animatorów tworzą ozdoby i proste zabawki z materiałów przyjaznych środowisku. Zapisy w punkcie informacyjnym lub bezpośrednio w salonie.",
    category: "Dzieci",
    bgGradient: "linear-gradient(135deg, #E65100, #FB8C00)"
  }
];

const PROMO_DATA = [
  {
    id: "p1",
    date: "Ważne do 20.11.2026",
    store: "Reserved",
    title: "Mid Season Sale do -50% na kolekcję jesienną",
    desc: "Skorzystaj z rabatów na kurtki, ciepłe swetry, płaszcze i akcesoria zimowe w salonie na poziomie 1.",
    fullText: "Odwiedź salon Reserved na 1. piętrze i skorzystaj z wyjątkowej promocji sezonowej! Wybrane artykuły z kolekcji damskiej, męskiej i dziecięcej przeceniono nawet o 50%. Promocja obejmuje ciepłe kurtki zimowe, płaszcze z wełną, grube swetry i stylowe dodatki.",
    category: "Moda",
    bgGradient: "linear-gradient(135deg, #111111, #424242)"
  },
  {
    id: "p2",
    date: "Ważne do 15.11.2026",
    store: "Rossmann",
    title: "1+1 gratis na wybrane kosmetyki do pielęgnacji",
    desc: "Kup dowolny krem do twarzy objęty promocją, a drugi produkt otrzymasz za 1 grosz z aplikacją Rossmann.",
    fullText: "Wyjątkowa oferta dla posiadaczy aplikacji Rossmann na poziomie 0. Przy zakupie dowolnego kremu pielęgnacyjnego lub serum z oznaczonej półki, drugi produkt tej samej lub tańszej marki otrzymasz za 1 grosz.",
    category: "Drogeria",
    bgGradient: "linear-gradient(135deg, #B71C1C, #C2185B)"
  },
  {
    id: "p3",
    date: "Ważne do 30.11.2026",
    store: "Komputronik",
    title: "Raty 0% i rabat 200 zł na laptopy i monitory",
    desc: "Wyposaż swoje domowe biuro lub stanowisko gracza w salonie elektroniki na poziomie 0.",
    fullText: "Salon Komputronik (poziom 0) przygotował specjalną ofertę technologiczną. Wybrane laptopy biurowe i gamingowe oraz monitory 4K objęte są promocją 20 rat 0% oraz natychmiastowym rabatem do 200 zł.",
    category: "Elektronika",
    bgGradient: "linear-gradient(135deg, #0D47A1, #1976D2)"
  },
  {
    id: "p4",
    date: "Ważne do 18.11.2026",
    store: "CCC",
    title: "Druga para obuwia zimowego -40%",
    desc: "Kup dowolną parę butów zimowych lub kozaków, a drugą parę otrzymasz z rabatem 40% na poziomie 1.",
    fullText: "Przygotuj całą rodzinę na chłodniejsze dni! W salonie CCC na poziomie 1 przy zakupie dwóch par butów zimowych, na tańszą parę naliczany jest natychmiastowy rabat 40%.",
    category: "Obuwie",
    bgGradient: "linear-gradient(135deg, #E65100, #F57C00)"
  },
  {
    id: "p5",
    date: "Ważne do 25.11.2026",
    store: "Douglas",
    title: "Prezent do każdego zakupu zapachów luksusowych",
    desc: "Otrzymaj miniaturę luksusowych perfum i kosmetyczkę przy zakupie wód perfumowanych od 299 zł.",
    fullText: "Perfumeria Douglas zaprasza miłośników wyrafinowanych kompozycji zapachowych. Przy zakupie dowolnego zapachu z linii luksusowej o wartości min. 299 zł otrzymasz elegancki zestaw miniatur i firmową kosmetyczkę w prezencie.",
    category: "Perfumeria",
    bgGradient: "linear-gradient(135deg, #004D40, #00796B)"
  },
  {
    id: "p6",
    date: "Ważne do 14.11.2026",
    store: "Costa Coffee",
    title: "Kawa duża w cenie średniej do każdego ciasta",
    desc: "Odwiedź Costa Coffee na poziomie 0 lub 2 i ciesz się powiększoną kawą w promocyjnej cenie.",
    fullText: "Słodka chwila wytchnienia podczas zakupów! Zamów dowolne ciasto lub tartę z naszej gabloty w kawiarni Costa Coffee (poziom 0 lub 2), a dowolną kawę klasyczną powiększymy do rozmiaru Massimo bez żadnych dopłat.",
    category: "Kawiarnia",
    bgGradient: "linear-gradient(135deg, #880E4F, #AD1457)"
  }
];

const TRANSIT_DATA = [
  {
    stopId: "stop_galeria_01",
    stopName: "Galeria Handlowa 01 (Wejście Główne)",
    lines: [
      {
        num: "115",
        stop: "Galeria Handlowa 01",
        dest: "Dworzec Główny PKP",
        schedule: [
          { hour: "06", mins: "05, 20, 35, 50" },
          { hour: "07", mins: "02, 14, 26, 38, 50" },
          { hour: "08", mins: "05, 18, 32, 45" },
          { hour: "09", mins: "00, 15, 30, 45" },
          { hour: "10", mins: "00, 15, 30, 45" },
          { hour: "11", mins: "00, 20, 40" },
          { hour: "12", mins: "00, 15, 30, 45" },
          { hour: "13", mins: "00, 15, 30, 45" },
          { hour: "14", mins: "02, 15, 28, 41, 54" },
          { hour: "15", mins: "08, 20, 32, 44, 56" },
          { hour: "16", mins: "08, 20, 32, 44, 56" },
          { hour: "17", mins: "10, 25, 40, 55" },
          { hour: "18", mins: "10, 25, 40, 55" },
          { hour: "19", mins: "15, 35, 55" },
          { hour: "20", mins: "15, 35, 55" },
          { hour: "21", mins: "15, 40" },
          { hour: "22", mins: "05, 35" }
        ]
      },
      {
        num: "124",
        stop: "Galeria Handlowa 01",
        dest: "Osiedle Słoneczne",
        schedule: [
          { hour: "06", mins: "12, 32, 52" },
          { hour: "07", mins: "10, 25, 40, 55" },
          { hour: "08", mins: "10, 30, 50" },
          { hour: "09", mins: "10, 30, 50" },
          { hour: "10", mins: "15, 45" },
          { hour: "11", mins: "15, 45" },
          { hour: "12", mins: "10, 30, 50" },
          { hour: "13", mins: "10, 30, 50" },
          { hour: "14", mins: "05, 20, 35, 50" },
          { hour: "15", mins: "05, 20, 35, 50" },
          { hour: "16", mins: "05, 20, 35, 50" },
          { hour: "17", mins: "12, 32, 52" },
          { hour: "18", mins: "15, 45" },
          { hour: "19", mins: "15, 45" },
          { hour: "20", mins: "15, 45" },
          { hour: "21", mins: "15, 45" }
        ]
      },
      {
        num: "199",
        stop: "Galeria Handlowa 01",
        dest: "Port Lotniczy / Terminal T2",
        schedule: [
          { hour: "05", mins: "10, 40" },
          { hour: "06", mins: "10, 30, 50" },
          { hour: "07", mins: "10, 30, 50" },
          { hour: "08", mins: "10, 30, 50" },
          { hour: "09", mins: "15, 45" },
          { hour: "10", mins: "15, 45" },
          { hour: "11", mins: "15, 45" },
          { hour: "12", mins: "15, 45" },
          { hour: "13", mins: "10, 30, 50" },
          { hour: "14", mins: "10, 30, 50" },
          { hour: "15", mins: "10, 30, 50" },
          { hour: "16", mins: "10, 30, 50" },
          { hour: "17", mins: "15, 45" },
          { hour: "18", mins: "15, 45" },
          { hour: "19", mins: "20, 50" },
          { hour: "20", mins: "20, 50" },
          { hour: "21", mins: "20, 50" }
        ]
      }
    ]
  },
  {
    stopId: "stop_dworzec_02",
    stopName: "Dworzec Wschodni PKP (3 min pieszo)",
    lines: [
      {
        num: "168",
        stop: "Dworzec Wschodni 02",
        dest: "Centrum Handlowe Matarnia",
        schedule: [
          { hour: "06", mins: "15, 45" },
          { hour: "07", mins: "05, 25, 45" },
          { hour: "08", mins: "05, 25, 45" },
          { hour: "09", mins: "15, 45" },
          { hour: "10", mins: "15, 45" },
          { hour: "11", mins: "15, 45" },
          { hour: "12", mins: "15, 45" },
          { hour: "13", mins: "05, 25, 45" },
          { hour: "14", mins: "05, 25, 45" },
          { hour: "15", mins: "05, 25, 45" },
          { hour: "16", mins: "05, 25, 45" },
          { hour: "17", mins: "15, 45" },
          { hour: "18", mins: "15, 45" },
          { hour: "19", mins: "20" },
          { hour: "20", mins: "20" }
        ]
      },
      {
        num: "210",
        stop: "Dworzec Wschodni 02",
        dest: "Port Lotniczy Gdańsk",
        schedule: [
          { hour: "05", mins: "25, 55" },
          { hour: "06", mins: "25, 55" },
          { hour: "07", mins: "20, 45" },
          { hour: "08", mins: "15, 45" },
          { hour: "09", mins: "15, 45" },
          { hour: "10", mins: "15, 45" },
          { hour: "11", mins: "15, 45" },
          { hour: "12", mins: "15, 45" },
          { hour: "13", mins: "15, 45" },
          { hour: "14", mins: "15, 45" },
          { hour: "15", mins: "15, 45" },
          { hour: "16", mins: "15, 45" },
          { hour: "17", mins: "20, 50" },
          { hour: "18", mins: "20, 50" },
          { hour: "19", mins: "25, 55" },
          { hour: "20", mins: "25" }
        ]
      }
    ]
  },
  {
    stopId: "stop_aleja_04",
    stopName: "Al. Zwycięstwa / Parkowa (5 min pieszo)",
    lines: [
      {
        num: "158",
        stop: "Al. Zwycięstwa 04",
        dest: "Plaża Stogi / Pętla",
        schedule: [
          { hour: "06", mins: "08, 28, 48" },
          { hour: "07", mins: "08, 24, 40, 56" },
          { hour: "08", mins: "12, 28, 44" },
          { hour: "09", mins: "04, 24, 44" },
          { hour: "10", mins: "10, 40" },
          { hour: "11", mins: "10, 40" },
          { hour: "12", mins: "10, 40" },
          { hour: "13", mins: "04, 24, 44" },
          { hour: "14", mins: "04, 20, 36, 52" },
          { hour: "15", mins: "08, 24, 40, 56" },
          { hour: "16", mins: "12, 28, 44" },
          { hour: "17", mins: "04, 24, 44" },
          { hour: "18", mins: "10, 40" },
          { hour: "19", mins: "10, 40" },
          { hour: "20", mins: "15, 45" }
        ]
      },
      {
        num: "227",
        stop: "Al. Zwycięstwa 04",
        dest: "Chełm Cmentarz",
        schedule: [
          { hour: "06", mins: "18, 48" },
          { hour: "07", mins: "18, 38, 58" },
          { hour: "08", mins: "18, 38, 58" },
          { hour: "09", mins: "20, 50" },
          { hour: "10", mins: "20, 50" },
          { hour: "11", mins: "20, 50" },
          { hour: "12", mins: "20, 50" },
          { hour: "13", mins: "18, 38, 58" },
          { hour: "14", mins: "18, 38, 58" },
          { hour: "15", mins: "18, 38, 58" },
          { hour: "16", mins: "18, 38, 58" },
          { hour: "17", mins: "20, 50" },
          { hour: "18", mins: "20, 50" },
          { hour: "19", mins: "25" }
        ]
      }
    ]
  }
];