import React from "react";
import { Text, StyleSheet, View, Image } from 'react-native';
import {
    useFonts,
} from '@expo-google-fonts/playfair-display';
import { AppLoading } from 'expo';

/** Кард погоды на неделю  */
export default function CardDW({ name, icon, temp }) {
    let [fontsLoaded] = useFonts({

        'Tillana': require('./../../assets/fonts/Tillana-SemiBold.ttf')
    });
    if (!fontsLoaded) {
        return <AppLoading />;
    } else {
        return (
            <View style={styles.card}>
                <View style={styles.dayBox}>
                    <Text style={styles.day}>{name}</Text>
                </View>
                <View style={styles.iconBox}>
                    <Image style={styles.icon} source={icon} />
                </View>
                <View style={styles.tempBox}>
                    <Text style={styles.text}>{temp}°C</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        height: 52,
        width: 340,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#A8B7EF',
        flexDirection: 'row',
        marginBottom: 20,
        borderRadius: 20,
    },
    dayBox: {
        flex: 1 / 2,
        alignItems: 'flex-start',
    },
    iconBox: {
        flex: 1 / 3,
        alignItems: 'center',
    },
    tempBox: {
        flex: 1 / 6,
        alignItems: 'flex-end',
        paddingRight: 10,
    },
    day: {
        fontSize: 14,
        fontFamily: 'Tillana',
        fontWeight: 'bold',
        color: 'black',
        paddingLeft: 15,
    },
    icon: {
        width: 50,
        height: 50,
    },
    text: {
        fontSize: 14,
        fontFamily: 'Tillana',
        fontWeight: 'bold',
        color: 'black',
    },
})