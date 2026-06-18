"""Definicje motywu i palety kolorów HomePulse."""
import flet as ft


# Paleta — głęboki granat + ciepły akcent (smart home, premium)
PRIMARY = "#3A5BA0"
PRIMARY_DARK = "#1E2761"
ACCENT = "#FF8A3D"
ACCENT_SOFT = "#FFB573"
SURFACE = "#F4F6FB"
SURFACE_DARK = "#0F1424"
CARD = "#FFFFFF"
CARD_DARK = "#1A2238"
TEXT = "#0F1424"
TEXT_MUTED = "#5D6480"
DANGER = "#E04545"
SUCCESS = "#2EB87D"


def severity_color(severity: str) -> str:
    return {
        "info": PRIMARY,
        "warn": ACCENT,
        "alert": DANGER,
    }.get(severity, PRIMARY)


def device_icon_color(on: bool) -> str:
    return ACCENT if on else TEXT_MUTED


def build_theme() -> ft.Theme:
    return ft.Theme(
        color_scheme_seed=PRIMARY,
        use_material3=True,
        font_family="Inter",
    )
