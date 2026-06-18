import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppState } from '../state/AppState';
import { theme } from '../theme';
import DeviceCard from '../components/DeviceCard';
import { RootStackParamList } from '../types';

export default function RoomScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'Room'>>();
  const { rooms } = useAppState();

  const room = rooms.find((r) => r.id === route.params.roomId);
  if (!room) return null;
  const activeCount = room.devices.filter((d) => d.on).length;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 24 }}>
      <LinearGradient
        colors={[theme.primaryDark, theme.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.topRow}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={8} style={styles.backBtn}>
            <MaterialIcons name="arrow-back" size={24} color={theme.white} />
          </Pressable>
          <Pressable hitSlop={8}>
            <MaterialIcons name="more-horiz" size={22} color={theme.white} />
          </Pressable>
        </View>

        <View style={styles.title}>
          <View style={styles.titleIcon}>
            <MaterialIcons
              name={room.icon as keyof typeof MaterialIcons.glyphMap}
              size={32}
              color={theme.white}
            />
          </View>
          <View>
            <Text style={styles.titleText}>{room.name}</Text>
            <Text style={styles.titleSub}>
              {activeCount} z {room.devices.length} urządzeń aktywnych
            </Text>
          </View>
        </View>

        <View style={styles.envRow}>
          <EnvChip icon="thermostat" value={`${room.temperature.toFixed(1)}°C`} label="Temperatura" />
          <EnvChip icon="water-drop" value={`${room.humidity}%`} label="Wilgotność" />
          <EnvChip
            icon={activeCount > 0 ? 'wifi' : 'wifi-off'}
            value={activeCount > 0 ? 'Online' : 'Czuwa'}
            label="Status"
          />
        </View>
      </LinearGradient>

      <View style={styles.body}>
        <View style={styles.bodyHead}>
          <Text style={styles.bodyTitle}>Urządzenia</Text>
          <Text style={styles.bodyCount}>{room.devices.length} urządzeń</Text>
        </View>
        <View style={{ gap: 10 }}>
          {room.devices.map((d) => (
            <DeviceCard key={d.id} roomId={room.id} device={d} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

function EnvChip({ icon, value, label }: { icon: string; value: string; label: string }) {
  return (
    <View style={styles.envChip}>
      <View style={styles.envChipRow}>
        <MaterialIcons name={icon as keyof typeof MaterialIcons.glyphMap} size={15} color={theme.white} />
        <Text style={styles.envValue}>{value}</Text>
      </View>
      <Text style={styles.envLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.surface },
  header: {
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 22,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  backBtn: { padding: 4 },
  title: { flexDirection: 'row', alignItems: 'center', gap: 14, marginVertical: 6 },
  titleIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: theme.white + '2E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: { color: theme.white, fontSize: 26, fontWeight: '700' },
  titleSub: { color: theme.white + 'B3', fontSize: 13, marginTop: 2 },
  envRow: { flexDirection: 'row', gap: 10, marginTop: 18 },
  envChip: { flex: 1, backgroundColor: theme.white + '24', borderRadius: 12, paddingVertical: 8, paddingHorizontal: 10 },
  envChipRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  envValue: { color: theme.white, fontSize: 14, fontWeight: '700' },
  envLabel: { color: theme.white + 'A0', fontSize: 10, marginTop: 2 },
  body: { paddingHorizontal: 20, paddingTop: 18 },
  bodyHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  bodyTitle: { fontSize: 16, fontWeight: '700', color: theme.text },
  bodyCount: { fontSize: 12, color: theme.textMuted },
});
