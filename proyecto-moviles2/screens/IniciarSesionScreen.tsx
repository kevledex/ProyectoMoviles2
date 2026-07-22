import { ImageBackground, StyleSheet, Text, TouchableOpacity, View, TextInput, Button, Alert } from 'react-native'
import { globalStyles } from '../styles/EstilosGlobales'
import { useState } from 'react'
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase/ConfigFirebase'



export default function IniciarSesionScreen({ navigation }: any) {
    const [correo, setCorreo] = useState("")
    const [contrasenia, setContrasenia] = useState("")

    function login() {

        signInWithEmailAndPassword(auth, correo, contrasenia)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                console.log(user)
                navigation.navigate('Menu')
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode);

                switch (errorCode) {
                    case "auth/invalid-email":
                        Alert.alert("Correo invalido", "Verificar el campo de correo")
                        break;
                    case "auth/missing-password":
                        Alert.alert("Contraseña invalida", "Verificar el campo de contraseña")
                        break;
                    case "auth/invalid-credential":
                        Alert.alert("Correo o contraseña incorrectos", "Verificar los campos")
                        break;
                    default:
                        Alert.alert("Error", "Verificar Credenciales")
                }

            });

    }


    function restablecerContrasenia() {
        sendPasswordResetEmail(auth, correo)
            .then(() => {
                // Password reset email sent!
                // ..
                Alert.alert("Mensaje", "Se envio un mensaje a tu correo")
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // ..

            });
    }

    return (
        <ImageBackground source={require('../assets/images/FondoMenu.jpg')} style={globalStyles.container}>
            <View style={styles.contenedorMenu}>
                <Text style={styles.titulo}>INICIAR SESIÓN</Text>

                <TextInput placeholder="Ingrese su correo"
                    style={styles.input}
                    onChangeText={setCorreo} />

                <TextInput placeholder="Ingrese la contraseña"
                    style={styles.input}
                    onChangeText={setContrasenia} />

                
                <View style={styles.contenedorAcciones}>
                    <View style={styles.filaBotones}>
                        <TouchableOpacity style={styles.boton}
                            onPress={login}>

                            <Text style={styles.txtMenu}>LOGIN</Text>
                        </TouchableOpacity>
                </View>

                    <TouchableOpacity
                        style={styles.enlaceRegistro}
                        onPress={() => navigation.navigate("Registro")}
                    >
                        <Text style={styles.txtRegistro}>¿NO TIENES CUENTA? REGÍSTRATE AQUÍ</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.enlaceRegistro}
                        onPress={restablecerContrasenia} 
                    >
                        <Text style={styles.txtRegistro}>Olvidaste la contraseña?</Text>
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
        marginTop: 2,
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