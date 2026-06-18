import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppState } from '../state/AppState';
import { theme } from '../theme';
import { Scene } from '../types';

export default function ScenesScreen() {
  const { scenes, applyScene } = useAppState();

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: 20, paddingBottom: 24 }}>
      <Text style={styles.title}>Sceny</Text>
      <Text style={styles.subtitle}>Kliknij scenę, by uruchomić zestaw automatyzacji</Text>

      <View style={{ gap: 12, marginTop: 18 }}>
        {scenes.map((s) => (
          <SceneCard key={s.id} scene={s} onApply={() => applyScene(s.id)} />
        ))}
      </View>
    </ScrollView>
  );
}

function SceneCard({ scene, onApply }: { scene: Scene; onApply: () => void }) {
  return (
    <View style={styles.card}>
      <View style={styles.iconBox}>
        <MaterialIcons name={scene.icon as keyof typeof MaterialIcons.glyphMap} size={26} color={theme.accent} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{scene.name}</Text>
        <Text style={styles.desc} numberOfLines={2}>
          {scene.description}
        </Text>
      </View>
      <Pressable onPress={onApply} style={({ pressed }) => [styles.run, pressed && { opacity: 0.8 }]}>
        <MaterialIcons name="play-arrow" size={16} color={theme.white} />
        <Text style={styles.runText}>Uruchom</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.surface },
  title: { fontSize: 28, fontWeight: '700', color: theme.text },
  subtitle: { fontSize: 13, color: theme.textMuted, marginTop: 4 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: theme.card,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: theme.primaryDark + '14',
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: theme.accent + '1F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { fontSize: 16, fontWeight: '700', color: theme.text },
  desc: { fontSize: 12, color: theme.textMuted, marginTop: 2 },
  run: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.accent,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  runText: { color: theme.white, fontSize: 12, fontWeight: '600' },
});
