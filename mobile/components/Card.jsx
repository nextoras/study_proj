import React from "react";
import { Text, StyleSheet, View, Image } from 'react-native';

/** Кард погоды   */
export default function Card({ name, icon, temp, hour }) {
  return (
    <View style={styles.day}>
      <Image style={styles.icon} source={icon} />
      <Text style={styles.text}>{name}</Text>
      <Text style={styles.text}>{temp}°C</Text>
      <Text style={styles.text}>{hour}h</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  day: {
    height: 150,
    width: 75,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 50,
    height: 50,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6B7AC9',
  },
})