import messaging from '@react-native-firebase/messaging';

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}

function onMessage() {
    messaging().onMessage( async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    }); 
}

function subscribeToTopic() {
  messaging()
  .subscribeToTopic('weather')
  .then(() => console.log('Subscribed to topic!'));
}

function unsubscribeFromTopic() {
  messaging()
  .unsubscribeFromTopic('weather')
  .then(() => console.log('Unsubscribed fom the topic!'));
}

function getToken() {
    messaging()
      .getToken()
      .then(token => {
        // 서버에 저장
        console.log(token);
      });
}

function onTokenRefresh() {
  messaging().onTokenRefresh(token => {
    saveTokenToDatabase(token);
  });
}

export {
  requestUserPermission, 
  onMessage, 
  getToken, 
  subscribeToTopic, 
  unsubscribeFromTopic, 
  onTokenRefresh 
}