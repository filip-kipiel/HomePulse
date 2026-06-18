import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AppStateProvider } from './src/state/AppState';
import { theme } from './src/theme';
import HomeScreen from './src/screens/HomeScreen';
import RoomScreen from './src/screens/RoomScreen';
import ScenesScreen from './src/screens/ScenesScreen';
import SecurityScreen from './src/screens/SecurityScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { RootStackParamList, TabParamList } from './src/types';

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.primaryDark + '14',
          height: 64,
          paddingTop: 6,
          paddingBottom: 10,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ color, size }) => {
          const map: Record<keyof TabParamList, keyof typeof MaterialIcons.glyphMap> = {
            Home: 'home',
            Scenes: 'auto-awesome',
            Security: 'shield',
            Settings: 'settings',
          };
          return <MaterialIcons name={map[route.name]} size={size ?? 22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Dom' }} />
      <Tab.Screen name="Scenes" component={ScenesScreen} options={{ title: 'Sceny' }} />
      <Tab.Screen name="Security" component={SecurityScreen} options={{ title: 'Ochrona' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Ustawienia' }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppStateProvider>
        <NavigationContainer>
          <StatusBar style="light" />
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="HomeTabs" component={HomeTabs} />
            <Stack.Screen
              name="Room"
              component={RoomScreen}
              options={{ headerShown: false, animation: 'slide_from_right' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </AppStateProvider>
    </GestureHandlerRootView>
  );
}
