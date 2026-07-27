import { StyleSheet, Text, View, TouchableOpacity, FlatList, ImageBackground, Alert, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getDatabase, ref, onValue, remove, update } from 'firebase/database'
import { auth } from '../firebase/ConfigFirebase'

export default function Lobby({ route, navigation }: any) {
    const { codigoSala, esHost } = route.params
    const [jugadores, setJugadores] = useState<any[]>([])

    useEffect(() => {
        const db = getDatabase()
        const salaRef = ref(db, 'salas/' + codigoSala)

        const unsubscribe = onValue(salaRef, (snapshot) => {
            if (!snapshot.exists()) {
                Alert.alert("Sala cerrada", "La sala ya no está disponible.")
                navigation.navigate('Sala')
                return
            }

            const datos = snapshot.val()
            const dataJugadores = datos.jugadores || {}
            const lista = Object.keys(dataJugadores).map((key) => ({
                id: key,
                ...dataJugadores[key]
            }))
            setJugadores(lista)

            if (datos.estado === 'jugando') {
                navigation.navigate('Juego', { codigoSala: codigoSala })
            }
        })

        return () => unsubscribe()
    }, [])

    function iniciarPartida() {
        if (jugadores.length < 2) {
            Alert.alert("Faltan jugadores", "Necesitas 2 jugadores para empezar")
            return
        }

        const db = getDatabase()
        const updates: any = {}
        updates['salas/' + codigoSala + '/estado'] = 'jugando'

        jugadores.forEach((jugador) => {
            updates['salas/' + codigoSala + '/jugadores/' + jugador.id + '/vida'] = 100
            updates['salas/' + codigoSala + '/jugadores/' + jugador.id + '/aciertos'] = 0
        })

        update(ref(db), updates)
    }

    function salirLobby() {
        const db = getDatabase()
        const currentUser = auth.currentUser

        if (esHost) {
            remove(ref(db, 'salas/' + codigoSala))
        } else if (currentUser) {
            remove(ref(db, 'salas/' + codigoSala + '/jugadores/' + currentUser.uid))
        }
        navigation.navigate('Sala')
    }

    return (
        <ImageBackground source={require('../assets/images/FondoLobby.png')} style={styles.fondo}>
            <Text style={styles.tituloSala}>CÓDIGO: {codigoSala}</Text>

            <FlatList
                contentContainerStyle={styles.listaContenedor}
                data={jugadores}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.tarjetaJugador}>
                        <Image
                            source={require('../assets/images/LobbyAvatar.png')}
                            style={styles.avatar}
                        />
                        <Text style={styles.txtJugador}>{item.nick}</Text>
                    </View>
                )}
            />

            <View style={styles.contenedorBotones}>
                <TouchableOpacity style={[styles.boton, styles.botonSalir]} onPress={salirLobby}>
                    <Text style={styles.txtBoton}>SALIR</Text>
                </TouchableOpacity>

                {esHost && (
                    <TouchableOpacity style={[styles.boton, styles.botonIniciar]} onPress={iniciarPartida}>
                        <Text style={styles.txtBoton}>INICIAR</Text>
                    </TouchableOpacity>
                )}
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    fondo: {
        flex: 1,
        padding: 20,
        alignItems: 'center'
    },
    tituloSala: {
        color: '#01ff01',
        fontSize: 40,
        fontFamily: 'AmongUs',
        marginTop: 30,
        marginBottom: 20
    },
    listaContenedor: {
        alignItems: 'center',
        paddingBottom: 20,
        width: '100%'
    },
    tarjetaJugador: {
        flexDirection: 'row',
        backgroundColor: 'rgba(40, 40, 40, 0.8)',
        padding: 10,
        marginVertical: 5,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center'
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 5,
        marginRight: 15
    },
    txtJugador: {
        fontSize: 25,
        fontFamily: 'AmongUs',
        color: '#ffffff'
    },
    contenedorBotones: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 40,
        justifyContent: 'space-evenly',
        width: '100%'
    },
    boton: {
        width: 140,
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    botonSalir: {
        backgroundColor: 'rgba(255, 0, 0, 0.8)'
    },
    botonIniciar: {
        backgroundColor: 'rgba(0, 180, 0, 0.8)'
    },
    txtBoton: {
        color: '#ffffff',
        fontSize: 25,
        fontFamily: 'AmongUs'
    }
})