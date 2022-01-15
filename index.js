/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import notifee, {EventType} from '@notifee/react-native';
import {Linking} from 'react-native';

notifee.onBackgroundEvent(async ({type, detail}) => {
  const {notification} = detail;

  // Check if the user pressed the "Mark as read" action
  if (type === EventType.PRESS) {
    Linking.openURL(`erminder://Snooze?data_id=${notification.data.id}`);

    // Remove the notification
    await notifee.cancelNotification(notification.id);
  }
});

ReactNativeForegroundService.register();
AppRegistry.registerComponent(appName, () => App);
