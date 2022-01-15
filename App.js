// import SplashScreen from 'react-native-splash-screen';
import React, {useState, useEffect, useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Linking,
  AppState,
  // TouchableOpacity,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './screens/Home';
import SignUp2 from './screens/SignUp2';

import TabBar from './components/TabBar';
import {TabNavHeader} from './components/TabNavHeader';
import {HomeStackHeader} from './components/HomeStackHeader';
import FlashMessage from 'react-native-flash-message';
import Login from './screens/Login';
import More from './screens/More';
import AlarmTab from './screens/AlarmTab';
import ProfileTab from './screens/ProfileTab';
import {MoreStackHeader} from './components/MoreStackHeader';
import ForgetPassword from './screens/ForgetPassword';
import notifee, {EventType} from '@notifee/react-native';
import auth from '@react-native-firebase/auth';
// import IIcon from 'react-native-vector-icons/Ionicons';
import SplashScreen from 'react-native-splash-screen';
import Snooze from './screens/Snooze';
import {finalCheck} from './Utils/getLocationPermission';

const Stack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

const LoginNavigation = () => (
  <Stack.Navigator
    screenOptions={{header: () => null}}
    initialRouteName={'Login'}>
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="SignUp" component={SignUp2} />
    <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
  </Stack.Navigator>
);

const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={({route}) => ({
        header: HomeStackHeader,
      })}
      initialRouteName={'Home'}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Snooze" component={Snooze} />
    </Stack.Navigator>
  );
};

const MoreStack = ({navigation}) => {
  return (
    <Stack.Navigator
      screenOptions={({route}) => ({
        header: MoreStackHeader,
      })}
      initialRouteName={'More'}>
      <Stack.Screen name="More" component={More} />
    </Stack.Navigator>
  );
};

const Header = () => {
  return (
    <View
      style={{
        padding: 10,
        paddingHorizontal: 20,
        backgroundColor: '#4094C1',
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      {/* <TouchableOpacity onPress={() => props.navigation.goBack()}>
        <IIcon
          name="ios-chevron-back"
          size={25}
          color="#fff"
          style={{padding: 10}}
        />
      </TouchableOpacity> */}
      <Text
        style={{fontSize: 20, fontWeight: '500', color: '#fff', marginLeft: 5}}>
        Alarms
      </Text>
    </View>
  );
};

const HomeNavigation = () => (
  <Tab.Navigator
    tabBar={props => <TabBar {...props} />}
    tabBarHideOnKeyboard
    screenOptions={({route}) => ({
      header: TabNavHeader,
    })}>
    <Tab.Screen name="LocationTab" component={HomeStack} />
    <Tab.Screen
      name="AlarmTab"
      options={{
        tabBarLabel: '',
        header: Header,
      }}
      component={AlarmTab}
    />
    <Tab.Screen name="SettingTab" component={ProfileTab} />
    <Tab.Screen name="LogOutTab" component={MoreStack} />
  </Tab.Navigator>
);

const deepLinksConf = {
  screens: {
    HomeNavigation: {
      initialRouteName: 'LocationTab',
      screens: {
        AlarmTab: 'AlarmTab',
        LocationTab: {
          screens: {
            initialRouteName: 'Home',
            Snooze: 'Snooze',
          },
        },
      },
    },
  },
};

const linking = {
  prefixes: ['erminder://', 'https://erminder.com'],
  config: deepLinksConf,
  async getInitialURL() {
    // Check if app was opened from a deep link
    const url = await Linking.getInitialURL();

    if (url != null) {
      return url;
    }

    // Check if there is an initial firebase notification
    const message = await notifee.getInitialNotification();

    // Get deep link from data
    // if this is undefined, the app will open the default/home page
    if (message?.notification?.data?.link) {
      return `${message?.notification?.data?.link}?data_id=${message?.notification?.data?.id}`;
    }
    return message?.notification?.data?.link;
  },
  subscribe(listener) {
    const onReceiveURL = ({url}) => listener(url);

    // Listen to incoming links from deep linking
    const listen = Linking.addEventListener('url', onReceiveURL);

    const unsubscribeFGNotification = notifee.onForegroundEvent(
      ({type, detail}) => {
        switch (type) {
          case EventType.PRESS:
            listener(
              `erminder://Snooze?data_id=${detail.notification.data.id}`,
            );
            break;
          default:
            break;
        }
      },
    );

    return () => {
      // Clean up the event listeners
      listen.remove();
      unsubscribeFGNotification();
    };
  },
};

const App = () => {
  const [isReady, setIsReady] = useState(false);
  const [initialRoute, setInitialRoute] = useState('');
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  useEffect(() => {
    (async () => {
      let userData = auth().currentUser;
      if (userData === undefined || userData === null) {
        SplashScreen.hide();
        setInitialRoute('LoginNavigation');
        setIsReady(true);
      } else {
        SplashScreen.hide();
        setInitialRoute('HomeNavigation');
        setIsReady(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (isReady === true) {
      console.log('000000000000000000000');
      finalCheck();
    }
  }, [isReady]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
        Linking.getInitialURL().then(url => {
          console.log(url);
        });
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log('AppState', appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return !isReady ? (
    <View />
  ) : (
    <>
      <SafeAreaView style={styles.container}>
        <NavigationContainer linking={linking}>
          <Stack.Navigator
            screenOptions={{header: () => null}}
            initialRouteName={initialRoute}>
            <Stack.Screen name="LoginNavigation" component={LoginNavigation} />
            <Stack.Screen name="HomeNavigation" component={HomeNavigation} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
      <FlashMessage position="top" />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
