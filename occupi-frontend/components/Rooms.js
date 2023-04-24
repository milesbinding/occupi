import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Images from '../images/Images';
import moment from 'moment';

class Rooms extends Component {
  state = {
    isLoading: true,
    user: {},
  };

  componentDidMount() {
    this.handleGetDevices();
  }

  async handleGetDevices() {
    try {
      const response = await fetch(`http://localhost:8080/devices/DC:68:EB:3B:7F:5A`, {
        method: 'GET',
        headers: {
          'Accept':'application/json'
        },
      });
      const data = await response.json();
      this.setState({
        isLoading: false,
        device: data,
      });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const { isLoading, device } = this.state;

    if (isLoading) {
      return (
        <View style={styles.container}>
          <Text style={styles.loadingText}>Loading rooms...</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <Image style={styles.image} source={Images.logo} />
        <Text style={styles.name}>{` ${device.mac}`}</Text>
        <Text style={styles.text}>{device.distance.substr(0, 4) + " meters away."}</Text>
        <Text style={styles.text}>{"Last seen on " + moment(device.time_stamp).format("DD-MM-YYYY") + "."}</Text>
        <Text style={styles.text}>{"Seen " + device.counter + " times."}</Text>
        <TouchableOpacity onPress={this.handleGetDevices} style={styles.refreshButton}>
          <Text style={styles.refreshButtonText}>Refresh Device</Text>
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
    marginBottom: 10,
  },
  loadingText: {
    fontSize: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 30,
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
});

export default Rooms;