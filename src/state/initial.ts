import { Room, Scene, Network, Notification } from '../types';

export const initialRooms: Room[] = [
  {
    id: 'livingroom',
    name: 'Salon',
    icon: 'weekend',
    temperature: 22.5,
    humidity: 45,
    devices: [
      { id: 'll_main', name: 'Lampa sufitowa', kind: 'light', icon: 'lightbulb', on: true, level: 70 },
      { id: 'll_floor', name: 'Lampa podłogowa', kind: 'light', icon: 'wb-incandescent', on: false, level: 40 },
      { id: 'l_tv', name: 'TV', kind: 'outlet', icon: 'tv', on: false, level: 0 },
      { id: 'l_blinds', name: 'Rolety', kind: 'blinds', icon: 'blinds', on: true, level: 60 },
      { id: 'l_ac', name: 'Klimatyzacja', kind: 'ac', icon: 'ac-unit', on: false, level: 22 },
      { id: 'l_cam', name: 'Kamera salonu', kind: 'camera', icon: 'videocam', on: true, level: 0, indoor: true },
    ],
  },
  {
    id: 'bedroom',
    name: 'Sypialnia',
    icon: 'bed',
    temperature: 20.0,
    humidity: 50,
    devices: [
      { id: 'b_main', name: 'Główne światło', kind: 'light', icon: 'lightbulb', on: false, level: 30 },
      { id: 'b_night', name: 'Lampka nocna', kind: 'light', icon: 'bedtime', on: true, level: 15 },
      { id: 'b_blinds', name: 'Rolety', kind: 'blinds', icon: 'blinds', on: true, level: 20 },
      { id: 'b_ac', name: 'Klimatyzacja', kind: 'ac', icon: 'ac-unit', on: true, level: 20 },
    ],
  },
  {
    id: 'kitchen',
    name: 'Kuchnia',
    icon: 'kitchen',
    temperature: 23.0,
    humidity: 55,
    devices: [
      { id: 'k_main', name: 'Światło sufitowe', kind: 'light', icon: 'lightbulb', on: false, level: 80 },
      { id: 'k_under', name: 'Podświetlenie blatu', kind: 'light', icon: 'light-mode', on: false, level: 50 },
      { id: 'k_fridge', name: 'Lodówka', kind: 'outlet', icon: 'kitchen', on: true, level: 0 },
      { id: 'k_oven', name: 'Piekarnik', kind: 'outlet', icon: 'outdoor-grill', on: false, level: 0 },
    ],
  },
  {
    id: 'bathroom',
    name: 'Łazienka',
    icon: 'bathtub',
    temperature: 24.5,
    humidity: 70,
    devices: [
      { id: 'ba_main', name: 'Światło', kind: 'light', icon: 'lightbulb', on: false, level: 90 },
      { id: 'ba_mirror', name: 'Podświetlenie lustra', kind: 'light', icon: 'light-mode', on: false, level: 60 },
      { id: 'ba_fan', name: 'Wentylator', kind: 'ac', icon: 'air', on: false, level: 50 },
    ],
  },
  {
    id: 'hall',
    name: 'Wejście',
    icon: 'meeting-room',
    temperature: 19.5,
    humidity: 48,
    devices: [
      { id: 'h_light', name: 'Światło', kind: 'light', icon: 'lightbulb', on: false, level: 80 },
      { id: 'h_cam', name: 'Kamera drzwi', kind: 'camera', icon: 'doorbell', on: true, level: 0, indoor: false },
      { id: 'h_lock', name: 'Zamek NFC', kind: 'outlet', icon: 'lock', on: true, level: 0 },
    ],
  },
];

