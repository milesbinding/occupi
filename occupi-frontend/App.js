import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
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
            <Tab.Screen 
              name="Rooms" 
              component={Rooms} 
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Icon name="home" color={color} size={size} />
                ),
              }}
            />
            <Tab.Screen 
              name="Settings" 
              component={Settings} 
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Icon name="settings" color={color} size={size} />
                ),
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
    );
  }
}
