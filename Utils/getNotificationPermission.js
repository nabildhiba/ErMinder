import {PermissionsAndroid, Platform,  Alert,AsyncStorage} from 'react-native';

export const requestPostNotificationPermission = async () => {
    try {
      if (Platform.Version >= 33) { // Android 13 (API level 33) and above require this permission
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          {
            title: 'Notification Permission',
            message: 'Our app needs to send you notifications to keep you updated about your alarms and location-based alerts.',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
  
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Post notification permission granted.');
          return true;
        } else {
          console.log('Post notification permission not granted.');
          return false;
        }
      } else {
        // If the Android version does not require explicit POST_NOTIFICATION permission.
        console.log('Post notification permission not required for this Android version.');
        return true;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  export const finalCheckNotification = () => {
    return new Promise((resolve, reject) => {
      const checkFirstLaunch = async () => {
        const hasAlertBefore = await AsyncStorage.getItem('hasAlertBefore');
        if (!hasAlertBefore) {
          // Show alert to explain why location and notification access is required
          Alert.alert(
            "Permissions Required",
            "Our app uses your location in the background, even when not in use, to trigger alarms based on your geographical position. We also need notification permissions to notify you of alarms and important updates. We respect your privacy; your location data is not used for ads and is kept confidential.",
            [
              {
                text: 'I agree',
                onPress: async () => {
                  try {
                    let locationPermissionGranted = false;
                    let notificationPermissionGranted = false;
  
                    // Request location permissions
                    if (Platform.Version >= 30) {
                      locationPermissionGranted = await requestLocationPermission30Plus();
                    } else {
                      locationPermissionGranted = await requestLocationPermissionBelow30();
                    }
  
                    if (!locationPermissionGranted) {
                      reject();
                      return;
                    }
  
                    // Request notification permissions
                    notificationPermissionGranted = await requestPostNotificationPermission();
                    if (!notificationPermissionGranted) {
                      reject();
                      return;
                    }
  
                    // If both permissions are granted, resolve
                    await AsyncStorage.setItem('hasAlertBefore', 'true');
                    resolve();
                  } catch (err) {
                    reject();
                  }
                },
              },
            ],
          );
        } else {
          // If permissions have already been granted, just resolve.
          resolve();
        }
      };
      checkFirstLaunch();
    });
  };