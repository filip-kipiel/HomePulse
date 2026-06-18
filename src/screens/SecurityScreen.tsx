import React from 'react';
import { View, Text, ScrollView, StyleSheet, Switch } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppState } from '../state/AppState';
import { theme } from '../theme';
import { Notification, Room, Device } from '../types';

export default function SecurityScreen() {
  const { rooms, alarmArmed, privacyMode, notifications, toggleAlarm, togglePrivacy } = useAppState();

  const cameras: { room: Room; cam: Device }[] = [];
  for (const r of rooms) {
    for (const d of r.devices) {
      if (d.kind === 'camera') cameras.push({ room: r, cam: d });
    }
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: 20, paddingBottom: 24 }}>
      <Text style={styles.title}>Bezpieczeństwo</Text>
      <Text style={styles.subtitle}>Alarm, kamery i powiadomienia</Text>

      <LinearGradient
        colors={alarmArmed ? [theme.danger, '#B82B2B'] : [theme.primary, theme.primaryDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.alarmCard]}
      >
        <View style={styles.alarmIconBox}>
          <MaterialIcons name={alarmArmed ? 'shield' : 'security'} size={28} color={theme.white} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.alarmTitle}>Alarm domowy</Text>
          <Text style={styles.alarmSub}>
            {alarmArmed ? 'Uzbrojony · czujniki aktywne' : 'Rozbrojony · gotowy do aktywacji'}
          </Text>
        </View>
        <Switch
          value={alarmArmed}
          onValueChange={toggleAlarm}
          trackColor={{ false: theme.white + '55', true: theme.white + '88' }}
          thumbColor={theme.white}
        />
      </LinearGradient>

      <View style={styles.card}>
        <View style={styles.iconBox}>
          <MaterialIcons name="visibility-off" size={24} color={theme.accent} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>Tryb prywatności</Text>
          <Text style={styles.cardSub}>Wyłącz kamery wewnątrz domu</Text>
        </View>
        <Switch
          value={privacyMode}
          onValueChange={togglePrivacy}
          trackColor={{ false: '#D8DDE8', true: theme.accent + 'AA' }}
          thumbColor={privacyMode ? theme.accent : '#F0F2F8'}
        />
      </View>

      <Text style={styles.sectionTitle}>Kamery</Text>
      <View style={{ gap: 8 }}>
        {cameras.map(({ room, cam }) => (
          <CameraRow key={cam.id} room={room} cam={cam} />
        ))}
      </View>

      <Text style={styles.sectionTitle}>Aktywność</Text>
      <View style={{ gap: 8 }}>
        {notifications.slice(0, 10).map((n) => (
          <NotificationRow key={n.id} n={n} />
        ))}
      </View>
    </ScrollView>
  );
}

function CameraRow({ room, cam }: { room: Room; cam: Device }) {
  return (
    <View style={styles.camRow}>
      <View style={[styles.camIcon, { backgroundColor: cam.on ? theme.accent + '1F' : theme.primary + '12' }]}>
        <MaterialIcons
          name={cam.on ? 'videocam' : 'videocam-off'}
          size={22}
          color={cam.on ? theme.accent : theme.textMuted}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.camName}>{cam.name}</Text>
        <Text style={styles.camSub}>
          {room.name} · {cam.indoor ? 'wewnętrzna' : 'zewnętrzna'}
        </Text>
      </View>
      <View style={[styles.camStatus, { backgroundColor: cam.on ? theme.danger : theme.textMuted }]}>
        <Text style={styles.camStatusText}>{cam.on ? 'LIVE' : 'OFF'}</Text>
      </View>
    </View>
  );
}

function NotificationRow({ n }: { n: Notification }) {
  const color = n.severity === 'alert' ? theme.danger : n.severity === 'warn' ? theme.accent : theme.primary;
  const icon = n.severity === 'alert' ? 'error' : n.severity === 'warn' ? 'warning' : 'info';
  const time = new Date(n.ts).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
  return (
    <View style={styles.notif}>
      <View style={[styles.notifIcon, { backgroundColor: color + '1F' }]}>
        <MaterialIcons name={icon as keyof typeof MaterialIcons.glyphMap} size={16} color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.notifTitle}>{n.title}</Text>
        <Text style={styles.notifBody} numberOfLines={2}>
          {n.body}
        </Text>
      </View>
      <Text style={styles.notifTime}>{time}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.surface },
  title: { fontSize: 28, fontWeight: '700', color: theme.text },
  subtitle: { fontSize: 13, color: theme.textMuted, marginTop: 4 },
  alarmCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 18,
    padding: 16,
    marginTop: 18,
  },
  alarmIconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: theme.white + '33',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alarmTitle: { color: theme.white, fontSize: 16, fontWeight: '700' },
  alarmSub: { color: theme.white + 'D9', fontSize: 12, marginTop: 2 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: theme.card,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: theme.primaryDark + '14',
    marginTop: 12,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: theme.accent + '1F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: theme.text },
  cardSub: { fontSize: 12, color: theme.textMuted, marginTop: 2 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: theme.text, marginTop: 20, marginBottom: 10 },
  camRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: theme.card,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: theme.primaryDark + '14',
  },
  camIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  camName: { fontSize: 14, fontWeight: '600', color: theme.text },
  camSub: { fontSize: 11, color: theme.textMuted, marginTop: 2 },
  camStatus: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  camStatusText: { color: theme.white, fontSize: 10, fontWeight: '700' },
  notif: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: theme.card,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: theme.primaryDark + '0E',
  },
  notifIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  notifTitle: { fontSize: 13, fontWeight: '600', color: theme.text },
  notifBody: { fontSize: 11, color: theme.textMuted, marginTop: 2 },
  notifTime: { fontSize: 11, color: theme.textMuted },
});
