"""Widok bezpieczeństwa — alarm, kamery, tryb prywatności, powiadomienia."""
import flet as ft

from ..state import AppState
from .. import theme


def security_view(state: AppState) -> ft.Control:
    cameras = []
    for room in state.rooms:
        for d in room.devices:
            if d.kind == "camera":
                cameras.append((room, d))

    alarm_card = _alarm_card(state)
    privacy_card = _privacy_card(state)

    cameras_section = ft.Column(
        [
            ft.Text("Kamery", size=16, weight=ft.FontWeight.W_700),
            ft.Container(height=8),
            *[_camera_row(state, r, c) for r, c in cameras],
        ],
        spacing=8,
    ) if cameras else ft.Container()

    notif_section = ft.Column(
        [
            ft.Text("Aktywność", size=16, weight=ft.FontWeight.W_700),
            ft.Container(height=8),
            *[_notification_row(n) for n in state.notifications[:10]],
        ],
        spacing=8,
    )

    return ft.Container(
        ft.Column(
            [
                ft.Text("Bezpieczeństwo", size=28, weight=ft.FontWeight.W_700),
                ft.Text(
                    "Alarm, kamery i powiadomienia",
                    size=13,
                    color=theme.TEXT_MUTED,
                ),
                ft.Container(height=18),
                alarm_card,
                ft.Container(height=12),
                privacy_card,
                ft.Container(height=20),
                cameras_section,
                ft.Container(height=20),
                notif_section,
            ],
            spacing=0,
        ),
        padding=ft.Padding(left=20, right=20, top=24, bottom=24),
        expand=True,
    )


def _alarm_card(state: AppState) -> ft.Control:
    armed = state.alarm_armed
    return ft.Container(
        ft.Row(
            [
                ft.Container(
                    ft.Icon(
                        "shield" if armed else "shield_outlined",
                        color="#FFFFFF",
                        size=28,
                    ),
                    bgcolor=ft.Colors.with_opacity(0.2, "#FFFFFF"),
                    width=56,
                    height=56,
                    border_radius=16,
                    alignment=ft.Alignment.CENTER,
                ),
                ft.Column(
                    [
                        ft.Text(
                            "Alarm domowy",
                            color="#FFFFFF",
                            size=16,
                            weight=ft.FontWeight.W_700,
                        ),
                        ft.Text(
                            "Uzbrojony · czujniki aktywne" if armed
                            else "Rozbrojony · gotowy do aktywacji",
                            color=ft.Colors.with_opacity(0.85, "#FFFFFF"),
                            size=12,
                        ),
                    ],
                    spacing=2,
                    expand=True,
                ),
                ft.Switch(
                    value=armed,
                    on_change=lambda _: state.toggle_alarm(),
                    active_color="#FFFFFF",
                    active_track_color=ft.Colors.with_opacity(0.4, "#FFFFFF"),
                ),
            ],
            spacing=14,
            vertical_alignment=ft.CrossAxisAlignment.CENTER,
        ),
        gradient=ft.LinearGradient(
            begin=ft.Alignment.TOP_LEFT,
            end=ft.Alignment.BOTTOM_RIGHT,
            colors=[theme.DANGER, "#B82B2B"] if armed else [theme.PRIMARY, theme.PRIMARY_DARK],
        ),
        padding=16,
        border_radius=18,
    )


def _privacy_card(state: AppState) -> ft.Control:
    return ft.Container(
        ft.Row(
            [
                ft.Container(
                    ft.Icon("visibility_off", color=theme.ACCENT, size=24),
                    bgcolor=ft.Colors.with_opacity(0.12, theme.ACCENT),
                    width=48,
                    height=48,
                    border_radius=14,
                    alignment=ft.Alignment.CENTER,
                ),
                ft.Column(
                    [
                        ft.Text(
                            "Tryb prywatności",
                            size=15,
                            weight=ft.FontWeight.W_700,
                        ),
                        ft.Text(
                            "Wyłącz kamery wewnątrz domu",
                            size=12,
                            color=theme.TEXT_MUTED,
                        ),
                    ],
                    spacing=2,
                    expand=True,
                ),
                ft.Switch(
                    value=state.privacy_mode,
                    on_change=lambda _: state.toggle_privacy(),
                    active_color=theme.ACCENT,
                ),
            ],
            spacing=14,
            vertical_alignment=ft.CrossAxisAlignment.CENTER,
        ),
        bgcolor=theme.CARD,
        padding=14,
        border_radius=18,
        border=ft.Border.all(1, ft.Colors.with_opacity(0.08, theme.PRIMARY_DARK)),
    )


def _camera_row(state: AppState, room, camera) -> ft.Control:
    return ft.Container(
        ft.Row(
            [
                ft.Container(
                    ft.Icon(
                        "videocam" if camera.on else "videocam_off",
                        color=theme.ACCENT if camera.on else theme.TEXT_MUTED,
                        size=22,
                    ),
                    bgcolor=ft.Colors.with_opacity(
                        0.12 if camera.on else 0.06,
                        theme.ACCENT if camera.on else theme.PRIMARY,
                    ),
                    width=44,
                    height=44,
                    border_radius=12,
                    alignment=ft.Alignment.CENTER,
                ),
                ft.Column(
                    [
                        ft.Text(camera.name, size=14, weight=ft.FontWeight.W_600),
                        ft.Text(
                            f"{room.name} · {'wewnętrzna' if camera.extra.get('indoor') else 'zewnętrzna'}",
                            size=11,
                            color=theme.TEXT_MUTED,
                        ),
                    ],
                    spacing=2,
                    expand=True,
                ),
                ft.Container(
                    ft.Text(
                        "LIVE" if camera.on else "OFF",
                        color="#FFFFFF",
                        size=10,
                        weight=ft.FontWeight.W_700,
                    ),
                    bgcolor=theme.DANGER if camera.on else theme.TEXT_MUTED,
                    padding=ft.Padding(left=8, right=8, top=4, bottom=4),
                    border_radius=8,
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


def _notification_row(n) -> ft.Control:
    color = theme.severity_color(n.severity)
    icon = {"info": "info", "warn": "warning", "alert": "error"}.get(n.severity, "info")
    return ft.Container(
        ft.Row(
            [
                ft.Container(
                    ft.Icon(icon, color=color, size=16),
                    bgcolor=ft.Colors.with_opacity(0.12, color),
                    width=36,
                    height=36,
                    border_radius=10,
                    alignment=ft.Alignment.CENTER,
                ),
                ft.Column(
                    [
                        ft.Text(n.title, size=13, weight=ft.FontWeight.W_600),
                        ft.Text(n.body, size=11, color=theme.TEXT_MUTED, max_lines=2),
                    ],
                    spacing=2,
                    expand=True,
                ),
                ft.Text(
                    n.ts.strftime("%H:%M"),
                    size=11,
                    color=theme.TEXT_MUTED,
                ),
            ],
            spacing=10,
            vertical_alignment=ft.CrossAxisAlignment.CENTER,
        ),
        bgcolor=theme.CARD,
        padding=10,
        border_radius=12,
        border=ft.Border.all(1, ft.Colors.with_opacity(0.06, theme.PRIMARY_DARK)),
    )
