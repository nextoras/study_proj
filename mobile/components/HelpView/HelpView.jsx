import React from 'react';
import { View, ImageBackground, StyleSheet } from 'react-native';
import ImageSlider from 'react-native-image-slider';
import imageDictionary from './../../utils/imageDictionary';

const images = [
    imageDictionary['1hv'], imageDictionary['2hv'], imageDictionary['3hv'], imageDictionary['4hv'], imageDictionary['5hv'], imageDictionary['6hv'], imageDictionary['7hv'],
    imageDictionary['8hv'], imageDictionary['9hv'], imageDictionary['10hv'],
]

const HelpView = () => {
    return (
        <ImageBackground source={imageDictionary['background']} style={styles.back}>
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