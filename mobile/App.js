import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Test from './components/Test';
import WeatherView from './components/WeatherView';



/** Навигатор  */
const Drawer = createDrawerNavigator();

/** Root component */
const App = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="WeatherView">
        <Drawer.Screen name="WeatherView" component={WeatherView} />
        <Drawer.Screen name="Test" component={Test} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default App;