import React from "react";
import { ImageBackground, StyleSheet, View, Text } from 'react-native';
import useDetailedWeather from '../../hooks/useDetailedWeather';
import DetailedWeather from './DetailedWeather'

/** Задний фон  */
const back = require("./../../assets/images/background.jpg")

/** Вью погоды на неделю  */
const DetailedWeatherView = () => {
    const weather = useDetailedWeather();
    return (
        <View style={styles.container}>
            <ImageBackground source={back} style={styles.image}>
                {!weather ? <Text>Load</Text> : <DetailedWeather forecast={weather} />}
            </ImageBackground>
        </View>
    )
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'column',
    },
    image: {
        flex: 1,
        width: null,
        height: null,
    },
})

export default DetailedWeatherView;