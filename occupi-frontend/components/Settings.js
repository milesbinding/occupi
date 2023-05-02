import React, { Component } from 'react';
import {
  View, Image, StyleSheet, Text, TouchableOpacity, Modal, BackHandler
} from 'react-native';
import Images from '../images/Images';

export default class Settings extends Component {
  state = {
    showModal: false,
  };

  handleExitApp = () => {
      BackHandler.exitApp();
  };

  toggleModal = () => {
    this.setState((prevState) => ({
      showModal: !prevState.showModal,
    }));
  };

  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.image} source={Images.logo} />
        <Text style={styles.title}>Settings</Text>
        <TouchableOpacity style={styles.helpButton} onPress={this.toggleModal}>
          <Text style={styles.helpButtonText}>Help & FAQ's</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={this.handleExitApp}>
          <Text style={styles.buttonText}>Exit App</Text>
        </TouchableOpacity>
        
        <Modal
          visible={this.state.showModal}
          onRequestClose={this.toggleModal}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={this.toggleModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
            <Text style={styles.title}>
              Help & FAQ's
            </Text>

            <Text style={styles.faqQuestion}>
              What is this project/app?
            </Text>

            <Text style={styles.faqText}>
              This project, Occupi, aims to measure the occupancy of a room using a Raspberry Pi, Bluetooth,
              and Python. The collected data is extracted and stored in a Spring Boot + Maven API
              written in Java, which can be accessed via this React Native JavaScript mobile front-end.
            </Text>

            <Text style={styles.faqQuestion}>
              What does the app do?
            </Text>

            <Text style={styles.faqText}>
              This app gathers data from surrounding Bluetooth devices and displays it in a clean, user friendly
              way. This allows the user to make decisions on whether they want to go to the room, based on the 
              number of people occupying the room at the current time.
            </Text>

            <Text style={styles.faqQuestion}>
              What data is collected?
            </Text>

            <Text style={styles.faqText}>
              Data gathered from the app is as followed: 

              - Device name,
              - MAC Address,
              - Distance from Bluetooth beacon,
              - Timestamp when device entered the room,
              - Timestamp of device when last seen 
              - Number of times the device has been seen.

              All of this data is persisted in a database for as long as the device is in the room,
              or 5 minutes after the device was last seen in the room.
            </Text>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    height: 200,
    width: 200,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  logoutButton: {
    width: '60%',
    height: 50,
    borderRadius: 25,
    backgroundColor: '#97deba',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
  },
  helpButton: {
    width: '60%',
    height: 50,
    borderRadius: 25,
    backgroundColor: '#97deba',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  helpButtonText: {
    color: 'black',
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: 'white',
    paddingHorizontal: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 10,
    marginRight: 10,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#97deba',
  },
  faqText: {
    fontSize: 18,
    marginBottom: 10,
  },
  faqQuestion: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
});
