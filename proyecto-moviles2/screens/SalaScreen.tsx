import { ImageBackground, StyleSheet, Text, TouchableOpacity, View, TextInput, Alert, Image } from 'react-native'
import React, { useState } from 'react'
import { getDatabase, ref, set, get, child, update } from 'firebase/database'
import { auth } from '../firebase/ConfigFirebase'

const MAX_JUGADORES = 2
const VIDA_INICIAL = 1000

export default function SalaScreen({ navigation }: any) {
    const [codigoSala, setCodigoSala] = useState("")

    function generarCodigo() {
        const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        let codigo = ''
        for (let i = 0; i < 4; i++) {
            codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length))
        }
        return codigo
    }

    function crearSala() {
        const currentUser = auth.currentUser
        if (!currentUser) return

        const nuevoCodigo = generarCodigo()
        const db = getDatabase()

        set(ref(db, 'salas/' + nuevoCodigo), {
            host: currentUser.uid,
            estado: 'esperando',
            jugadores: {
                [currentUser.uid]: {
                    correo: currentUser.email,
                    nick: currentUser.email?.split('@')[0],
                    vida: VIDA_INICIAL,
                    aciertos: 0,
                    disparos: 0
                }
            }
        }).then(() => {
            navigation.navigate('Lobby', { codigoSala: nuevoCodigo, esHost: true })
        }).catch((error) => {
            Alert.alert("Error", error.message)
        })
    }

    async function unirseSala() {
        if (codigoSala.trim() === "") {
            Alert.alert("Error", "Ingresa un código")
            return
        }

        const currentUser = auth.currentUser
        if (!currentUser) return

        const codigoUpper = codigoSala.toUpperCase()
        const db = getDatabase()
        const snapshot = await get(child(ref(db), 'salas/' + codigoUpper))

        if (!snapshot.exists() || snapshot.val().estado !== 'esperando') {
            Alert.alert("Error", "La sala no existe o ya empezó")
            return
        }

        const jugadoresActuales = snapshot.val().jugadores || {}
        const cantidad = Object.keys(jugadoresActuales).length

        if (cantidad >= MAX_JUGADORES) {
            Alert.alert("Sala llena", "Esta sala ya tiene 2 jugadores")
            return
        }

        const updates: any = {}
        updates['salas/' + codigoUpper + '/jugadores/' + currentUser.uid] = {
            correo: currentUser.email,
            nick: currentUser.email?.split('@')[0],
            vida: VIDA_INICIAL,
            aciertos: 0,
            disparos: 0
        }

        await update(ref(db), updates)
        navigation.navigate('Lobby', { codigoSala: codigoUpper, esHost: false })
    }

    return (
        <ImageBackground source={require('../assets/images/FondoSala2.png')} style={styles.fondo}>
            <View style={styles.header}>
                <Text style={styles.txtAmongGrande}>AMONG US</Text>
                <Text style={styles.txtSalasPequeno}>SALAS</Text>
            </View>

            <View style={styles.contenedorColumnas}>
                <View style={styles.columna}>
                    <Image source={require('../assets/images/FondoCrearSala.png')} style={styles.iconoColumna} resizeMode="cover" />
                    <TouchableOpacity style={styles.boton} onPress={crearSala}>
                        <Text style={styles.txtBoton}>CREAR SALA</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.columna}>
                    <Image source={require('../assets/images/FondoCodigo.png')} style={styles.iconoColumna} resizeMode="cover" />
                    <TextInput
                        placeholder="CÓDIGO"
                        style={styles.input}
                        onChangeText={setCodigoSala}
                        value={codigoSala}
                        autoCapitalize="characters"
                        maxLength={4}
                        placeholderTextColor={"#e4e4e4"}
                    />
                    <TouchableOpacity style={styles.boton} onPress={unirseSala}>
                        <Text style={styles.txtBoton}>UNIRSE</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity style={styles.botonVolver} onPress={() => navigation.goBack()}>
                <Text style={styles.txtBotonPequeno}>VOLVER</Text>
            </TouchableOpacity>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    fondo: {
        flex: 1,
        padding: 20
    },
    header: {
        marginTop: 20,
        alignItems: 'flex-start'
    },
    txtAmongGrande: {
        color: '#ffffff',
        fontSize: 50,
        fontFamily: 'AmongUs'
    },
    txtSalasPequeno: {
        color: '#ffffff',
        fontSize: 25,
        fontFamily: 'AmongUs',
        marginTop: -5
    },
    contenedorColumnas: {
        flex: 1, flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginBottom: 80
    },
    columna: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    iconoColumna: {
        width: 160,
        height: 90,
        marginBottom: 5,
        borderRadius: 10
    },
    input: {
        borderWidth: 2,
        borderColor: '#ffffff',
        padding: 5,
        marginVertical: 5,
        width: '60%',
        height: 45,
        backgroundColor: '#b8b8b893',
        fontSize: 20,
        borderRadius: 10,
        textAlign: 'center',
        fontFamily: 'AmongUs',
        color: '#ffffff'
    },
    boton: {
        borderColor: '#ffffff',
        borderWidth: 2,
        width: '60%',
        height: 45,
        borderRadius: 10,
        marginVertical: 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000b0'
    },
    txtBoton: {
        color: '#ffffff',
        fontSize: 20,
        fontFamily: 'AmongUs'
    },
    botonVolver: {
        position: 'absolute',
        bottom: 30, left: 30,
        borderColor: '#ffffff',
        borderWidth: 1,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10
    },
    txtBotonPequeno: {
        color: '#ffffff',
        fontSize: 18,
        fontFamily: 'AmongUs'
    }
})