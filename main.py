"""HomePulse — aplikacja inteligentnego domu.

Projekt na kurs Systemy Mobilne (prof. Piotr Nawrocki).
Architektura: thick-client (Flet/Python) + messaging (MQTT) — patrz Ustawienia.
"""
from __future__ import annotations

import flet as ft

from homepulse.state import AppState
from homepulse import theme
from homepulse.views.home_view import home_view
from homepulse.views.room_view import room_view
from homepulse.views.scenes_view import scenes_view
from homepulse.views.security_view import security_view
from homepulse.views.settings_view import settings_view


# Indeksy zakładek
TAB_HOME = 0
TAB_SCENES = 1
TAB_SECURITY = 2
TAB_SETTINGS = 3


class HomePulseApp:
    def __init__(self, page: ft.Page) -> None:
        self.page = page
        self.state = AppState()
        self.tab_index = TAB_HOME
        self.detail_room_id: str | None = None  # gdy ustawione, pokazujemy widok pokoju

        self.state.subscribe(self.rebuild)

        page.title = "HomePulse"
        page.theme = theme.build_theme()
        page.bgcolor = theme.SURFACE
        page.padding = 0
        page.window.width = 420
        page.window.height = 860
        page.window.min_width = 360
        page.window.min_height = 640

        self.body = ft.Container(expand=True)
        self.nav = self._build_nav()

        page.add(
            ft.Column(
                [self.body, self.nav],
                spacing=0,
                expand=True,
            )
        )
        self.rebuild()

    # ------------ rendering ------------

    def rebuild(self) -> None:
        if self.detail_room_id is not None:
            self.body.content = room_view(
                self.state,
                self.detail_room_id,
                on_back=self._back_from_room,
            )
            self.nav.visible = False
        else:
            self.nav.visible = True
            if self.tab_index == TAB_HOME:
                self.body.content = home_view(
                    self.state,
                    on_open_room=self._open_room,
                    on_open_scene=self._apply_scene,
                )
            elif self.tab_index == TAB_SCENES:
                self.body.content = scenes_view(self.state, on_apply=self._apply_scene)
            elif self.tab_index == TAB_SECURITY:
                self.body.content = security_view(self.state)
            elif self.tab_index == TAB_SETTINGS:
                self.body.content = settings_view(self.state)
        self.page.update()

    def _build_nav(self) -> ft.NavigationBar:
        return ft.NavigationBar(
            destinations=[
                ft.NavigationBarDestination(
                    icon="home_outlined",
                    selected_icon="home",
                    label="Dom",
                ),
                ft.NavigationBarDestination(
                    icon="auto_awesome_outlined",
                    selected_icon="auto_awesome",
                    label="Sceny",
                ),
                ft.NavigationBarDestination(
                    icon="shield_outlined",
                    selected_icon="shield",
                    label="Ochrona",
                ),
                ft.NavigationBarDestination(
                    icon="settings_outlined",
                    selected_icon="settings",
                    label="Ustawienia",
                ),
            ],
            selected_index=self.tab_index,
            on_change=self._on_tab_change,
            bgcolor=theme.CARD,
            indicator_color=ft.Colors.with_opacity(0.18, theme.ACCENT),
            surface_tint_color=theme.PRIMARY,
        )

    # ------------ events ------------

    def _on_tab_change(self, e: ft.ControlEvent) -> None:
        self.tab_index = e.control.selected_index
        self.detail_room_id = None
        self.nav.selected_index = self.tab_index
        self.rebuild()

    def _open_room(self, room_id: str) -> None:
        self.detail_room_id = room_id
        self.state.current_room_id = room_id
        self.rebuild()

    def _back_from_room(self) -> None:
        self.detail_room_id = None
        self.rebuild()

    def _apply_scene(self, scene_id: str) -> None:
        self.state.apply_scene(scene_id)
        snack = ft.SnackBar(
            ft.Text(
                f"Scena uruchomiona: "
                f"{next(s.name for s in self.state.scenes if s.id == scene_id)}",
                color="#FFFFFF",
            ),
            bgcolor=theme.PRIMARY,
            duration=2000,
        )
        self.page.open(snack)


def main(page: ft.Page) -> None:
    HomePulseApp(page)


if __name__ == "__main__":
    ft.app(target=main)
