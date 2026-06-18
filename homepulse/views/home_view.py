"""Widok główny — dashboard z podsumowaniem domu."""
import flet as ft
from datetime import datetime

from ..state import AppState
from .. import theme


def home_view(state: AppState, on_open_room, on_open_scene) -> ft.Control:
    current_room = state.room(state.current_room_id)
    active_devices = sum(r.active_count() for r in state.rooms)
    total_devices = sum(len(r.devices) for r in state.rooms)

    greeting_hour = datetime.now().hour
    if greeting_hour < 5:
        greeting = "Dobranoc"
    elif greeting_hour < 12:
        greeting = "Dzień dobry"
    elif greeting_hour < 18:
        greeting = "Cześć"
    else:
        greeting = "Dobry wieczór"

    # Nagłówek
    header = ft.Container(
        ft.Column(
            [
                ft.Row(
                    [
                        ft.Column(
                            [
                                ft.Text(
                                    f"{greeting}, {state.user_name}",
                                    size=14,
                                    color=ft.Colors.with_opacity(0.7, "#FFFFFF"),
                                ),
                                ft.Text(
                                    "HomePulse",
                                    size=28,
                                    weight=ft.FontWeight.W_700,
                                    color="#FFFFFF",
                                ),
                            ],
                            spacing=0,
                            expand=True,
                        ),
                        ft.Container(
                            ft.Row(
                                [
                                    ft.Icon(
                                        "location_on",
                                        color="#FFFFFF",
                                        size=14,
                                    ),
                                    ft.Text(
                                        current_room.name,
                                        color="#FFFFFF",
                                        size=12,
                                        weight=ft.FontWeight.W_500,
                                    ),
                                ],
                                spacing=4,
                            ),
                            bgcolor=ft.Colors.with_opacity(0.15, "#FFFFFF"),
                            padding=ft.Padding(left=10, right=10, top=6, bottom=6),
                            border_radius=20,
                        ),
                    ],
                    alignment=ft.MainAxisAlignment.SPACE_BETWEEN,
                ),
                ft.Container(height=20),
                ft.Row(
                    [
                        _stat_chip("thermostat", f"{state.outside_temp:.1f}°C", "Na zewnątrz"),
                        _stat_chip("bolt", f"{active_devices}/{total_devices}", "Aktywne"),
                        _stat_chip(
                            "shield" if state.alarm_armed else "shield_outlined",
                            "Uzbrojony" if state.alarm_armed else "Rozbrojony",
                            "Alarm",
                        ),
                    ],
                    alignment=ft.MainAxisAlignment.SPACE_BETWEEN,
                ),
            ],
            spacing=4,
        ),
        gradient=ft.LinearGradient(
            begin=ft.Alignment.TOP_LEFT,
            end=ft.Alignment.BOTTOM_RIGHT,
            colors=[theme.PRIMARY_DARK, theme.PRIMARY],
        ),
        padding=ft.Padding(left=20, right=20, top=24, bottom=24),
        border_radius=ft.BorderRadius.only(bottom_left=28, bottom_right=28),
    )

    # Quick scenes
    quick_scenes = ft.Container(
        ft.Column(
            [
                _section_header("Szybkie sceny"),
                ft.Row(
                    [
                        _scene_chip(s, on_open_scene)
                        for s in state.scenes[:4]
                    ],
                    spacing=10,
                    scroll=ft.ScrollMode.HIDDEN,
                ),
            ],
            spacing=12,
        ),
        padding=ft.Padding(left=20, right=20, top=20, bottom=8),
    )

    # Lista pokoi (skrót)
    room_tiles = ft.Container(
        ft.Column(
            [
                _section_header("Pokoje"),
                ft.GridView(
                    [
                        _room_tile(r, on_open_room, selected=(r.id == state.current_room_id))
                        for r in state.rooms
                    ],
                    runs_count=2,
                    spacing=12,
                    run_spacing=12,
                    child_aspect_ratio=1.4,
                ),
            ],
            spacing=12,
        ),
        padding=ft.Padding(left=20, right=20, top=8, bottom=20),
        expand=True,
    )

    return ft.Column(
        [header, quick_scenes, room_tiles],
        spacing=0,
        scroll=ft.ScrollMode.AUTO,
        expand=True,
    )


