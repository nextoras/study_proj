import React from "react";
import { Text, StyleSheet, View, } from 'react-native';

/** Тестовый компонент   */
const TestComponent = () => {
    return (
        <View style={styles.day}>
            <Text style={styles.text}>Тест</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    day: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#6B7AC9',
    },
})

export default TestComponent;