"""Stan aplikacji HomePulse — pokoje, urządzenia, sceny, powiadomienia."""
from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from typing import Callable


@dataclass
class Device:
    id: str
    name: str
    kind: str  # "light", "ac", "blinds", "camera", "outlet", "speaker"
    icon: str
    on: bool = False
    level: int = 50  # 0-100 — jasność, prędkość wentylatora, otwarcie rolet
    extra: dict = field(default_factory=dict)


@dataclass
class Room:
    id: str
    name: str
    icon: str
    temperature: float
    humidity: int
    devices: list[Device]

    def active_count(self) -> int:
        return sum(1 for d in self.devices if d.on)


@dataclass
class Scene:
    id: str
    name: str
    icon: str
    description: str
    actions: dict  # {room_id: {device_id: {"on": True, "level": 30}}}


@dataclass
class Notification:
    id: str
    title: str
    body: str
    severity: str  # "info", "warn", "alert"
    ts: datetime


@dataclass
class Network:
    name: str
    kind: str  # "wifi", "bluetooth", "zigbee", "mqtt"
    connected: bool
    detail: str


class AppState:
    """Centralny stan aplikacji + prosty pub/sub do odświeżania UI."""

    def __init__(self) -> None:
        self.rooms: list[Room] = _initial_rooms()
        self.scenes: list[Scene] = _initial_scenes()
        self.notifications: list[Notification] = _initial_notifications()
        self.networks: list[Network] = _initial_networks()
        self.current_room_id: str = self.rooms[0].id
        self.alarm_armed: bool = False
        self.privacy_mode: bool = False  # gdy True — kamery wewnętrzne wyłączone
        self.user_name: str = "Filip"
        self.outside_temp: float = 12.5
        self._listeners: list[Callable[[], None]] = []

    def subscribe(self, fn: Callable[[], None]) -> None:
        self._listeners.append(fn)

    def notify(self) -> None:
        for fn in list(self._listeners):
            fn()

    def room(self, room_id: str) -> Room:
        return next(r for r in self.rooms if r.id == room_id)

    def device(self, room_id: str, device_id: str) -> Device:
        return next(d for d in self.room(room_id).devices if d.id == device_id)

    def toggle_device(self, room_id: str, device_id: str) -> None:
        d = self.device(room_id, device_id)
        d.on = not d.on
        self.add_notification(
            f"{d.name}", f"Stan zmieniony na: {'WŁ' if d.on else 'WYŁ'}", "info"
        )
        self.notify()

    def set_device_level(self, room_id: str, device_id: str, level: int) -> None:
        d = self.device(room_id, device_id)
        d.level = level
        if level > 0 and not d.on:
            d.on = True
        self.notify()

    def apply_scene(self, scene_id: str) -> None:
        scene = next(s for s in self.scenes if s.id == scene_id)
        for room_id, devs in scene.actions.items():
            for device_id, settings in devs.items():
                d = self.device(room_id, device_id)
                if "on" in settings:
                    d.on = settings["on"]
                if "level" in settings:
                    d.level = settings["level"]
        self.add_notification(
            "Scena aktywowana", f"Włączono scenę: {scene.name}", "info"
        )
        self.notify()

    def toggle_alarm(self) -> None:
        self.alarm_armed = not self.alarm_armed
        self.add_notification(
            "System alarmowy",
            "Uzbrojono" if self.alarm_armed else "Rozbrojono",
            "alert" if self.alarm_armed else "info",
        )
        self.notify()

    def toggle_privacy(self) -> None:
        self.privacy_mode = not self.privacy_mode
        for room in self.rooms:
            for d in room.devices:
                if d.kind == "camera" and d.extra.get("indoor"):
                    d.on = not self.privacy_mode
        self.add_notification(
            "Tryb prywatności",
            "Kamery wewnętrzne WYŁĄCZONE" if self.privacy_mode else "Kamery wewnętrzne aktywne",
            "warn" if self.privacy_mode else "info",
        )
        self.notify()

    def add_notification(self, title: str, body: str, severity: str = "info") -> None:
        nid = f"n{len(self.notifications) + 1}"
        self.notifications.insert(
            0, Notification(id=nid, title=title, body=body, severity=severity, ts=datetime.now())
        )
        self.notifications = self.notifications[:30]  # cap


