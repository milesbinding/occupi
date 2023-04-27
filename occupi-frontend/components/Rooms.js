import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Images from '../images/Images';
import moment from 'moment';

class Rooms extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      devices: [],
      error: null
    };

    // bind component methods to the component instance, this ensures the component refreshes
    this.handleGetDevices = this.handleGetDevices.bind(this);
  }

  componentDidMount() {
    this.handleGetDevices();
    this.interval = setInterval(() => this.handleGetDevices(), 30000); // seconds
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  async handleGetDevices() {
    try {
      const response = await fetch(`http://localhost:8080/devices`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        },
      });
      if (response.status === 200) {
        const data = await response.json();
        this.setState({
          isLoading: false,
          devices: data,
          error: null,
        });
      } else {
        this.setState({
          isLoading: false,
          devices: null,
          error: `Devices not found. ${error}`,
        });
      }
    } catch (error) {
      console.log(error);
      this.setState({
        isLoading: false,
        devices: null,
        error: `Something went wrong. ${error}`,
      });
    }
  }

    calculateOccupancy(distance, sightings) {
    // Define a constant for the maximum distance
    const max = 100;
  
    // Calculate the percentage of occupancy based on the distance and sightings
    let occupancy = 0;
    if (distance <= max) {
      occupancy = ((max - distance) / max) * (sightings / 100) * 100; 
      
      // sightings / 10, 20, 50 is the factor that determines how much the percentage is affected.
    }
  
    // Round the occupancy to two decimal places
    occupancy = Math.round(occupancy * 100) / 100;
  
    // Return the occupancy percentage
    return occupancy;
  }
  

  render() {
    const { isLoading, devices } = this.state;

    if (isLoading) {
      return (
        <View style={styles.container}>
          <Text style={styles.loadingText}>Loading rooms...</Text>
        </View>
      );
    }

    if (this.state.error || !devices) {
      return (
        <View style={styles.container}>
          <Text style={styles.errorText}>{this.state.error || 'No devices found.'}</Text>
          <TouchableOpacity onPress={this.handleGetDevices} style={styles.refreshButton}>
            <Text style={styles.refreshButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <Image style={styles.image} source={Images.logo} />
        <Text style={styles.text}>Welcome to Room 1. The devices here refresh every 30 seconds.</Text>
        <ScrollView style={styles.scroll}>
          {devices.map(device => (
            <View style={styles.box} key={device.name}>
              <Text style={styles.name}>{` ${device.name}`}</Text>
              <Text style={styles.text}>{device.distance.substr(0, 4) + " meters away."}</Text>
              <Text style={styles.text}>{"Last seen on " + moment(device.time_stamp).format("DD-MM-YYYY hh:mm A") + "."}</Text>
              <Text style={styles.text}>{"Seen " + device.counter + " times."}</Text>
              <Text style={styles.text}>{"Estimated occupancy: " + this.calculateOccupancy(device.distance, device.counter) + "% chance."}</Text>
            </View>
          ))}
        </ScrollView>
        <TouchableOpacity onPress={this.handleGetDevices} style={styles.refreshButton}>
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  image: {
    height: 200,
    width: 200,
  },
  loadingText: {
    fontSize: 20,
  },
  scroll: {
    flex: 1,
  },
  box: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
    alignSelf: 'center',
    paddingLeft: 20,
    paddingRight: 20,
  },
  refreshButton: {
    width: '50%',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#97deba',
  },
  refreshButtonText: {
    color: 'black',
    fontSize: 18,
  },
  errorText: {
    color: 'red',
    fontSize: 20,
    padding: 10,
    textAlign: 'center',
    alignSelf: 'center',
  },
  placeholderText: {
    fontSize: 20,
    marginBottom: 30,
  },
});

export default Rooms;