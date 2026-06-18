"""Karta urządzenia — toggle + opcjonalny suwak poziomu."""
import flet as ft

from ..state import AppState, Device
from .. import theme


def device_card(state: AppState, room_id: str, device: Device) -> ft.Control:
    icon_color = theme.ACCENT if device.on else theme.TEXT_MUTED
    bg = ft.Colors.with_opacity(0.06, theme.ACCENT) if device.on else theme.SURFACE

    def on_toggle(_):
        state.toggle_device(room_id, device.id)

    def on_slider_change(e: ft.ControlEvent):
        state.set_device_level(room_id, device.id, int(e.control.value))

    has_level = device.kind in {"light", "ac", "blinds"}

    level_unit = "%"
    if device.kind == "ac":
        level_unit = "°C"
        level_min, level_max = 16, 30
    else:
        level_min, level_max = 0, 100

    controls = [
        ft.Row(
            [
                ft.Container(
                    ft.Icon(device.icon, color=icon_color, size=24),
                    bgcolor=ft.Colors.with_opacity(
                        0.15 if device.on else 0.06,
                        theme.ACCENT if device.on else theme.PRIMARY,
                    ),
                    width=44,
                    height=44,
                    border_radius=12,
                    alignment=ft.Alignment.CENTER,
                ),
                ft.Column(
                    [
                        ft.Text(device.name, weight=ft.FontWeight.W_600, size=14),
                        ft.Text(
                            f"{int(device.level)}{level_unit}" if has_level and device.on else
                            ("WŁ" if device.on else "WYŁ"),
                            size=12,
                            color=theme.TEXT_MUTED,
                        ),
                    ],
                    spacing=2,
                    expand=True,
                ),
                ft.Switch(
                    value=device.on,
                    on_change=on_toggle,
                    active_color=theme.ACCENT,
                ),
            ],
            spacing=12,
            alignment=ft.MainAxisAlignment.START,
        ),
    ]

    if has_level and device.on:
        controls.append(
            ft.Slider(
                min=level_min,
                max=level_max,
                divisions=level_max - level_min,
                value=max(level_min, min(level_max, device.level)),
                on_change_end=on_slider_change,
                active_color=theme.ACCENT,
                inactive_color=ft.Colors.with_opacity(0.2, theme.PRIMARY),
                thumb_color=theme.ACCENT,
            )
        )

    return ft.Container(
        ft.Column(controls, spacing=4),
        bgcolor=bg,
        padding=ft.Padding(left=14, right=14, top=12, bottom=8 if has_level and device.on else 12),
        border_radius=16,
        border=ft.Border.all(1, ft.Colors.with_opacity(0.06, theme.PRIMARY_DARK)),
    )
