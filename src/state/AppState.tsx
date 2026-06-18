import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Room, Scene, Network, Notification } from '../types';
import {
  initialRooms,
  initialScenes,
  initialNetworks,
  initialNotifications,
} from './initial';

interface AppStateValue {
  rooms: Room[];
  scenes: Scene[];
  notifications: Notification[];
  networks: Network[];
  currentRoomId: string;
  alarmArmed: boolean;
  privacyMode: boolean;
  userName: string;
  outsideTemp: number;
  setCurrentRoomId: (id: string) => void;
  toggleDevice: (roomId: string, deviceId: string) => void;
  setDeviceLevel: (roomId: string, deviceId: string, level: number) => void;
  applyScene: (sceneId: string) => void;
  toggleAlarm: () => void;
  togglePrivacy: () => void;
}

const AppStateContext = createContext<AppStateValue | undefined>(undefined);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [scenes] = useState<Scene[]>(initialScenes);
  const [networks] = useState<Network[]>(initialNetworks);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications());
  const [currentRoomId, setCurrentRoomId] = useState<string>(initialRooms[0].id);
  const [alarmArmed, setAlarmArmed] = useState(false);
  const [privacyMode, setPrivacyMode] = useState(false);
  const userName = 'Filip';
  const outsideTemp = 12.5;

  const pushNotification = useCallback(
    (title: string, body: string, severity: Notification['severity'] = 'info') => {
      setNotifications((prev) =>
        [
          { id: `n_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, title, body, severity, ts: Date.now() },
          ...prev,
        ].slice(0, 30)
      );
    },
    []
  );

  const toggleDevice = useCallback(
    (roomId: string, deviceId: string) => {
      setRooms((prev) =>
        prev.map((r) =>
          r.id !== roomId
            ? r
            : {
                ...r,
                devices: r.devices.map((d) =>
                  d.id !== deviceId
                    ? d
                    : {
                        ...d,
                        on: !d.on,
                      }
                ),
              }
        )
      );
      const room = rooms.find((r) => r.id === roomId);
      const device = room?.devices.find((d) => d.id === deviceId);
      if (device) {
        pushNotification(device.name, `Stan zmieniony na: ${!device.on ? 'WŁ' : 'WYŁ'}`);
      }
    },
    [rooms, pushNotification]
  );

  const setDeviceLevel = useCallback((roomId: string, deviceId: string, level: number) => {
    setRooms((prev) =>
      prev.map((r) =>
        r.id !== roomId
          ? r
          : {
              ...r,
              devices: r.devices.map((d) =>
                d.id !== deviceId
                  ? d
                  : {
                      ...d,
                      level,
                      on: level > 0 ? true : d.on,
                    }
              ),
            }
      )
    );
  }, []);

  const applyScene = useCallback(
    (sceneId: string) => {
      const scene = scenes.find((s) => s.id === sceneId);
      if (!scene) return;
      setRooms((prev) =>
        prev.map((r) => {
          const roomActions = scene.actions[r.id];
          if (!roomActions) return r;
          return {
            ...r,
            devices: r.devices.map((d) => {
              const a = roomActions[d.id];
              if (!a) return d;
              return {
                ...d,
                on: a.on !== undefined ? a.on : d.on,
                level: a.level !== undefined ? a.level : d.level,
              };
            }),
          };
        })
      );
      pushNotification('Scena aktywowana', `Włączono scenę: ${scene.name}`, 'info');
    },
    [scenes, pushNotification]
  );

  const toggleAlarm = useCallback(() => {
    setAlarmArmed((prev) => {
      const next = !prev;
      pushNotification('System alarmowy', next ? 'Uzbrojono' : 'Rozbrojono', next ? 'alert' : 'info');
      return next;
    });
  }, [pushNotification]);

  const togglePrivacy = useCallback(() => {
    setPrivacyMode((prev) => {
      const next = !prev;
      setRooms((prevRooms) =>
        prevRooms.map((r) => ({
          ...r,
          devices: r.devices.map((d) =>
            d.kind === 'camera' && d.indoor ? { ...d, on: !next } : d
          ),
        }))
      );
      pushNotification(
        'Tryb prywatności',
        next ? 'Kamery wewnętrzne WYŁĄCZONE' : 'Kamery wewnętrzne aktywne',
        next ? 'warn' : 'info'
      );
      return next;
    });
  }, [pushNotification]);

  const value: AppStateValue = {
    rooms,
    scenes,
    notifications,
    networks,
    currentRoomId,
    alarmArmed,
    privacyMode,
    userName,
    outsideTemp,
    setCurrentRoomId,
    toggleDevice,
    setDeviceLevel,
    applyScene,
    toggleAlarm,
    togglePrivacy,
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppStateValue {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used inside AppStateProvider');
  return ctx;
}