export const initialScenes: Scene[] = [
  {
    id: 'morning',
    name: 'Dzień dobry',
    icon: 'wb-sunny',
    description: 'Stopniowe rozjaśnienie, rolety w górę, kawa w kuchni',
    actions: {
      livingroom: {
        ll_main: { on: true, level: 60 },
        l_blinds: { on: true, level: 90 },
      },
      bedroom: {
        b_main: { on: true, level: 40 },
        b_blinds: { on: true, level: 80 },
        b_night: { on: false },
      },
      kitchen: { k_main: { on: true, level: 100 } },
    },
  },
  {
    id: 'evening',
    name: 'Wieczór',
    icon: 'nights-stay',
    description: 'Ciepłe światło, rolety w dół, TV włączone',
    actions: {
      livingroom: {
        ll_main: { on: true, level: 30 },
        ll_floor: { on: true, level: 50 },
        l_blinds: { on: true, level: 10 },
        l_tv: { on: true },
      },
    },
  },
  {
    id: 'sleep',
    name: 'Dobranoc',
    icon: 'bedtime',
    description: 'Wszystko gasimy, klima cicho, alarm uzbrojony',
    actions: {
      livingroom: {
        ll_main: { on: false },
        ll_floor: { on: false },
        l_tv: { on: false },
        l_blinds: { on: true, level: 0 },
      },
      bedroom: {
        b_main: { on: false },
        b_night: { on: true, level: 10 },
        b_blinds: { on: true, level: 0 },
        b_ac: { on: true, level: 19 },
      },
      kitchen: { k_main: { on: false }, k_under: { on: false } },
      bathroom: { ba_main: { on: false }, ba_mirror: { on: false } },
      hall: { h_light: { on: false } },
    },
  },
  {
    id: 'away',
    name: 'Wychodzę',
    icon: 'directions-walk',
    description: 'Wyłącz światła, zamknij rolety, uzbrój alarm',
    actions: {
      livingroom: {
        ll_main: { on: false },
        ll_floor: { on: false },
        l_tv: { on: false },
        l_ac: { on: false },
        l_blinds: { on: true, level: 0 },
      },
      bedroom: {
        b_main: { on: false },
        b_night: { on: false },
        b_ac: { on: false },
      },
      kitchen: { k_main: { on: false }, k_under: { on: false } },
      bathroom: { ba_main: { on: false }, ba_mirror: { on: false } },
      hall: { h_light: { on: false } },
    },
  },
  {
    id: 'movie',
    name: 'Kino domowe',
    icon: 'local-movies',
    description: 'Ściemnij światło, opuść rolety, TV i sound on',
    actions: {
      livingroom: {
        ll_main: { on: true, level: 10 },
        ll_floor: { on: true, level: 25 },
        l_tv: { on: true },
        l_blinds: { on: true, level: 0 },
      },
    },
  },
  {
    id: 'party',
    name: 'Impreza',
    icon: 'celebration',
    description: 'Pełne oświetlenie, klima na wyższe obroty',
    actions: {
      livingroom: {
        ll_main: { on: true, level: 100 },
        ll_floor: { on: true, level: 100 },
        l_ac: { on: true, level: 21 },
      },
      kitchen: {
        k_main: { on: true, level: 100 },
        k_under: { on: true, level: 100 },
      },
    },
  },
];

export const initialNetworks: Network[] = [
  { name: 'HomePulse_5G', kind: 'wifi', connected: true, detail: '802.11ax · -42 dBm' },
  { name: 'HomePulse_IoT', kind: 'wifi', connected: true, detail: '802.11n · pasmo 2.4 GHz' },
  { name: 'Zigbee Coordinator', kind: 'zigbee', connected: true, detail: '12 urządzeń w sieci mesh' },
  { name: 'BLE Hub', kind: 'bluetooth', connected: true, detail: 'BT 5.3 · 4 urządzenia' },
  { name: 'mqtt://broker.local', kind: 'mqtt', connected: true, detail: 'TLS · QoS 1' },
];

export const initialNotifications = (): Notification[] => {
  const now = Date.now();
  return [
    { id: 'n_welcome', title: 'HomePulse', body: 'Witaj w domu', severity: 'info', ts: now },
    { id: 'n_geo', title: 'Geofencing', body: 'Wykryto wejście do strefy: Dom', severity: 'info', ts: now - 60000 },
    { id: 'n_temp', title: 'Czujnik temperatury', body: 'Sypialnia: 20.0°C — w normie', severity: 'info', ts: now - 180000 },
  ];
};
