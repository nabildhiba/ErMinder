import {
  Alert,
  // Linking,
  PermissionsAndroid,
  Platform,
  ToastAndroid,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

const hasPermissionIOS = async () => {
  // const openSetting = () => {
  //   Linking.openSettings().catch(() => {
  //     Alert.alert('Unable to open settings');
  //   });
  // };
  const status = await Geolocation.requestAuthorization('whenInUse');

  if (status === 'granted') {
    return true;
  }

  if (status === 'denied') {
    // Alert.alert('Location permission denied');
    // ToastAndroid.show('Location permission denied.', ToastAndroid.LONG);
    Alert.alert(
      'Location Denied',
      "Please allow location permission to track your vehicle's location.",
    );
  }

  // ToastAndroid.show(
  //   'Turn on Location Services to allow app to determine your location.',
  //   ToastAndroid.LONG,
  // );

  // if (status === 'disabled') {
  //   Alert.alert(
  //     'Turn on Location Services to allow app to determine your location.',
  //     '',
  //     [
  //       {text: 'Go to Settings', onPress: openSetting},
  //       {text: "Don't Use Location", onPress: () => {}},
  //     ],
  //   );
  // }

  return false;
};

const hasLocationPermission = async () => {
  if (Platform.OS === 'ios') {
    const hasPermission = await hasPermissionIOS();
    return hasPermission;
  }

  if (Platform.OS === 'android' && Platform.Version < 23) {
    return true;
  }

  const hasPermission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  if (hasPermission) {
    return true;
  }

  const status = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {
      title: 'RNbgLocation Permission',
      message: 'RNbgLocation needs to access your location in order to work',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    },
  );

  if (status === PermissionsAndroid.RESULTS.GRANTED) {
    return true;
  }

  if (status === PermissionsAndroid.RESULTS.DENIED) {
    ToastAndroid.show('Location permission denied by user.', ToastAndroid.LONG);
  } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    ToastAndroid.show(
      'Location permission revoked by user.',
      ToastAndroid.LONG,
    );
  }

  return false;
};

export const getLocation = () => {
  return new Promise(async (res, rej) => {
    const hasPermission = await hasLocationPermission();

    if (!hasPermission) {
      console.log("We don't have location permission");
      rej();
      return;
    }

    Geolocation.getCurrentPosition(
      position => {
        // console.log(position);
        res(position);
      },
      error => {
        rej();
        // Alert.alert(`Code ${error.code}`, error.message);
        console.log(error);
      },
      {
        accuracy: {
          android: 'high',
          ios: 'best',
        },
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
        distanceFilter: 0,
        forceRequestLocation: true,
        showLocationDialog: true,
      },
    );
  });
};

// const requestLocationPermission = async () => {
//   try {
//     const granted = await PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//       {
//         title: 'Need Location Permission',
//         message:
//           "Please allow location permission to track your vehicle's location.",
//         buttonPositive: 'OK',
//       },
//     );
//     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//       console.log('You can use the location');
//     } else {
//       throw new Error('location permission denied');
//     }
//   } catch (err) {
//     throw new Error(err);
//   }
// };

// export default requestLocationPermission;
