import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import TarjetaPerfil from '../components/TarjetaPerfil'
import { getDatabase, onValue, ref, update } from 'firebase/database'
import { onAuthStateChanged, signOut } from 'firebase/auth/web-extension'
import { auth } from '../firebase/ConfigFirebase'

export default function PerfilScreen({ navigation }: any) {

    const [correo, setCorreo] = useState("")
    const [edad, setEdad] = useState(0)
    const [nick, setNick] = useState("")
    const [puntos, setPuntos] = useState(0)
    const [avatarUrl, setAvatarUrl] = useState("")
    const [uidUsuario, setUidUsuario] = useState("")

    function leerUsuario(uid: string) {

        const db = getDatabase()
        const usuarioRef = ref(db, 'usuarios/' + uid)
        onValue(usuarioRef, (snapshot) => {
            const datos = snapshot.val()
            if (datos) {
                setCorreo(datos.correo)
                setEdad(datos.edad)
                setNick(datos.nick)
                setPuntos(datos.puntos)
                setAvatarUrl(datos.avatarUrl || "");
            }
        })
    }

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                leerUsuario(user.uid)
                setUidUsuario(user.uid)
            } else {
                navigation.navigate('Login')
            }
        })
    }, [])


    function editarUsuario(uid: string) {
        const db = getDatabase();
        update(ref(db, 'usuarios/' + uid),
            {
                correo: correo,
                edad: edad,
                nick: nick,
            }
        );
        Alert.alert('Usuario Editado','Se edito los datos del usuario')
    }

    function cerrarSesion() {
        signOut(auth).then(() => {
            navigation.navigate('Login')
        }).catch((error) => {
            Alert.alert("Error", "No se pudo cerrar sesión. Intente nuevamente.")
        })
    }

    return (
        <ImageBackground source={require('../assets/images/FondoPerfil.png')} style={styles.fondo}>

            <Text style={styles.titulo}>MI PERFIL</Text>

            <View style={styles.contenedorCentro}>
                <TarjetaPerfil
                    nick={nick}
                    correo={correo}
                    edad={edad}
                    puntos={puntos}
                    image={avatarUrl}
                    setNick={setNick}
                    setEdad={setEdad}
                    editar={() => editarUsuario(uidUsuario)}
                />
            </View>

            <View style={styles.contenedorBotones}>
                <TouchableOpacity
                    style={styles.botonVolver}
                    onPress={() => navigation.navigate('Menu')}>
                    <Text style={styles.txtVolver}>VOLVER</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.botonCerrarSesion}
                    onPress={cerrarSesion}>
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
        marginTop: 20,
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





}) 

