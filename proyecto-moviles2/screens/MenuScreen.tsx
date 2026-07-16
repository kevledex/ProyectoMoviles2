import { ImageBackground, StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { globalStyles } from '../styles/EstilosGlobales'

export default function MenuScreen() {
    return (
        <ImageBackground source={require('../assets/images/FondoMenu.jpg')} style={globalStyles.container}>

            <View style={styles.fila}>

                <Text style={styles.txtMenu}>AMONG US!</Text>

                <TouchableOpacity style={styles.boton}>
                    <Text style={styles.txtMenu}>JUGAR</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.boton}>
                    <Text style={styles.txtMenu}>PERFIL</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    fila: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    txtMenu: {
        color: '#ffff',
        justifyContent: 'center',
        fontSize: 25
    },
    boton: {
        borderColor: '#ffff',
        borderWidth: 2,
        width: 150,
        height: 55,
        borderRadius: 10,
        margin: 15,
        justifyContent: 'center',
        alignItems: 'center'
    }
})