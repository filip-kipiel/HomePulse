import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppState } from '../state/AppState';
import { theme, radius } from '../theme';
import { Room, Scene, RootStackParamList } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const { rooms, scenes, currentRoomId, alarmArmed, outsideTemp, userName, applyScene, setCurrentRoomId } =
    useAppState();

  const currentRoom = rooms.find((r) => r.id === currentRoomId)!;
  const activeDevices = rooms.reduce((sum, r) => sum + r.devices.filter((d) => d.on).length, 0);
  const totalDevices = rooms.reduce((sum, r) => sum + r.devices.length, 0);

  const greetingHour = new Date().getHours();
  const greeting =
    greetingHour < 5 ? 'Dobranoc' : greetingHour < 12 ? 'Dzień dobry' : greetingHour < 18 ? 'Cześć' : 'Dobry wieczór';

  const handleOpenRoom = (roomId: string) => {
    setCurrentRoomId(roomId);
    navigation.navigate('Room', { roomId });
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 24 }}>
      <LinearGradient
        colors={[theme.primaryDark, theme.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>{greeting}, {userName}</Text>
            <Text style={styles.brand}>HomePulse</Text>
          </View>
          <View style={styles.locationChip}>
            <MaterialIcons name="location-on" size={14} color={theme.white} />
            <Text style={styles.locationText}>{currentRoom.name}</Text>
          </View>
        </View>
        <View style={styles.stats}>
          <StatChip icon="thermostat" value={`${outsideTemp.toFixed(1)}°C`} label="Na zewnątrz" />
          <StatChip icon="bolt" value={`${activeDevices}/${totalDevices}`} label="Aktywne" />
          <StatChip
            icon={alarmArmed ? 'shield' : 'security'}
            value={alarmArmed ? 'Uzbrojony' : 'Rozbrojony'}
            label="Alarm"
          />
        </View>
      </LinearGradient>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Szybkie sceny</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingRight: 4 }}>
          {scenes.slice(0, 4).map((s) => (
            <SceneChip key={s.id} scene={s} onPress={() => applyScene(s.id)} />
          ))}
        </ScrollView>
      </View>

      <View style={[styles.section, { paddingBottom: 12 }]}>
        <Text style={styles.sectionTitle}>Pokoje</Text>
        <View style={styles.roomGrid}>
          {rooms.map((r) => (
            <RoomTile
              key={r.id}
              room={r}
              selected={r.id === currentRoomId}
              onPress={() => handleOpenRoom(r.id)}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

function StatChip({ icon, value, label }: { icon: string; value: string; label: string }) {
  return (
    <View style={styles.statChip}>
      <View style={styles.statRow}>
        <MaterialIcons name={icon as keyof typeof MaterialIcons.glyphMap} size={16} color={theme.white} />
        <Text style={styles.statValue}>{value}</Text>
      </View>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function SceneChip({ scene, onPress }: { scene: Scene; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.sceneChip, pressed && { opacity: 0.7 }]}>
      <View style={styles.sceneIconBox}>
        <MaterialIcons name={scene.icon as keyof typeof MaterialIcons.glyphMap} size={22} color={theme.accent} />
      </View>
      <Text style={styles.sceneName}>{scene.name}</Text>
    </Pressable>
  );
}

function RoomTile({ room, selected, onPress }: { room: Room; selected: boolean; onPress: () => void }) {
  const active = room.devices.filter((d) => d.on).length;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.roomTile,
        selected && { borderColor: theme.accent, borderWidth: 2 },
        pressed && { opacity: 0.85 },
      ]}
    >
      <View style={styles.roomTileTop}>
        <MaterialIcons name={room.icon as keyof typeof MaterialIcons.glyphMap} size={22} color={theme.primary} />
        <View style={styles.roomBadge}>
          <Text style={[styles.roomBadgeText, { color: active > 0 ? theme.accent : theme.textMuted }]}>
            {active}
          </Text>
        </View>
      </View>
      <View style={{ flex: 1 }} />
      <Text style={styles.roomName}>{room.name}</Text>
      <View style={styles.roomEnv}>
        <MaterialIcons name="thermostat" size={13} color={theme.textMuted} />
        <Text style={styles.roomEnvText}>{room.temperature.toFixed(1)}°C</Text>
        <View style={{ width: 8 }} />
        <MaterialIcons name="water-drop" size={13} color={theme.textMuted} />
        <Text style={styles.roomEnvText}>{room.humidity}%</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.surface },
  header: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  greeting: { color: theme.white + 'B3', fontSize: 14 },
  brand: { color: theme.white, fontSize: 28, fontWeight: '700', marginTop: 2 },
  locationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.white + '26',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  locationText: { color: theme.white, fontSize: 12, fontWeight: '500' },
  stats: { flexDirection: 'row', gap: 10 },
  statChip: {
    flex: 1,
    backgroundColor: theme.white + '1F',
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  statRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statValue: { color: theme.white, fontSize: 15, fontWeight: '700' },
  statLabel: { color: theme.white + 'B3', fontSize: 11, marginTop: 2 },
  section: { paddingHorizontal: 20, paddingTop: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: theme.text, marginBottom: 12 },
  sceneChip: {
    width: 92,
    backgroundColor: theme.card,
    borderRadius: radius.lg,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: theme.primaryDark + '14',
    alignItems: 'center',
    gap: 8,
  },
  sceneIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: theme.accent + '1F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sceneName: { fontSize: 12, fontWeight: '600', color: theme.text, textAlign: 'center' },
  roomGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  roomTile: {
    width: '48%',
    minHeight: 120,
    backgroundColor: theme.card,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: theme.primaryDark + '14',
  },
  roomTileTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  roomBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: theme.accent + '1F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roomBadgeText: { fontSize: 11, fontWeight: '700' },
  roomName: { fontSize: 16, fontWeight: '700', color: theme.text, marginTop: 8 },
  roomEnv: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 4 },
  roomEnvText: { color: theme.textMuted, fontSize: 12 },
});
