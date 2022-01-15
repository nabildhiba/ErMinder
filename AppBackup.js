// import SplashScreen from 'react-native-splash-screen';
import React, {useState, useEffect} from 'react';
import {View, Text, PermissionsAndroid} from 'react-native';
import notifee, {EventType} from '@notifee/react-native';
import SplashScreen from 'react-native-splash-screen';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import Geolocation from '@react-native-community/geolocation';

const requestLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'RNbgLocation Permission',
        message: 'RNbgLocation needs to access your location in order to work',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    console.log(granted);
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
};

const onStop = () => {
  // Make always sure to remove the task before stoping the service. and instead of re-adding the task you can always update the task.
  if (ReactNativeForegroundService.is_task_running(1234)) {
    ReactNativeForegroundService.remove_task('taskid');
  }
  // Stoping Foreground service.
  return ReactNativeForegroundService.stop();
};

const onStart = () => {
  // Checking if the task i am going to create already exist and running, which means that the foreground is also running.
  if (ReactNativeForegroundService.is_task_running(1234)) {
    return;
  }

  ReactNativeForegroundService.add_task(
    async () => {
      console.log(new Date());
      Geolocation.getCurrentPosition(info => console.log(info));
      const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        sound: 'default',
      });

      // Display a notification
      await notifee.displayNotification({
        id: '153',
        title: 'Test title',
        body: 'Test body',
        data: {link: 'erminder://Snooze'},
        android: {
          channelId,
          sound: 'default',
          pressAction: {
            id: 'default',
          },
          showTimestamp: true,
          timestamp: new Date() - 3600,
          // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
        },
      });
    },
    {
      delay: 5000,
      onLoop: true,
      taskId: 'taskid',
      onError: e => console.log('Error logging:', e),
    },
  );
  // starting  foreground service.
  return ReactNativeForegroundService.start({
    id: 1234,
    title: 'Alert Service',
    message: 'Your location is being used in background.',
  });
};

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
    requestLocationPermission();
    // ReactNativeForegroundService.add_task(
    //   () => console.log('I am Being Tested'),
    //   {
    //     delay: 100,
    //     onLoop: true,
    //     taskId: 'taskid',
    //     onError: e => console.log(`Error logging:`, e),
    //   },
    // );
    onStop();
  }, []);
  return (
    <View>
      <Text>Wow</Text>
    </View>
  );
};

export default App;
