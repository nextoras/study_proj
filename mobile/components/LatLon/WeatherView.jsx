import React from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import useWeather from './../../utils/useWeather';
import Weather from './Weather'
import LoadingView from '../LoadingView';

/** Задний фон  */
const back = require("./../../assets/images/background.jpg")

/** Вью погоды по геолокации  */
const WeatherView = ({ navigation }) => {
    const weather = useWeather();
    return (
        <View style={styles.container}>
            <ImageBackground source={back} style={styles.image}>
                {!weather ? <LoadingView /> : <Weather navigation={navigation} forecast={weather} />}
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