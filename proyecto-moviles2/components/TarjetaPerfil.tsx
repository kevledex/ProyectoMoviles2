import { StyleSheet, Text, View, TouchableOpacity, Modal, Image, TextInput, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'

import * as ImagePicker from 'expo-image-picker';
import { File } from 'expo-file-system';
import { supabase } from '../supabase/config';

type Props = {
    nick: string
    correo: string
    edad: number
    puntos: number
    image?: string
    uid: string
    setNick: (text: string) => void
    setEdad: (text: any) => void
    editar: () => void
}

export default function TarjetaPerfil({ nick, correo, edad, puntos, image, uid, setNick, setEdad, editar }: Props) {

    //Cambiar cache de la imagen
    const [cache, setCache] = useState(Date.now());


    const [ocultarModal, setOcultarModal] = useState(false)

    async function editarFotoPerfil() {
        const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permiso.granted) {
            Alert.alert("Permiso requerido", "Debes permitir acceder a la galería.");
            return;
        }

        const resultado = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (resultado.canceled) return;

        const nuevaImagen = resultado.assets[0].uri;
        const bytes = await new File(nuevaImagen).bytes();
        const ruta = `usuarios/${uid}/avatar.png`;
        const { error } = await supabase
            .storage
            .from("jugadores")
            .upload(ruta, bytes, {
                contentType: "image/jpeg",
                upsert: true,
            });

        if (error) {
            Alert.alert("Error", "No se pudo actualizar la imagen.");
            return;
        }

        //Para recargae de la foto de perfil
        setCache(Date.now());

        Alert.alert("Éxito", "Foto actualizada.");
    }

    return (
        <View style={styles.tarjeta}>

            <View style={styles.infoImg}>
                <Image
                    source={{
                        uri: image
                            ? `${image}?v=${cache}`
                            : 'https://via.placeholder.com/120'
                    }}
                    style={styles.avatar}
                />

                <TouchableOpacity
                    style={styles.btnImg}
                    onPress={editarFotoPerfil}
                >
                    <Text style={styles.txtVerMas}>EDITAR FOTO PERFIL</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.infoTarjeta}>
                <Text style={styles.subtituloModal}>USUARIO:
                    <Text style={styles.txtStatLabel}> {nick}</Text>
                </Text>

                <Text style={styles.subtituloModal}>CORREO:
                    <Text style={styles.txtStatLabel}> {correo}</Text>
                </Text>

                <Text style={styles.subtituloModal}>EDAD:
                    <Text style={styles.txtStatLabel}> {edad}</Text>
                </Text>

                <Text style={styles.subtituloModal}>PUNTAJE:
                    <Text style={styles.puntaje}> {puntos}</Text>
                </Text>

                <TouchableOpacity
                    style={styles.btnVerMas}
                    onPress={() => setOcultarModal(true)}
                >
                    <Text style={styles.txtVerMas}>EDITAR DATOS</Text>
                </TouchableOpacity>

            </View>

            <Modal
                visible={ocultarModal}
                transparent
                animationType="fade"
            >

                <View style={styles.fondoModal}>
                    <View style={styles.cuerpoModal}>
                        <View style={styles.cajaStats}>
                            <View style={styles.filaStat}>
                                <TextInput
                                    placeholder='Editar tu usuario'
                                    placeholderTextColor="#888"
                                    value={nick}
                                    onChangeText={setNick}
                                    style={styles.input}
                                />
                            </View>
                            <View style={styles.filaStat}>
                                <TextInput
                                    placeholder='Editar tu edad'
                                    placeholderTextColor="#888"
                                    value={edad ? edad.toString() : ''}
                                    keyboardType='numeric'
                                    onChangeText={(val) => setEdad(val ? parseInt(val, 10) : 0)}
                                    style={styles.input}
                                />
                            </View>

                        </View>

                        <TouchableOpacity
                            style={[styles.btnCerrar, { marginBottom: 10 }]}
                            onPress={() => {
                                editar()
                                setOcultarModal(false)
                            }}
                        >
                            <Text style={styles.txtBtnCerrar}>Guardar Cambios</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.btnCerrar}
                            onPress={() => setOcultarModal(false)}
                        >
                            <Text style={styles.txtBtnCerrar}>CERRAR</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </Modal>
        </View >
    )
}



const styles = StyleSheet.create({

    avatar: {
        width: 100,
        height: 100,
        borderWidth: 3,
        borderColor: "#fff",
        alignSelf: 'center',
        marginRight: 29,
        borderRadius: 5,
    },

    tarjeta: {
        backgroundColor: '#121212c2',
        borderWidth: 2,
        borderColor: "#ffffff",
        borderRadius: 12,
        padding: 15,
        width: 340,
        height: 210,
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    infoTarjeta: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        flex: 1,
    },

    infoImg: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        flex: 1,
    },

    btnVerMas: {
        marginTop: 12,
        backgroundColor: '#ffffff22',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
    },

    btnImg: {
        margin: 12,
        backgroundColor: '#ffffff22',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
    },

    txtVerMas: {
        color: '#ffffff',
        fontFamily: 'AmongUs',
        fontSize: 16,
    },

    fondoModal: {
        backgroundColor: '#000000d0',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    cuerpoModal: {
        backgroundColor: '#121212',
        width: '85%',
        borderRadius: 20,
        borderWidth: 3,
        borderColor: '#ffffff',
        padding: 20,
        alignItems: 'center',
    },

    puntaje: {
        color: '#FFD700',
        fontSize: 25,
        marginBottom: 7,
        textAlign: 'center',
        fontFamily: 'AmongUs',

    },





    subtituloModal: {

        color: '#ffffff',

        fontSize: 22,

        marginBottom: 7,

        textAlign: 'center',

        fontFamily: 'AmongUs',

    },



    txtStatLabel: {

        color: '#C7C6C6',

        fontSize: 22,

        marginBottom: 7,

        textAlign: 'center',

        fontFamily: 'AmongUs',

    },



    cajaStats: {

        width: '100%',

        backgroundColor: '#222222',

        borderRadius: 12,

        padding: 10,

        marginVertical: 15,

    },



    filaStat: {

        flexDirection: 'row',

        justifyContent: 'center',

        marginVertical: 5,

    },



    btnCerrar: {

        backgroundColor: '#ffffff',

        paddingVertical: 10,

        width: '100%',

        borderRadius: 8,

        alignItems: 'center',

    },



    txtBtnCerrar: {

        color: '#000000',

        fontFamily: 'AmongUs',

        fontSize: 18,

    },

    input: {

        borderWidth: 1,

        borderColor: '#777',

        paddingHorizontal: 10,

        width: '100%',

        height: 45,

        backgroundColor: 'white',

        fontFamily: 'AmongUs',

        fontSize: 20,

        borderRadius: 10,

        color: '#000',

    },

})

