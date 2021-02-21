import React from 'react';
import useWeather from "./utils/useWeather";
import { ImageBackground, StyleSheet, Text } from 'react-native';
import Weather from './components/Weather';


/** Задний фон  */
const back = require("./assets/images/background.jpg")

const App = () => {
  const weather = useWeather();
  return (
    <ImageBackground source={back} style={styles.container}>
      {!weather ? <Text>Don't work</Text> : <Weather forecast={weather} />}
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


export default App;