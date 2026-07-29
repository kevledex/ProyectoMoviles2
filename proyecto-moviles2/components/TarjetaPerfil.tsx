import { StyleSheet, Text, View, TouchableOpacity, Modal, Image, TextInput } from 'react-native'

import React, { useState } from 'react'

type Props = {
    nick: string
    correo: string
    edad: number
    puntos: number
    image?: string
    guardarCambios: (datos: any) => void
}

export default function TarjetaPerfil({ nick, correo, edad, puntos, image, guardarCambios }: Props) {

    const [ocultarModal, setOcultarModal] = useState(false)

    const [nuevoNick, setNuevoNick] = useState(nick)
    const [nuevoCorreo, setNuevoCorreo] = useState(correo)
    const [nuevaEdad, setNuevaEdad] = useState(edad)

    console.log("Image recibida:", image);

    return (

        <TouchableOpacity
            onPress={() => setOcultarModal(true)}
            style={styles.tarjeta}
            activeOpacity={0.9}
        >
            <Image
                source={{ uri: image }}
                style={styles.avatar}
            />

            <View style={styles.infoTarjeta}>

                <Text style={styles.txtStatLabel}>USUARIO:</Text>
                <Text style={styles.tituloModal}>{nick}</Text>
                <Text style={styles.txtStatLabel}>CORREO:</Text>
                <Text style={styles.subtituloModal}>{correo}</Text>
                <Text style={styles.txtStatLabel}>EDAD:</Text>
                <Text style={styles.subtituloModal}>{edad}</Text>
                <Text style={styles.txtStatLabel}>PUNTOS:</Text>
                <Text style={styles.subtituloModal}>{puntos}</Text>

                <View style={styles.btnVerMas}>
                    <Text style={styles.txtVerMas}>
                        EDITAR DATOS
                    </Text>
                </View>

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
                                    value={nuevoNick}
                                    onChangeText={setNuevoNick}
                                    style={styles.input}
                                />
                            </View>

                            <View style={styles.filaStat}>
                                <TextInput
                                    placeholder='Editar tu edad'
                                    value={nuevoNick}
                                    onChangeText={setNuevoNick}
                                    style={styles.input}
                                />
                            </View>

                        </View>

                        <TouchableOpacity
                            style={styles.btnCerrar}
                            onPress={() => {
                                guardarCambios({
                                    nick: nuevoNick,
                                    correo: nuevoCorreo,
                                    edad: nuevaEdad
                                })

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
        </TouchableOpacity >
    )
}

const styles = StyleSheet.create({

    avatar: {
        width: 120,
        height: 120,
        borderWidth: 3,
        borderColor: "#fff",
        alignSelf: 'center',
        marginRight: 30,
    },

    tarjeta: {
        backgroundColor: '#121212c2',
        borderWidth: 2,
        borderColor: "#ffffff",
        borderRadius: 12,
        padding: 15,
        width: 320,
        height: 180,
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    infoTarjeta: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        alignSelf: 'center',
    },

    txtNombre: {
        color: '#ffffff',
        fontFamily: 'AmongUs',
        fontSize: 36,
    },

    txtEmail: {
        color: '#aaaaaa',
        fontSize: 18,
        marginTop: 4,
        textAlign: 'center',
        fontFamily: 'AmongUs',
    },

    btnVerMas: {
        marginTop: 12,
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
        width: '75%',
        borderRadius: 20,
        borderWidth: 3,
        borderColor: '#ffffff',
        padding: 20,
        alignItems: 'center',
    },

    tituloModal: {
        fontFamily: 'AmongUs',
        color: '#ffffff',
        fontSize: 32,
        textAlign: 'center',
    },

    subtituloModal: {
        color: '#aaaaaa',
        fontSize: 14,
        marginBottom: 15,
        textAlign: 'center',
        fontFamily: 'AmongUs',
    },
    cajaStats: {
        width: '100%',
        backgroundColor: '#222222',
        borderRadius: 12,
        padding: 12,
        marginBottom: 15,
    },

    filaStat: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 5,
    },

    txtStatLabel: {
        color: '#ffffff',
        fontFamily: 'AmongUs',
        fontSize: 18,
    },

    txtStatVal: {
        color: '#00ff00',
        fontFamily: 'AmongUs',
        fontSize: 20,
    },

    btnCerrar: {
        backgroundColor: '#ffffff',
        paddingVertical: 8,
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
        padding: 5,
        margin: 5,
        width: 250,
        height: 45,
        backgroundColor: 'white',
        fontFamily: 'AmongUs',
        fontSize: 30,
        borderRadius: 10,
    },
})