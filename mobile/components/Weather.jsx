import React from 'react';
import { Text, StyleSheet, View, Image } from 'react-native';
import { Container, CurrentDay, City, BigText, Description, Week } from './Styles';
// import {
//     useFonts,
//     Tillana_700Bold,
// } from '@expo-google-fonts/tillana';
// import { AppLoading } from 'expo';

const todayIconWeather = require("../assets/icons/01d.png");
const editIcon = require("../assets/icons/settings.png");
const personage = require("../assets/icons/zombie2.png");
const cloudPers = require("../assets/icons/cloudPers.png");


/** Вью погоды*/
const Weather = () => {
    // let [fontsLoaded] = useFonts({
    //     Tillana_700Bold,
    // });

    // if (!fontsLoaded) {
    //     return <AppLoading />;
    // } else {
    return (
        <View style={styles.container}>
            <View style={styles.currentInfo}>
                <View style={styles.todayWeatherContainer}>
                    <Image source={todayIconWeather} style={styles.todayWeatherIcon}></Image>
                </View>
                <View style={styles.cityContainer}>
                    <Text style={styles.cityText}>City</Text>
                </View>
                <View style={styles.tempContainer}>
                    <Text style={styles.temp}>-21</Text>
                </View>
                <View style={styles.editContainer}>
                    <Image source={editIcon} style={styles.settings}></Image>
                </View>
            </View>
            <View style={styles.todayInfo}>
                <Week horizontal={true} showsHorizontalScrollIndicator={false}>
                    {/* {daysByHour.map((day, index) => (
                            <Card
                                key={index}
                                icon={day.icon}
                                name={day.name.substring(0, 3)}
                                temp={day.temp}
                                hour={day.hour}
                            />
                        ))} */}
                </Week>
            </View>
            <View style={styles.personage}>
                <View style={styles.cloudContainer}>
                    <Image source={cloudPers} style={styles.cloudImage}></Image>
                </View>
                <View style={styles.personageContainer}>
                    <Image source={personage} style={styles.personageImage}></Image>
                </View>
            </View>
        </View>
    )
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
    },
    personage: {
        flex: 1,
        flexDirection: 'column'
    },
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
        fontWeight: 'bold',
        fontSize: 35,
        color: '#6B7AC9',
        paddingBottom: 20,
    },
    temp: {
        fontWeight: 'bold',
        fontSize: 35,
        color: '#6B7AC9',
        paddingBottom: 20,
    },
    settings: {
        height: 50,
        width: 50,
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
        height: 200
    },
    personageImage: {
        width: 200,
        height: 200
    }
});

export default Weather;

