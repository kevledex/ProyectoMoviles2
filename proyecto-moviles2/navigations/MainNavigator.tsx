import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MenuScreen from '../screens/MenuScreen';
import { NavigationContainer } from '@react-navigation/native';
import RegistroScreen from '../screens/RegistroScreen';
import IniciarSesionScreen from '../screens/IniciarSesionScreen';
import JuegoScreen from '../screens/JuegoScreen';
import PerfilScreen from '../screens/PerfilScreen';

const Tab = createNativeStackNavigator();
const Stack = createNativeStackNavigator();

function JuegoTabs() {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen name="Acciones" component={MenuScreen}
                options={{ title: "Menu" }}
            />
            <Tab.Screen name="Discusion" component={MenuScreen}
                options={{ title: "Discusión" }}
            />
        </Tab.Navigator>
    );
}

function MyStack() {
    return (
        <Stack.Navigator initialRouteName="Menu">

            <Stack.Screen name="Menu" component={MenuScreen}
                options={{ title: "Lobby", headerShown: false }}
            />

            <Stack.Screen
                name="InicioSecion"
                component={IniciarSesionScreen}
                options={{ title: "Iniciar sesión", headerShown: false, }}
            />

            <Stack.Screen
                name="Registrar"
                component={RegistroScreen}
                options={{ title: "Registrar perfil", headerShown: false, }}
            />

            <Stack.Screen
                name="Jugar"
                component={JuegoScreen}
                options={{ title: "Jugar", headerShown: false, }}
            />

            <Stack.Screen
                name="Perfil"
                component={PerfilScreen}
                options={{ title: "Perfil", headerShown: false, }}
            />

            <Stack.Screen name="Juego" component={JuegoTabs}
                options={{ headerShown: false, }}
            />


        </Stack.Navigator>
    );
}

export function MainNavigator() {
    return (
        <NavigationContainer>
            <MyStack />
        </NavigationContainer>
    );
}