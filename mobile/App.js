import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WeatherView from './components/LatLon/WeatherView';
import CityWeatherView from './components/City/CityWeatherView';

/** Навигатор  */
const Stack = createStackNavigator();

/** Root component */
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="WeatherView">
        <Stack.Screen name="WeatherView" component={WeatherView} options={{ headerShown: false }} />
        <Stack.Screen name="CityWeatherView" component={CityWeatherView} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;