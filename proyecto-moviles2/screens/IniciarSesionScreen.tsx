import { ImageBackground, StyleSheet, Text, TouchableOpacity, View, TextInput, Button, Alert } from 'react-native'
import { globalStyles } from '../styles/EstilosGlobales'
import { useState } from 'react'
import { supabase } from '../supabase/config'


export default function IniciarSesionScreen({ navigation }: any) {

    const [id, setId] = useState('')
    const [usuario, setUsuario] = useState('')
    const [email, setEmail] = useState('')
    const [contrasenia, setContrasenia] = useState('')

    async function iniciarSesion() {
        if (email.trim() === '' || contrasenia.trim() === '') {
            Alert.alert('Campos incompletos', 'Ingrese el correo y la contraseña')
            return
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email.trim().toLowerCase(),
            password: contrasenia,
        })

        if (error) {
            console.log('ERROR DE INICIO DE SESIÓN:', error)
            Alert.alert('Error al iniciar sesión', error.message)
            return
        }

        if (data.session) {
            navigation.replace('Menu')
        }
    }

    return (
        <ImageBackground source={require('../assets/images/FondoMenu.jpg')} style={globalStyles.container}>

            <View style={styles.contenedorMenu}>

                <Text style={styles.titulo}>INICIAR SESIÓN</Text>

                <TextInput
                    style={styles.input}
                    placeholder="EMAIL"
                    value={email}
                    onChangeText={setEmail}
                />

                <TextInput
                    style={styles.input}
                    placeholder="CONTRASEÑA"
                    value={contrasenia}
                    onChangeText={setContrasenia}
                    secureTextEntry
                />

                <View style={styles.contenedorAcciones}>
                    <View style={styles.filaBotones}>
                        <TouchableOpacity style={styles.boton}
                            onPress={iniciarSesion}>
                            <Text style={styles.txtMenu}>LOGIN</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.boton}
                            onPress={() => navigation.navigate('Menu')}>
                            <Text style={styles.txtMenu}>SALIR</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.enlaceRegistro}
                        onPress={() => navigation.navigate('Registrar')}
                    >
                        <Text style={styles.txtRegistro}>¿NO TIENES CUENTA? REGÍSTRATE AQUÍ</Text>
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
    },

    titulo: {
        color: '#ffffff',
        fontSize: 70,
        fontFamily: 'AmongUs',
        marginTop: 20,
    },
    contenedorAcciones: {
        alignItems: 'center',
        marginBottom: 20,
    },
    filaBotones: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    txtMenu: {
        color: '#ffffff',
        fontSize: 40,
        fontFamily: 'AmongUs',
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
    },

    input: {
        borderWidth: 1,
        borderColor: '#777',
        padding: 8,
        margin: 8,
        width: 250,
        backgroundColor: 'white',
        fontFamily: 'AmongUs',
        fontSize: 30,
        borderRadius: 10
    },
    enlaceRegistro: {
        marginTop: 15,
        padding: 5,
    },
    txtRegistro: {
        color: '#ffffff',
        fontSize: 20,
        fontFamily: 'AmongUs',
        textDecorationLine: 'underline',
        textAlign: 'center',
    }
})