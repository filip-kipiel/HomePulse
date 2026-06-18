"""Widok szczegółów pojedynczego pokoju."""
import flet as ft

from ..state import AppState
from ..components.device_card import device_card
from .. import theme


def room_view(state: AppState, room_id: str, on_back) -> ft.Control:
    room = state.room(room_id)
    active = room.active_count()

    header = ft.Container(
        ft.Column(
            [
                ft.Row(
                    [
                        ft.IconButton(
                            "arrow_back",
                            on_click=lambda _: on_back(),
                            icon_color="#FFFFFF",
                        ),
                        ft.Container(expand=True),
                        ft.IconButton(
                            "more_horiz",
                            icon_color="#FFFFFF",
                        ),
                    ],
                ),
                ft.Container(height=4),
                ft.Row(
                    [
                        ft.Container(
                            ft.Icon(room.icon, color="#FFFFFF", size=32),
                            bgcolor=ft.Colors.with_opacity(0.18, "#FFFFFF"),
                            width=64,
                            height=64,
                            border_radius=20,
                            alignment=ft.Alignment.CENTER,
                        ),
                        ft.Column(
                            [
                                ft.Text(
                                    room.name,
                                    color="#FFFFFF",
                                    size=26,
                                    weight=ft.FontWeight.W_700,
                                ),
                                ft.Text(
                                    f"{active} z {len(room.devices)} urządzeń aktywnych",
                                    color=ft.Colors.with_opacity(0.7, "#FFFFFF"),
                                    size=13,
                                ),
                            ],
                            spacing=2,
                        ),
                    ],
                    spacing=14,
                ),
                ft.Container(height=18),
                ft.Row(
                    [
                        _env_chip("thermostat", f"{room.temperature:.1f}°C", "Temperatura"),
                        _env_chip("water_drop", f"{room.humidity}%", "Wilgotność"),
                        _env_chip(
                            "wifi" if active else "wifi_off",
                            "Online" if active else "Czuwa",
                            "Status",
                        ),
                    ],
                    spacing=10,
                ),
            ],
            spacing=2,
        ),
        gradient=ft.LinearGradient(
            begin=ft.Alignment.TOP_LEFT,
            end=ft.Alignment.BOTTOM_RIGHT,
            colors=[theme.PRIMARY_DARK, theme.PRIMARY],
        ),
        padding=ft.Padding(left=14, right=14, top=14, bottom=22),
        border_radius=ft.BorderRadius.only(bottom_left=24, bottom_right=24),
    )

    cards = [device_card(state, room.id, d) for d in room.devices]

    devices_section = ft.Container(
        ft.Column(
            [
                ft.Row(
                    [
                        ft.Text(
                            "Urządzenia",
                            size=16,
                            weight=ft.FontWeight.W_700,
                        ),
                        ft.Container(expand=True),
                        ft.Text(
                            f"{len(room.devices)} urządzeń",
                            size=12,
                            color=theme.TEXT_MUTED,
                        ),
                    ],
                ),
                ft.Container(height=10),
                ft.Column(cards, spacing=10),
            ],
            spacing=0,
        ),
        padding=ft.Padding(left=20, right=20, top=18, bottom=24),
    )

    return ft.Column(
        [header, devices_section],
        spacing=0,
        scroll=ft.ScrollMode.AUTO,
        expand=True,
    )


def _env_chip(icon: str, value: str, label: str) -> ft.Control:
    return ft.Container(
        ft.Column(
            [
                ft.Row(
                    [
                        ft.Icon(icon, color="#FFFFFF", size=15),
                        ft.Text(
                            value,
                            color="#FFFFFF",
                            size=14,
                            weight=ft.FontWeight.W_700,
                        ),
                    ],
                    spacing=5,
                ),
                ft.Text(
                    label,
                    color=ft.Colors.with_opacity(0.65, "#FFFFFF"),
                    size=10,
                ),
            ],
            spacing=2,
        ),
        bgcolor=ft.Colors.with_opacity(0.14, "#FFFFFF"),
        padding=ft.Padding(left=10, right=10, top=8, bottom=8),
        border_radius=12,
        expand=True,
    )
