import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Rooms from './components/Rooms';
import Settings from './components/Settings';

export default class HomeNav extends Component {
  render() {
    const Tab = createBottomTabNavigator();

    return (
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={{
              headerShown: false, 
              lazy: false, //set to render on first initial render
            }}
            initialRouteName="Rooms"
          >
            <Tab.Screen name="Rooms" component={Rooms} />
            <Tab.Screen name="Settings" component={Settings} />
          </Tab.Navigator>
        </NavigationContainer>
    );
  }
}
