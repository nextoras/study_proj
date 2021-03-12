import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import WeatherView from './components/LatLon/WeatherView';
import CityWeatherView from './components/City/CityWeatherView';
import { Image } from 'react-native';
import TestComponent from './components/TestComponent';
import DetailedWeatherView from './components/DetailedWeather/DetailedWeatherView';


/** Навигатор  */
const Stack = createStackNavigator()
const Drawer = createDrawerNavigator()


/** Root component */
const App = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Сегодня">
        <Drawer.Screen name="Сегодня" component={MyStack} options={{
          headerShown: false,
          drawerIcon: ({ }) => (
            <Image
              source={require('./assets/images/menu/today.png')} style={{ width: 20, height: 20, tintColor: 'black' }}
            />)
        }} />
        <Drawer.Screen name="7 дней" component={DetailedWeatherView} options={{
          headerShown: false,
          drawerIcon: ({ }) => (
            <Image
              source={require('./assets/images/menu/calendar.png')} style={{ width: 20, height: 20, tintColor: 'black' }}
            />)
        }} />
        <Drawer.Screen name="Игра" component={TestComponent} options={{
          headerShown: false,
          drawerIcon: ({ }) => (
            <Image
              source={require('./assets/images/menu/game.png')} style={{ width: 20, height: 20, tintColor: 'black' }}
            />)
        }} />
        <Drawer.Screen name="Настройки" component={TestComponent} options={{
          headerShown: false,
          drawerIcon: ({ }) => (
            <Image
              source={require('./assets/images/menu/settings.png')} style={{ width: 20, height: 20, tintColor: 'black' }}
            />)
        }} />
        <Drawer.Screen name="Помощь" component={TestComponent} options={{
          headerShown: false,
          drawerIcon: ({ }) => (
            <Image
              source={require('./assets/images/menu/help.png')} style={{ width: 20, height: 20, tintColor: 'black' }}
            />)
        }} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const MyStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="WeatherView"
        component={WeatherView}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="CityWeatherView" component={CityWeatherView} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}

export default App;
