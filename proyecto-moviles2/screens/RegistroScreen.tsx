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
    const [image, setImage] = useState<string | null>(null);

    function registro() {
        createUserWithEmailAndPassword(auth, correo, contrasenia)
            .then(async (userCredential) => {

                const user = userCredential.user;
                let avatarUrl = "";
                if (image) {
                    avatarUrl = await subirImagen(user.uid);
                }

                guardarUsuario(
                    user.uid,
                    avatarUrl
                );

                navigation.navigate("Login");
                console.log(user.uid);
            })
            .catch((error) => {
                Alert.alert(
                    error.code,
                    error.message
                )
            });
        Alert.alert('Usuario Registrado','El usuario se registro con exito')
    }


    function guardarUsuario(uid: string, avatarUrl?: string) {
        const db = getDatabase();
        set(ref(db, 'usuarios/' + uid),
            {
                correo: correo,
                edad: edad,
                nick: nick,
                avatarUrl: avatarUrl
            }
        );
    }


//Elejir imagenes
    const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
            Alert.alert('Permission required', 'Permission to access the media library is required.');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos'],
            allowsEditing: true,
            aspect: [3, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };


    //Subir Imagen
    async function subirImagen(uid: string): Promise<string> {

        const avatarFile = await new File(image as string).bytes();
        const ruta = `usuarios/${uid}/avatar.png`;

        const { error } = await supabase
            .storage
            .from('jugadores')
            .upload(ruta, avatarFile,
                {
                    contentType: 'image/jpeg',
                    cacheControl: '3600',
                    upsert: true
                });

        if (error) {
            console.log(error);
            return "";
        }

        const url = supabase
            .storage
            .from('jugadores')
            .getPublicUrl(ruta)
            .data
            .publicUrl;

        return url;
    }


    return (
        <ImageBackground
            source={require('../assets/images/FondoMenu.jpg')}
            style={globalStyles.container}
        >
            <View style={styles.contenedorMenu}>

                <Text style={styles.titulo}>Registrate</Text>

                <View style={styles.contenedorRegistro}>

                    <View style={styles.datosUsuario}>

                        <TextInput
                            placeholder="Ingrese su Nickname"
                            style={styles.input}
                            onChangeText={setNick}
                        />

                        <TextInput
                            placeholder="Ingrese su edad"
                            style={styles.input}
                            onChangeText={(texto) => setEdad(+texto)}
                        />

                        <TextInput
                            placeholder="Ingrese su correo"
                            style={styles.input}
                            onChangeText={setCorreo}
                        />

                        <TextInput
                            placeholder="Ingrese la contraseña"
                            style={styles.input}
                            onChangeText={setContrasenia}
                        />

                    <View style={styles.contenedorAcciones}>

                        <View style={styles.filaBotones}>
                            <TouchableOpacity
                                    style={styles.boton}
                                    onPress={registro}
                                >
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

                    <View style={styles.avatarContainer}>

                        <Text style={styles.tituloAvatar}>AVATAR</Text>

                        {image ?
                            <Image
                                source={{ uri: image }}
                                style={styles.avatar}
                            />
                            :

                        <View style={styles.avatarVacio}>
                            <Text style={styles.txtLogin}>SIN FOTO</Text>
                        </View>
                        }

                    <TouchableOpacity
                        style={styles.botonImagen}
                        onPress={pickImage}
                    >
                        <Text style={styles.txtMenu}>ELEGIR FOTO</Text>
                    </TouchableOpacity>

                    </View>

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


    avatar: {
        width: 130,
        height: 130,
        borderRadius: 65,
        borderWidth: 3,
        borderColor: "#fff",
    },


    avatarVacio: {
        width: 130,
        height: 130,
        borderRadius: 65,
        backgroundColor: "#555",
        justifyContent: "center",
        alignItems: "center",
    },

    contenedorRegistro: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    },


    datosUsuario: {
        width: "55%",
        alignItems: "center",
    },


    avatarContainer: {
        width: "40%",
        alignItems: "center",
        justifyContent: "center",
    },


    tituloAvatar: {
        color: "#ffffff",
        fontSize: 35,
        fontFamily: "AmongUs",
        marginBottom: 15,
    },


    botonImagen: {
        borderColor: "#ffffff",
        borderWidth: 2,
        width: 180,
        height: 45,
        borderRadius: 10,
        marginTop: 20,
        justifyContent: "center",
        alignItems: "center"
    },


})