import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
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
    this.interval = setInterval(() => this.handleGetDevices(), 30000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  async handleGetDevices() {
    try {
      const response = await fetch(`http://localhost:8080/devices`, {
        method: 'GET',
        headers: {
          'Accept':'application/json'
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
        {devices.map(device => (
          <View style={styles.box} key={device.mac}>
            <Text style={styles.name}>{` ${device.mac}`}</Text>
            <Text style={styles.text}>{device.distance.substr(0, 4) + " meters away."}</Text>
            <Text style={styles.text}>{"Last seen on " + moment(device.time_stamp).format("DD-MM-YYYY hh:mm A") + "."}</Text>
            <Text style={styles.text}>{"Seen " + device.counter + " times."}</Text>
          </View>
        ))}
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
    height: 250,
    width: 250,
    marginBottom: 10,
  },
  loadingText: {
    fontSize: 20,
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