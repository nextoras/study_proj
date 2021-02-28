import React from 'react';
import { Text, StyleSheet, View } from 'react-native';

/** Компонент погоды по поиску города */
const CityWeather = ({ forecast: { name, temp } }) => {
    return (
        <View style={styles.container}>
            <Text style={{ color: 'black', fontSize: 100 }}>{name}</Text>
            <Text style={{ color: 'black', fontSize: 100 }}>{Math.round(temp - 273)}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'column',
    },
})

export default CityWeather;