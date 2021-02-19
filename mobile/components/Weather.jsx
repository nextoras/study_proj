import React from 'react';
import { Text, StyleSheet, View, Image, ImageBackground } from 'react-native';
import { Container, CurrentDay, City, BigText, Description, Week } from './Styles';
import {
    useFonts,
    PlayfairDisplay_700Bold,
} from '@expo-google-fonts/playfair-display';
import { AppLoading } from 'expo';

const todayIconWeather = require("../assets/icons/01d.png");
const editIcon = require("../assets/icons/settings.png");
const personage = require("../assets/icons/zombie2.png");
const cloudPers = require("../assets/images/cloudWords.png");
const scrollWeather = require("../assets/images/scrollWeather.png");


/** Вью погоды*/
const Weather = () => {
    let [fontsLoaded] = useFonts({
        PlayfairDisplay_700Bold,
    });
    if (!fontsLoaded) {
        return <AppLoading />;
    } else {
        return (
            <View style={styles.container}>
                <View style={styles.currentInfo}>
                    <View style={styles.todayWeatherContainer}>
                        <Image source={todayIconWeather} style={styles.todayWeatherIcon}></Image>
                    </View>
                    <View style={styles.cityContainer}>
                        <Text style={styles.cityText}>Казань</Text>
                    </View>
                    <View style={styles.tempContainer}>
                        <Text style={styles.temp}>-21</Text>
                    </View>
                    <View style={styles.editContainer}>
                        <Image source={editIcon} style={styles.settings}></Image>
                    </View>
                </View>
                <View style={styles.todayInfo}>
                    <Image source={scrollWeather} style={styles.scrollWeather}></Image>
                </View>
                <View style={styles.personage}>
                    <View style={styles.cloudContainer}>
                        <ImageBackground source={cloudPers} style={styles.cloudImage}>
                            <Text style={{ alignItems: 'center' }}>{'\n\n           \u{1F60D},\nна улице довольно \nхолодно. стоит надеить свитер'}</Text>
                        </ImageBackground>
                    </View>
                    <View style={styles.personageContainer}>
                        <Image source={personage} style={styles.personageImage}></Image>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'column',
    },
    currentInfo: {
        flex: 3 / 5,
        flexDirection: 'row',
    },
    todayInfo: {
        flex: 2 / 5,
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
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    tempContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    editContainer: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 40
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
    settings: {
        height: 50,
        width: 50,
    },
    ///////////
    scrollWeather: {
        height: 97,
        width: 350,
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
        justifyContent: 'center',
        alignItems: 'center',
    },
    personageImage: {
        width: 200,
        height: 200
    }
});

export default Weather;

