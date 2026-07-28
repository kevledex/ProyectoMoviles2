import { ImageBackground, StyleSheet, Text, TouchableOpacity, View, TextInput, Button, Alert, Image } from 'react-native'
import { globalStyles } from '../styles/EstilosGlobales'
import { useState } from 'react'
import { supabase } from '../supabase/config'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase/ConfigFirebase'
import { getDatabase, ref, set } from 'firebase/database'
import * as ImagePicker from 'expo-image-picker';
import { File, Directory, Paths } from 'expo-file-system';



export default function RegistroScreen({ navigation }: any) {

    const [correo, setCorreo] = useState("")
    const [contrasenia, setContrasenia] = useState("")
    const [edad, setEdad] = useState(0)
    const [nick, setNick] = useState("")

    function registro() {
        createUserWithEmailAndPassword(auth, correo, contrasenia)
            .then((userCredential) => {
                // Signed-up
                const user = userCredential.user;

                guardarUsuario(user.uid);
                navigation.navigate("Login");
                console.log(user.uid);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;

                Alert.alert(errorCode, errorMessage)
            });

    }


    function guardarUsuario(uid: string) {
        const db = getDatabase();
        set(ref(db, 'usuarios/' + uid), {
            correo: correo,
            edad: edad,
            nick: nick
        });
    }

    //Guardar Imagen Avatar
    const [image, setImage] = useState<string | null>(null);
    const pickImage = async () => {

        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
            Alert.alert('Permission required', 'Permission to access the media library is required.');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };


//Subir Imagen
    async function subirImagen() {

        const avatarFile = await new File(image as string).bytes()
        const { data, error } = await supabase
            .storage
            .from('jugadores')
            .upload('publica/avatar3.png', avatarFile, {
                contentType: 'image/jpeg',
                cacheControl: '1',
                upsert: false
            })

            console.log(error);

    }




    return (
        <ImageBackground source={require('../assets/images/FondoMenu.jpg')} style={globalStyles.container}>
            <View style={styles.contenedorMenu}>
                <Text style={styles.titulo}>Registrate</Text>

                <TextInput placeholder="Ingrese su Nickname"
                    style={styles.input}
                    onChangeText={setNick} />

                <TextInput placeholder="Ingrese su edad"
                    style={styles.input}
                    onChangeText={(texto) => setEdad(+texto)} />

                <TextInput placeholder="Ingrese su correo"
                    style={styles.input}
                    onChangeText={setCorreo} />

                <TextInput placeholder="Ingrese la contraseña"
                    style={styles.input}
                    onChangeText={setContrasenia} />


            <View style={styles.containerImg}>
                    <Button title="Abrir Galeria" onPress={pickImage} />
                    {image && <Image source={{ uri: image }} style={styles.image} />}

                    <Button title="Subir Imagen" onPress={subirImagen} />
            </View>
                


                <View style={styles.contenedorAcciones}>
                    <View style={styles.filaBotones}>
                        <TouchableOpacity style={styles.boton}
                            onPress={registro}>
                            <Text style={styles.txtMenu}>REGISTRAR</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.enlaceLogin}
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text style={styles.txtLogin}>¿YA TIENES CUENTA? INICIA SESIÓN</Text>
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
        fontSize: 50,
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
        height: 45,
        borderRadius: 10,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },

    input: {
        borderWidth: 1,
        borderColor: '#777',
        padding: 5,
        margin: 5,
        width: 250,
        height: 45,
        backgroundColor: 'white',
        fontFamily: 'AmongUs',
        fontSize: 30,
        borderRadius: 10,
    },
    enlaceLogin: {
        marginTop: 2,
        padding: 1,
    },
    txtLogin: {
        color: '#ffffff',
        fontSize: 18,
        fontFamily: 'AmongUs',
        textDecorationLine: 'underline',
        textAlign: 'center',
    },

    containerImg: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 300,
        height: 300,
        resizeMode: 'contain'
    },


})