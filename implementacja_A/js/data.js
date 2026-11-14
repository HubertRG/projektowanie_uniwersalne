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
  },
  {
    title: "Oppenheimer",
    genre: "Biograficzny / Dramat",
    duration: "180 min",
    dubbing: false,
    hours: ["15:00", "19:00"]
  },
  {
    title: "Barbie",
    genre: "Komedia / Fantasy",
    duration: "114 min",
    dubbing: true,
    hours: ["12:00", "14:30", "17:00", "19:30"]
  },
  {
    title: "Mission: Impossible – Dead Reckoning",
    genre: "Akcja / Thriller",
    duration: "163 min",
    dubbing: false,
    hours: ["14:15", "17:45", "21:00"]
  },
  {
    title: "Indiana Jones i Artefakt Przeznaczenia",
    genre: "Przygodowy / Akcja",
    duration: "154 min",
    dubbing: false,
    hours: ["13:00", "16:30", "20:00"]
  },
  {
    title: "Spider-Man: Across the Spider-Verse",
    genre: "Animacja / Akcja",
    duration: "140 min",
    dubbing: true,
    hours: ["10:45", "13:45", "16:45", "19:45"]
  },
  {
    title: "Wonka",
    genre: "Familijny / Musical",
    duration: "116 min",
    dubbing: true,
    hours: ["10:00", "12:30", "15:00", "17:30"]
  },
  {
    title: "Napoleon",
    genre: "Historyczny / Dramat",
    duration: "158 min",
    dubbing: false,
    hours: ["14:30", "18:00", "21:15"]
  },
  {
    title: "The Batman",
    genre: "Kryminał / Akcja",
    duration: "176 min",
    dubbing: false,
    hours: ["16:00", "19:45"]
  },
  {
    title: "Top Gun: Maverick",
    genre: "Akcja / Dramat",
    duration: "130 min",
    dubbing: false,
    hours: ["13:15", "16:00", "18:45", "21:30"]
  },
  {
    title: "Avatar: Istota wody",
    genre: "Sci-Fi / Przygodowy",
    duration: "192 min",
    dubbing: false,
    hours: ["12:00", "16:00", "20:00"]
  },
  {
    title: "Puss in Boots: Ostatnie życzenie",
    genre: "Animacja / Przygodowy",
    duration: "102 min",
    dubbing: true,
    hours: ["10:30", "12:45", "15:00", "17:15"]
  },
  {
    title: "Szybcy i wściekli 10",
    genre: "Akcja / Thriller",
    duration: "141 min",
    dubbing: false,
    hours: ["14:00", "17:00", "20:15", "22:30"]
  },
  {
    title: "Transformers: Przebudzenie bestii",
    genre: "Sci-Fi / Akcja",
    duration: "127 min",
    dubbing: false,
    hours: ["13:30", "16:15", "19:00", "21:45"]
  },
  {
    title: "The Marvels",
    genre: "Akcja / Sci-Fi",
    duration: "105 min",
    dubbing: false,
    hours: ["11:15", "13:45", "16:15", "18:45"]
  },
  {
    title: "Akwaman i Zaginione Królestwo",
    genre: "Akcja / Fantasy",
    duration: "124 min",
    dubbing: false,
    hours: ["12:30", "15:15", "18:00", "20:45"]
  },
  {
    title: "Migracja",
    genre: "Animacja / Komedia",
    duration: "91 min",
    dubbing: true,
    hours: ["10:00", "12:00", "14:00", "16:00"]
  },
  {
    title: "Trolle 3",
    genre: "Animacja / Musical",
    duration: "92 min",
    dubbing: true,
    hours: ["10:15", "12:15", "14:15", "16:15"]
  },
  {
    title: "Chłopiec i czapla",
    genre: "Animacja / Dramat",
    duration: "124 min",
    dubbing: false,
    hours: ["11:30", "14:00", "16:30", "19:00"]
  },
  {
    title: "Biedne istoty",
    genre: "Dramat / Fantasy",
    duration: "141 min",
    dubbing: false,
    hours: ["15:30", "18:30", "21:30"]
  },
  {
    title: "Anatomia upadku",
    genre: "Dramat / Thriller",
    duration: "151 min",
    dubbing: false,
    hours: ["16:45", "20:15"]
  },
  {
    title: "Strefa interesów",
    genre: "Dramat historyczny",
    duration: "105 min",
    dubbing: false,
    hours: ["14:30", "17:00", "19:30"]
  },
  {
    title: "Wszystko wszędzie naraz",
    genre: "Sci-Fi / Komedia",
    duration: "139 min",
    dubbing: false,
    hours: ["15:00", "18:15", "21:30"]
  },
  {
    title: "Czas krwawego księżyca",
    genre: "Dramat / Kryminał",
    duration: "206 min",
    dubbing: false,
    hours: ["14:00", "18:30"]
  },
  {
    title: "Priscilla",
    genre: "Biograficzny / Dramat",
    duration: "113 min",
    dubbing: false,
    hours: ["12:45", "15:15", "17:45", "20:15"]
  },
  {
    title: "Ferrari",
    genre: "Biograficzny / Dramat",
    duration: "130 min",
    dubbing: false,
    hours: ["13:15", "16:15", "19:15"]
  },
  {
    title: "Godzilla x Kong: Nowe imperium",
    genre: "Akcja / Sci-Fi",
    duration: "115 min",
    dubbing: false,
    hours: ["12:00", "14:30", "17:00", "19:30", "22:00"]
  },
  {
    title: "Cudowna podróż",
    genre: "Animacja / Familijny",
    duration: "98 min",
    dubbing: true,
    hours: ["10:00", "11:45", "13:30", "15:15"]
  },
  {
    title: "Hrabia Monte Christo",
    genre: "Przygodowy / Dramat",
    duration: "173 min",
    dubbing: false,
    hours: ["14:45", "18:30"]
  },
  {
    title: "Beetlejuice Beetlejuice",
    genre: "Komedia / Horror",
    duration: "104 min",
    dubbing: false,
    hours: ["16:30", "18:45", "21:00"]
  },
  {
    title: "Vaiana 2",
    genre: "Animacja / Przygodowy",
    duration: "100 min",
    dubbing: true,
    hours: ["10:30", "12:45", "15:00", "17:15", "19:30"]
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
    stopId: "stop_krakowskie_02",
    stopName: "Krakowskie Przedmieście 02",
    lines: [
      {
        num: "003",
        stop: "Krakowskie Przedmieście 02",
        dest: "Zorza",
        schedule: [
          { hour: "05", mins: "10, 40" },
          { hour: "06", mins: "10, 25, 40, 55" },
          { hour: "07", mins: "10, 25, 40, 55" },
          { hour: "08", mins: "10, 25, 40, 55" },
          { hour: "09", mins: "10, 30, 50" },
          { hour: "10", mins: "10, 30, 50" },
          { hour: "11", mins: "10, 30, 50" },
          { hour: "12", mins: "10, 30, 50" },
          { hour: "13", mins: "10, 25, 40, 55" },
          { hour: "14", mins: "10, 25, 40, 55" },
          { hour: "15", mins: "10, 25, 40, 55" },
          { hour: "16", mins: "10, 25, 40, 55" },
          { hour: "17", mins: "10, 30, 50" },
          { hour: "18", mins: "10, 30, 50" },
          { hour: "19", mins: "15, 45" },
          { hour: "20", mins: "15, 45" },
          { hour: "21", mins: "15, 45" },
          { hour: "22", mins: "15, 45" }
        ]
      },
      {
        num: "007",
        stop: "Krakowskie Przedmieście 02",
        dest: "Felin",
        schedule: [
          { hour: "05", mins: "20, 50" },
          { hour: "06", mins: "20, 35, 50" },
          { hour: "07", mins: "05, 20, 35, 50" },
          { hour: "08", mins: "05, 20, 35, 50" },
          { hour: "09", mins: "05, 20, 35, 50" },
          { hour: "10", mins: "05, 25, 45" },
          { hour: "11", mins: "05, 25, 45" },
          { hour: "12", mins: "05, 25, 45" },
          { hour: "13", mins: "05, 20, 35, 50" },
          { hour: "14", mins: "05, 20, 35, 50" },
          { hour: "15", mins: "05, 20, 35, 50" },
          { hour: "16", mins: "05, 20, 35, 50" },
          { hour: "17", mins: "05, 25, 45" },
          { hour: "18", mins: "05, 25, 45" },
          { hour: "19", mins: "10, 40" },
          { hour: "20", mins: "10, 40" },
          { hour: "21", mins: "10, 40" },
          { hour: "22", mins: "10, 40" }
        ]
      },
      {
        num: "026",
        stop: "Krakowskie Przedmieście 02",
        dest: "Paderewskiego",
        schedule: [
          { hour: "06", mins: "00, 30" },
          { hour: "07", mins: "00, 20, 40" },
          { hour: "08", mins: "00, 20, 40" },
          { hour: "09", mins: "00, 20, 40" },
          { hour: "10", mins: "00, 30" },
          { hour: "11", mins: "00, 30" },
          { hour: "12", mins: "00, 30" },
          { hour: "13", mins: "00, 20, 40" },
          { hour: "14", mins: "00, 20, 40" },
          { hour: "15", mins: "00, 20, 40" },
          { hour: "16", mins: "00, 20, 40" },
          { hour: "17", mins: "00, 30" },
          { hour: "18", mins: "00, 30" },
          { hour: "19", mins: "15, 45" },
          { hour: "20", mins: "15, 45" },
          { hour: "21", mins: "15, 45" }
        ]
      },
      {
        num: "040",
        stop: "Krakowskie Przedmieście 02",
        dest: "Chodźki - szpital",
        schedule: [
          { hour: "05", mins: "30" },
          { hour: "06", mins: "00, 20, 40" },
          { hour: "07", mins: "00, 15, 30, 45" },
          { hour: "08", mins: "00, 15, 30, 45" },
          { hour: "09", mins: "00, 15, 30, 45" },
          { hour: "10", mins: "00, 20, 40" },
          { hour: "11", mins: "00, 20, 40" },
          { hour: "12", mins: "00, 20, 40" },
          { hour: "13", mins: "00, 15, 30, 45" },
          { hour: "14", mins: "00, 15, 30, 45" },
          { hour: "15", mins: "00, 15, 30, 45" },
          { hour: "16", mins: "00, 15, 30, 45" },
          { hour: "17", mins: "00, 20, 40" },
          { hour: "18", mins: "00, 20, 40" },
          { hour: "19", mins: "00, 30" },
          { hour: "20", mins: "00, 30" },
          { hour: "21", mins: "00, 30" },
          { hour: "22", mins: "00, 30" }
        ]
      },
      {
        num: "055",
        stop: "Krakowskie Przedmieście 02",
        dest: "Os. Choiny",
        schedule: [
          { hour: "05", mins: "45" },
          { hour: "06", mins: "15, 45" },
          { hour: "07", mins: "15, 45" },
          { hour: "08", mins: "15, 45" },
          { hour: "09", mins: "15, 45" },
          { hour: "10", mins: "15, 45" },
          { hour: "11", mins: "15, 45" },
          { hour: "12", mins: "15, 45" },
          { hour: "13", mins: "15, 45" },
          { hour: "14", mins: "15, 45" },
          { hour: "15", mins: "15, 45" },
          { hour: "16", mins: "15, 45" },
          { hour: "17", mins: "15, 45" },
          { hour: "18", mins: "15, 45" },
          { hour: "19", mins: "15, 45" },
          { hour: "20", mins: "15, 45" },
          { hour: "21", mins: "15, 45" }
        ]
      },
      {
        num: "302",
        stop: "Krakowskie Przedmieście 02",
        dest: "Koncertowa",
        schedule: [
          { hour: "06", mins: "05, 35" },
          { hour: "07", mins: "05, 25, 45" },
          { hour: "08", mins: "05, 25, 45" },
          { hour: "09", mins: "05, 25, 45" },
          { hour: "10", mins: "05, 35" },
          { hour: "11", mins: "05, 35" },
          { hour: "12", mins: "05, 35" },
          { hour: "13", mins: "05, 25, 45" },
          { hour: "14", mins: "05, 25, 45" },
          { hour: "15", mins: "05, 25, 45" },
          { hour: "16", mins: "05, 25, 45" },
          { hour: "17", mins: "05, 35" },
          { hour: "18", mins: "05, 35" },
          { hour: "19", mins: "05, 35" },
          { hour: "20", mins: "05, 35" },
          { hour: "21", mins: "05, 35" }
        ]
      }
    ]
  },
  {
    stopId: "stop_lipowa_cmentarz_01",
    stopName: "Lipowa - cmentarz 01",
    lines: [
      {
        num: "004",
        stop: "Lipowa - cmentarz 01",
        dest: "Elizówka - giełda",
        schedule: [
          { hour: "05", mins: "15, 45" },
          { hour: "06", mins: "15, 35, 55" },
          { hour: "07", mins: "15, 35, 55" },
          { hour: "08", mins: "15, 35, 55" },
          { hour: "09", mins: "15, 35, 55" },
          { hour: "10", mins: "15, 45" },
          { hour: "11", mins: "15, 45" },
          { hour: "12", mins: "15, 45" },
          { hour: "13", mins: "15, 35, 55" },
          { hour: "14", mins: "15, 35, 55" },
          { hour: "15", mins: "15, 35, 55" },
          { hour: "16", mins: "15, 35, 55" },
          { hour: "17", mins: "15, 45" },
          { hour: "18", mins: "15, 45" },
          { hour: "19", mins: "15, 45" },
          { hour: "20", mins: "15, 45" },
          { hour: "21", mins: "15, 45" },
          { hour: "22", mins: "15, 45" }
        ]
      },
      {
        num: "008",
        stop: "Lipowa - cmentarz 01",
        dest: "Zemborzyce Górne",
        schedule: [
          { hour: "05", mins: "25, 55" },
          { hour: "06", mins: "25, 55" },
          { hour: "07", mins: "20, 40" },
          { hour: "08", mins: "00, 20, 40" },
          { hour: "09", mins: "00, 20, 40" },
          { hour: "10", mins: "00, 30" },
          { hour: "11", mins: "00, 30" },
          { hour: "12", mins: "00, 30" },
          { hour: "13", mins: "00, 20, 40" },
          { hour: "14", mins: "00, 20, 40" },
          { hour: "15", mins: "00, 20, 40" },
          { hour: "16", mins: "00, 20, 40" },
          { hour: "17", mins: "00, 30" },
          { hour: "18", mins: "00, 30" },
          { hour: "19", mins: "00, 30" },
          { hour: "20", mins: "00, 30" },
          { hour: "21", mins: "00, 30" }
        ]
      },
      {
        num: "011",
        stop: "Lipowa - cmentarz 01",
        dest: "Os. Widok",
        schedule: [
          { hour: "05", mins: "35" },
          { hour: "06", mins: "05, 35" },
          { hour: "07", mins: "05, 25, 45" },
          { hour: "08", mins: "05, 25, 45" },
          { hour: "09", mins: "05, 25, 45" },
          { hour: "10", mins: "05, 35" },
          { hour: "11", mins: "05, 35" },
          { hour: "12", mins: "05, 35" },
          { hour: "13", mins: "05, 25, 45" },
          { hour: "14", mins: "05, 25, 45" },
          { hour: "15", mins: "05, 25, 45" },
          { hour: "16", mins: "05, 25, 45" },
          { hour: "17", mins: "05, 35" },
          { hour: "18", mins: "05, 35" },
          { hour: "19", mins: "05, 35" },
          { hour: "20", mins: "05, 35" },
          { hour: "21", mins: "05, 35" }
        ]
      },
      {
        num: "013",
        stop: "Lipowa - cmentarz 01",
        dest: "Paderewskiego",
        schedule: [
          { hour: "05", mins: "45" },
          { hour: "06", mins: "15, 45" },
          { hour: "07", mins: "15, 35, 55" },
          { hour: "08", mins: "15, 35, 55" },
          { hour: "09", mins: "15, 35, 55" },
          { hour: "10", mins: "15, 45" },
          { hour: "11", mins: "15, 45" },
          { hour: "12", mins: "15, 45" },
          { hour: "13", mins: "15, 35, 55" },
          { hour: "14", mins: "15, 35, 55" },
          { hour: "15", mins: "15, 35, 55" },
          { hour: "16", mins: "15, 35, 55" },
          { hour: "17", mins: "15, 45" },
          { hour: "18", mins: "15, 45" },
          { hour: "19", mins: "15, 45" },
          { hour: "20", mins: "15, 45" },
          { hour: "21", mins: "15, 45" }
        ]
      },
      {
        num: "015",
        stop: "Lipowa - cmentarz 01",
        dest: "Żeglarska",
        schedule: [
          { hour: "06", mins: "00, 30" },
          { hour: "07", mins: "00, 20, 40" },
          { hour: "08", mins: "00, 20, 40" },
          { hour: "09", mins: "00, 20, 40" },
          { hour: "10", mins: "00, 30" },
          { hour: "11", mins: "00, 30" },
          { hour: "12", mins: "00, 30" },
          { hour: "13", mins: "00, 20, 40" },
          { hour: "14", mins: "00, 20, 40" },
          { hour: "15", mins: "00, 20, 40" },
          { hour: "16", mins: "00, 20, 40" },
          { hour: "17", mins: "00, 30" },
          { hour: "18", mins: "00, 30" },
          { hour: "19", mins: "00, 30" },
          { hour: "20", mins: "00, 30" },
          { hour: "21", mins: "00, 30" }
        ]
      },
      {
        num: "020",
        stop: "Lipowa - cmentarz 01",
        dest: "Kruczkowskiego",
        schedule: [
          { hour: "06", mins: "10, 40" },
          { hour: "07", mins: "10, 30, 50" },
          { hour: "08", mins: "10, 30, 50" },
          { hour: "09", mins: "10, 30, 50" },
          { hour: "10", mins: "10, 40" },
          { hour: "11", mins: "10, 40" },
          { hour: "12", mins: "10, 40" },
          { hour: "13", mins: "10, 30, 50" },
          { hour: "14", mins: "10, 30, 50" },
          { hour: "15", mins: "10, 30, 50" },
          { hour: "16", mins: "10, 30, 50" },
          { hour: "17", mins: "10, 40" },
          { hour: "18", mins: "10, 40" },
          { hour: "19", mins: "10, 40" },
          { hour: "20", mins: "10, 40" },
          { hour: "21", mins: "10, 40" }
        ]
      },
      {
        num: "032",
        stop: "Lipowa - cmentarz 01",
        dest: "Os. Widok",
        schedule: [
          { hour: "06", mins: "20, 50" },
          { hour: "07", mins: "20, 40" },
          { hour: "08", mins: "00, 20, 40" },
          { hour: "09", mins: "00, 20, 40" },
          { hour: "10", mins: "00, 30" },
          { hour: "11", mins: "00, 30" },
          { hour: "12", mins: "00, 30" },
          { hour: "13", mins: "00, 20, 40" },
          { hour: "14", mins: "00, 20, 40" },
          { hour: "15", mins: "00, 20, 40" },
          { hour: "16", mins: "00, 20, 40" },
          { hour: "17", mins: "00, 30" },
          { hour: "18", mins: "00, 30" },
          { hour: "19", mins: "00, 30" },
          { hour: "20", mins: "00, 30" },
          { hour: "21", mins: "00, 30" }
        ]
      },
      {
        num: "040",
        stop: "Lipowa - cmentarz 01",
        dest: "Żeglarska",
        schedule: [
          { hour: "05", mins: "30" },
          { hour: "06", mins: "00, 20, 40" },
          { hour: "07", mins: "00, 15, 30, 45" },
          { hour: "08", mins: "00, 15, 30, 45" },
          { hour: "09", mins: "00, 15, 30, 45" },
          { hour: "10", mins: "00, 20, 40" },
          { hour: "11", mins: "00, 20, 40" },
          { hour: "12", mins: "00, 20, 40" },
          { hour: "13", mins: "00, 15, 30, 45" },
          { hour: "14", mins: "00, 15, 30, 45" },
          { hour: "15", mins: "00, 15, 30, 45" },
          { hour: "16", mins: "00, 15, 30, 45" },
          { hour: "17", mins: "00, 20, 40" },
          { hour: "18", mins: "00, 20, 40" },
          { hour: "19", mins: "00, 30" },
          { hour: "20", mins: "00, 30" },
          { hour: "21", mins: "00, 30" }
        ]
      },
      {
        num: "044",
        stop: "Lipowa - cmentarz 01",
        dest: "Kawka - las",
        schedule: [
          { hour: "05", mins: "50" },
          { hour: "06", mins: "20, 50" },
          { hour: "07", mins: "20, 50" },
          { hour: "08", mins: "20, 50" },
          { hour: "09", mins: "20, 50" },
          { hour: "10", mins: "20, 50" },
          { hour: "11", mins: "20, 50" },
          { hour: "12", mins: "20, 50" },
          { hour: "13", mins: "20, 50" },
          { hour: "14", mins: "20, 50" },
          { hour: "15", mins: "20, 50" },
          { hour: "16", mins: "20, 50" },
          { hour: "17", mins: "20, 50" },
          { hour: "18", mins: "20, 50" },
          { hour: "19", mins: "20, 50" },
          { hour: "20", mins: "20, 50" },
          { hour: "21", mins: "20, 50" }
        ]
      },
      {
        num: "055",
        stop: "Lipowa - cmentarz 01",
        dest: "Świdnik Helikopter",
        schedule: [
          { hour: "05", mins: "45" },
          { hour: "06", mins: "15, 45" },
          { hour: "07", mins: "15, 45" },
          { hour: "08", mins: "15, 45" },
          { hour: "09", mins: "15, 45" },
          { hour: "10", mins: "15, 45" },
          { hour: "11", mins: "15, 45" },
          { hour: "12", mins: "15, 45" },
          { hour: "13", mins: "15, 45" },
          { hour: "14", mins: "15, 45" },
          { hour: "15", mins: "15, 45" },
          { hour: "16", mins: "15, 45" },
          { hour: "17", mins: "15, 45" },
          { hour: "18", mins: "15, 45" },
          { hour: "19", mins: "15, 45" },
          { hour: "20", mins: "15, 45" },
          { hour: "21", mins: "15, 45" }
        ]
      },
      {
        num: "074",
        stop: "Lipowa - cmentarz 01",
        dest: "KUL",
        schedule: [
          { hour: "06", mins: "10, 30, 50" },
          { hour: "07", mins: "10, 30, 50" },
          { hour: "08", mins: "10, 30, 50" },
          { hour: "09", mins: "10, 30, 50" },
          { hour: "10", mins: "10, 40" },
          { hour: "11", mins: "10, 40" },
          { hour: "12", mins: "10, 40" },
          { hour: "13", mins: "10, 30, 50" },
          { hour: "14", mins: "10, 30, 50" },
          { hour: "15", mins: "10, 30, 50" },
          { hour: "16", mins: "10, 30, 50" },
          { hour: "17", mins: "10, 40" },
          { hour: "18", mins: "10, 40" },
          { hour: "19", mins: "10, 40" },
          { hour: "20", mins: "10, 40" },
          { hour: "21", mins: "10, 40" }
        ]
      },
      {
        num: "151",
        stop: "Lipowa - cmentarz 01",
        dest: "Abramowice",
        schedule: [
          { hour: "06", mins: "05, 35" },
          { hour: "07", mins: "05, 25, 45" },
          { hour: "08", mins: "05, 25, 45" },
          { hour: "09", mins: "05, 25, 45" },
          { hour: "10", mins: "05, 35" },
          { hour: "11", mins: "05, 35" },
          { hour: "12", mins: "05, 35" },
          { hour: "13", mins: "05, 25, 45" },
          { hour: "14", mins: "05, 25, 45" },
          { hour: "15", mins: "05, 25, 45" },
          { hour: "16", mins: "05, 25, 45" },
          { hour: "17", mins: "05, 35" },
          { hour: "18", mins: "05, 35" },
          { hour: "19", mins: "05, 35" },
          { hour: "20", mins: "05, 35" },
          { hour: "21", mins: "05, 35" }
        ]
      },
      {
        num: "155",
        stop: "Lipowa - cmentarz 01",
        dest: "Mełgiewska WSEI",
        schedule: [
          { hour: "06", mins: "15, 45" },
          { hour: "07", mins: "15, 35, 55" },
          { hour: "08", mins: "15, 35, 55" },
          { hour: "09", mins: "15, 35, 55" },
          { hour: "10", mins: "15, 45" },
          { hour: "11", mins: "15, 45" },
          { hour: "12", mins: "15, 45" },
          { hour: "13", mins: "15, 35, 55" },
          { hour: "14", mins: "15, 35, 55" },
          { hour: "15", mins: "15, 35, 55" },
          { hour: "16", mins: "15, 35, 55" },
          { hour: "17", mins: "15, 45" },
          { hour: "18", mins: "15, 45" },
          { hour: "19", mins: "15, 45" },
          { hour: "20", mins: "15, 45" },
          { hour: "21", mins: "15, 45" }
        ]
      },
      {
        num: "158",
        stop: "Lipowa - cmentarz 01",
        dest: "Felin",
        schedule: [
          { hour: "06", mins: "25, 55" },
          { hour: "07", mins: "25, 55" },
          { hour: "08", mins: "20, 40" },
          { hour: "09", mins: "00, 20, 40" },
          { hour: "10", mins: "00, 20, 40" },
          { hour: "11", mins: "00, 30" },
          { hour: "12", mins: "00, 30" },
          { hour: "13", mins: "00, 20, 40" },
          { hour: "14", mins: "00, 20, 40" },
          { hour: "15", mins: "00, 20, 40" },
          { hour: "16", mins: "00, 20, 40" },
          { hour: "17", mins: "00, 30" },
          { hour: "18", mins: "00, 30" },
          { hour: "19", mins: "00, 30" },
          { hour: "20", mins: "00, 30" },
          { hour: "21", mins: "00, 30" }
        ]
      },
      {
        num: "200",
        stop: "Lipowa - cmentarz 01",
        dest: "Majdanek",
        schedule: [
          { hour: "06", mins: "00, 30" },
          { hour: "07", mins: "00, 30" },
          { hour: "08", mins: "00, 30" },
          { hour: "09", mins: "00, 30" },
          { hour: "10", mins: "00, 30" },
          { hour: "11", mins: "00, 30" },
          { hour: "12", mins: "00, 30" },
          { hour: "13", mins: "00, 30" },
          { hour: "14", mins: "00, 30" },
          { hour: "15", mins: "00, 30" },
          { hour: "16", mins: "00, 30" },
          { hour: "17", mins: "00, 30" },
          { hour: "18", mins: "00, 30" },
          { hour: "19", mins: "00, 30" },
          { hour: "20", mins: "00, 30" },
          { hour: "21", mins: "00, 30" }
        ]
      },
      {
        num: "201",
        stop: "Lipowa - cmentarz 01",
        dest: "Konopnica - las",
        schedule: [
          { hour: "06", mins: "10, 40" },
          { hour: "07", mins: "10, 30, 50" },
          { hour: "08", mins: "10, 30, 50" },
          { hour: "09", mins: "10, 30, 50" },
          { hour: "10", mins: "10, 40" },
          { hour: "11", mins: "10, 40" },
          { hour: "12", mins: "10, 40" },
          { hour: "13", mins: "10, 30, 50" },
          { hour: "14", mins: "10, 30, 50" },
          { hour: "15", mins: "10, 30, 50" },
          { hour: "16", mins: "10, 30, 50" },
          { hour: "17", mins: "10, 40" },
          { hour: "18", mins: "10, 40" },
          { hour: "19", mins: "10, 40" },
          { hour: "20", mins: "10, 40" },
          { hour: "21", mins: "10, 40" }
        ]
      },
      {
        num: "302",
        stop: "Lipowa - cmentarz 01",
        dest: "Os. Widok",
        schedule: [
          { hour: "06", mins: "05, 35" },
          { hour: "07", mins: "05, 25, 45" },
          { hour: "08", mins: "05, 25, 45" },
          { hour: "09", mins: "05, 25, 45" },
          { hour: "10", mins: "05, 35" },
          { hour: "11", mins: "05, 35" },
          { hour: "12", mins: "05, 35" },
          { hour: "13", mins: "05, 25, 45" },
          { hour: "14", mins: "05, 25, 45" },
          { hour: "15", mins: "05, 25, 45" },
          { hour: "16", mins: "05, 25, 45" },
          { hour: "17", mins: "05, 35" },
          { hour: "18", mins: "05, 35" },
          { hour: "19", mins: "05, 35" },
          { hour: "20", mins: "05, 35" },
          { hour: "21", mins: "05, 35" }
        ]
      },
      {
        num: "950",
        stop: "Lipowa - cmentarz 01",
        dest: "Pancerniaków",
        schedule: [
          { hour: "06", mins: "30" },
          { hour: "07", mins: "00, 30" },
          { hour: "08", mins: "00, 30" },
          { hour: "09", mins: "00, 30" },
          { hour: "10", mins: "00, 30" },
          { hour: "11", mins: "00, 30" },
          { hour: "12", mins: "00, 30" },
          { hour: "13", mins: "00, 30" },
          { hour: "14", mins: "00, 30" },
          { hour: "15", mins: "00, 30" },
          { hour: "16", mins: "00, 30" },
          { hour: "17", mins: "00, 30" },
          { hour: "18", mins: "00, 30" },
          { hour: "19", mins: "00, 30" },
          { hour: "20", mins: "00, 30" },
          { hour: "21", mins: "00, 30" }
        ]
      }
    ]
  },
  {
    stopId: "stop_lipowa_cmentarz_02",
    stopName: "Lipowa - cmentarz 02",
    lines: [
      {
        num: "004",
        stop: "Lipowa - cmentarz 02",
        dest: "Elizówka",
        schedule: [
          { hour: "05", mins: "15, 45" },
          { hour: "06", mins: "15, 35, 55" },
          { hour: "07", mins: "15, 35, 55" },
          { hour: "08", mins: "15, 35, 55" },
          { hour: "09", mins: "15, 35, 55" },
          { hour: "10", mins: "15, 45" },
          { hour: "11", mins: "15, 45" },
          { hour: "12", mins: "15, 45" },
          { hour: "13", mins: "15, 35, 55" },
          { hour: "14", mins: "15, 35, 55" },
          { hour: "15", mins: "15, 35, 55" },
          { hour: "16", mins: "15, 35, 55" },
          { hour: "17", mins: "15, 45" },
          { hour: "18", mins: "15, 45" },
          { hour: "19", mins: "15, 45" },
          { hour: "20", mins: "15, 45" },
          { hour: "21", mins: "15, 45" },
          { hour: "22", mins: "15, 45" }
        ]
      },
      {
        num: "008",
        stop: "Lipowa - cmentarz 02",
        dest: "Okopowa",
        schedule: [
          { hour: "05", mins: "25, 55" },
          { hour: "06", mins: "25, 55" },
          { hour: "07", mins: "20, 40" },
          { hour: "08", mins: "00, 20, 40" },
          { hour: "09", mins: "00, 20, 40" },
          { hour: "10", mins: "00, 30" },
          { hour: "11", mins: "00, 30" },
          { hour: "12", mins: "00, 30" },
          { hour: "13", mins: "00, 20, 40" },
          { hour: "14", mins: "00, 20, 40" },
          { hour: "15", mins: "00, 20, 40" },
          { hour: "16", mins: "00, 20, 40" },
          { hour: "17", mins: "00, 30" },
          { hour: "18", mins: "00, 30" },
          { hour: "19", mins: "00, 30" },
          { hour: "20", mins: "00, 30" },
          { hour: "21", mins: "00, 30" }
        ]
      },
      {
        num: "011",
        stop: "Lipowa - cmentarz 02",
        dest: "Węglarza",
        schedule: [
          { hour: "05", mins: "35" },
          { hour: "06", mins: "05, 35" },
          { hour: "07", mins: "05, 25, 45" },
          { hour: "08", mins: "05, 25, 45" },
          { hour: "09", mins: "05, 25, 45" },
          { hour: "10", mins: "05, 35" },
          { hour: "11", mins: "05, 35" },
          { hour: "12", mins: "05, 35" },
          { hour: "13", mins: "05, 25, 45" },
          { hour: "14", mins: "05, 25, 45" },
          { hour: "15", mins: "05, 25, 45" },
          { hour: "16", mins: "05, 25, 45" },
          { hour: "17", mins: "05, 35" },
          { hour: "18", mins: "05, 35" },
          { hour: "19", mins: "05, 35" },
          { hour: "20", mins: "05, 35" },
          { hour: "21", mins: "05, 35" }
        ]
      },
      {
        num: "013",
        stop: "Lipowa - cmentarz 02",
        dest: "Paderewskiego",
        schedule: [
          { hour: "05", mins: "45" },
          { hour: "06", mins: "15, 45" },
          { hour: "07", mins: "15, 35, 55" },
          { hour: "08", mins: "15, 35, 55" },
          { hour: "09", mins: "15, 35, 55" },
          { hour: "10", mins: "15, 45" },
          { hour: "11", mins: "15, 45" },
          { hour: "12", mins: "15, 45" },
          { hour: "13", mins: "15, 35, 55" },
          { hour: "14", mins: "15, 35, 55" },
          { hour: "15", mins: "15, 35, 55" },
          { hour: "16", mins: "15, 35, 55" },
          { hour: "17", mins: "15, 45" },
          { hour: "18", mins: "15, 45" },
          { hour: "19", mins: "15, 45" },
          { hour: "20", mins: "15, 45" },
          { hour: "21", mins: "15, 45" }
        ]
      },
      {
        num: "015",
        stop: "Lipowa - cmentarz 02",
        dest: "Os. Choiny",
        schedule: [
          { hour: "06", mins: "00, 30" },
          { hour: "07", mins: "00, 20, 40" },
          { hour: "08", mins: "00, 20, 40" },
          { hour: "09", mins: "00, 20, 40" },
          { hour: "10", mins: "00, 30" },
          { hour: "11", mins: "00, 30" },
          { hour: "12", mins: "00, 30" },
          { hour: "13", mins: "00, 20, 40" },
          { hour: "14", mins: "00, 20, 40" },
          { hour: "15", mins: "00, 20, 40" },
          { hour: "16", mins: "00, 20, 40" },
          { hour: "17", mins: "00, 30" },
          { hour: "18", mins: "00, 30" },
          { hour: "19", mins: "00, 30" },
          { hour: "20", mins: "00, 30" },
          { hour: "21", mins: "00, 30" }
        ]
      },
      {
        num: "020",
        stop: "Lipowa - cmentarz 02",
        dest: "Dębówka",
        schedule: [
          { hour: "06", mins: "10, 40" },
          { hour: "07", mins: "10, 30, 50" },
          { hour: "08", mins: "10, 30, 50" },
          { hour: "09", mins: "10, 30, 50" },
          { hour: "10", mins: "10, 40" },
          { hour: "11", mins: "10, 40" },
          { hour: "12", mins: "10, 40" },
          { hour: "13", mins: "10, 30, 50" },
          { hour: "14", mins: "10, 30, 50" },
          { hour: "15", mins: "10, 30, 50" },
          { hour: "16", mins: "10, 30, 50" },
          { hour: "17", mins: "10, 40" },
          { hour: "18", mins: "10, 40" },
          { hour: "19", mins: "10, 40" },
          { hour: "20", mins: "10, 40" },
          { hour: "21", mins: "10, 40" }
        ]
      },
      {
        num: "032",
        stop: "Lipowa - cmentarz 02",
        dest: "Daszyńskiego",
        schedule: [
          { hour: "06", mins: "20, 50" },
          { hour: "07", mins: "20, 40" },
          { hour: "08", mins: "00, 20, 40" },
          { hour: "09", mins: "00, 20, 40" },
          { hour: "10", mins: "00, 30" },
          { hour: "11", mins: "00, 30" },
          { hour: "12", mins: "00, 30" },
          { hour: "13", mins: "00, 20, 40" },
          { hour: "14", mins: "00, 20, 40" },
          { hour: "15", mins: "00, 20, 40" },
          { hour: "16", mins: "00, 20, 40" },
          { hour: "17", mins: "00, 30" },
          { hour: "18", mins: "00, 30" },
          { hour: "19", mins: "00, 30" },
          { hour: "20", mins: "00, 30" },
          { hour: "21", mins: "00, 30" }
        ]
      },
      {
        num: "040",
        stop: "Lipowa - cmentarz 02",
        dest: "Chodźki - szpital",
        schedule: [
          { hour: "05", mins: "30" },
          { hour: "06", mins: "00, 20, 40" },
          { hour: "07", mins: "00, 15, 30, 45" },
          { hour: "08", mins: "00, 15, 30, 45" },
          { hour: "09", mins: "00, 15, 30, 45" },
          { hour: "10", mins: "00, 20, 40" },
          { hour: "11", mins: "00, 20, 40" },
          { hour: "12", mins: "00, 20, 40" },
          { hour: "13", mins: "00, 15, 30, 45" },
          { hour: "14", mins: "00, 15, 30, 45" },
          { hour: "15", mins: "00, 15, 30, 45" },
          { hour: "16", mins: "00, 15, 30, 45" },
          { hour: "17", mins: "00, 20, 40" },
          { hour: "18", mins: "00, 20, 40" },
          { hour: "19", mins: "00, 30" },
          { hour: "20", mins: "00, 30" },
          { hour: "21", mins: "00, 30" }
        ]
      },
      {
        num: "044",
        stop: "Lipowa - cmentarz 02",
        dest: "Paderewskiego",
        schedule: [
          { hour: "05", mins: "50" },
          { hour: "06", mins: "20, 50" },
          { hour: "07", mins: "20, 50" },
          { hour: "08", mins: "20, 50" },
          { hour: "09", mins: "20, 50" },
          { hour: "10", mins: "20, 50" },
          { hour: "11", mins: "20, 50" },
          { hour: "12", mins: "20, 50" },
          { hour: "13", mins: "20, 50" },
          { hour: "14", mins: "20, 50" },
          { hour: "15", mins: "20, 50" },
          { hour: "16", mins: "20, 50" },
          { hour: "17", mins: "20, 50" },
          { hour: "18", mins: "20, 50" },
          { hour: "19", mins: "20, 50" },
          { hour: "20", mins: "20, 50" },
          { hour: "21", mins: "20, 50" }
        ]
      },
      {
        num: "055",
        stop: "Lipowa - cmentarz 02",
        dest: "Felin Europark",
        schedule: [
          { hour: "05", mins: "45" },
          { hour: "06", mins: "15, 45" },
          { hour: "07", mins: "15, 45" },
          { hour: "08", mins: "15, 45" },
          { hour: "09", mins: "15, 45" },
          { hour: "10", mins: "15, 45" },
          { hour: "11", mins: "15, 45" },
          { hour: "12", mins: "15, 45" },
          { hour: "13", mins: "15, 45" },
          { hour: "14", mins: "15, 45" },
          { hour: "15", mins: "15, 45" },
          { hour: "16", mins: "15, 45" },
          { hour: "17", mins: "15, 45" },
          { hour: "18", mins: "15, 45" },
          { hour: "19", mins: "15, 45" },
          { hour: "20", mins: "15, 45" },
          { hour: "21", mins: "15, 45" }
        ]
      },
      {
        num: "074",
        stop: "Lipowa - cmentarz 02",
        dest: "Rudnik",
        schedule: [
          { hour: "06", mins: "10, 30, 50" },
          { hour: "07", mins: "10, 30, 50" },
          { hour: "08", mins: "10, 30, 50" },
          { hour: "09", mins: "10, 30, 50" },
          { hour: "10", mins: "10, 40" },
          { hour: "11", mins: "10, 40" },
          { hour: "12", mins: "10, 40" },
          { hour: "13", mins: "10, 30, 50" },
          { hour: "14", mins: "10, 30, 50" },
          { hour: "15", mins: "10, 30, 50" },
          { hour: "16", mins: "10, 30, 50" },
          { hour: "17", mins: "10, 40" },
          { hour: "18", mins: "10, 40" },
          { hour: "19", mins: "10, 40" },
          { hour: "20", mins: "10, 40" },
          { hour: "21", mins: "10, 40" }
        ]
      },
      {
        num: "151",
        stop: "Lipowa - cmentarz 02",
        dest: "Węglin",
        schedule: [
          { hour: "06", mins: "05, 35" },
          { hour: "07", mins: "05, 25, 45" },
          { hour: "08", mins: "05, 25, 45" },
          { hour: "09", mins: "05, 25, 45" },
          { hour: "10", mins: "05, 35" },
          { hour: "11", mins: "05, 35" },
          { hour: "12", mins: "05, 35" },
          { hour: "13", mins: "05, 25, 45" },
          { hour: "14", mins: "05, 25, 45" },
          { hour: "15", mins: "05, 25, 45" },
          { hour: "16", mins: "05, 25, 45" },
          { hour: "17", mins: "05, 35" },
          { hour: "18", mins: "05, 35" },
          { hour: "19", mins: "05, 35" },
          { hour: "20", mins: "05, 35" },
          { hour: "21", mins: "05, 35" }
        ]
      },
      {
        num: "155",
        stop: "Lipowa - cmentarz 02",
        dest: "Zana ZUS",
        schedule: [
          { hour: "06", mins: "15, 45" },
          { hour: "07", mins: "15, 35, 55" },
          { hour: "08", mins: "15, 35, 55" },
          { hour: "09", mins: "15, 35, 55" },
          { hour: "10", mins: "15, 45" },
          { hour: "11", mins: "15, 45" },
          { hour: "12", mins: "15, 45" },
          { hour: "13", mins: "15, 35, 55" },
          { hour: "14", mins: "15, 35, 55" },
          { hour: "15", mins: "15, 35, 55" },
          { hour: "16", mins: "15, 35, 55" },
          { hour: "17", mins: "15, 45" },
          { hour: "18", mins: "15, 45" },
          { hour: "19", mins: "15, 45" },
          { hour: "20", mins: "15, 45" },
          { hour: "21", mins: "15, 45" }
        ]
      },
      {
        num: "158",
        stop: "Lipowa - cmentarz 02",
        dest: "Zana ZUS",
        schedule: [
          { hour: "06", mins: "25, 55" },
          { hour: "07", mins: "25, 55" },
          { hour: "08", mins: "20, 40" },
          { hour: "09", mins: "00, 20, 40" },
          { hour: "10", mins: "00, 20, 40" },
          { hour: "11", mins: "00, 30" },
          { hour: "12", mins: "00, 30" },
          { hour: "13", mins: "00, 20, 40" },
          { hour: "14", mins: "00, 20, 40" },
          { hour: "15", mins: "00, 20, 40" },
          { hour: "16", mins: "00, 20, 40" },
          { hour: "17", mins: "00, 30" },
          { hour: "18", mins: "00, 30" },
          { hour: "19", mins: "00, 30" },
          { hour: "20", mins: "00, 30" },
          { hour: "21", mins: "00, 30" }
        ]
      },
      {
        num: "200",
        stop: "Lipowa - cmentarz 02",
        dest: "Rondo Berbeckiego",
        schedule: [
          { hour: "06", mins: "00, 30" },
          { hour: "07", mins: "00, 30" },
          { hour: "08", mins: "00, 30" },
          { hour: "09", mins: "00, 30" },
          { hour: "10", mins: "00, 30" },
          { hour: "11", mins: "00, 30" },
          { hour: "12", mins: "00, 30" },
          { hour: "13", mins: "00, 30" },
          { hour: "14", mins: "00, 30" },
          { hour: "15", mins: "00, 30" },
          { hour: "16", mins: "00, 30" },
          { hour: "17", mins: "00, 30" },
          { hour: "18", mins: "00, 30" },
          { hour: "19", mins: "00, 30" },
          { hour: "20", mins: "00, 30" },
          { hour: "21", mins: "00, 30" }
        ]
      },
      {
        num: "201",
        stop: "Lipowa - cmentarz 02",
        dest: "Rondo Berbeckiego",
        schedule: [
          { hour: "06", mins: "10, 40" },
          { hour: "07", mins: "10, 30, 50" },
          { hour: "08", mins: "10, 30, 50" },
          { hour: "09", mins: "10, 30, 50" },
          { hour: "10", mins: "10, 40" },
          { hour: "11", mins: "10, 40" },
          { hour: "12", mins: "10, 40" },
          { hour: "13", mins: "10, 30, 50" },
          { hour: "14", mins: "10, 30, 50" },
          { hour: "15", mins: "10, 30, 50" },
          { hour: "16", mins: "10, 30, 50" },
          { hour: "17", mins: "10, 40" },
          { hour: "18", mins: "10, 40" },
          { hour: "19", mins: "10, 40" },
          { hour: "20", mins: "10, 40" },
          { hour: "21", mins: "10, 40" }
        ]
      },
      {
        num: "302",
        stop: "Lipowa - cmentarz 02",
        dest: "Koncertowa",
        schedule: [
          { hour: "06", mins: "05, 35" },
          { hour: "07", mins: "05, 25, 45" },
          { hour: "08", mins: "05, 25, 45" },
          { hour: "09", mins: "05, 25, 45" },
          { hour: "10", mins: "05, 35" },
          { hour: "11", mins: "05, 35" },
          { hour: "12", mins: "05, 35" },
          { hour: "13", mins: "05, 25, 45" },
          { hour: "14", mins: "05, 25, 45" },
          { hour: "15", mins: "05, 25, 45" },
          { hour: "16", mins: "05, 25, 45" },
          { hour: "17", mins: "05, 35" },
          { hour: "18", mins: "05, 35" },
          { hour: "19", mins: "05, 35" },
          { hour: "20", mins: "05, 35" },
          { hour: "21", mins: "05, 35" }
        ]
      }
    ]
  },
  {
    stopId: "stop_ogrod_saski_01",
    stopName: "Ogród Saski 01",
    lines: [
      {
        num: "004",
        stop: "Ogród Saski 01",
        dest: "Elizówka - giełda",
        schedule: [
          { hour: "05", mins: "15, 45" },
          { hour: "06", mins: "15, 35, 55" },
          { hour: "07", mins: "15, 35, 55" },
          { hour: "08", mins: "15, 35, 55" },
          { hour: "09", mins: "15, 35, 55" },
          { hour: "10", mins: "15, 45" },
          { hour: "11", mins: "15, 45" },
          { hour: "12", mins: "15, 45" },
          { hour: "13", mins: "15, 35, 55" },
          { hour: "14", mins: "15, 35, 55" },
          { hour: "15", mins: "15, 35, 55" },
          { hour: "16", mins: "15, 35, 55" },
          { hour: "17", mins: "15, 45" },
          { hour: "18", mins: "15, 45" },
          { hour: "19", mins: "15, 45" },
          { hour: "20", mins: "15, 45" },
          { hour: "21", mins: "15, 45" }
        ]
      },
      {
        num: "008",
        stop: "Ogród Saski 01",
        dest: "Zemborzyce Górne",
        schedule: [
          { hour: "05", mins: "25, 55" },
          { hour: "06", mins: "25, 55" },
          { hour: "07", mins: "20, 40" },
          { hour: "08", mins: "00, 20, 40" },
          { hour: "09", mins: "00, 20, 40" },
          { hour: "10", mins: "00, 30" },
          { hour: "11", mins: "00, 30" },
          { hour: "12", mins: "00, 30" },
          { hour: "13", mins: "00, 20, 40" },
          { hour: "14", mins: "00, 20, 40" },
          { hour: "15", mins: "00, 20, 40" },
          { hour: "16", mins: "00, 20, 40" },
          { hour: "17", mins: "00, 30" },
          { hour: "18", mins: "00, 30" },
          { hour: "19", mins: "00, 30" },
          { hour: "20", mins: "00, 30" },
          { hour: "21", mins: "00, 30" }
        ]
      },
      {
        num: "013",
        stop: "Ogród Saski 01",
        dest: "Dworzec Gł. PKP",
        schedule: [
          { hour: "05", mins: "45" },
          { hour: "06", mins: "15, 45" },
          { hour: "07", mins: "15, 35, 55" },
          { hour: "08", mins: "15, 35, 55" },
          { hour: "09", mins: "15, 35, 55" },
          { hour: "10", mins: "15, 45" },
          { hour: "11", mins: "15, 45" },
          { hour: "12", mins: "15, 45" },
          { hour: "13", mins: "15, 35, 55" },
          { hour: "14", mins: "15, 35, 55" },
          { hour: "15", mins: "15, 35, 55" },
          { hour: "16", mins: "15, 35, 55" },
          { hour: "17", mins: "15, 45" },
          { hour: "18", mins: "15, 45" },
          { hour: "19", mins: "15, 45" },
          { hour: "20", mins: "15, 45" },
          { hour: "21", mins: "15, 45" }
        ]
      },
      {
        num: "015",
        stop: "Ogród Saski 01",
        dest: "Żeglarska",
        schedule: [
          { hour: "06", mins: "00, 30" },
          { hour: "07", mins: "00, 20, 40" },
          { hour: "08", mins: "00, 20, 40" },
          { hour: "09", mins: "00, 20, 40" },
          { hour: "10", mins: "00, 30" },
          { hour: "11", mins: "00, 30" },
          { hour: "12", mins: "00, 30" },
          { hour: "13", mins: "00, 20, 40" },
          { hour: "14", mins: "00, 20, 40" },
          { hour: "15", mins: "00, 20, 40" },
          { hour: "16", mins: "00, 20, 40" },
          { hour: "17", mins: "00, 30" },
          { hour: "18", mins: "00, 30" },
          { hour: "19", mins: "00, 30" },
          { hour: "20", mins: "00, 30" },
          { hour: "21", mins: "00, 30" }
        ]
      },
      {
        num: "020",
        stop: "Ogród Saski 01",
        dest: "Kruczkowskiego",
        schedule: [
          { hour: "06", mins: "10, 40" },
          { hour: "07", mins: "10, 30, 50" },
          { hour: "08", mins: "10, 30, 50" },
          { hour: "09", mins: "10, 30, 50" },
          { hour: "10", mins: "10, 40" },
          { hour: "11", mins: "10, 40" },
          { hour: "12", mins: "10, 40" },
          { hour: "13", mins: "10, 30, 50" },
          { hour: "14", mins: "10, 30, 50" },
          { hour: "15", mins: "10, 30, 50" },
          { hour: "16", mins: "10, 30, 50" },
          { hour: "17", mins: "10, 40" },
          { hour: "18", mins: "10, 40" },
          { hour: "19", mins: "10, 40" },
          { hour: "20", mins: "10, 40" },
          { hour: "21", mins: "10, 40" }
        ]
      },
      {
        num: "032",
        stop: "Ogród Saski 01",
        dest: "Os. Widok",
        schedule: [
          { hour: "06", mins: "20, 50" },
          { hour: "07", mins: "20, 40" },
          { hour: "08", mins: "00, 20, 40" },
          { hour: "09", mins: "00, 20, 40" },
          { hour: "10", mins: "00, 30" },
          { hour: "11", mins: "00, 30" },
          { hour: "12", mins: "00, 30" },
          { hour: "13", mins: "00, 20, 40" },
          { hour: "14", mins: "00, 20, 40" },
          { hour: "15", mins: "00, 20, 40" },
          { hour: "16", mins: "00, 20, 40" },
          { hour: "17", mins: "00, 30" },
          { hour: "18", mins: "00, 30" },
          { hour: "19", mins: "00, 30" },
          { hour: "20", mins: "00, 30" },
          { hour: "21", mins: "00, 30" }
        ]
      },
      {
        num: "040",
        stop: "Ogród Saski 01",
        dest: "Żeglarska",
        schedule: [
          { hour: "05", mins: "30" },
          { hour: "06", mins: "00, 20, 40" },
          { hour: "07", mins: "00, 15, 30, 45" },
          { hour: "08", mins: "00, 15, 30, 45" },
          { hour: "09", mins: "00, 15, 30, 45" },
          { hour: "10", mins: "00, 20, 40" },
          { hour: "11", mins: "00, 20, 40" },
          { hour: "12", mins: "00, 20, 40" },
          { hour: "13", mins: "00, 15, 30, 45" },
          { hour: "14", mins: "00, 15, 30, 45" },
          { hour: "15", mins: "00, 15, 30, 45" },
          { hour: "16", mins: "00, 15, 30, 45" },
          { hour: "17", mins: "00, 20, 40" },
          { hour: "18", mins: "00, 20, 40" },
          { hour: "19", mins: "00, 30" },
          { hour: "20", mins: "00, 30" },
          { hour: "21", mins: "00, 30" }
        ]
      },
      {
        num: "044",
        stop: "Ogród Saski 01",
        dest: "Kawka - las",
        schedule: [
          { hour: "05", mins: "50" },
          { hour: "06", mins: "20, 50" },
          { hour: "07", mins: "20, 50" },
          { hour: "08", mins: "20, 50" },
          { hour: "09", mins: "20, 50" },
          { hour: "10", mins: "20, 50" },
          { hour: "11", mins: "20, 50" },
          { hour: "12", mins: "20, 50" },
          { hour: "13", mins: "20, 50" },
          { hour: "14", mins: "20, 50" },
          { hour: "15", mins: "20, 50" },
          { hour: "16", mins: "20, 50" },
          { hour: "17", mins: "20, 50" },
          { hour: "18", mins: "20, 50" },
          { hour: "19", mins: "20, 50" },
          { hour: "20", mins: "20, 50" },
          { hour: "21", mins: "20, 50" }
        ]
      },
      {
        num: "074",
        stop: "Ogród Saski 01",
        dest: "KUL",
        schedule: [
          { hour: "06", mins: "10, 30, 50" },
          { hour: "07", mins: "10, 30, 50" },
          { hour: "08", mins: "10, 30, 50" },
          { hour: "09", mins: "10, 30, 50" },
          { hour: "10", mins: "10, 40" },
          { hour: "11", mins: "10, 40" },
          { hour: "12", mins: "10, 40" },
          { hour: "13", mins: "10, 30, 50" },
          { hour: "14", mins: "10, 30, 50" },
          { hour: "15", mins: "10, 30, 50" },
          { hour: "16", mins: "10, 30, 50" },
          { hour: "17", mins: "10, 40" },
          { hour: "18", mins: "10, 40" },
          { hour: "19", mins: "10, 40" },
          { hour: "20", mins: "10, 40" },
          { hour: "21", mins: "10, 40" }
        ]
      },
      {
        num: "0N2",
        stop: "Ogród Saski 01",
        dest: "Świdnik Helikopter",
        schedule: [
          { hour: "23", mins: "10" },
          { hour: "00", mins: "10" },
          { hour: "01", mins: "10" },
          { hour: "02", mins: "10" },
          { hour: "03", mins: "10" },
          { hour: "04", mins: "10" }
        ]
      },
      {
        num: "0N3",
        stop: "Ogród Saski 01",
        dest: "Abramowice",
        schedule: [
          { hour: "23", mins: "40" },
          { hour: "00", mins: "40" },
          { hour: "01", mins: "40" },
          { hour: "02", mins: "40" },
          { hour: "03", mins: "40" },
          { hour: "04", mins: "40" }
        ]
      },
      {
        num: "151",
        stop: "Ogród Saski 01",
        dest: "Abramowice",
        schedule: [
          { hour: "06", mins: "05, 35" },
          { hour: "07", mins: "05, 25, 45" },
          { hour: "08", mins: "05, 25, 45" },
          { hour: "09", mins: "05, 25, 45" },
          { hour: "10", mins: "05, 35" },
          { hour: "11", mins: "05, 35" },
          { hour: "12", mins: "05, 35" },
          { hour: "13", mins: "05, 25, 45" },
          { hour: "14", mins: "05, 25, 45" },
          { hour: "15", mins: "05, 25, 45" },
          { hour: "16", mins: "05, 25, 45" },
          { hour: "17", mins: "05, 35" },
          { hour: "18", mins: "05, 35" },
          { hour: "19", mins: "05, 35" },
          { hour: "20", mins: "05, 35" },
          { hour: "21", mins: "05, 35" }
        ]
      },
      {
        num: "155",
        stop: "Ogród Saski 01",
        dest: "Mełgiewska WSEI",
        schedule: [
          { hour: "06", mins: "15, 45" },
          { hour: "07", mins: "15, 35, 55" },
          { hour: "08", mins: "15, 35, 55" },
          { hour: "09", mins: "15, 35, 55" },
          { hour: "10", mins: "15, 45" },
          { hour: "11", mins: "15, 45" },
          { hour: "12", mins: "15, 45" },
          { hour: "13", mins: "15, 35, 55" },
          { hour: "14", mins: "15, 35, 55" },
          { hour: "15", mins: "15, 35, 55" },
          { hour: "16", mins: "15, 35, 55" },
          { hour: "17", mins: "15, 45" },
          { hour: "18", mins: "15, 45" },
          { hour: "19", mins: "15, 45" },
          { hour: "20", mins: "15, 45" },
          { hour: "21", mins: "15, 45" }
        ]
      },
      {
        num: "158",
        stop: "Ogród Saski 01",
        dest: "Felin",
        schedule: [
          { hour: "06", mins: "25, 55" },
          { hour: "07", mins: "25, 55" },
          { hour: "08", mins: "20, 40" },
          { hour: "09", mins: "00, 20, 40" },
          { hour: "10", mins: "00, 20, 40" },
          { hour: "11", mins: "00, 30" },
          { hour: "12", mins: "00, 30" },
          { hour: "13", mins: "00, 20, 40" },
          { hour: "14", mins: "00, 20, 40" },
          { hour: "15", mins: "00, 20, 40" },
          { hour: "16", mins: "00, 20, 40" },
          { hour: "17", mins: "00, 30" },
          { hour: "18", mins: "00, 30" },
          { hour: "19", mins: "00, 30" },
          { hour: "20", mins: "00, 30" },
          { hour: "21", mins: "00, 30" }
        ]
      },
      {
        num: "200",
        stop: "Ogród Saski 01",
        dest: "Majdanek",
        schedule: [
          { hour: "06", mins: "00, 30" },
          { hour: "07", mins: "00, 30" },
          { hour: "08", mins: "00, 30" },
          { hour: "09", mins: "00, 30" },
          { hour: "10", mins: "00, 30" },
          { hour: "11", mins: "00, 30" },
          { hour: "12", mins: "00, 30" },
          { hour: "13", mins: "00, 30" },
          { hour: "14", mins: "00, 30" },
          { hour: "15", mins: "00, 30" },
          { hour: "16", mins: "00, 30" },
          { hour: "17", mins: "00, 30" },
          { hour: "18", mins: "00, 30" },
          { hour: "19", mins: "00, 30" },
          { hour: "20", mins: "00, 30" },
          { hour: "21", mins: "00, 30" }
        ]
      },
      {
        num: "201",
        stop: "Ogród Saski 01",
        dest: "Konopnica - las",
        schedule: [
          { hour: "06", mins: "10, 40" },
          { hour: "07", mins: "10, 30, 50" },
          { hour: "08", mins: "10, 30, 50" },
          { hour: "09", mins: "10, 30, 50" },
          { hour: "10", mins: "10, 40" },
          { hour: "11", mins: "10, 40" },
          { hour: "12", mins: "10, 40" },
          { hour: "13", mins: "10, 30, 50" },
          { hour: "14", mins: "10, 30, 50" },
          { hour: "15", mins: "10, 30, 50" },
          { hour: "16", mins: "10, 30, 50" },
          { hour: "17", mins: "10, 40" },
          { hour: "18", mins: "10, 40" },
          { hour: "19", mins: "10, 40" },
          { hour: "20", mins: "10, 40" },
          { hour: "21", mins: "10, 40" }
        ]
      },
      {
        num: "302",
        stop: "Ogród Saski 01",
        dest: "Os. Widok",
        schedule: [
          { hour: "06", mins: "05, 35" },
          { hour: "07", mins: "05, 25, 45" },
          { hour: "08", mins: "05, 25, 45" },
          { hour: "09", mins: "05, 25, 45" },
          { hour: "10", mins: "05, 35" },
          { hour: "11", mins: "05, 35" },
          { hour: "12", mins: "05, 35" },
          { hour: "13", mins: "05, 25, 45" },
          { hour: "14", mins: "05, 25, 45" },
          { hour: "15", mins: "05, 25, 45" },
          { hour: "16", mins: "05, 25, 45" },
          { hour: "17", mins: "05, 35" },
          { hour: "18", mins: "05, 35" },
          { hour: "19", mins: "05, 35" },
          { hour: "20", mins: "05, 35" },
          { hour: "21", mins: "05, 35" }
        ]
      },
      {
        num: "950",
        stop: "Ogród Saski 01",
        dest: "Pancerniaków",
        schedule: [
          { hour: "06", mins: "30" },
          { hour: "07", mins: "00, 30" },
          { hour: "08", mins: "00, 30" },
          { hour: "09", mins: "00, 30" },
          { hour: "10", mins: "00, 30" },
          { hour: "11", mins: "00, 30" },
          { hour: "12", mins: "00, 30" },
          { hour: "13", mins: "00, 30" },
          { hour: "14", mins: "00, 30" },
          { hour: "15", mins: "00, 30" },
          { hour: "16", mins: "00, 30" },
          { hour: "17", mins: "00, 30" },
          { hour: "18", mins: "00, 30" },
          { hour: "19", mins: "00, 30" },
          { hour: "20", mins: "00, 30" },
          { hour: "21", mins: "00, 30" }
        ]
      }
    ]
  },
  {
    stopId: "stop_okopowa_01",
    stopName: "Okopowa 01",
    lines: [
      {
        num: "011",
        stop: "Okopowa 01",
        dest: "Węglarza",
        schedule: [
          { hour: "05", mins: "35" },
          { hour: "06", mins: "05, 35" },
          { hour: "07", mins: "05, 25, 45" },
          { hour: "08", mins: "05, 25, 45" },
          { hour: "09", mins: "05, 25, 45" },
          { hour: "10", mins: "05, 35" },
          { hour: "11", mins: "05, 35" },
          { hour: "12", mins: "05, 35" },
          { hour: "13", mins: "05, 25, 45" },
          { hour: "14", mins: "05, 25, 45" },
          { hour: "15", mins: "05, 25, 45" },
          { hour: "16", mins: "05, 25, 45" },
          { hour: "17", mins: "05, 35" },
          { hour: "18", mins: "05, 35" },
          { hour: "19", mins: "05, 35" },
          { hour: "20", mins: "05, 35" },
          { hour: "21", mins: "05, 35" }
        ]
      },
      {
        num: "013",
        stop: "Okopowa 01",
        dest: "Paderewskiego",
        schedule: [
          { hour: "05", mins: "45" },
          { hour: "06", mins: "15, 45" },
          { hour: "07", mins: "15, 35, 55" },
          { hour: "08", mins: "15, 35, 55" },
          { hour: "09", mins: "15, 35, 55" },
          { hour: "10", mins: "15, 45" },
          { hour: "11", mins: "15, 45" },
          { hour: "12", mins: "15, 45" },
          { hour: "13", mins: "15, 35, 55" },
          { hour: "14", mins: "15, 35, 55" },
          { hour: "15", mins: "15, 35, 55" },
          { hour: "16", mins: "15, 35, 55" },
          { hour: "17", mins: "15, 45" },
          { hour: "18", mins: "15, 45" },
          { hour: "19", mins: "15, 45" },
          { hour: "20", mins: "15, 45" },
          { hour: "21", mins: "15, 45" }
        ]
      },
      {
        num: "015",
        stop: "Okopowa 01",
        dest: "Os. Choiny",
        schedule: [
          { hour: "06", mins: "00, 30" },
          { hour: "07", mins: "00, 20, 40" },
          { hour: "08", mins: "00, 20, 40" },
          { hour: "09", mins: "00, 20, 40" },
          { hour: "10", mins: "00, 30" },
          { hour: "11", mins: "00, 30" },
          { hour: "12", mins: "00, 30" },
          { hour: "13", mins: "00, 20, 40" },
          { hour: "14", mins: "00, 20, 40" },
          { hour: "15", mins: "00, 20, 40" },
          { hour: "16", mins: "00, 20, 40" },
          { hour: "17", mins: "00, 30" },
          { hour: "18", mins: "00, 30" },
          { hour: "19", mins: "00, 30" },
          { hour: "20", mins: "00, 30" },
          { hour: "21", mins: "00, 30" }
        ]
      },
      {
        num: "032",
        stop: "Okopowa 01",
        dest: "Daszyńskiego",
        schedule: [
          { hour: "06", mins: "20, 50" },
          { hour: "07", mins: "20, 40" },
          { hour: "08", mins: "00, 20, 40" },
          { hour: "09", mins: "00, 20, 40" },
          { hour: "10", mins: "00, 30" },
          { hour: "11", mins: "00, 30" },
          { hour: "12", mins: "00, 30" },
          { hour: "13", mins: "00, 20, 40" },
          { hour: "14", mins: "00, 20, 40" },
          { hour: "15", mins: "00, 20, 40" },
          { hour: "16", mins: "00, 20, 40" },
          { hour: "17", mins: "00, 30" },
          { hour: "18", mins: "00, 30" },
          { hour: "19", mins: "00, 30" },
          { hour: "20", mins: "00, 30" },
          { hour: "21", mins: "00, 30" }
        ]
      },
      {
        num: "040",
        stop: "Okopowa 01",
        dest: "Chodźki - szpital",
        schedule: [
          { hour: "05", mins: "30" },
          { hour: "06", mins: "00, 20, 40" },
          { hour: "07", mins: "00, 15, 30, 45" },
          { hour: "08", mins: "00, 15, 30, 45" },
          { hour: "09", mins: "00, 15, 30, 45" },
          { hour: "10", mins: "00, 20, 40" },
          { hour: "11", mins: "00, 20, 40" },
          { hour: "12", mins: "00, 20, 40" },
          { hour: "13", mins: "00, 15, 30, 45" },
          { hour: "14", mins: "00, 15, 30, 45" },
          { hour: "15", mins: "00, 15, 30, 45" },
          { hour: "16", mins: "00, 15, 30, 45" },
          { hour: "17", mins: "00, 20, 40" },
          { hour: "18", mins: "00, 20, 40" },
          { hour: "19", mins: "00, 30" },
          { hour: "20", mins: "00, 30" },
          { hour: "21", mins: "00, 30" }
        ]
      },
      {
        num: "044",
        stop: "Okopowa 01",
        dest: "Paderewskiego",
        schedule: [
          { hour: "05", mins: "50" },
          { hour: "06", mins: "20, 50" },
          { hour: "07", mins: "20, 50" },
          { hour: "08", mins: "20, 50" },
          { hour: "09", mins: "20, 50" },
          { hour: "10", mins: "20, 50" },
          { hour: "11", mins: "20, 50" },
          { hour: "12", mins: "20, 50" },
          { hour: "13", mins: "20, 50" },
          { hour: "14", mins: "20, 50" },
          { hour: "15", mins: "20, 50" },
          { hour: "16", mins: "20, 50" },
          { hour: "17", mins: "20, 50" },
          { hour: "18", mins: "20, 50" },
          { hour: "19", mins: "20, 50" },
          { hour: "20", mins: "20, 50" },
          { hour: "21", mins: "20, 50" }
        ]
      },
      {
        num: "055",
        stop: "Okopowa 01",
        dest: "Felin Europark",
        schedule: [
          { hour: "05", mins: "45" },
          { hour: "06", mins: "15, 45" },
          { hour: "07", mins: "15, 45" },
          { hour: "08", mins: "15, 45" },
          { hour: "09", mins: "15, 45" },
          { hour: "10", mins: "15, 45" },
          { hour: "11", mins: "15, 45" },
          { hour: "12", mins: "15, 45" },
          { hour: "13", mins: "15, 45" },
          { hour: "14", mins: "15, 45" },
          { hour: "15", mins: "15, 45" },
          { hour: "16", mins: "15, 45" },
          { hour: "17", mins: "15, 45" },
          { hour: "18", mins: "15, 45" },
          { hour: "19", mins: "15, 45" },
          { hour: "20", mins: "15, 45" },
          { hour: "21", mins: "15, 45" }
        ]
      },
      {
        num: "074",
        stop: "Okopowa 01",
        dest: "KUL",
        schedule: [
          { hour: "06", mins: "10, 30, 50" },
          { hour: "07", mins: "10, 30, 50" },
          { hour: "08", mins: "10, 30, 50" },
          { hour: "09", mins: "10, 30, 50" },
          { hour: "10", mins: "10, 40" },
          { hour: "11", mins: "10, 40" },
          { hour: "12", mins: "10, 40" },
          { hour: "13", mins: "10, 30, 50" },
          { hour: "14", mins: "10, 30, 50" },
          { hour: "15", mins: "10, 30, 50" },
          { hour: "16", mins: "10, 30, 50" },
          { hour: "17", mins: "10, 40" },
          { hour: "18", mins: "10, 40" },
          { hour: "19", mins: "10, 40" },
          { hour: "20", mins: "10, 40" },
          { hour: "21", mins: "10, 40" }
        ]
      },
      {
        num: "0N2",
        stop: "Okopowa 01",
        dest: "Świdnik Helikopter",
        schedule: [
          { hour: "23", mins: "10" },
          { hour: "00", mins: "10" },
          { hour: "01", mins: "10" },
          { hour: "02", mins: "10" },
          { hour: "03", mins: "10" },
          { hour: "04", mins: "10" }
        ]
      },
      {
        num: "0N3",
        stop: "Okopowa 01",
        dest: "Abramowice",
        schedule: [
          { hour: "23", mins: "40" },
          { hour: "00", mins: "40" },
          { hour: "01", mins: "40" },
          { hour: "02", mins: "40" },
          { hour: "03", mins: "40" },
          { hour: "04", mins: "40" }
        ]
      }
    ]
  },
  {
    stopId: "stop_okopowa_02",
    stopName: "Okopowa 02",
    lines: [
      {
        num: "003",
        stop: "Okopowa 02",
        dest: "Dąbrowica",
        schedule: [
          { hour: "05", mins: "10, 40" },
          { hour: "06", mins: "10, 25, 40, 55" },
          { hour: "07", mins: "10, 25, 40, 55" },
          { hour: "08", mins: "10, 25, 40, 55" },
          { hour: "09", mins: "10, 30, 50" },
          { hour: "10", mins: "10, 30, 50" },
          { hour: "11", mins: "10, 30, 50" },
          { hour: "12", mins: "10, 30, 50" },
          { hour: "13", mins: "10, 25, 40, 55" },
          { hour: "14", mins: "10, 25, 40, 55" },
          { hour: "15", mins: "10, 25, 40, 55" },
          { hour: "16", mins: "10, 25, 40, 55" },
          { hour: "17", mins: "10, 30, 50" },
          { hour: "18", mins: "10, 30, 50" },
          { hour: "19", mins: "15, 45" },
          { hour: "20", mins: "15, 45" },
          { hour: "21", mins: "15, 45" },
          { hour: "22", mins: "15, 45" }
        ]
      },
      {
        num: "007",
        stop: "Okopowa 02",
        dest: "KUL",
        schedule: [
          { hour: "05", mins: "20, 50" },
          { hour: "06", mins: "20, 35, 50" },
          { hour: "07", mins: "05, 20, 35, 50" },
          { hour: "08", mins: "05, 20, 35, 50" },
          { hour: "09", mins: "05, 20, 35, 50" },
          { hour: "10", mins: "05, 25, 45" },
          { hour: "11", mins: "05, 25, 45" },
          { hour: "12", mins: "05, 25, 45" },
          { hour: "13", mins: "05, 20, 35, 50" },
          { hour: "14", mins: "05, 20, 35, 50" },
          { hour: "15", mins: "05, 20, 35, 50" },
          { hour: "16", mins: "05, 20, 35, 50" },
          { hour: "17", mins: "05, 25, 45" },
          { hour: "18", mins: "05, 25, 45" },
          { hour: "19", mins: "10, 40" },
          { hour: "20", mins: "10, 40" },
          { hour: "21", mins: "10, 40" },
          { hour: "22", mins: "10, 40" }
        ]
      },
      {
        num: "008",
        stop: "Okopowa 02",
        dest: "Zemborzyce Górne",
        schedule: [
          { hour: "05", mins: "25, 55" },
          { hour: "06", mins: "25, 55" },
          { hour: "07", mins: "20, 40" },
          { hour: "08", mins: "00, 20, 40" },
          { hour: "09", mins: "00, 20, 40" },
          { hour: "10", mins: "00, 30" },
          { hour: "11", mins: "00, 30" },
          { hour: "12", mins: "00, 30" },
          { hour: "13", mins: "00, 20, 40" },
          { hour: "14", mins: "00, 20, 40" },
          { hour: "15", mins: "00, 20, 40" },
          { hour: "16", mins: "00, 20, 40" },
          { hour: "17", mins: "00, 30" },
          { hour: "18", mins: "00, 30" },
          { hour: "19", mins: "00, 30" },
          { hour: "20", mins: "00, 30" },
          { hour: "21", mins: "00, 30" }
        ]
      },
      {
        num: "011",
        stop: "Okopowa 02",
        dest: "Os. Widok",
        schedule: [
          { hour: "05", mins: "35" },
          { hour: "06", mins: "05, 35" },
          { hour: "07", mins: "05, 25, 45" },
          { hour: "08", mins: "05, 25, 45" },
          { hour: "09", mins: "05, 25, 45" },
          { hour: "10", mins: "05, 35" },
          { hour: "11", mins: "05, 35" },
          { hour: "12", mins: "05, 35" },
          { hour: "13", mins: "05, 25, 45" },
          { hour: "14", mins: "05, 25, 45" },
          { hour: "15", mins: "05, 25, 45" },
          { hour: "16", mins: "05, 25, 45" },
          { hour: "17", mins: "05, 35" },
          { hour: "18", mins: "05, 35" },
          { hour: "19", mins: "05, 35" },
          { hour: "20", mins: "05, 35" },
          { hour: "21", mins: "05, 35" }
        ]
      },
      {
        num: "013",
        stop: "Okopowa 02",
        dest: "Paderewskiego",
        schedule: [
          { hour: "05", mins: "45" },
          { hour: "06", mins: "15, 45" },
          { hour: "07", mins: "15, 35, 55" },
          { hour: "08", mins: "15, 35, 55" },
          { hour: "09", mins: "15, 35, 55" },
          { hour: "10", mins: "15, 45" },
          { hour: "11", mins: "15, 45" },
          { hour: "12", mins: "15, 45" },
          { hour: "13", mins: "15, 35, 55" },
          { hour: "14", mins: "15, 35, 55" },
          { hour: "15", mins: "15, 35, 55" },
          { hour: "16", mins: "15, 35, 55" },
          { hour: "17", mins: "15, 45" },
          { hour: "18", mins: "15, 45" },
          { hour: "19", mins: "15, 45" },
          { hour: "20", mins: "15, 45" },
          { hour: "21", mins: "15, 45" }
        ]
      },
      {
        num: "015",
        stop: "Okopowa 02",
        dest: "Żeglarska",
        schedule: [
          { hour: "06", mins: "00, 30" },
          { hour: "07", mins: "00, 20, 40" },
          { hour: "08", mins: "00, 20, 40" },
          { hour: "09", mins: "00, 20, 40" },
          { hour: "10", mins: "00, 30" },
          { hour: "11", mins: "00, 30" },
          { hour: "12", mins: "00, 30" },
          { hour: "13", mins: "00, 20, 40" },
          { hour: "14", mins: "00, 20, 40" },
          { hour: "15", mins: "00, 20, 40" },
          { hour: "16", mins: "00, 20, 40" },
          { hour: "17", mins: "00, 30" },
          { hour: "18", mins: "00, 30" },
          { hour: "19", mins: "00, 30" },
          { hour: "20", mins: "00, 30" },
          { hour: "21", mins: "00, 30" }
        ]
      },
      {
        num: "032",
        stop: "Okopowa 02",
        dest: "Os. Widok",
        schedule: [
          { hour: "06", mins: "20, 50" },
          { hour: "07", mins: "20, 40" },
          { hour: "08", mins: "00, 20, 40" },
          { hour: "09", mins: "00, 20, 40" },
          { hour: "10", mins: "00, 30" },
          { hour: "11", mins: "00, 30" },
          { hour: "12", mins: "00, 30" },
          { hour: "13", mins: "00, 20, 40" },
          { hour: "14", mins: "00, 20, 40" },
          { hour: "15", mins: "00, 20, 40" },
          { hour: "16", mins: "00, 20, 40" },
          { hour: "17", mins: "00, 30" },
          { hour: "18", mins: "00, 30" },
          { hour: "19", mins: "00, 30" },
          { hour: "20", mins: "00, 30" },
          { hour: "21", mins: "00, 30" }
        ]
      },
      {
        num: "040",
        stop: "Okopowa 02",
        dest: "Żeglarska",
        schedule: [
          { hour: "05", mins: "30" },
          { hour: "06", mins: "00, 20, 40" },
          { hour: "07", mins: "00, 15, 30, 45" },
          { hour: "08", mins: "00, 15, 30, 45" },
          { hour: "09", mins: "00, 15, 30, 45" },
          { hour: "10", mins: "00, 20, 40" },
          { hour: "11", mins: "00, 20, 40" },
          { hour: "12", mins: "00, 20, 40" },
          { hour: "13", mins: "00, 15, 30, 45" },
          { hour: "14", mins: "00, 15, 30, 45" },
          { hour: "15", mins: "00, 15, 30, 45" },
          { hour: "16", mins: "00, 15, 30, 45" },
          { hour: "17", mins: "00, 20, 40" },
          { hour: "18", mins: "00, 20, 40" },
          { hour: "19", mins: "00, 30" },
          { hour: "20", mins: "00, 30" },
          { hour: "21", mins: "00, 30" }
        ]
      },
      {
        num: "044",
        stop: "Okopowa 02",
        dest: "Kawka - las",
        schedule: [
          { hour: "05", mins: "50" },
          { hour: "06", mins: "20, 50" },
          { hour: "07", mins: "20, 50" },
          { hour: "08", mins: "20, 50" },
          { hour: "09", mins: "20, 50" },
          { hour: "10", mins: "20, 50" },
          { hour: "11", mins: "20, 50" },
          { hour: "12", mins: "20, 50" },
          { hour: "13", mins: "20, 50" },
          { hour: "14", mins: "20, 50" },
          { hour: "15", mins: "20, 50" },
          { hour: "16", mins: "20, 50" },
          { hour: "17", mins: "20, 50" },
          { hour: "18", mins: "20, 50" },
          { hour: "19", mins: "20, 50" },
          { hour: "20", mins: "20, 50" },
          { hour: "21", mins: "20, 50" }
        ]
      },
      {
        num: "055",
        stop: "Okopowa 02",
        dest: "Świdnik Helikopter",
        schedule: [
          { hour: "05", mins: "45" },
          { hour: "06", mins: "15, 45" },
          { hour: "07", mins: "15, 45" },
          { hour: "08", mins: "15, 45" },
          { hour: "09", mins: "15, 45" },
          { hour: "10", mins: "15, 45" },
          { hour: "11", mins: "15, 45" },
          { hour: "12", mins: "15, 45" },
          { hour: "13", mins: "15, 45" },
          { hour: "14", mins: "15, 45" },
          { hour: "15", mins: "15, 45" },
          { hour: "16", mins: "15, 45" },
          { hour: "17", mins: "15, 45" },
          { hour: "18", mins: "15, 45" },
          { hour: "19", mins: "15, 45" },
          { hour: "20", mins: "15, 45" },
          { hour: "21", mins: "15, 45" }
        ]
      },
      {
        num: "0N2",
        stop: "Okopowa 02",
        dest: "Os. Szymanowskiego",
        schedule: [
          { hour: "23", mins: "10" },
          { hour: "00", mins: "10" },
          { hour: "01", mins: "10" },
          { hour: "02", mins: "10" },
          { hour: "03", mins: "10" },
          { hour: "04", mins: "10" }
        ]
      },
      {
        num: "0N3",
        stop: "Okopowa 02",
        dest: "Os. Poręba",
        schedule: [
          { hour: "23", mins: "40" },
          { hour: "00", mins: "40" },
          { hour: "01", mins: "40" },
          { hour: "02", mins: "40" },
          { hour: "03", mins: "40" },
          { hour: "04", mins: "40" }
        ]
      }
    ]
  }
];