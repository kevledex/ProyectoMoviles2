import { StyleSheet, Text, View, ImageBackground, TouchableOpacity } from 'react-native'
import React from 'react'
import TarjetaPerfil from '../components/TarjetaPerfil'

export default function PerfilScreen({ navigation }: any) {
    return (
        <ImageBackground source={require('../assets/images/FondoMenu.jpg')} style={styles.fondo}>

            <Text style={styles.titulo}>MI PERFIL</Text>

            <View style={styles.contenedorCentro}>
                <TarjetaPerfil />
            </View>

            <View style={styles.contenedorBotones}>
                <TouchableOpacity
                    style={styles.botonVolver}
                    onPress={() => navigation.navigate('Menu')}>
                    <Text style={styles.txtVolver}>VOLVER</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.botonCerrarSesion}>
                    <Text style={styles.txtCerrarSesion}>CERRAR SESION</Text>
                </TouchableOpacity>
            </View>

        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    fondo: {
        flex: 1,
    },
    titulo: {
        color: '#ffffff',
        fontSize: 50,
        fontFamily: 'AmongUs',
        textAlign: 'center',
        marginTop: 40,
        marginBottom: 10,
    },
    contenedorCentro: {
        flex: 1,
        justifyContent: 'center',
    },
    contenedorBotones: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    botonVolver: {
        borderColor: '#ffffff',
        borderWidth: 2,
        borderRadius: 10,
        margin: 10,
        height: 50,
        width: 130,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00000088',
    },
    txtVolver: {
        color: '#ffffff',
        fontFamily: 'AmongUs',
        fontSize: 24,
    },
    botonCerrarSesion: {
        borderColor: '#ff3333',
        borderWidth: 2,
        borderRadius: 10,
        margin: 10,
        height: 50,
        width: 170,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00000088',
    },
    txtCerrarSesion: {
        color: '#ff3333',
        fontFamily: 'AmongUs',
        fontSize: 20,
    }
})