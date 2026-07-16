import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { MainNavigator } from './navigations/MainNavigator';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';

export default function App() {

  const [fontsLoaded] = useFonts({
    'AmongUs': require('./assets/fonts/Brook-Demo.otf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <MainNavigator />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
