# HomePulse

Aplikacja inteligentnego domu (smart home) — projekt na kurs **Systemy Mobilne** (prof. Piotr Nawrocki).

> Dom w standardzie *Mobile & Wireless* — przejście od sterowania stacjonarnego (ścianowego) do pełnej mobilności na smartfonie.

## Demo

| Dom (dashboard) | Pokój | Sceny | Bezpieczeństwo |
|:---:|:---:|:---:|:---:|
| nagłówek z lokalizacją, szybkie sceny, kafle pokoi | toggle urządzeń + suwaki jasności / temperatury | 6 predefiniowanych scen | alarm, kamery, tryb prywatności, powiadomienia |

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
| Klient | aplikacja Flet (Python → Flutter), lokalne przetwarzanie stanu, persystencja |
| Messaging | MQTT (store-and-forward), powiadomienia push *application-to-user* |
| Infrastruktura | hub Zigbee (mesh), AP Wi-Fi, urządzenia BLE |

Wybór architektury thick-client jest uzasadniony:

- aplikacja musi działać przy ograniczonej łączności (np. brak Internetu, ale lokalna sieć Wi-Fi działa);
- niskie opóźnienia w reakcji na input użytkownika (toggle światła musi być natychmiastowy);
- bogate GUI z animacjami i dotykowymi gestami;
- możliwość integracji z natywnymi API telefonu (NFC, lokalizacja, powiadomienia).

## Stack

- **Python 3.12** + [Flet](https://flet.dev/) (Flutter pod spodem, jeden kod → web / desktop / Android / iOS)
- Brak innych zależności

## Uruchomienie lokalne

```bash
pip install -r requirements.txt
python src/main.py
```

Domyślnie otwiera się w okienku desktop. Aby uruchomić w przeglądarce:

```bash
cd src && python -c "import flet as ft; from main import main; ft.app(target=main, view=ft.AppView.WEB_BROWSER, port=8550)"
```

## Build na Androida (APK)

```bash
flet build apk
```

Wymaga zainstalowanego Flutter SDK i Androida SDK — patrz [docs.flet.dev/getting-started/packaging](https://flet.dev/docs/publish/android).

## Struktura

```
HomePulse/
├── pyproject.toml                # metadata + konfiguracja flet build
├── requirements.txt
├── README.md
├── .github/workflows/build-apk.yml   # CI: tag v* → APK w Releases
└── src/
    ├── main.py                   # punkt wejścia + routing widoków
    └── homepulse/
        ├── state.py              # model + stan (rooms, devices, scenes, notifications)
        ├── theme.py              # paleta + Material 3 theme
        ├── components/
        │   └── device_card.py    # karta urządzenia z togglem i suwakiem
        └── views/
            ├── home_view.py      # dashboard
            ├── room_view.py      # szczegóły pokoju
            ├── scenes_view.py    # lista scen
            ├── security_view.py  # alarm, kamery, log
            └── settings_view.py  # sieci, użytkownik, architektura
```

## Autor

Filip Kipiel — Systemy Mobilne, AGH, semestr letni 2025/2026.
