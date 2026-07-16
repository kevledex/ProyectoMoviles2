import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MenuScreen from '../screens/MenuScreen';
import { NavigationContainer } from '@react-navigation/native';

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
                options={{ title: "Lobby", headerTransparent: true, headerTintColor: '#ffffff' }}
            />

            <Stack.Screen name="Perfil" component={MenuScreen}
                options={{ title: "Mi Perfil" }}
            />

            <Stack.Screen name="Juego" component={JuegoTabs}
                options={{ headerShown: false, }}
            />

            <Stack.Screen name="Resultados" component={MenuScreen}
                options={{ headerShown: false }}
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