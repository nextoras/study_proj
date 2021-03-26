import React, { Component } from 'react';
import { View, ImageBackground, Animated, StyleSheet, Image, Dimensions, ScrollView, Text } from 'react-native';
import ImageSlider from 'react-native-image-slider';

/** Задний фон  */
const back = require("./../../assets/images/background.jpg")

const searchIcon = require("./../../assets/airplane2.png")
const personageCity = require("./../../assets/airplane1.png")

const images = [
    searchIcon, personageCity
]

const HelpView = () => {
    return (
        <ImageBackground source={back} style={styles.back}>
            <View
                style={styles.container}
                flex={1}
            >
                <ImageSlider images={images} />
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    back: {
        flex: 1,
        width: null,
        height: null,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
})

export default HelpView;