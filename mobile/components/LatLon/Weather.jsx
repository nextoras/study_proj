import React from 'react';
import { isSameDay, format } from "date-fns";
import { Text, StyleSheet, View, Image, ImageBackground, ScrollView, TouchableOpacity } from 'react-native';
import {
    useFonts,
    PlayfairDisplay_700Bold,
} from '@expo-google-fonts/playfair-display';
import { AppLoading } from 'expo';
import imageDictionary from './../../utils/imageDictionary.js';
import Card from './../Card';

const todayIconWeather = require("./../../assets/icons/01d.png");
const personage = require("./../../assets/icons/zombie2.png");
const cloudPers = require("./../../assets/images/cloudWords.png");

const ChoosePhrase = (temp) => {
    if (temp < 0 && temp > -10)
        return 'Брр, время доставать зимние вещи из шкафа.';
    else if (temp < -10 && temp >= -20)
        return 'В такую погоду не обойтись без шапки и шарфа.';
    else if (temp < -20 && temp > -30)
        return 'Не глупи, оставайся дома под пледом и с какао.';
    else return ''
}

/** Компонент погоды по геолокации*/
const Weather = ({ navigation, forecast: { name, list, timezone } }) => {

    const currentWeather = list.filter((day) => {
        const now = new Date().getTime() + Math.abs(timezone * 1000);
        const currentDate = new Date(day.dt * 1000);
        return isSameDay(now, currentDate);
    });

    const daysByHour = list.map((day) => {
        const dt = new Date(day.dt * 1000);
        return {
            date: dt,
            hour: dt.getHours(),
            name: format(dt, "EEEE"),
            temp: Math.round(day.main.temp),
            icon:
                imageDictionary[day.weather[0].icon] || imageDictionary["02d"],
        };
    });

    let [fontsLoaded] = useFonts({
        PlayfairDisplay_700Bold,
    });
    if (!fontsLoaded) {
        return <AppLoading />;
    } else {
        return (
            currentWeather.length > 0 && (
                <View style={styles.container}>
                    <View style={styles.currentInfo}>
                        <View style={styles.todayWeatherContainer}>
                            <Image source={todayIconWeather} style={styles.todayWeatherIcon}></Image>
                        </View>
                        <View style={styles.cityContainer}>
                            <TouchableOpacity onPress={() => navigation.navigate('CityWeatherView')}>
                                <Text style={styles.cityText}>{name}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.tempContainer}>
                            <Text style={styles.temp}>{Math.round(currentWeather[0].main.temp)}°C</Text>
                        </View>
                    </View>
                    <View style={styles.todayInfo}>
                        <ScrollView style={styles.scrollWeather} horizontal={true} showsHorizontalScrollIndicator={false}>
                            {daysByHour.map((day, index) => (
                                <Card
                                    key={index}
                                    icon={day.icon}
                                    name={day.name.substring(0, 3)}
                                    temp={day.temp}
                                    hour={day.hour}
                                />
                            ))}
                        </ScrollView>
                    </View>
                    <View style={styles.personage}>
                        <View style={styles.cloudContainer}>
                            <ImageBackground source={cloudPers} style={styles.cloudImage}>
                                <Text style={{ fontWeight: 'bold', alignItems: 'center', justifyContent: 'flex-end' }}>{ChoosePhrase(Math.round(currentWeather[0].main.temp))}</Text>
                            </ImageBackground>
                        </View>
                        <View style={styles.personageContainer}>
                            <Image source={personage} style={styles.personageImage}></Image>
                        </View>
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
    currentInfo: {
        flex: 2 / 5,
        flexDirection: 'row',
    },
    todayInfo: {
        flex: 3 / 5,
        alignItems: 'center',
    },
    personage: {
        flex: 1,
        flexDirection: 'column'
    },
    ///////////
    todayWeatherContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    cityContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    tempContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    todayWeatherIcon: {
        height: 50,
        width: 50,
    },
    cityText: {
        fontFamily: 'PlayfairDisplay_700Bold',
        fontWeight: 'bold',
        fontSize: 36,
        color: '#6B7AC9',
    },
    temp: {
        fontFamily: 'PlayfairDisplay_700Bold',
        fontSize: 36,
        fontWeight: 'bold',
        color: '#6B7AC9',
    },
    ///////////
    scrollWeather: {
        left: 0,
        width: '100%',
        height: 150,
        position: 'absolute',
    },
    ///////////
    cloudContainer: {
        flex: 1,
        alignItems: 'flex-end',
    },
    personageContainer: {
        flex: 1,
        alignItems: 'center',
    },
    cloudImage: {
        width: 200,
        height: 126,
        justifyContent: 'flex-end',
        paddingBottom: 15,
        alignItems: 'center',
    },
    personageImage: {
        width: 200,
        height: 200
    }
});

export default Weather;

