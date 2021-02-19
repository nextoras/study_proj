import React from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import Weather from './components/Weather';

const back = require("./assets/images/background.jpg")

export default function App() {
  return (
    <ImageBackground source={back} style={styles.container}>
      <Weather />
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


