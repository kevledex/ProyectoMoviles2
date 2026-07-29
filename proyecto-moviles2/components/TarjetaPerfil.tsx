import {StyleSheet,Text,View,TouchableOpacity,Modal} from 'react-native'

import React, { useState } from 'react'

type Props = {
    nick: string
    correo: string
    edad: number
    puntos: number
    
}

export default function TarjetaPerfil({nick,correo, edad, puntos}: Props) {

    const [ocultarModal, setOcultarModal] = useState(false)

return (

    <TouchableOpacity
        onPress={() => setOcultarModal(true)}
        style={styles.tarjeta}
        activeOpacity={0.9}
    >
        <View style={styles.infoTarjeta}>

            <Text style={styles.txtNombre}>{nick}</Text>
            <Text style={styles.txtEmail}>{correo}</Text>

            <View style={styles.btnVerMas}>
                <Text style={styles.txtVerMas}>
                    VER STATS
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

                    <Text style={styles.tituloModal}>{nick}</Text>
                    <Text style={styles.subtituloModal}>{correo}</Text>

                    <View style={styles.cajaStats}>

                        <View style={styles.filaStat}>
                            <Text style={styles.txtStatLabel}>
                                EDAD:
                            </Text>

                            <Text style={styles.txtStatVal}>{edad}</Text>
                        </View>

                        <View style={styles.filaStat}>
                            <Text style={styles.txtStatLabel}>
                                PUNTUACIÓN:
                            </Text>

                            <Text style={styles.txtStatVal}>{puntos}</Text>
                        </View>

                    </View>

                    <TouchableOpacity
                        style={styles.btnCerrar}
                        onPress={() => setOcultarModal(false)}
                    >
                        <Text style={styles.txtBtnCerrar}>
                            CERRAR
                        </Text>
                    </TouchableOpacity>

                </View>
            </View>
         </Modal>
    </TouchableOpacity>
)
}

const styles = StyleSheet.create({
    tarjeta: {
        backgroundColor: '#121212c2',
        borderWidth: 2,
        borderColor: '#ffffff',
        borderRadius: 12,
        padding: 15,
        width: 320,
        height: 160,
        alignSelf: 'center',
        justifyContent: 'center',
    },
    infoTarjeta: {
        alignItems: 'center',
        justifyContent: 'center',
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
        fontSize: 16,
    },
    txtStatVal: {
        color: '#00ff00',
        fontFamily: 'AmongUs',
        fontSize: 16,
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
})