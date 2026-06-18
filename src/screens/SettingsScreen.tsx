import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppState } from '../state/AppState';
import { theme } from '../theme';
import { Network } from '../types';

const KIND_ICON: Record<Network['kind'], keyof typeof MaterialIcons.glyphMap> = {
  wifi: 'wifi',
  bluetooth: 'bluetooth',
  zigbee: 'hub',
  mqtt: 'cloud',
};

const KIND_LABEL: Record<Network['kind'], string> = {
  wifi: 'Wi-Fi',
  bluetooth: 'Bluetooth',
  zigbee: 'Zigbee',
  mqtt: 'MQTT',
};

export default function SettingsScreen() {
  const { networks, userName } = useAppState();

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: 20, paddingBottom: 32 }}>
      <Text style={styles.title}>Ustawienia</Text>

      <View style={styles.userCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{userName[0].toUpperCase()}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.userSub}>Uwierzytelnienie NFC · aktywne</Text>
        </View>
        <MaterialIcons name="chevron-right" size={24} color={theme.textMuted} />
      </View>

      <LinearGradient
        colors={[theme.primaryDark, theme.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.archCard}
      >
        <Text style={styles.archTitle}>Architektura aplikacji</Text>
        <Text style={styles.archSub}>HomePulse to thick-client (gruby klient) z warstwą messaging:</Text>
        <View style={{ marginTop: 10, gap: 6 }}>
          <ArchBullet text="Lokalne przetwarzanie i interfejs natywny" />
          <ArchBullet text="Komunikacja MQTT (store-and-forward) z hubem" />
          <ArchBullet text="Synchronizacja stanu z chmurą w tle" />
          <ArchBullet text="Powiadomienia push: model application-to-user" />
          <ArchBullet text="Sieci: Wi-Fi, Bluetooth, Zigbee (mesh)" />
        </View>
      </LinearGradient>

      <Text style={styles.sectionTitle}>Łączność bezprzewodowa</Text>
      <Text style={styles.sectionSub}>Sieci wykorzystywane przez HomePulse</Text>
      <View style={{ gap: 8, marginTop: 10 }}>
        {networks.map((n) => (
          <NetworkRow key={n.name} network={n} />
        ))}
      </View>

      <Text style={styles.footer}>HomePulse v0.1 · projekt kursu Systemy Mobilne</Text>
    </ScrollView>
  );
}

function ArchBullet({ text }: { text: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      <MaterialIcons name="check-circle" size={14} color={theme.accentSoft} />
      <Text style={{ color: theme.white, fontSize: 12, flex: 1 }}>{text}</Text>
    </View>
  );
}

function NetworkRow({ network }: { network: Network }) {
  const dot = network.connected ? theme.success : theme.textMuted;
  return (
    <View style={styles.netRow}>
      <View style={styles.netIcon}>
        <MaterialIcons name={KIND_ICON[network.kind]} size={22} color={theme.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={styles.netName}>{network.name}</Text>
          <View style={styles.kindTag}>
            <Text style={styles.kindTagText}>{KIND_LABEL[network.kind].toUpperCase()}</Text>
          </View>
        </View>
        <Text style={styles.netDetail}>{network.detail}</Text>
      </View>
      <View style={[styles.dot, { backgroundColor: dot }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.surface },
  title: { fontSize: 28, fontWeight: '700', color: theme.text },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: theme.card,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: theme.primaryDark + '14',
    marginTop: 18,
  },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: theme.accent, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: theme.white, fontSize: 22, fontWeight: '700' },
  userName: { fontSize: 16, fontWeight: '700', color: theme.text },
  userSub: { fontSize: 12, color: theme.textMuted, marginTop: 2 },
  archCard: { borderRadius: 18, padding: 18, marginTop: 18 },
  archTitle: { color: theme.white, fontSize: 16, fontWeight: '700' },
  archSub: { color: theme.white + 'D9', fontSize: 12, marginTop: 6 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: theme.text, marginTop: 18 },
  sectionSub: { fontSize: 12, color: theme.textMuted, marginTop: 2 },
  netRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: theme.card,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: theme.primaryDark + '14',
  },
  netIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: theme.primary + '14', alignItems: 'center', justifyContent: 'center' },
  netName: { fontSize: 14, fontWeight: '600', color: theme.text },
  netDetail: { fontSize: 11, color: theme.textMuted, marginTop: 2 },
  kindTag: { backgroundColor: theme.primary + '14', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  kindTagText: { fontSize: 9, color: theme.primary, fontWeight: '700' },
  dot: { width: 10, height: 10, borderRadius: 5 },
  footer: { textAlign: 'center', fontSize: 11, color: theme.textMuted, marginTop: 24 },
});
