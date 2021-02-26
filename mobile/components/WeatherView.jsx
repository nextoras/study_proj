import React from 'react';
import useWeather from './../utils/useWeather';
import { Text, View, StyleSheet, ImageBackground } from 'react-native';
import Weather from './Weather'
import LoadingView from './LoadingView';

/** Задний фон  */
const back = require("./../assets/images/background.jpg")

/** Вью погоды по геолокации  */
const WeatherView = () => {
    const weather = useWeather();
    return (
        <View style={styles.container}>
            <ImageBackground source={back} style={styles.image}>
                {!weather ? <LoadingView /> : <Weather forecast={weather} />}
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
    }
});

export default WeatherView;