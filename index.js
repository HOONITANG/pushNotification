/**
 * @format
 */
import React from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';

// Register background handler
// 가능한 빨리 애플리케이션 로직 외부에서 호출해야합니다.
// onMessage는 앱이 종료되었을 때 받아오지 않아, 
// setBackgroundMessageHandler을 사용해야합니다.
messaging().setBackgroundMessageHandler(async remoteMessage => {
   console.log('Message handled in the background!', remoteMessage);
});

// function HeadlessCheck() {
    
//     const isBackgroundIOS = new Promise((resolve, reject) => { 
//         messaging().getIsHeadless().then(isHeadless => {
//             if (isHeadless) {
//                 resolve(false)
//             }
//         });   

//     })
//     return <App />;

// }
  
  

AppRegistry.registerComponent(appName, () => App);
