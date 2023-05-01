import React, { Component } from 'react';
import {
  View, Image, StyleSheet, Text, TouchableOpacity, Modal,
} from 'react-native';
import Images from '../images/Images';

export default class Settings extends Component {
  state = {
    showModal: false,
  };

  handleFavRoom = () => {
    // Code to handle changing the favorite room
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
        <TouchableOpacity style={styles.logoutButton} onPress={this.handleFavRoom}>
          <Text style={styles.buttonText}>Change Favorite Room</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.helpButton} onPress={this.toggleModal}>
          <Text style={styles.helpButtonText}>Help and FAQ</Text>
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
            <Text style={styles.faqText}>
              This is the Help and FAQ section. Here you can find answers to frequently asked
              questions about the app.
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
    color: '#9b59b6',
  },
  faqText: {
    fontSize: 18,
    marginBottom: 10,
  },
});
