"""Widok ustawień — sieci komunikacji bezprzewodowej i konfiguracja."""
import flet as ft

from ..state import AppState
from .. import theme


_KIND_ICON = {
    "wifi": "wifi",
    "bluetooth": "bluetooth",
    "zigbee": "hub",
    "mqtt": "cloud",
}

_KIND_LABEL = {
    "wifi": "Wi-Fi",
    "bluetooth": "Bluetooth",
    "zigbee": "Zigbee",
    "mqtt": "MQTT",
}


def settings_view(state: AppState) -> ft.Control:
    networks_section = ft.Column(
        [
            ft.Text("Łączność bezprzewodowa", size=16, weight=ft.FontWeight.W_700),
            ft.Text(
                "Sieci wykorzystywane przez HomePulse",
                size=12,
                color=theme.TEXT_MUTED,
            ),
            ft.Container(height=10),
            *[_network_row(n) for n in state.networks],
        ],
        spacing=8,
    )

    arch_section = ft.Container(
        ft.Column(
            [
                ft.Text(
                    "Architektura aplikacji",
                    color="#FFFFFF",
                    size=16,
                    weight=ft.FontWeight.W_700,
                ),
                ft.Container(height=6),
                ft.Text(
                    "HomePulse to thick-client (gruby klient) z warstwą messaging:",
                    color=ft.Colors.with_opacity(0.85, "#FFFFFF"),
                    size=12,
                ),
                ft.Container(height=10),
                _arch_bullet("Lokalne przetwarzanie i interfejs natywny"),
                _arch_bullet("Komunikacja MQTT (store-and-forward) z hubem"),
                _arch_bullet("Synchronizacja stanu z chmurą w tle"),
                _arch_bullet("Powiadomienia push: model application-to-user"),
                _arch_bullet("Sieci: Wi-Fi, Bluetooth, Zigbee (mesh)"),
            ],
            spacing=0,
        ),
        gradient=ft.LinearGradient(
            begin=ft.Alignment.TOP_LEFT,
            end=ft.Alignment.BOTTOM_RIGHT,
            colors=[theme.PRIMARY_DARK, theme.PRIMARY],
        ),
        padding=18,
        border_radius=18,
    )

    user_section = ft.Container(
        ft.Row(
            [
                ft.Container(
                    ft.Text(
                        state.user_name[:1].upper(),
                        color="#FFFFFF",
                        size=22,
                        weight=ft.FontWeight.W_700,
                    ),
                    bgcolor=theme.ACCENT,
                    width=52,
                    height=52,
                    border_radius=26,
                    alignment=ft.Alignment.CENTER,
                ),
                ft.Column(
                    [
                        ft.Text(state.user_name, size=16, weight=ft.FontWeight.W_700),
                        ft.Text(
                            "Uwierzytelnienie NFC · aktywne",
                            size=12,
                            color=theme.TEXT_MUTED,
                        ),
                    ],
                    spacing=2,
                    expand=True,
                ),
                ft.Icon("chevron_right", color=theme.TEXT_MUTED),
            ],
            spacing=14,
            vertical_alignment=ft.CrossAxisAlignment.CENTER,
        ),
        bgcolor=theme.CARD,
        padding=14,
        border_radius=18,
        border=ft.Border.all(1, ft.Colors.with_opacity(0.08, theme.PRIMARY_DARK)),
    )

    return ft.Container(
        ft.Column(
            [
                ft.Text("Ustawienia", size=28, weight=ft.FontWeight.W_700),
                ft.Container(height=18),
                user_section,
                ft.Container(height=18),
                arch_section,
                ft.Container(height=18),
                networks_section,
                ft.Container(height=24),
                ft.Text(
                    "HomePulse v0.1 · projekt kursu Systemy Mobilne",
                    size=11,
                    color=theme.TEXT_MUTED,
                    text_align=ft.TextAlign.CENTER,
                ),
            ],
            spacing=0,
        ),
        padding=ft.Padding(left=20, right=20, top=24, bottom=24),
        expand=True,
    )


def _network_row(network) -> ft.Control:
    color = theme.SUCCESS if network.connected else theme.TEXT_MUTED
    return ft.Container(
        ft.Row(
            [
                ft.Container(
                    ft.Icon(_KIND_ICON.get(network.kind, "wifi"), color=theme.PRIMARY, size=22),
                    bgcolor=ft.Colors.with_opacity(0.08, theme.PRIMARY),
                    width=44,
                    height=44,
                    border_radius=12,
                    alignment=ft.Alignment.CENTER,
                ),
                ft.Column(
                    [
                        ft.Row(
                            [
                                ft.Text(network.name, size=14, weight=ft.FontWeight.W_600),
                                ft.Container(
                                    ft.Text(
                                        _KIND_LABEL.get(network.kind, network.kind).upper(),
                                        size=9,
                                        color=theme.PRIMARY,
                                        weight=ft.FontWeight.W_700,
                                    ),
                                    bgcolor=ft.Colors.with_opacity(0.08, theme.PRIMARY),
                                    padding=ft.Padding(left=6, right=6, top=2, bottom=2),
                                    border_radius=6,
                                ),
                            ],
                            spacing=8,
                        ),
                        ft.Text(network.detail, size=11, color=theme.TEXT_MUTED),
                    ],
                    spacing=2,
                    expand=True,
                ),
                ft.Container(
                    width=10,
                    height=10,
                    bgcolor=color,
                    border_radius=5,
                ),
            ],
            spacing=12,
            vertical_alignment=ft.CrossAxisAlignment.CENTER,
        ),
        bgcolor=theme.CARD,
        padding=12,
        border_radius=14,
        border=ft.Border.all(1, ft.Colors.with_opacity(0.08, theme.PRIMARY_DARK)),
    )


def _arch_bullet(text: str) -> ft.Control:
    return ft.Row(
        [
            ft.Icon("check_circle", color=theme.ACCENT_SOFT, size=14),
            ft.Text(text, color="#FFFFFF", size=12, expand=True),
        ],
        spacing=6,
    )
