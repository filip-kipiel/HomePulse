export type DeviceKind = 'light' | 'ac' | 'blinds' | 'camera' | 'outlet';
export type IconName = string; // MaterialIcons names

export interface Device {
  id: string;
  name: string;
  kind: DeviceKind;
  icon: IconName;
  on: boolean;
  level: number; // 0-100, dla ac: 16-30 (stopnie C)
  indoor?: boolean; // tylko dla kamer
}

export interface Room {
  id: string;
  name: string;
  icon: IconName;
  temperature: number;
  humidity: number;
  devices: Device[];
}

export interface Scene {
  id: string;
  name: string;
  icon: IconName;
  description: string;
  actions: Record<string, Record<string, { on?: boolean; level?: number }>>;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  severity: 'info' | 'warn' | 'alert';
  ts: number; // timestamp
}

export interface Network {
  name: string;
  kind: 'wifi' | 'bluetooth' | 'zigbee' | 'mqtt';
  connected: boolean;
  detail: string;
}

export type RootStackParamList = {
  HomeTabs: undefined;
  Room: { roomId: string };
};

export type TabParamList = {
  Home: undefined;
  Scenes: undefined;
  Security: undefined;
  Settings: undefined;
};
