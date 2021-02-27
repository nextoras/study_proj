import React from "react";
import { ImageBackground, StyleSheet, View, Text, Image } from "react-native";

/** Задний фон  */
const back = require("./../assets/images/background.jpg")
const icon = require("./../assets/icon.png")

const LoadingView = (props) => {

  return (
    <ImageBackground source={back} style={styles.image}>
      <View style={styles.container}>
        <Image source={icon} style={styles.icon} />
        <Text style={styles.load}>Загрузка...</Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  image: {
    flex: 1,
    width: null,
    height: null,
  },
  icon: {
    width: 168,
    height: 168,
    paddingBottom: 40,
  },
  load: {
    fontSize: 24,
    fontWeight: '100',
    color: '#6B7AC9',
    paddingTop: 20,
  }
});

export default LoadingView;
