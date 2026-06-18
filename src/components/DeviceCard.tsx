import React from 'react';
import { View, Text, StyleSheet, Pressable, Switch } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Device } from '../types';
import { theme, radius } from '../theme';
import { useAppState } from '../state/AppState';

interface Props {
  roomId: string;
  device: Device;
}

export default function DeviceCard({ roomId, device }: Props) {
  const { toggleDevice, setDeviceLevel } = useAppState();
  const hasLevel = device.kind === 'light' || device.kind === 'ac' || device.kind === 'blinds';
  const isAc = device.kind === 'ac';
  const step = isAc ? 1 : 10;
  const min = isAc ? 16 : 0;
  const max = isAc ? 30 : 100;
  const unit = isAc ? '°C' : '%';

  const adjust = (delta: number) => {
    const nextLevel = Math.max(min, Math.min(max, device.level + delta));
    setDeviceLevel(roomId, device.id, nextLevel);
  };

  return (
    <View style={[styles.card, device.on && styles.cardActive]}>
      <View style={styles.row}>
        <View style={[styles.iconBox, { backgroundColor: device.on ? theme.accent + '22' : theme.primary + '12' }]}>
          <MaterialIcons
            name={device.icon as keyof typeof MaterialIcons.glyphMap}
            size={22}
            color={device.on ? theme.accent : theme.textMuted}
          />
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.name}>{device.name}</Text>
          <Text style={styles.subtitle}>
            {device.on ? (hasLevel ? `${device.level}${unit}` : 'WŁ') : 'WYŁ'}
          </Text>
        </View>
        <Switch
          value={device.on}
          onValueChange={() => toggleDevice(roomId, device.id)}
          trackColor={{ false: '#D8DDE8', true: theme.accent + 'AA' }}
          thumbColor={device.on ? theme.accent : '#F0F2F8'}
        />
      </View>

      {hasLevel && device.on ? (
        <View style={styles.controls}>
          <Pressable
            onPress={() => adjust(-step)}
            style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
          >
            <MaterialIcons name="remove" size={18} color={theme.primary} />
          </Pressable>
          <View style={styles.bar}>
            <View
              style={[
                styles.barFill,
                {
                  width: `${((device.level - min) / (max - min)) * 100}%`,
                },
              ]}
            />
          </View>
          <Pressable
            onPress={() => adjust(step)}
            style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
          >
            <MaterialIcons name="add" size={18} color={theme.primary} />
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.surface,
    borderRadius: radius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: theme.primaryDark + '12',
  },
  cardActive: {
    backgroundColor: theme.accent + '0F',
    borderColor: theme.accent + '33',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontWeight: '600',
    fontSize: 14,
    color: theme.text,
  },
  subtitle: {
    fontSize: 12,
    color: theme.textMuted,
    marginTop: 2,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 10,
  },
  btn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.primary + '33',
    backgroundColor: theme.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPressed: {
    backgroundColor: theme.primary + '15',
  },
  bar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.primary + '22',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: theme.accent,
  },
});