def _stat_chip(icon: str, value: str, label: str) -> ft.Control:
    return ft.Container(
        ft.Column(
            [
                ft.Row(
                    [
                        ft.Icon(icon, color="#FFFFFF", size=16),
                        ft.Text(value, color="#FFFFFF", size=15, weight=ft.FontWeight.W_700),
                    ],
                    spacing=6,
                ),
                ft.Text(
                    label,
                    color=ft.Colors.with_opacity(0.7, "#FFFFFF"),
                    size=11,
                ),
            ],
            spacing=2,
        ),
        bgcolor=ft.Colors.with_opacity(0.12, "#FFFFFF"),
        padding=ft.Padding(left=12, right=12, top=8, bottom=8),
        border_radius=14,
        expand=True,
    )


def _section_header(title: str) -> ft.Control:
    return ft.Text(title, size=16, weight=ft.FontWeight.W_700, color=theme.TEXT)


def _scene_chip(scene, on_open_scene) -> ft.Control:
    return ft.Container(
        ft.Column(
            [
                ft.Container(
                    ft.Icon(scene.icon, color=theme.ACCENT, size=22),
                    bgcolor=ft.Colors.with_opacity(0.12, theme.ACCENT),
                    width=42,
                    height=42,
                    border_radius=12,
                    alignment=ft.Alignment.CENTER,
                ),
                ft.Text(scene.name, size=12, weight=ft.FontWeight.W_600),
            ],
            spacing=8,
            horizontal_alignment=ft.CrossAxisAlignment.CENTER,
        ),
        width=92,
        padding=ft.Padding(left=10, right=10, top=12, bottom=12),
        bgcolor=theme.CARD,
        border_radius=16,
        border=ft.Border.all(1, ft.Colors.with_opacity(0.08, theme.PRIMARY_DARK)),
        on_click=lambda _, sid=scene.id: on_open_scene(sid),
        ink=True,
    )


def _room_tile(room, on_open_room, selected: bool = False) -> ft.Control:
    border_color = theme.ACCENT if selected else ft.Colors.with_opacity(0.08, theme.PRIMARY_DARK)
    return ft.Container(
        ft.Column(
            [
                ft.Row(
                    [
                        ft.Icon(room.icon, color=theme.PRIMARY, size=22),
                        ft.Container(expand=True),
                        ft.Container(
                            ft.Text(
                                f"{room.active_count()}",
                                color=theme.ACCENT if room.active_count() else theme.TEXT_MUTED,
                                size=11,
                                weight=ft.FontWeight.W_700,
                            ),
                            bgcolor=ft.Colors.with_opacity(
                                0.12 if room.active_count() else 0.06,
                                theme.ACCENT if room.active_count() else theme.PRIMARY,
                            ),
                            width=22,
                            height=22,
                            border_radius=11,
                            alignment=ft.Alignment.CENTER,
                        ),
                    ],
                ),
                ft.Container(expand=True),
                ft.Text(room.name, size=16, weight=ft.FontWeight.W_700),
                ft.Row(
                    [
                        ft.Icon("thermostat", color=theme.TEXT_MUTED, size=14),
                        ft.Text(
                            f"{room.temperature:.1f}°C",
                            color=theme.TEXT_MUTED,
                            size=12,
                        ),
                        ft.Container(width=8),
                        ft.Icon("water_drop", color=theme.TEXT_MUTED, size=14),
                        ft.Text(
                            f"{room.humidity}%",
                            color=theme.TEXT_MUTED,
                            size=12,
                        ),
                    ],
                    spacing=4,
                ),
            ],
            spacing=4,
        ),
        padding=14,
        bgcolor=theme.CARD,
        border_radius=18,
        border=ft.Border.all(2 if selected else 1, border_color),
        on_click=lambda _, rid=room.id: on_open_room(rid),
        ink=True,
    )
