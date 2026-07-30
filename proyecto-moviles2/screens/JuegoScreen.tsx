import { StyleSheet, View, Text, TouchableOpacity, Animated, ImageBackground, Vibration } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { getDatabase, ref, onValue, update } from 'firebase/database'
import { auth } from '../firebase/ConfigFirebase'
import { useAudioPlayer } from 'expo-audio'

const VIDA_MAXIMA = 1000
const DANIO_DISPARO = 50
const DANIO_RAFAGA = 150
const PROBABILIDAD_ENCASQUILLE = 0.6
const TIEMPO_PARTIDA = 60
const ESPERA_DISPARO = 400
const ESPERA_RAFAGA = 2500

const musicaJuego = require('../assets/audio/FondoJuego.mp3')
const sonidoDisparo = require('../assets/audio/Disparo.mp3')
const sonidoRafaga = require('../assets/audio/Rafaga.mp3')

export default function JuegoScreen({ route, navigation }: any) {
  const { codigoSala } = route.params
  const uid = auth.currentUser?.uid

  const [datos, setDatos] = useState<any>(null)
  const [tiempo, setTiempo] = useState(TIEMPO_PARTIDA)
  const [mensaje, setMensaje] = useState("")
  const [esperandoDisparo, setEsperandoDisparo] = useState(false)
  const [esperandoRafaga, setEsperandoRafaga] = useState(false)

  const playerMusica = useAudioPlayer(musicaJuego)
  const playerDisparo = useAudioPlayer(sonidoDisparo)
  const playerRafaga = useAudioPlayer(sonidoRafaga)

  const datosRef = useRef<any>(null)
  const activo = useRef(true)
  const prevVida1 = useRef<number | null>(null)
  const prevVida2 = useRef<number | null>(null)
  const prevDisparos1 = useRef<number | null>(null)
  const prevDisparos2 = useRef<number | null>(null)

  const animPistola1 = useRef(new Animated.Value(0)).current
  const animPistola2 = useRef(new Animated.Value(0)).current
  const animGolpe1 = useRef(new Animated.Value(0)).current
  const animGolpe2 = useRef(new Animated.Value(0)).current

  useEffect(() => {
    playerMusica.loop = true
    playerMusica.play()

    return () => {
      activo.current = false
      try {
        playerMusica.pause()
      } catch (error) {
      }
    }
  }, [])

  useEffect(() => {
    const db = getDatabase()
    const salaRef = ref(db, 'salas/' + codigoSala)

    const unsubscribe = onValue(salaRef, (snapshot) => {
      if (!snapshot.exists()) return
      const valor = snapshot.val()
      setDatos(valor)
      datosRef.current = valor

      if (valor.estado === 'terminado') {
        navigation.replace('Resultados', { codigoSala: codigoSala })
      }
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (!datos) return

    const jugador1Id = datos.host
    const jugador2Id = Object.keys(datos.jugadores).find((id) => id !== jugador1Id)
    const v1 = datos.jugadores[jugador1Id]?.vida
    const v2 = jugador2Id ? datos.jugadores[jugador2Id]?.vida : undefined
    const d1 = datos.jugadores[jugador1Id]?.disparos
    const d2 = jugador2Id ? datos.jugadores[jugador2Id]?.disparos : undefined
    const t1 = datos.jugadores[jugador1Id]?.tipo
    const t2 = jugador2Id ? datos.jugadores[jugador2Id]?.tipo : undefined

    if (prevVida1.current !== null && v1 < prevVida1.current) {
      animarGolpe(animGolpe1)
    }
    if (prevVida2.current !== null && v2 !== undefined && v2 < prevVida2.current) {
      animarGolpe(animGolpe2)
    }
    if (prevDisparos1.current !== null && d1 > prevDisparos1.current) {
      animarRetroceso(animPistola1, t1)
      reproducirSonido(t1)
    }
    if (prevDisparos2.current !== null && d2 !== undefined && d2 > prevDisparos2.current) {
      animarRetroceso(animPistola2, t2)
      reproducirSonido(t2)
    }

    prevVida1.current = v1 ?? null
    prevVida2.current = v2 ?? null
    prevDisparos1.current = d1 ?? null
    prevDisparos2.current = d2 ?? null
  }, [datos])

  useEffect(() => {
    if (!datos || datos.estado !== 'jugando') return

    const intervalo = setInterval(() => {
      setTiempo((valorActual) => {
        if (valorActual <= 1) {
          clearInterval(intervalo)
          terminarPorTiempo()
          return 0
        }
        return valorActual - 1
      })
    }, 1000)

    return () => clearInterval(intervalo)
  }, [datos?.estado])

  function terminarPorTiempo() {
    const valor = datosRef.current
    if (!valor || valor.estado !== 'jugando') return

    const jugador1Id = valor.host
    const jugador2Id = Object.keys(valor.jugadores).find((id) => id !== jugador1Id)
    if (!jugador2Id) return

    const vida1 = valor.jugadores[jugador1Id].vida
    const vida2 = valor.jugadores[jugador2Id].vida

    const ganadorId = vida1 >= vida2 ? jugador1Id : jugador2Id

    const db = getDatabase()
    const updates: any = {}
    updates['salas/' + codigoSala + '/estado'] = 'terminado'
    updates['salas/' + codigoSala + '/ganador'] = ganadorId

    update(ref(db), updates)
  }

  function reproducirSonido(tipo: string) {
    if (!activo.current) return

    try {
      const player = tipo === 'rafaga' ? playerRafaga : playerDisparo
      player.seekTo(0)
      player.play()
    } catch (error) {
    }
  }

  function animarRetroceso(anim: Animated.Value, tipo: string) {
    const fuerza = tipo === 'rafaga' ? -30 : -15

    anim.stopAnimation()
    anim.setValue(0)

    Animated.sequence([
      Animated.timing(anim, { toValue: fuerza, duration: 80, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 0, duration: 120, useNativeDriver: true })
    ]).start()
  }

  function animarGolpe(anim: Animated.Value) {
    anim.stopAnimation()
    anim.setValue(0)

    Animated.sequence([
      Animated.timing(anim, { toValue: -14, duration: 90, useNativeDriver: true }),
      Animated.spring(anim, { toValue: 0, friction: 3, useNativeDriver: true })
    ]).start()
  }

  if (!datos) {
    return (
      <View style={styles.cargando}>
        <Text style={styles.txtCargando}>Cargando partida...</Text>
      </View>
    )
  }

  const jugador1Id = datos.host
  const jugador2Id = Object.keys(datos.jugadores).find((id) => id !== jugador1Id)
  const jugador1 = datos.jugadores[jugador1Id]
  const jugador2 = jugador2Id ? datos.jugadores[jugador2Id] : null

  const soyJugador1 = uid === jugador1Id
  const miVida = soyJugador1 ? jugador1.vida : jugador2?.vida
  const partidaActiva = datos.estado === 'jugando'

  function disparar(tipo: string) {
    if (!partidaActiva || !jugador2 || miVida <= 0) return

    if (tipo === 'rafaga') {
      if (esperandoRafaga) return
      setEsperandoRafaga(true)
      setTimeout(() => setEsperandoRafaga(false), ESPERA_RAFAGA)
    } else {
      if (esperandoDisparo) return
      setEsperandoDisparo(true)
      setTimeout(() => setEsperandoDisparo(false), ESPERA_DISPARO)
    }

    const miId = soyJugador1 ? jugador1Id : jugador2Id
    const misDisparos = (soyJugador1 ? jugador1.disparos : jugador2.disparos) || 0

    const db = getDatabase()
    const updates: any = {}
    updates['salas/' + codigoSala + '/jugadores/' + miId + '/disparos'] = misDisparos + 1
    updates['salas/' + codigoSala + '/jugadores/' + miId + '/tipo'] = tipo

    const seEncasquillo = Math.random() < PROBABILIDAD_ENCASQUILLE
    if (seEncasquillo) {
      update(ref(db), updates)

      Vibration.vibrate([300, 1000, 200, 500])
      setMensaje("SE ENCASQUILLÓ")
      setTimeout(() => setMensaje(""), 800)
      return
    }

    const rivalId = soyJugador1 ? jugador2Id : jugador1Id
    const rival = soyJugador1 ? jugador2 : jugador1
    const misAciertos = (soyJugador1 ? jugador1.aciertos : jugador2.aciertos) || 0
    const danio = tipo === 'rafaga' ? DANIO_RAFAGA : DANIO_DISPARO

    const nuevaVidaRival = Math.max(0, rival.vida - danio)

    updates['salas/' + codigoSala + '/jugadores/' + rivalId + '/vida'] = nuevaVidaRival
    updates['salas/' + codigoSala + '/jugadores/' + miId + '/aciertos'] = misAciertos + 1

    if (nuevaVidaRival <= 0) {
      updates['salas/' + codigoSala + '/estado'] = 'terminado'
      updates['salas/' + codigoSala + '/ganador'] = miId
    }

    update(ref(db), updates)
  }

  return (
    <ImageBackground source={require('../assets/images/FondoJuego.png')} style={styles.fondo}>
      <Text style={styles.txtTiempo}>{formatearTiempo(tiempo)}</Text>

      <View style={styles.espacioMensaje}>
        {mensaje !== "" && <Text style={styles.txtMensaje}>{mensaje}</Text>}
      </View>

      <View style={styles.contenedorJugadores}>

        <View style={styles.columna}>
          <Text style={styles.txtNick}>{jugador1.nick}</Text>
          <View style={styles.barraFondo}>
            <View style={[styles.barraVida, { width: (jugador1.vida / VIDA_MAXIMA * 100 + '%') as any }]} />
          </View>

          <View style={styles.filaCuerpo}>
            <Animated.Image
              source={jugador1.vida > 0
                ? require('../assets/images/TripulanteRojo.png')
                : require('../assets/images/TripulanteMuerto.png')}
              style={[styles.tripulante, { transform: [{ translateY: animGolpe1 }] }]}
            />
            <Animated.Image
              source={require('../assets/images/PistolaRojo.png')}
              style={[styles.pistola, { transform: [{ translateX: animPistola1 }] }]}
            />
          </View>

          <View style={styles.espacioBoton}>
            {soyJugador1 && (
              <View>
                <TouchableOpacity
                  style={[styles.boton, esperandoDisparo && styles.botonEspera]}
                  onPress={() => disparar('normal')}>
                  <Text style={styles.txtBoton}>DISPARAR</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.boton, styles.botonRafaga, esperandoRafaga && styles.botonEspera]}
                  onPress={() => disparar('rafaga')}>
                  <Text style={styles.txtBoton}>RÁFAGA</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        <View style={styles.columna}>
          <Text style={styles.txtNick}>{jugador2 ? jugador2.nick : "..."}</Text>
          <View style={styles.barraFondo}>
            <View style={[styles.barraVida, { width: ((jugador2 ? jugador2.vida : 0) / VIDA_MAXIMA * 100 + '%') as any }]} />
          </View>

          <View style={styles.filaCuerpo}>
            <Animated.Image
              source={require('../assets/images/PistolaAzul.png')}
              style={[styles.pistola, styles.pistolaVolteada, { transform: [{ scaleX: -1 }, { translateX: animPistola2 }] }]}
            />
            <Animated.Image
              source={jugador2 && jugador2.vida > 0
                ? require('../assets/images/TripulanteAzul.png')
                : require('../assets/images/TripulanteMuerto.png')}
              style={[styles.tripulante, { transform: [{ translateY: animGolpe2 }] }]}
            />
          </View>

          <View style={styles.espacioBoton}>
            {!soyJugador1 && (
              <View>
                <TouchableOpacity
                  style={[styles.boton, esperandoDisparo && styles.botonEspera]}
                  onPress={() => disparar('normal')}>
                  <Text style={styles.txtBoton}>DISPARAR</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.boton, styles.botonRafaga, esperandoRafaga && styles.botonEspera]}
                  onPress={() => disparar('rafaga')}>
                  <Text style={styles.txtBoton}>RÁFAGA</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

      </View>
    </ImageBackground>
  )
}

function formatearTiempo(segundosTotales: number) {
  const minutos = Math.floor(segundosTotales / 60)
  const segundos = segundosTotales % 60
  const minutosTexto = minutos < 10 ? '0' + minutos : '' + minutos
  const segundosTexto = segundos < 10 ? '0' + segundos : '' + segundos
  return minutosTexto + ':' + segundosTexto
}

const styles = StyleSheet.create({
  fondo: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40
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
  txtTiempo: {
    color: '#ffffff',
    fontSize: 40,
    fontFamily: 'AmongUs',
    marginBottom: 10
  },
  espacioMensaje: {
    height: 30,
    justifyContent: 'center',
    marginBottom: 10
  },
  txtMensaje: {
    color: '#ff3333',
    fontSize: 22,
    fontFamily: 'AmongUs'
  },
  contenedorJugadores: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%'
  },
  columna: {
    alignItems: 'center',
    width: '45%'
  },
  txtNick: {
    color: '#ffffff',
    fontSize: 20,
    fontFamily: 'AmongUs',
    marginBottom: 5
  },
  barraFondo: {
    width: 140,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#3d3d3d',
    borderWidth: 1,
    borderColor: '#ffffff',
    overflow: 'hidden',
    marginBottom: 15
  },
  barraVida: {
    height: '100%',
    backgroundColor: '#00c853'
  },
  filaCuerpo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 110,
    marginBottom: 5
  },
  tripulante: {
    width: 110,
    height: 110,
    resizeMode: 'contain'
  },
  pistola: {
    width: 55,
    height: 35,
    resizeMode: 'contain',
    marginHorizontal: -5
  },
  pistolaVolteada: {
    marginHorizontal: -5
  },
  boton: {
    borderColor: '#ffffff',
    borderWidth: 2,
    width: 140,
    height: 50,
    borderRadius: 10,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000088'
  },
  botonRafaga: {
    borderColor: '#ffcc00',
    backgroundColor: '#553300aa'
  },
  botonEspera: {
    opacity: 0.4
  },
  espacioBoton: {
    width: 140,
    height: 110,
    marginBottom: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  txtBoton: {
    color: '#ffffff',
    fontSize: 22,
    fontFamily: 'AmongUs'
  }
})
