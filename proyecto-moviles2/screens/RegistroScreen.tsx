import { ImageBackground, StyleSheet, Text, TouchableOpacity, View, TextInput, Button, Alert } from 'react-native'
import { globalStyles } from '../styles/EstilosGlobales'
import { useState } from 'react'
import { supabase } from '../supabase/config'


export default function RegistroScreen({ navigation }: any) {

    const [usuario, setUsuario] = useState('')
    const [email, setEmail] = useState('')
    const [contrasenia, setContrasenia] = useState('')

    async function registrarUsuarios() {
        const { error } = await supabase.auth.signUp({
            email: email.trim().toLowerCase(),
            password: contrasenia,
            options: {
                data: {
                    usuario: usuario.trim(),
                },
            },
        })

        if (error) {
            Alert.alert('Error', error.message)
            return
        }

        Alert.alert('Registro exitoso', 'Revisa tu correo electrónico')
        navigation.navigate('Menu')
    }


    return (
        <ImageBackground source={require('../assets/images/FondoMenu.jpg')} style={globalStyles.container}>

            <View style={styles.contenedorMenu}>

                <Text style={styles.titulo}>REGISTRATE</Text>

                <TextInput
                    style={styles.input}
                    placeholder="USUARIO"
                    value={usuario}
                    onChangeText={setUsuario}
                />

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

                <View style={styles.filaBotones}>
                    <TouchableOpacity style={styles.boton}
                        onPress={registrarUsuarios}>
                        <Text style={styles.txtMenu}>REGISTRAR</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.boton}
                        onPress={() => navigation.navigate('Menu')}>
                        <Text style={styles.txtMenu}>SALIR</Text>
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
        fontSize: 40,
        fontWeight: 'bold',
        marginTop: 20,
    },
    filaBotones: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    txtMenu: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: '600',
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
        margin: 10,
        width: 200,
        backgroundColor: 'white',
    },
})