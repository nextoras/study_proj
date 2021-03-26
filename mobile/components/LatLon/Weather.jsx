import React from 'react';
import { isSameDay, format } from "date-fns";
import { Text, StyleSheet, View, Image, ImageBackground, TouchableOpacity, ScrollView } from 'react-native';
import {
    useFonts,
} from '@expo-google-fonts/playfair-display';
import imageDictionary from './../../utils/imageDictionary.js';
import Card from './../Card';
import LoadingView from '../LoadingView';

const cloudPers = require("./../../assets/images/cloudWords.png");

const ChoosePhrase = (temp) => {
    if (temp <= 0 && temp >= -10)
        return 'Брр, время доставать зимние вещи из шкафа.';
    else if (temp > 0 && temp < 10)
        return 'На улице довольно холодно, стоит надеть свитер.';
    else if (temp < -10 && temp >= -20)
        return 'В такую погоду не обойтись без шапки и шарфа.';
    else if (temp < -20 && temp > -30)
        return 'Не глупи, оставайся дома под пледом и с какао.';

    else return ''
}
const ChoosePersonage = (temp) => {
    if (temp <= 40 && temp > 30)
        return imageDictionary['4030'];
    else if (temp <= 30 && temp > 25)
        return imageDictionary['3025'];
    else if (temp <= 25 && temp > 20)
        return imageDictionary['2520'];
    else if (temp <= 20 && temp > 10)
        return imageDictionary['2010'];
    else if (temp <= 10 && temp > 0)
        return imageDictionary['100'];
    else if (temp <= 0 && temp > -10)
        return imageDictionary['0-10'];
    else if (temp <= -10 && temp > -20)
        return imageDictionary['-10-20'];
    else if (temp <= -20 && temp > -30)
        return imageDictionary['-20-30'];
    else if (temp <= -30)
        return imageDictionary['-30'];
    else return imageDictionary['def'];
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
        'Roboto': require('./../../assets/fonts/Roboto-Medium.ttf'),
        'PlayfairDisplay': require('./../../assets/fonts/PlayfairDisplay-Bold.ttf'),
        'Tillana': require('./../../assets/fonts/Tillana-SemiBold.ttf')
    });
    if (!fontsLoaded) {
        return <LoadingView />;
    } else {
        return (
            currentWeather.length > 0 && (
                <View style={styles.container}>
                    <View style={styles.currentInfo}>
                        <View style={styles.data}>
                            <View style={styles.todayWeatherContainer}>
                                <Image source={imageDictionary[currentWeather[0].weather[0].icon
                                ] || imageDictionary["02d"]}
                                    style={styles.todayWeatherIcon} />
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
                        <View style={styles.feels}>
                            <Text style={{
                                fontFamily: 'Roboto',
                                textDecorationLine: 'underline',
                                fontSize: 18,
                                color: '#6B7AC9',
                                paddingRight: 11,
                                paddingTop: 5
                            }}>По ощущениям: {Math.round(currentWeather[0].main.feels_like)}°C</Text>
                            <Text style={{
                                fontFamily: 'Roboto',
                                textDecorationLine: 'underline',
                                fontSize: 18,
                                color: '#6B7AC9',
                                paddingLeft: 11,
                                paddingTop: 5
                            }}>Ветер: {Math.round(currentWeather[0].wind.speed)} м/с</Text>
                        </View>
                    </View>
                    <View style={styles.todayInfo}>
                        <ScrollView style={styles.scrollWeather} horizontal={true} showsHorizontalScrollIndicator={true}>
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
                                <View style={{ width: 200, height: 65, }}>
                                    <Text style={{ fontFamily: 'Roboto', alignItems: 'center' }}
                                    >{ChoosePhrase(Math.round(currentWeather[0].main.temp))}</Text>
                                </View>
                            </ImageBackground>
                        </View>
                        <View style={styles.personageContainer}>
                            <Image source={ChoosePersonage(Math.round(currentWeather[0].main.temp))} style={styles.personageImage}></Image>
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
        flex: 2 / 8,
        flexDirection: 'column',
    },
    todayInfo: {
        flex: 2 / 8,
        alignItems: 'center',
    },
    personage: {
        flex: 4 / 8,
        flexDirection: 'column',
    },
    ///////////
    data: {
        flex: 3 / 4,
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    todayWeatherContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 15,
    },
    cityContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 15,
    },
    tempContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 5,
    },
    todayWeatherIcon: {
        height: 50,
        width: 50,
    },
    cityText: {
        fontFamily: 'PlayfairDisplay',
        fontWeight: 'bold',
        fontSize: 36,
        color: '#6B7AC9',
    },
    temp: {
        fontFamily: 'Tillana',
        fontSize: 36,
        fontWeight: 'bold',
        color: '#6B7AC9',
    },
    feels: {
        flex: 1 / 4,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    ///////////
    scrollWeather: {
        left: 0,
        width: '100%',
        height: 150,
        position: 'absolute',
        flexDirection: 'row',
    },
    ///////////
    cloudContainer: {
        flex: 1,
        alignItems: 'center',
    },
    personageContainer: {
        flex: 1,
        alignItems: 'center',
    },
    cloudImage: {
        width: 263,
        height: 166,
        justifyContent: 'flex-end',
        paddingBottom: 15,
        alignItems: 'center',
    },
    personageImage: {
        width: 200,
        height: 200
    }
    /////////////

});

export default Weather;

