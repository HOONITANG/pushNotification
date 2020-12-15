import messaging from '@react-native-firebase/messaging';

export default notification = async function() {
    return {
        // iOS badge, alert, .. Permission을 체크하고,
        // Permission이 없는 경우 권한 허락 alert창을 호출 합니다.
        // -1 = messaging.AuthorizationStatus.NOT_DETERMINED: Permission has not yet been requested for your application.
            // 0 = messaging.AuthorizationStatus.DENIED: The user has denied notification permissions.
            // 1 = messaging.AuthorizationStatus.AUTHORIZED: The user has accept the permission & it is enabled.
            // 2 = messaging.AuthorizationStatus.PROVISIONAL: Provisional authorization has been granted.
        requestPermission: () => {
            const authStatus = await messaging().requestPermission();
            const enabled =
                authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                authStatus === messaging.AuthorizationStatus.PROVISIONAL;

            return enabled;
        },
        // Topic 구독
        subscribeToTopic: (topic) => {
            await messaging().subscribeToTopic(topic);
        },
        // Topic 구독 해제
        unSubscribeToTopic: (topic) => {
            await messaging().unsubscribeFromTopic(topic);
        },
        createNotificationListeners: () => {
            //애플리케이션이 실행 중이지만 백그라운드에있을 때.
            this.notificationOpenedListener = messaging().onNotificationOpenedApp((remoteMessage) => {
                console.log(
                    'Notification caused app to open from background state:',
                    remoteMessage.notification,
                );
                //navigation.navigate(remoteMessage.data.type);
            });
            // 종료 상태에서 알림을 클릭해서 앱을 실행 했을 떄,
            // 너무 빨리 호출하면(생성자, 전역 범위내에서), 알림 데이터를 사용 할 수 없습니다.
            this.closedAppNotificationListener = messaging().getInitialNotification().then((remoteMessage) => {
                if (remoteMessage) {
                    alert("App Closed Push Notification opened")
                }
            });
        },
        createStateMessage: () => {
            const unsubscribe = messaging().onMessage(async remoteMessage => {
                Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
            });
        }
        
    }
}