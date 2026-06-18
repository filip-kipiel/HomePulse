"""Widok scen — predefiniowane automatyzacje."""
import flet as ft

from ..state import AppState
from .. import theme


def scenes_view(state: AppState, on_apply) -> ft.Control:
    cards = [_scene_card(s, on_apply) for s in state.scenes]

    return ft.Container(
        ft.Column(
            [
                ft.Text("Sceny", size=28, weight=ft.FontWeight.W_700),
                ft.Text(
                    "Kliknij scenę, by uruchomić zestaw automatyzacji",
                    size=13,
                    color=theme.TEXT_MUTED,
                ),
                ft.Container(height=18),
                ft.Column(cards, spacing=12),
            ],
            spacing=2,
        ),
        padding=ft.Padding(left=20, right=20, top=24, bottom=24),
        expand=True,
    )


def _scene_card(scene, on_apply) -> ft.Control:
    return ft.Container(
        ft.Row(
            [
                ft.Container(
                    ft.Icon(scene.icon, color=theme.ACCENT, size=26),
                    bgcolor=ft.Colors.with_opacity(0.12, theme.ACCENT),
                    width=56,
                    height=56,
                    border_radius=16,
                    alignment=ft.Alignment.CENTER,
                ),
                ft.Column(
                    [
                        ft.Text(scene.name, size=16, weight=ft.FontWeight.W_700),
                        ft.Text(
                            scene.description,
                            size=12,
                            color=theme.TEXT_MUTED,
                            max_lines=2,
                        ),
                    ],
                    spacing=2,
                    expand=True,
                ),
                ft.Container(
                    ft.Row(
                        [
                            ft.Icon("play_arrow", color="#FFFFFF", size=16),
                            ft.Text("Uruchom", color="#FFFFFF", size=12, weight=ft.FontWeight.W_600),
                        ],
                        spacing=4,
                        alignment=ft.MainAxisAlignment.CENTER,
                    ),
                    bgcolor=theme.ACCENT,
                    padding=ft.Padding(left=12, right=14, top=8, bottom=8),
                    border_radius=12,
                    on_click=lambda _, sid=scene.id: on_apply(sid),
                    ink=True,
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
