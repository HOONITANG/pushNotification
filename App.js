import React, {Component, useEffect} from 'react';
import {StyleSheet, Text, View, Alert, TouchableOpacity } from 'react-native';
import messaging from '@react-native-firebase/messaging';

import notification from './notification'
export default class App extends Component{
  async componentDidMount() {
    await notification.createNotificationListeners();
    await notification.requestPermission();
    await notification.getToken();
  }


  async subscribeToTopic() {
    await notification.subscribeToTopic('weather')
  }

  async unSubscribeToTopic() {
    await notification.unsubscribeFromTopic('weather')
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Push Notification Demo</Text>
        <TouchableOpacity 
              activeOpacity={0.6} 
              onPress={() => this.subscribeToTopic()}>
          <View style={styles.button}>
                <Text style={styles.buttonTitle}>
              subscribeToTopic
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity 
              activeOpacity={0.6} 
              onPress={() => this.unSubscribeToTopic()}>
          <View style={styles.button}>
                <Text style={styles.buttonTitle}>
              unSubscribeToTopic
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  button: {
    padding: 16,
    backgroundColor: 'blue',
    alignItems: 'center',
    borderRadius: 24,
    margin: 16,
  },
  buttonTitle: {
    color: 'white'
  }
});