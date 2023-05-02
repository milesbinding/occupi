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
    this.getTimestampDifference = this.getTimestampDifference.bind(this);
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
        const currentTime = moment();
        const filteredDevices = data.filter(device => {
          const deviceTimestamp = moment(device.current_time_stamp);
          const diffMinutes = currentTime.diff(deviceTimestamp, 'minutes');
          return diffMinutes <= 5;
        });
        const deletePromises = data.filter(device => {
          const deviceTimestamp = moment(device.current_time_stamp);
          const diffMinutes = currentTime.diff(deviceTimestamp, 'minutes');
          return diffMinutes > 5;
        }).map(device => {
          return fetch(`http://localhost:8080/devices/${device.mac}`, {
            method: 'DELETE',
          });
        });
        await Promise.all(deletePromises);
        this.setState({
          isLoading: false,
          devices: filteredDevices,
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
        error: `${error}, API is not running.`,
      });
    }
  }

  getTimestampDifference(startTime, endTime) {
    const moment1 = moment(startTime);
    const moment2 = moment(endTime);
    const duration = moment.duration(moment2.diff(moment1));
    const hours = duration.asHours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();

    let timeString = '';

    if (hours >= 1) {
      timeString += `${Math.floor(hours)} hour${hours >= 2 ? 's' : ''}, `;
    }

    if (minutes >= 1 && hours < 1) {
      timeString += `${minutes} minute${minutes >= 2 ? 's' : ''}, `;
    }

    if (seconds >= 1 && hours < 1 && minutes < 1) {
      timeString += `${seconds} second${seconds >= 2 ? 's' : ''}, `;
    }

    // Remove the trailing comma and space
    timeString = timeString.replace(/,\s$/, '');

    return timeString;
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

    if (this.state.error || !devices || devices.length === 0) {
      return (
        <View style={styles.container}>
          <Image style={styles.image} source={Images.logo} />
          <Text style={styles.errorText}>{this.state.error || 'No devices are currently in the room.'}</Text>
          <TouchableOpacity onPress={this.handleGetDevices} style={styles.refreshButton}>
            <Text style={styles.refreshButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <Image style={styles.image} source={Images.logo} />
        <Text style={styles.text}>Welcome to Room 1. The devices here refresh every 30 seconds. There are currently {devices.length} in the room!</Text>
        <ScrollView style={styles.scroll}>
          {devices.map(device => (
            <View style={styles.box} key={device.name}>
              <Text style={styles.name}>{` ${device.name}`}</Text>
              <Text style={styles.text}>{device.distance.substr(0, 4) + " meters away."}</Text>
              <Text style={styles.text}>{"Last seen: " + moment(device.current_time_stamp).format("dddd, Do MMMM YYYY, HH:mm A") + "."}</Text>
              <Text style={styles.text}>{"Seen " + device.counter + " times."}</Text>
              <Text style={styles.text}>{"Time spent in room: " + this.getTimestampDifference(device.first_time_stamp, device.current_time_stamp)}</Text>
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
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
    color: 'green',
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