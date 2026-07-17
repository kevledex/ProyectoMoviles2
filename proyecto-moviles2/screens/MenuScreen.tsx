import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { globalStyles } from '../styles/EstilosGlobales'

export default function MenuScreen({ navigation }: any) {
    return (
        <ImageBackground source={require('../assets/images/FondoMenu.jpg')} style={globalStyles.container}>

            <View style={styles.contenedorMenu}>

                <Text style={styles.titulo}>AMONG US!</Text>

                <View style={styles.contenedorBotones}>

                    <View style={styles.filaBotones}>
                        <TouchableOpacity style={styles.boton}
                            onPress={() => navigation.navigate('InicioSecion')}>
                            <Text style={styles.txtMenu}>JUGAR</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.boton}
                            onPress={() => navigation.navigate('Perfil')}>
                            <Text style={styles.txtMenu}>PERFIL</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.boton}
                        onPress={() => navigation.navigate('Registrar')}>
                        <Text style={styles.txtMenu}>Registrarse </Text>
                    </TouchableOpacity>

                </View>

            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    contenedorMenu: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 80,
    },
    titulo: {
        color: '#ffffff',
        fontSize: 90,
        marginTop: 20,
        fontFamily: 'AmongUs'
    },
    contenedorBotones: {
        alignItems: 'center',
    },
    filaBotones: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    txtMenu: {
        color: '#ffffff',
        fontSize: 40,
        fontFamily: 'AmongUs'
    },
    boton: {
        borderColor: '#ffffff',
        borderWidth: 2,
        width: 140,
        height: 55,
        borderRadius: 10,
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center'
    }
})