def _initial_rooms() -> list[Room]:
    return [
        Room(
            id="livingroom",
            name="Salon",
            icon="weekend",
            temperature=22.5,
            humidity=45,
            devices=[
                Device("ll_main", "Lampa sufitowa", "light", "lightbulb", on=True, level=70),
                Device("ll_floor", "Lampa podłogowa", "light", "floor_lamp", on=False, level=40),
                Device("l_tv", "TV", "outlet", "tv", on=False),
                Device("l_blinds", "Rolety", "blinds", "blinds", on=True, level=60),
                Device("l_ac", "Klimatyzacja", "ac", "ac_unit", on=False, level=22),
                Device(
                    "l_cam", "Kamera salonu", "camera", "videocam",
                    on=True, extra={"indoor": True}
                ),
            ],
        ),
        Room(
            id="bedroom",
            name="Sypialnia",
            icon="bed",
            temperature=20.0,
            humidity=50,
            devices=[
                Device("b_main", "Główne światło", "light", "lightbulb", on=False, level=30),
                Device("b_night", "Lampka nocna", "light", "bedtime", on=True, level=15),
                Device("b_blinds", "Rolety", "blinds", "blinds", on=True, level=20),
                Device("b_ac", "Klimatyzacja", "ac", "ac_unit", on=True, level=20),
            ],
        ),
        Room(
            id="kitchen",
            name="Kuchnia",
            icon="kitchen",
            temperature=23.0,
            humidity=55,
            devices=[
                Device("k_main", "Światło sufitowe", "light", "lightbulb", on=False, level=80),
                Device("k_under", "Podświetlenie blatu", "light", "light_mode", on=False, level=50),
                Device("k_fridge", "Lodówka", "outlet", "kitchen", on=True),
                Device("k_oven", "Piekarnik", "outlet", "outdoor_grill", on=False),
            ],
        ),
        Room(
            id="bathroom",
            name="Łazienka",
            icon="bathroom",
            temperature=24.5,
            humidity=70,
            devices=[
                Device("ba_main", "Światło", "light", "lightbulb", on=False, level=90),
                Device("ba_mirror", "Podświetlenie lustra", "light", "light_mode", on=False, level=60),
                Device("ba_fan", "Wentylator", "ac", "air", on=False, level=50),
            ],
        ),
        Room(
            id="hall",
            name="Wejście",
            icon="meeting_room",
            temperature=19.5,
            humidity=48,
            devices=[
                Device("h_light", "Światło", "light", "lightbulb", on=False, level=80),
                Device(
                    "h_cam", "Kamera drzwi", "camera", "doorbell",
                    on=True, extra={"indoor": False}
                ),
                Device("h_lock", "Zamek NFC", "outlet", "lock", on=True),
            ],
        ),
    ]


