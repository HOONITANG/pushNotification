import React, {Component, useEffect} from 'react';
import {StyleSheet, Text, View, Alert, TouchableOpacity } from 'react-native';
import messaging from '@react-native-firebase/messaging';
// import firebase from 'react-native-firebase';
import {
  requestUserPermission, 
  onMessage, 
  getToken, 
  subscribeToTopic, 
  unsubscribeFromTopic, 
  onTokenRefresh 
} from './NotificationHandler';

export default class App extends Component{
  async componentDidMount() {
    
    this.requestPermission();
    this.checkPermission();
    this.createNotificationListeners();
  }

  componentWillUnmount() {
    this.notificationListener;
    this.notificationOpenedListener;
  }

  //Check whether Push Notifications are enabled or not
  async checkPermission() {
    const enabled = await messaging().hasPermission();
    if (enabled) {
      this.getToken();
    } else {
      this.requestPermission();
    }
  }

  //Get Device Registration Token
  async getToken() {
    let fcmToken = await messaging().getToken();

    console.log(JSON.stringify(fcmToken));
    // let fcmToken = await AsyncStorage.getItem('fcmToken');
    // if (!fcmToken) {
    //   fcmToken = await firebase.messaging().getToken();
    //   if (fcmToken) {
    //     console.log('fcmToken:', fcmToken);
    //     await AsyncStorage.setItem('fcmToken', fcmToken);
    //   }
    // }
  }

  //Request for Push Notification
  // async requestPermission() {
  //   try {
  //     await messaging().requestPermission()
  //     //await firebase.messaging().requestPermission();
  //     // If user allow Push Notification
  //     this.getToken();
  //   } catch (error) {
  //     // If user do not allow Push Notification
  //     console.log('Rejected');
  //   }
  // }

  async  requestPermission() {
    const authorizationStatus = await messaging().requestPermission();
    this.getToken();
    if (authorizationStatus) {
      console.log('Permission status:', authorizationStatus);
    }
  }
  async subscribeToTopic() {
    const subscribe = await messaging().subscribeToTopic('weather')
    if (subscribe) {
      console.log('Subscribed to topic!', subscribe)
    }
  }

  async unSubscribeToTopic() {
    const unSubscribe = await messaging().unsubscribeFromTopic('weather')
    if (unSubscribe) {
      console.log('unSubscribe to topic!', unSubscribe)
    }
  }

  async createNotificationListeners() {
     // Register background handler
     // 이건 안잡히는데
     messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });
    messaging().onMessage( async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    }); 
    // If your app is in Foreground
   
    // this.notificationListener = onMessage
    
    // firebase.notifications().onNotification((notification) => {
    //     const localNotification = new firebase.notifications.Notification({
    //       show_in_foreground: true,
    //     })
    //     .setNotificationId(notification.notificationId)
    //     .setTitle(notification.title)
    //     .setBody(notification.body)

    //     firebase.notifications()
    //       .displayNotification(localNotification)
    //       .catch(err => console.error(err));
    // });


    // When a user tap on a push notification and the app is in background
    this.backgroundNotificationListener = messaging().onNotificationOpenedApp(async (remoteMessage) => {
        alert("Background Push Notification opened")
    });
    // When a user tap on a push notification and the app is CLOSED
    this.closedAppNotificationListener = messaging().getInitialNotification().then((remoteMessage) => {
      if (remoteMessage) {
        alert("App Closed Push Notification opened")
      }
    });
    // When a user receives a push notification and the app is in foreground
    // this.onMessageListener = messaging().onMessage(() => {
    //     alert("Foreground Push Notification opened")
    // });


    //If your app is in background
    // back ground에서 알람 눌러서 돌아왔을떄,

    // this.notificationOpenedListener = messaging().onNotificationOpenedApp((notificationOpen) => {
    //   const { title, body } = notificationOpen.notification;
    //   console.log('onNotificationOpened:');
    //   Alert.alert(title, body)
    // });


    // // If your app is closed

    // const notificationOpen = await messaging().getInitialNotification();
    // if (notificationOpen) {
    //   console.log('getInitialNotification:');
    // }

    // For data only payload in foreground

    this.messageListener = messaging().onMessage ((message) => {
      //process data message
      console.log("Message", JSON.stringify(message));
    });
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