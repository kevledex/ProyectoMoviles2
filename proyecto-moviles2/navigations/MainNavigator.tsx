import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MenuScreen from '../screens/MenuScreen';
import { NavigationContainer } from '@react-navigation/native';
import RegistroScreen from '../screens/RegistroScreen';
import IniciarSesionScreen from '../screens/IniciarSesionScreen';
import JuegoScreen from '../screens/JuegoScreen';
import PerfilScreen from '../screens/PerfilScreen';
import SalaScreen from '../screens/SalaScreen';
import LobbyScreen from '../screens/LobbyScreen';

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
                name="Jugar"
                component={JuegoScreen}
                options={{ title: "Jugar", headerShown: false, }}
            />

        </Stack.Navigator>
    );
}



export function MainNavigator() {
    return (
        <NavigationContainer>
            <LoginStack />
        </NavigationContainer>
    );
}