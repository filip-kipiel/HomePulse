# HomePulse

Aplikacja inteligentnego domu (smart home) — projekt na kurs **Systemy Mobilne** (prof. Piotr Nawrocki).

> Dom w standardzie *Mobile & Wireless* — przejście od sterowania stacjonarnego (ścianowego) do pełnej mobilności na smartfonie.

## Stack

- **React Native + Expo** (TypeScript)
- React Navigation (bottom tabs + native stack)
- Material Icons (`@expo/vector-icons`)
- Linear gradients (`expo-linear-gradient`)
- State: React Context (`AppStateProvider`)

## Funkcjonalność

- **5 pokoi** (Salon, Sypialnia, Kuchnia, Łazienka, Wejście) z osobnymi urządzeniami
- **20+ urządzeń**: światła z regulacją jasności, klimatyzacja z ustawianiem temperatury, rolety, kamery, gniazdka, zamek NFC
- **6 scen automatyzacji**: Dzień dobry, Wieczór, Dobranoc, Wychodzę, Kino domowe, Impreza
- **Geofencing** (mock): nagłówek pokazuje wykryty pokój
- **Bezpieczeństwo**: alarm domowy, tryb prywatności wyłączający kamery wewnętrzne, log aktywności
- **Łączność**: Wi-Fi (802.11ax), Bluetooth 5.3, Zigbee mesh, MQTT broker — widoczne w Ustawieniach

## Architektura

HomePulse to **thick-client** (gruby klient) z warstwą **messaging** — zgodnie z taksonomią z prezentacji 2 kursu:

| Warstwa | Komponenty |
|---|---|
| Klient | aplikacja React Native (natywne komponenty Android/iOS), lokalne przetwarzanie stanu |
| Messaging | MQTT (store-and-forward), powiadomienia push *application-to-user* |
| Infrastruktura | hub Zigbee (mesh), AP Wi-Fi, urządzenia BLE |

Wybór architektury thick-client jest uzasadniony:

- aplikacja musi działać przy ograniczonej łączności (np. brak Internetu, ale lokalna sieć Wi-Fi działa);
- niskie opóźnienia w reakcji na input użytkownika (toggle światła musi być natychmiastowy);
- bogate GUI z animacjami i dotykowymi gestami;
- możliwość integracji z natywnymi API telefonu (NFC, lokalizacja, powiadomienia).

## Uruchomienie

```bash
npm install
npm start
```

W terminalu pojawi się **kod QR**. Zeskanuj go:
- **Android**: aplikacją **Expo Go** ([Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent))
- **iOS**: aparatem (oferuje otwarcie w Expo Go) lub **Expo Go** ([App Store](https://apps.apple.com/app/expo-go/id982107779))

Aplikacja załaduje się na telefonie w ~5 sekund. **Wymaga, by telefon był w tej samej sieci Wi-Fi co komputer**.

### Dostęp spoza Wi-Fi (np. dla znajomego)

```bash
npm run tunnel
```

Uruchamia Expo z tunelem ngrok — wygenerowany URL działa z dowolnej sieci. Pierwsze uruchomienie może chwilę zająć (ngrok się inicjuje).

### Web preview

```bash
npm run web
```

Otwiera aplikację w przeglądarce (bez natywnych komponentów, ale działa).

## Struktura

```
HomePulse/
├── App.tsx                       # root: NavigationContainer + tab navigator
├── index.ts                      # entry point (registerRootComponent)
├── app.json                      # konfiguracja Expo
├── package.json
├── tsconfig.json
└── src/
    ├── theme.ts                  # paleta + radius scale
    ├── types.ts                  # interfejsy (Device, Room, Scene, ...)
    ├── components/
    │   └── DeviceCard.tsx        # karta urządzenia z togglem + level
    ├── state/
    │   ├── AppState.tsx          # Context Provider + hook useAppState
    │   └── initial.ts            # seed: pokoje, sceny, sieci
    └── screens/
        ├── HomeScreen.tsx        # dashboard z pokojami i scenami
        ├── RoomScreen.tsx        # szczegóły pokoju z urządzeniami
        ├── ScenesScreen.tsx      # lista scen z opisami
        ├── SecurityScreen.tsx    # alarm, kamery, log powiadomień
        └── SettingsScreen.tsx    # sieci, profil, architektura
```

## Autor

Filip Kipiel — Systemy Mobilne, AGH, semestr letni 2025/2026.
