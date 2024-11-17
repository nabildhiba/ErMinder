import {PermissionsAndroid, Platform,  Alert,AsyncStorage} from 'react-native';



export const checkLocationPermissions30Plus = async () => {
  const backgroundLocationPermissionGranted = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
  );
  const fineLocationPermissionGranted = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );
  if (backgroundLocationPermissionGranted && fineLocationPermissionGranted) {
    return true;
  }
  return false;
};

export const requestLocationPermission30Plus = async () => {
  try {
    const granted = await PermissionsAndroid.requestMultiple(
      [
        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ],
      {
        title: 'RNbgLocation Permission',
        message: 'RNbgLocation needs to access your location in order to work',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );

    if (
      granted['android.permission.ACCESS_BACKGROUND_LOCATION'] ===
        PermissionsAndroid.RESULTS.GRANTED &&
      granted['android.permission.ACCESS_FINE_LOCATION'] ===
        PermissionsAndroid.RESULTS.GRANTED
    ) {
      console.log('Background location permission granted.');
      return true;
    } else {
      console.log('Background location permission not granted.');
      return false;
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
};

export const checkLocationPermissionsBelow30 = async () => {
  const fineLocationPermissionGranted = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );
  if (fineLocationPermissionGranted) {
    return true;
  }
  return false;
};

export const requestLocationPermissionBelow30 = async () => {
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

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Background location permission granted.');
      return true;
    } else {
      console.log('Background location permission not granted.');
      return false;
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
};

export const checkBackgroundPermission = () => {
  return new Promise((resolve, reject) => {
    if (Platform.Version >= 30) {
      requestLocationPermission30Plus().then(res2 => {
        if (!res2) {
          reject();
        }
        resolve();
      });
    } else {
      checkLocationPermissionsBelow30().then(res => {
        if (!res) {
          reject();
        }
        resolve();
      });
    }
  });
};

export const finalCheck = () => {
  return new Promise((resolve, reject) => {
    const checkFirstLaunch = async () => {
      const hasAlertBefore = await AsyncStorage.getItem('hasAlertBefore');
      if (!hasAlertBefore) {
        Alert.alert(
          "Location Access Required",
          "Our app uses your location in the background, even when not in use, to trigger alarms based on your geographical position. This function is essential for the geo-alarm feature to operate effectively. We respect your privacy; your location data is not used for ads and is kept confidential.",
          [
            {
            text:'I agree',
            onPress: () =>
            {
              if (Platform.Version >= 30 && false) {
                requestLocationPermission30Plus().then(res2 => {
                  if (!res2) {
                    reject();
                  }
                  resolve();
                });
              } else {
                requestLocationPermissionBelow30().then(res2 => {
                  if (!res2) {
                    reject();
                  }
                  resolve();
                });
              }
            }
          }
        ]
        );
        await AsyncStorage.setItem('hasAlertBefore', 'true');
      }
    };
    checkFirstLaunch();
  });
};