def _initial_scenes() -> list[Scene]:
    return [
        Scene(
            id="morning",
            name="Dzień dobry",
            icon="wb_sunny",
            description="Stopniowe rozjaśnienie, rolety w górę, kawa w kuchni",
            actions={
                "livingroom": {
                    "ll_main": {"on": True, "level": 60},
                    "l_blinds": {"on": True, "level": 90},
                },
                "bedroom": {
                    "b_main": {"on": True, "level": 40},
                    "b_blinds": {"on": True, "level": 80},
                    "b_night": {"on": False},
                },
                "kitchen": {"k_main": {"on": True, "level": 100}},
            },
        ),
        Scene(
            id="evening",
            name="Wieczór",
            icon="nights_stay",
            description="Ciepłe światło, rolety w dół, TV włączone",
            actions={
                "livingroom": {
                    "ll_main": {"on": True, "level": 30},
                    "ll_floor": {"on": True, "level": 50},
                    "l_blinds": {"on": True, "level": 10},
                    "l_tv": {"on": True},
                },
            },
        ),
        Scene(
            id="sleep",
            name="Dobranoc",
            icon="bedtime",
            description="Wszystko gasimy, alarm uzbrojony, klima cicho",
            actions={
                "livingroom": {
                    "ll_main": {"on": False},
                    "ll_floor": {"on": False},
                    "l_tv": {"on": False},
                    "l_blinds": {"on": True, "level": 0},
                },
                "bedroom": {
                    "b_main": {"on": False},
                    "b_night": {"on": True, "level": 10},
                    "b_blinds": {"on": True, "level": 0},
                    "b_ac": {"on": True, "level": 19},
                },
                "kitchen": {"k_main": {"on": False}, "k_under": {"on": False}},
                "bathroom": {"ba_main": {"on": False}, "ba_mirror": {"on": False}},
                "hall": {"h_light": {"on": False}},
            },
        ),
        Scene(
            id="away",
            name="Wychodzę",
            icon="directions_walk",
            description="Wyłącz światła, zamknij rolety, uzbrój alarm",
            actions={
                "livingroom": {
                    "ll_main": {"on": False},
                    "ll_floor": {"on": False},
                    "l_tv": {"on": False},
                    "l_ac": {"on": False},
                    "l_blinds": {"on": True, "level": 0},
                },
                "bedroom": {
                    "b_main": {"on": False},
                    "b_night": {"on": False},
                    "b_ac": {"on": False},
                },
                "kitchen": {"k_main": {"on": False}, "k_under": {"on": False}},
                "bathroom": {"ba_main": {"on": False}, "ba_mirror": {"on": False}},
                "hall": {"h_light": {"on": False}},
            },
        ),
        Scene(
            id="movie",
            name="Kino domowe",
            icon="local_movies",
            description="Ściemnij światło, opuść rolety, TV i sound on",
            actions={
                "livingroom": {
                    "ll_main": {"on": True, "level": 10},
                    "ll_floor": {"on": True, "level": 25},
                    "l_tv": {"on": True},
                    "l_blinds": {"on": True, "level": 0},
                },
            },
        ),
        Scene(
            id="party",
            name="Impreza",
            icon="celebration",
            description="Pełne oświetlenie, klima na wyższe obroty",
            actions={
                "livingroom": {
                    "ll_main": {"on": True, "level": 100},
                    "ll_floor": {"on": True, "level": 100},
                    "l_ac": {"on": True, "level": 21},
                },
                "kitchen": {
                    "k_main": {"on": True, "level": 100},
                    "k_under": {"on": True, "level": 100},
                },
            },
        ),
    ]


def _initial_notifications() -> list[Notification]:
    now = datetime.now()
    return [
        Notification("n0", "HomePulse", f"Cześć, witamy w domu", "info", now),
        Notification("n_geo", "Geofencing", "Wykryto wejście do strefy: Dom", "info", now),
        Notification(
            "n_temp", "Czujnik temperatury",
            "Sypialnia: 20.0°C — w normie", "info", now,
        ),
    ]


def _initial_networks() -> list[Network]:
    return [
        Network("HomePulse_5G", "wifi", True, "802.11ax · -42 dBm"),
        Network("HomePulse_IoT", "wifi", True, "802.11n · pasmo 2.4 GHz"),
        Network("Zigbee Coordinator", "zigbee", True, "12 urządzeń w sieci mesh"),
        Network("BLE Hub", "bluetooth", True, "BT 5.3 · 4 urządzenia"),
        Network("mqtt://broker.local", "mqtt", True, "TLS · QoS 1"),
    ]
