// import SplashScreen from 'react-native-splash-screen';
import React, {useState, useEffect} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import MobileLogin from './screens/MobileLogin';
// import OTP from './screens/OTP';
// import Registration from './screens/Registration';
import Home from './screens/Home';
import SignUp from './screens/SignUp';
// import AddProduct from './screens/AddProduct';
// import ProductDetails from './screens/ProductDetails';

import TabBar from './components/TabBar';
import {TabNavHeader} from './components/TabNavHeader';
import {HomeStackHeader} from './components/HomeStackHeader';
// import UpdateProfile from './screens/UpdateProfile';
import {SettingStackHeader} from './components/SettingStackHeader';
import FlashMessage from 'react-native-flash-message';
import Login from './screens/Login';
import More from './screens/More';
import AlarmTab from './screens/AlarmTab';
import {MoreStackHeader} from './components/MoreStackHeader';
import Profile from './screens/Profile';
import QuestionDetails from './screens/QuestionDetails';
import Experts from './screens/Experts';
import ExpertDetails from './screens/ExpertDetails';
import MyQuestions from './screens/MyQuestions';
import MyQuestionDetails from './screens/MyQuestionDetails';
import ForgetPassword from './screens/ForgetPassword';
import Kundli from './screens/Kundli';

const Stack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

const LoginNavigation = () => (
  <Stack.Navigator
    screenOptions={{header: () => null}}
    initialRouteName={'Login'}>
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="SignUp" component={SignUp} />
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
      <Stack.Screen name="QuestionDetails" component={QuestionDetails} />
    </Stack.Navigator>
  );
};

const MoreStack = () => {
  return (
    <Stack.Navigator
      screenOptions={({route}) => ({
        header: MoreStackHeader,
      })}
      initialRouteName={'More'}>
      <Stack.Screen name="More" component={More} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Experts" component={Experts} />
      <Stack.Screen name="ExpertDetails" component={ExpertDetails} />
      <Stack.Screen name="MyQuestions" component={MyQuestions} />
      <Stack.Screen name="MyQuestionDetails" component={MyQuestionDetails} />
      <Stack.Screen name="Kundli" component={Kundli} />
    </Stack.Navigator>
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
      }}
      component={AlarmTab}
    />
    <Tab.Screen name="SettingTab" component={MoreStack} />
    <Tab.Screen name="LogOutTab" component={MoreStack} />
  </Tab.Navigator>
);

const App = () => {
  const [isReady, setIsReady] = useState(false);
  const [initialRoute, setInitialRoute] = useState('');
  useEffect(() => {
    (async () => {
      let userData = await EncryptedStorage.getItem('userData').catch(err => {
        setInitialRoute('LoginNavigation');
        setIsReady(true);
        console.log(err);
      });
      console.log(userData);
      if (userData == undefined || userData == null) {
        setInitialRoute('LoginNavigation');
        setIsReady(true);
      } else {
        setInitialRoute('HomeNavigation');
        setIsReady(true);
      }
      // SplashScreen.hide();
    })();

    // setInitialRoute('HomeNavigation');
    // setIsReady(true);
  }, []);

  return !isReady ? (
    <View></View>
  ) : (
    <>
      <SafeAreaView style={styles.container}>
        <NavigationContainer>
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
