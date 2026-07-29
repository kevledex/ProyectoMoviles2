import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MenuScreen from '../screens/MenuScreen';
import { NavigationContainer } from '@react-navigation/native';
import RegistroScreen from '../screens/RegistroScreen';
import IniciarSesionScreen from '../screens/IniciarSesionScreen';
import JuegoScreen from '../screens/JuegoScreen';
import PerfilScreen from '../screens/PerfilScreen';
import SalaScreen from '../screens/SalaScreen';
import LobbyScreen from '../screens/LobbyScreen';
import ResultadosScreen from '../screens/ResultadosScreen';
import { useAudioPlayer } from 'expo-audio';
import { useEffect, useState } from 'react';

const musicaFondo = require('../assets/audio/AmongUsSpaceTheme.mp3');

const Tab = createNativeStackNavigator();
const Stack = createNativeStackNavigator();

function LoginStack() {
    return (
        <Stack.Navigator initialRouteName="Login">

            <Stack.Screen name="Login" component={IniciarSesionScreen}
                options={{ headerShown: false }}
            />

            <Stack.Screen name="Registro" component={RegistroScreen}
                options={{ headerShown: false }}
            />

            <Stack.Screen name="Menu" component={GameStack}
                options={{ headerShown: false }}
            />

        </Stack.Navigator>
    );
}

function GameStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="Menu"
                component={MenuScreen}
                options={{ title: "Menu", headerShown: false }}
            />

            <Stack.Screen
                name="Sala"
                component={SalaScreen}
                options={{ title: "Sala", headerShown: false, }}
            />

            <Stack.Screen
                name="Lobby"
                component={LobbyScreen}
                options={{ title: "Lobby", headerShown: false, }}
            />

            <Stack.Screen
                name="Perfil"
                component={PerfilScreen}
                options={{ title: "Perfil", headerShown: false, }}
            />

            <Stack.Screen
                name="Juego"
                component={JuegoScreen}
                options={{ title: "Jugar", headerShown: false, }}
            />

            <Stack.Screen
                name="Resultados"
                component={ResultadosScreen}
                options={{ title: "Resultados", headerShown: false, }}
            />

        </Stack.Navigator>
    );
}

function obtenerPantallaActual(estado: any): string {
    if (!estado) return ''

    const ruta = estado.routes[estado.index]

    if (ruta.state) {
        return obtenerPantallaActual(ruta.state)
    }

    return ruta.name
}

export function MainNavigator() {
    const player = useAudioPlayer(musicaFondo)
    const [pantallaActual, setPantallaActual] = useState('')

    useEffect(() => {
        player.loop = true
        player.play()
    }, [])

    useEffect(() => {
        if (pantallaActual == 'Juego') {
            player.pause()
        } else {
            player.play()
        }
    }, [pantallaActual])

    return (
        <NavigationContainer
            onStateChange={(estado) => setPantallaActual(obtenerPantallaActual(estado))}
        >
            <LoginStack />
        </NavigationContainer>
    );
}
