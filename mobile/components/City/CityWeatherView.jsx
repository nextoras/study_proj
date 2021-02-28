import React from 'react';
import { Text, StyleSheet, View, ImageBackground, Button, TextInput } from 'react-native';
import { useState } from "react";
import WeatherCity from './CityWeather';
import useWeatherCity from '../../utils/useWeatherCity';

/** Задний фон  */
const back = require("./../../assets/images/background.jpg")

/** Вью погоды по поиску города  */
const CityWeatherView = () => {
    const [city, setCity] = useState();
    const weath = useWeatherCity(city)

    return (
        <ImageBackground source={back} style={styles.container}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                <TextInput style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                    value={city}
                    onChangeText={(city) => setCity(city)}
                    placeholder={"Введите город"} />
                <Button onPress={() => weath}
                    title="ОК" />
                <View style={{ flex: 3 / 5 }}>
                    {!weath ? <Text>Loading...</Text> : <WeatherCity forecast={weath}></WeatherCity>}
                </View>
            </View>
        </ImageBackground>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: null,
        height: null,
    }
})

export default CityWeatherView;