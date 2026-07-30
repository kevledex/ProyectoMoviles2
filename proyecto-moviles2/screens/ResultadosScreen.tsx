import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { getDatabase, ref, get, set } from 'firebase/database'
import { auth } from '../firebase/ConfigFirebase'
import { useAudioPlayer } from 'expo-audio'

const PUNTOS_POR_ACIERTO = 5
const PUNTOS_GANADOR = 50
const PUNTOS_PARTICIPACION = 10

const sonidoVictoria = require('../assets/audio/Victoria.mp3')
const sonidoDerrota = require('../assets/audio/Derrota.mp3')

export default function ResultadosScreen({ route, navigation }: any) {
    const { codigoSala } = route.params
    const uid = auth.currentUser?.uid

    const [datos, setDatos] = useState<any>(null)
    const [puntosGanados, setPuntosGanados] = useState(0)
    const yaGuardado = useRef(false)
    const yaSono = useRef(false)
    const activo = useRef(true)

    const playerVictoria = useAudioPlayer(sonidoVictoria)
    const playerDerrota = useAudioPlayer(sonidoDerrota)

    useEffect(() => {
        const db = getDatabase()
        const salaRef = ref(db, 'salas/' + codigoSala)

        get(salaRef).then((snapshot) => {
            if (!snapshot.exists()) return
            const valor = snapshot.val()
            setDatos(valor)
            guardarPuntos(valor)
            reproducirResultado(valor.ganador === uid)
        })

        return () => {
            activo.current = false
        }
    }, [])

    function reproducirResultado(gano: boolean) {
        if (yaSono.current || !activo.current) return
        yaSono.current = true

        try {
            const player = gano ? playerVictoria : playerDerrota
            player.seekTo(0)
            player.play()
        } catch (error) {
        }
    }

    async function guardarPuntos(valor: any) {
        if (yaGuardado.current || !uid) return
        yaGuardado.current = true

        const miDato = valor.jugadores[uid]
        const gane = valor.ganador === uid
        const aciertos = miDato?.aciertos || 0

        const puntosBase = gane ? PUNTOS_GANADOR : PUNTOS_PARTICIPACION
        const total = puntosBase + (aciertos * PUNTOS_POR_ACIERTO)
        setPuntosGanados(total)

        const db = getDatabase()
        const usuarioRef = ref(db, 'usuarios/' + uid)
        const snapshotUsuario = await get(usuarioRef)
        const usuarioActual = snapshotUsuario.val() || {}
        const puntosPrevios = usuarioActual.puntos || 0

        set(ref(db, 'usuarios/' + uid + '/puntos'), puntosPrevios + total)
    }

    if (!datos || !uid) {
        return (
            <View style={styles.cargando}>
                <Text style={styles.txtCargando}>Cargando resultados...</Text>
            </View>
        )
    }

    const gane = datos.ganador === uid
    const misAciertos = datos.jugadores[uid]?.aciertos || 0

    return (
        <ImageBackground
            source={gane
                ? require('../assets/images/FondoGanaste.png')
                : require('../assets/images/FondoPerdiste.png')}
            style={styles.fondo}
        >
            <Text style={[styles.txtResultado, gane ? styles.txtGano : styles.txtPerdio]}>
                {gane ? "GANASTE" : "PERDISTE"}
            </Text>

            <View style={styles.tarjeta}>
                <Text style={styles.txtLinea}>Disparos acertados: {misAciertos}</Text>
                <Text style={styles.txtPuntos}>+{puntosGanados} PUNTOS</Text>
            </View>

            <TouchableOpacity style={styles.boton} onPress={() => navigation.navigate('Menu')}>
                <Text style={styles.txtBoton}>VOLVER AL MENU</Text>
            </TouchableOpacity>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    fondo: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    cargando: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000'
    },
    txtCargando: {
        color: '#ffffff',
        fontSize: 20,
        fontFamily: 'AmongUs'
    },
    txtResultado: {
        fontSize: 55,
        fontFamily: 'AmongUs',
        marginBottom: 20
    },
    txtGano: {
        color: '#00ff00'
    },
    txtPerdio: {
        color: '#ff3333'
    },
    tarjeta: {
        backgroundColor: '#121212c2',
        borderWidth: 2,
        borderColor: '#ffffff',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        marginBottom: 30
    },
    txtLinea: {
        color: '#ffffff',
        fontFamily: 'AmongUs',
        fontSize: 20,
        marginBottom: 10
    },
    txtPuntos: {
        color: '#00ff00',
        fontFamily: 'AmongUs',
        fontSize: 30
    },
    boton: {
        borderColor: '#ffffff',
        borderWidth: 2,
        borderRadius: 10,
        height: 55,
        width: 220,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00000088'
    },
    txtBoton: {
        color: '#ffffff',
        fontFamily: 'AmongUs',
        fontSize: 20
    }
})
