import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    TouchableOpacity,
    Alert
} from 'react-native'
import React, { useEffect, useState } from 'react'
import TarjetaPerfil from '../components/TarjetaPerfil'

import { onAuthStateChanged, signOut } from 'firebase/auth'
import { onValue, ref } from 'firebase/database'
import { auth, db } from '../firebase/ConfigFirebase'


export default function PerfilScreen({ navigation }: any) {

    const [nick, setNick] = useState('')
    const [correo, setCorreo] = useState('')
    const [edad, setEdad] = useState(0)
    const [cargando, setCargando] = useState(true)

    useEffect(() => {
        const cancelarAuth = onAuthStateChanged(auth, (usuarioActivo) => {

            if (!usuarioActivo) {
                setCargando(false)
                navigation.replace('Login')
                return
            }

            const usuarioRef = ref(db, `usuarios/${usuarioActivo.uid}`)

            const cancelarDatos = onValue(
                usuarioRef,
                (snapshot) => {
                    if (snapshot.exists()) {
                        const datos = snapshot.val()

                        setNick(datos.nick ?? '')
                        setCorreo(datos.correo ?? usuarioActivo.email ?? '')
                        setEdad(Number(datos.edad) || 0)
                    } else {
                        Alert.alert(
                            'Perfil no encontrado',
                            'No existen datos guardados para este usuario.'
                        )
                    }

                    setCargando(false)
                },
                (error) => {
                    console.log('Error al leer el perfil:', error)
                    Alert.alert('Error', 'No se pudieron cargar los datos del perfil.')
                    setCargando(false)
                }
            )

            return cancelarDatos
        })

        return cancelarAuth
    }, [navigation])

    async function cerrarSesion() {
        try {
            await signOut(auth)
            navigation.replace('Login')
        } catch (error) {
            console.log('Error al cerrar sesión:', error)
            Alert.alert('Error', 'No se pudo cerrar la sesión.')
        }
    }

    return (
        <ImageBackground
            source={require('../assets/images/FondoMenu.jpg')}
            style={styles.fondo}
        >
            <Text style={styles.titulo}>MI PERFIL</Text>

            <View style={styles.contenedorCentro}>
                {cargando ? (
                    <Text style={{ color: 'white', textAlign: 'center' }}>
                        Cargando perfil...
                    </Text>
                ) : (
                    <TarjetaPerfil
                        nick={nick}
                        correo={correo}
                        edad={edad}
                    />
                )}
            </View>

            <View style={styles.contenedorBotones}>
                <TouchableOpacity
                    style={styles.botonVolver}
                    onPress={() => navigation.navigate('Menu')}
                >
                    <Text style={styles.txtVolver}>VOLVER</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.botonCerrarSesion}
                    onPress={cerrarSesion}
                >
                    <Text style={styles.txtCerrarSesion}>
                        CERRAR SESION
                    </Text>
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
    },
    txtCargando: {
        color: '#ffffff',
        fontFamily: 'AmongUs',
        fontSize: 24,
        textAlign: 'center',
    }
})