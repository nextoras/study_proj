import React from 'react';
import { format, isSameDay } from "date-fns";
import { Text, StyleSheet, View, ScrollView } from 'react-native';
import {
    useFonts,
} from '@expo-google-fonts/playfair-display';
import { AppLoading } from 'expo';
import imageDictionary from './../../utils/imageDictionary.js';
import CardDW from './CardDW';


/** Компонент погоды на неделю */
const DetailedWeather = ({ forecast: { name, list, timezone } }) => {

    const currentWeather = list.filter((day) => {
        const now = new Date().getTime() + Math.abs(timezone * 1000);
        const currentDate = new Date(day.dt * 1000);
        return isSameDay(now, currentDate);
    });

    const daysByHour = list.map((day) => {
        const dt = new Date(day.dt * 1000);
        return {
            date: dt,
            name: format(dt, 'iii PP'),
            temp: Math.round(day.main.temp),
            icon:
                imageDictionary[day.weather[0].icon] || imageDictionary["02d"],
        };
    });

    let [fontsLoaded] = useFonts({
        'PlayfairDisplay': require('./../../assets/fonts/PlayfairDisplay-Bold.ttf'),
    });
    if (!fontsLoaded) {
        return <AppLoading />;
    } else {
        return (
            currentWeather.length > 0 && (
                <View style={styles.container}>
                    <View style={styles.city}>
                        <Text style={styles.cityText}>{name}</Text>
                    </View>
                    <View style={styles.daysInfo}>
                        <ScrollView>
                            {daysByHour.map((day, index) => (
                                <CardDW
                                    key={index}
                                    icon={day.icon}
                                    name={day.name}
                                    temp={day.temp}
                                />
                            ))}
                        </ScrollView>
                    </View>
                </View>
            )
        );
    }
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'column',
    },
    city: {
        flex: 2 / 10,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
    },
    daysInfo: {
        flex: 8 / 10,
        alignItems: 'center',
    },
    ///////////
    cityText: {
        fontFamily: 'PlayfairDisplay',
        fontSize: 36,
        color: '#6B7AC9',
        paddingTop: 45,
    },
    ///////////
    scrollWeather: {
    },
});

export default DetailedWeather;

