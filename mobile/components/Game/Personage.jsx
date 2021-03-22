import React from 'react';
import { View, Image } from 'react-native';
import imageDictionary from './../../utils/imageDictionary'

const Personage = ({ birdBottom, birdLeft }) => {
    const birdWidth = 50
    const birdHeight = 60

    return (
        <Image source={imageDictionary['def']} style={{
            position: 'absolute',
            width: birdWidth,
            height: birdHeight,
            left: birdLeft - (birdWidth / 2),
            bottom: birdBottom - (birdHeight / 2),
        }} ></Image>
    )
}

export default Personage