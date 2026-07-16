import { ImageBackground, StyleSheet, Text, TouchableOpacity, View, TextInput, Button } from 'react-native'
import { globalStyles } from '../styles/EstilosGlobales'
import { useState } from 'react'


export default function IniciarSesionScreen({ navigation }: any) {

  const [id, setId] = useState('')
  const [usuario, setUsuario] = useState('')
  const [email, setEmail] = useState('')
  const [contraseña, setContraseña] = useState('')
  


    return (
        <ImageBackground source={require('../assets/images/FondoMenu.jpg')} style={globalStyles.container}>

            <View style={styles.contenedorMenu}>

                <Text style={styles.titulo}>INICIAR SESIÓN</Text>

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
                    value={contraseña}
                    onChangeText={setContraseña}
                    secureTextEntry
                 />

                <View style={styles.filaBotones}>
                    <TouchableOpacity style={styles.boton}
                    onPress={() => navigation.navigate('InicioSecion')}>
                        <Text style={styles.txtMenu}>JUGAR</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.boton}
                    onPress={() => navigation.navigate('InicioSecion')}>
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
        paddingVertical: 80,
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