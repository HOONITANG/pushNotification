import messaging from '@react-native-firebase/messaging';

export default notification = {
        // iOS badge, alert, .. Permission을 체크하고,
        // Permission이 없는 경우 권한 허락 alert창을 호출 합니다.
        // -1 = messaging.AuthorizationStatus.NOT_DETERMINED: Permission has not yet been requested for your application.
            // 0 = messaging.AuthorizationStatus.DENIED: The user has denied notification permissions.
            // 1 = messaging.AuthorizationStatus.AUTHORIZED: The user has accept the permission & it is enabled.
            // 2 = messaging.AuthorizationStatus.PROVISIONAL: Provisional authorization has been granted.
        requestPermission: async () => {
            await messaging().requestPermission();
            const authStatus = await messaging().requestPermission();
            const enabled =
                authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                authStatus === messaging.AuthorizationStatus.PROVISIONAL;

            return enabled;
        },
        // Topic 구독
        subscribeToTopic: async (topic) => {
            await messaging().subscribeToTopic(topic);
        },
        // Topic 구독 해제
        unsubscribeFromTopic: async (topic) => {
            await messaging().unsubscribeFromTopic(topic);
        },
        createNotificationListeners: async () => {
            // 애플리케이션이 실행 중이지만 백그라운드에있을 때,
            // 알림을 클릭하면 실행됩니다.
            messaging().onNotificationOpenedApp((remoteMessage) => {
                alert("Notification caused app to open from background state")
                console.log(
                    'Notification caused app to open from background state:',
                    remoteMessage.notification,
                );
                //navigation.navigate(remoteMessage.data.type);
            });
            // 종료 상태에서 알림을 클릭해서 앱을 실행 했을 떄,
            // ComponentDidMount와 같은 생명주기에서 사용해야합니다.
            // 너무 빨리 호출하면(생성자, 전역 범위내에서), 알림 데이터를 사용 할 수 없습니다.
            messaging().getInitialNotification().then((remoteMessage) => {
                if (remoteMessage) {
                    alert("App Closed Push Notification opened")
                }
            });
        },
        // foreground에 있을 때 
        // notification이 오면 호출되는 함수입니다.
        // ComponentDidMount에서 사용하고, 메모리 낭비를 줄이기 위해 
        // componentWillUnmount 에서 할당해제해줍니다.
        createStateMessage: async () => {
            const unsubscribe = messaging().onMessage(async remoteMessage => {
                Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
            });
        },
        getToken: async () => {
            let fcmToken = await messaging().getToken();
            console.log(JSON.stringify(fcmToken));

            // 토큰 캐시화 생각해보자.
            // let fcmTokenAsync = await AsyncStorage.getItem('fcmToken');
            // if (fcmTokenAsync !== fcmToken) {
            //   fcmToken = await firebase.messaging().getToken();
            //   if (fcmToken) {
            //     console.log('fcmToken:', fcmToken);
            //     await AsyncStorage.setItem('fcmToken', fcmToken);
            //   }
            // }
        }
    }