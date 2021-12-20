import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
  Permissi,
  PermissionsAndroid,
} from 'react-native';
import QuestionsCard from '../components/QuestionsCard';
import SearchBox from '../components/SearchBox';
import {Text} from '../components/Text';
import colors from '../constant/colors.json';
import EncryptedStorage from 'react-native-encrypted-storage';
import fontSize from '../constant/fontSize.json';
import {showMessage} from 'react-native-flash-message';
import SearchBar from '../components/SearchBar';
import AppCheckbox from '../components/AppCheckbox';
import Spinner from '../components/Spinner';
import MapView, {Marker, PROVIDER_GOOGLE, Circle} from 'react-native-maps';
import RBSheet from 'react-native-raw-bottom-sheet';
import {Picker} from '@react-native-picker/picker';
import IIcon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import {format, differenceInMinutes, formatDistanceToNow} from 'date-fns';
import BackgroundTimer from 'react-native-background-timer';
import {getLocation} from '../Utils/requestLocationPermission';
import getDistanceFromLatLon from '../Utils/getDistanceFromLatLon';
import notifee from '@notifee/react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import Geolocation from '@react-native-community/geolocation';
import moment from 'moment'

const milesArray = [0.0310685596, 0.0621371192, 0.1242742384, 0.1864113577, 0.2485484769];

notifee.onBackgroundEvent(async ({type, detail}) => {
  // const {notification, pressAction} = detail;
  // Check if the user pressed the "Mark as read" action
  // if (type === EventType.ACTION_PRESS && pressAction.id === 'mark-as-read') {
  //   // Update external API
  //   await fetch(`https://my-api.com/chat/${notification.data.chatId}/read`, {
  //     method: 'POST',
  //   });
  //   // Remove the notification
  //   await notifee.cancelNotification(notification.id);
  // }
});

const requestBackgroundLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
      {
        title: 'Allow Location Access',
        message:
          'App needs to access your backgroud location to alert you when you are near a location, your location will not be stored online/offline',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the background location');
    } else {
      console.log('Background location permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
};

const DistanceAlarmCard = ({
  distanceCheckbox,
  setDistanceCheckbox,
  selectDistance,
  setSelectDistance,
}) => {
  // const [toggleCheckBox, setToggleCheckBox] = useState(false);
  // const [selectDistance, setSelectDistance] = useState(2);
  const pickerRef = useRef(null);
  return (
    <LinearGradient
      colors={['#4292C5', '#1FAB86']}
      style={{
        height: 80,
        flexDirection: 'row',
        backgroundColor: '#319EA7',
        padding: 5,
        borderRadius: 5,
        marginBottom: 10,
      }}>
      <View style={{flex: 0.1}}>
        <AppCheckbox
          value={distanceCheckbox}
          onValueChange={newValue => setDistanceCheckbox(newValue)}
          style={{margin: 5}}
        />
      </View>
      <View style={{flex: 0.9}}>
        <Text style={styles.text}>Distance Alarm</Text>
        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}>
          <Text style={styles.text}>Distance:</Text>
          <TouchableOpacity
            onPress={() => pickerRef.current.focus()}
            style={{flexDirection: 'row'}}>
            <Text style={styles.text}>{`${Math.round(selectDistance * 1609.344)} meter(s)`}</Text>
            <IIcon
              name="chevron-down"
              size={20}
              color="#fff"
              style={{position: 'relative', top: 5, right: 2}}
            />
            <Picker
              style={{flex: 1, zIndex: 55555}}
              dropdownIconColor="#2BA29D"
              ref={pickerRef}
              selectedValue={selectDistance}
              onValueChange={itemValue => setSelectDistance(itemValue)}>
              {milesArray.map(item => {
                return <Picker.Item label={`${Math.round(item * 1609.344)} meter(s)`} value={item} />;
              })}
            </Picker>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

const TimeAlarmCard = ({
  date,
  setDate,
  time,
  setTime,
  endTime,
  timeCheckbox,
  setTimeCheckbox,
  setEndTime
}) => {
  // const [date, setDate] = useState(new Date());
  // const [time, setTime] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [showEndTime, setShowEndTime] = useState(false);
  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDate(Platform.OS === 'ios');
    setDate(currentDate);
  };
  const onChangeTime = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowTime(Platform.OS === 'ios');
    setTime(currentDate);
  };

  const onChangeEndTime = (event, selectedDate) => {
    if(moment(time).diff(selectedDate, 'minutes') > 0) {
      setShowEndTime(Platform.OS === 'ios');
      showMessage({
        message: 'End Time can not be less then start time',
        type: 'danger',
      });
      return
    }
    const currentDate = selectedDate || date;
    setShowEndTime(Platform.OS === 'ios');
    setEndTime(currentDate);
  };

  return (
    <LinearGradient
      colors={['#4292C5', '#1FAB86']}
      style={{
        // height: 80,
        flexDirection: 'row',
        backgroundColor: '#319EA7',
        padding: 5,
        borderRadius: 5,
        marginBottom: 10,
      }}>
      <View style={{flex: 0.1}}>
        <AppCheckbox
          value={timeCheckbox}
          onValueChange={newValue => setTimeCheckbox(newValue)}
          style={{margin: 5}}
        />
      </View>
      <View style={{flex: 0.9}}>
        <Text style={styles.text}>Time Alarm</Text>
        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center',
            // marginVertical: -10
          }}>
          <Text style={styles.text}>Date:</Text>
          <TouchableOpacity
            onPress={() => setShowDate(true)}
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.text}>{format(date, 'd-M-y')}</Text>
            <IIcon name="chevron-down" size={20} color="#fff" />
            {showDate && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={'date'}
                is24Hour={true}
                display="default"
                onChange={onChangeDate}
              />
            )}
          </TouchableOpacity>
        </View>
        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}>
          <Text style={styles.text}>Start Time:</Text>
          <TouchableOpacity
            onPress={() => setShowTime(true)}
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.text}>{format(time, 'hh:mm a')}</Text>
            <IIcon name="chevron-down" size={20} color="#fff" />
            {showTime && (
              <DateTimePicker
                testID="dateTimePicker"
                value={time}
                mode={'time'}
                is24Hour={false}
                display="default"
                onChange={onChangeTime}
              />
            )}
          </TouchableOpacity>
        </View>
        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}>
          <Text style={styles.text}>End Time:</Text>
          <TouchableOpacity
            onPress={() => setShowEndTime(true)}
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.text}>{format(endTime, 'hh:mm a')}</Text>
            <IIcon name="chevron-down" size={20} color="#fff" />
            {showEndTime && (
              <DateTimePicker
                testID="dateTimePicker"
                value={endTime}
                minimumDate={time}
                mode={'time'}
                is24Hour={false}
                display="default"
                onChange={onChangeEndTime}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

const NotificationViaCard = ({notificationVia, setNotificationVia}) => {
  // const [notificationVia, setNotificationVia] = useState('App Notification');
  const pickerRef = useRef(null);

  return (
    <LinearGradient
      colors={['#4292C5', '#1FAB86']}
      style={{
        flexDirection: 'row',
        backgroundColor: '#319EA7',
        padding: 5,
        borderRadius: 5,
        marginBottom: 10,
        alignItems: 'center',
        // justifyContent: 'space-between',
      }}>
      <View style={{flex: 0.9}}>
        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            marginBottom: -20,
            paddingHorizontal: 10,
          }}>
          <Text style={styles.text}>Notification via: </Text>
          <TouchableOpacity
            onPress={() => pickerRef.current.focus()}
            style={{flexDirection: 'row'}}>
            <Text style={styles.text}>{notificationVia}</Text>
            <IIcon
              name="chevron-down"
              size={20}
              color="#fff"
              style={{position: 'relative', top: 5}}
            />
            <Picker
              dropdownIconColor="#2BA29D"
              ref={pickerRef}
              selectedValue={notificationVia}
              onValueChange={(itemValue, itemIndex) =>
                setNotificationVia(itemValue)
              }>
              <Picker.Item label="Notification" value={'push_notification'} />
              <Picker.Item label="Email" value={'email'} enabled={false} />
              <Picker.Item
                label="Ringtone"
                value={'ringtone'}
                enabled={false}
              />
            </Picker>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

const SubmitButton = ({onPress = () => null}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <LinearGradient
        colors={['#4292C5', '#1FAB86']}
        style={{
          flexDirection: 'row',
          backgroundColor: '#319EA7',
          padding: 5,
          borderRadius: 5,
          marginBottom: 10,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={styles.text}>Submit</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

function Home({route, navigation}) {
  const [marker, setMarker] = useState(null);
  const rawSheetRef = useRef(null);
  const [selectDistance, setSelectDistance] = useState(2);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [notificationVia, setNotificationVia] = useState('App Notification');
  const [distanceCheckbox, setDistanceCheckbox] = useState(false);
  const [timeCheckbox, setTimeCheckbox] = useState(false);
  const [loading, setLoading] = useState(false);
  const alarmRef = useRef([]);
  const firstTime = useRef(true);
  const mapRef = useRef(null);
  // console.log('currentLocation', currentLocation);
  const [region, setRegion] = useState({
    latitude: 28,
    longitude: 76,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  async function onDisplayNotification(title, body) {
    // Create a channel
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      sound: 'default',
    });

    // Display a notification
    await notifee.displayNotification({
      title,
      body,
      android: {
        channelId,
        sound: 'default',
        // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
      },
    });
  }

  const addDebugObject = object => {
    // const debugCollection = firestore().collection('debug');
    // debugCollection.add(object);
  };

  const performOperation = coords => {
    addDebugObject({
      type: 'current location',
      coords,
    });
    if (firstTime.current) {
      setRegion({
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      mapRef.current.animateToRegion({
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      firstTime.current = false;
    }
    alarmRef.current.forEach(item => {
      if (item.isActive && item.timeAlarm && item.distanceAlarm) {
        const distance = getDistanceFromLatLon(
          coords.latitude,
          coords.longitude,
          item.coordinate.latitude,
          item.coordinate.longitude,
        );
        const timeDifference = Math.abs(
          differenceInMinutes(new Date(item.dateTime), new Date()),
        );
        // console.log(4, timeDifference);
        if (distance <= item.distance && timeDifference <= 15) {
          onDisplayNotification(
            `Time alarm (${item.location}) - ${formatDistanceToNow(
              new Date(item.dateTime),
            )}`,
            `2 You are ${Math.round(distance * 1609.344)} meters away from ${item.location}`,
          );
        }
      } else if (item.isActive && item.distanceAlarm) {
        const distance = getDistanceFromLatLon(
          coords.latitude,
          coords.longitude,
          item.coordinate.latitude,
          item.coordinate.longitude,
        );
        // console.log(distance);
        addDebugObject({
          type: 'distanceAlarm',
          distance,
        });
        if (distance <= item.distance) {
          if (auth()?.currentUser?.uid) {
            firestore()
              .collection('Users')
              .doc(auth().currentUser.uid)
              .collection('Alarms')
              .doc(item.id)
              .update({isActive: false});
          }
          onDisplayNotification(
            item.location,
            `You are ${Math.round(distance * 1609.344)} meters away from ${item.location}`,
          );
        }
      } else if (item.isActive && item.timeAlarm) {
        const distance = getDistanceFromLatLon(
          coords.latitude,
          coords.longitude,
          item.coordinate.latitude,
          item.coordinate.longitude,
        );
        const timeDifference = Math.abs(
          differenceInMinutes(new Date(item.dateTime), new Date()),
        );
        // console.log(4, timeDifference);
        if (distance <= 2 && timeDifference <= 15) {
          onDisplayNotification(
            `Time alarm (${item.location}) - ${formatDistanceToNow(
              new Date(item.dateTime),
            )}`,
            `2 You are ${Math.round(distance * 1609.344)} meters away from ${item.location}`,
          );
        }
      }
    });
  };

  const performTask = async () => {
    getLocation().then(async res => {
      performOperation(res.coords);
    });
  };

  const onMapPress = e => {
    setMarker({
      coordinate: e.nativeEvent.coordinate,
    });
    rawSheetRef.current.open();
  };

  const onSubmit = async () => {
    if (!distanceCheckbox) {
      showMessage({
        message: 'Distance alarm is mandatory',
        type: 'danger',
      });
      return;
    }
    if (auth()?.currentUser?.uid) {
      setLoading(true);
      const resluts = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${marker.coordinate.latitude},${marker.coordinate.longitude}&key=AIzaSyCZgPZ3f4_DaC4Rh7qFAQSQu_9K4SSQLPk`,
      );
      const Alarms = firestore()
        .collection('Users')
        .doc(auth().currentUser.uid)
        .collection('Alarms');
      Alarms.add({
        distanceAlarm: distanceCheckbox,
        timeAlarm: timeCheckbox,
        date: date,
        time: time,
        endTime: endTime,
        coordinate: marker.coordinate,
        location: resluts.data?.results[0]?.formatted_address ?? 'Unknown',
        distance: selectDistance,
        notificationVia: notificationVia,
        dateTime: `${format(date, 'yyyy-MM-dd')}T${format(time, 'HH:mm:ss')}`,
        dateTimeFormatted: `${format(date, 'dd/MM/yyyy')} ${format(
          time,
          'HH:mm',
        )}`,
        isActive: true,
        createdAt: firestore.Timestamp.fromDate(new Date()),
      })
        .then(() => {
          setLoading(false);
          setTimeCheckbox(false);
          setMarker({});
          setDistanceCheckbox(false);
          rawSheetRef.current.close();
          showMessage({
            message: 'Alarm have been added successfully.',
            type: 'success',
          });
        })
        .catch(err => {
          showMessage({
            message: err.toString(),
            type: 'danger',
          });
        });
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
      ).then(response => {
        console.log(response);
      });
    }, 10000);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    BackgroundTimer.runBackgroundTimer(() => {
      performTask();
    }, 30000);
    return () => {
      BackgroundTimer.stopBackgroundTimer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // requestBackgroundLocationPermission();
    if (auth()?.currentUser?.uid) {
      // const allAlarms = [];
      firestore()
        .collection('Users')
        .doc(auth().currentUser.uid)
        .collection('Alarms')
        .onSnapshot(doc => {
          doc.docChanges().forEach(change => {
            if (change.type === 'added') {
              alarmRef.current = [
                {...change.doc.data(), id: change.doc.id},
                ...alarmRef.current,
              ];
            }
            if (change.type === 'modified') {
              alarmRef.current = alarmRef.current.map(item => {
                if (item.id === change.doc.id) {
                  return {...item, ...change.doc.data()};
                } else {
                  return item;
                }
              });
            }
            if (change.type === 'removed') {
              alarmRef.current = alarmRef.current.filter(item => {
                if (item.id === change.doc.id) {
                  return false;
                }
                return true;
              });
            }
          });
        });
    }
  }, []);

  return (
    <>
      <MapView
        ref={mapRef}
        style={{flex: 1}}
        provider={PROVIDER_GOOGLE}
        // region={region}
        // initialRegion={{
        //   latitude: 37.78825,
        //   longitude: -122.4324,
        //   latitudeDelta: 0.0922,
        //   longitudeDelta: 0.0421,
        // }}
        onUserLocationChange={e => {
          // console.log(e.nativeEvent.coordinate);
          performOperation(e.nativeEvent.coordinate);
        }}
        onPress={onMapPress}
        showsUserLocation
        showsMyLocationButton={false}
        // showsMyLocationButton
        userLocationUpdateInterval={15000}
        showsPointsOfInterest={false}
        showsCompass={false}
        loadingEnabled
        onRegionChangeComplete={setRegion}>
        {marker?.coordinate && (
          <Marker pinColor={colors.skyblue} coordinate={marker.coordinate} />
        )}
        {alarmRef.current.map(item => {
          if (!item.distanceAlarm || !item.isActive) {
            return null;
          }
          // return null;
          return (
            <>
              <Circle
                center={{
                  latitude: item.coordinate.latitude,
                  longitude: item.coordinate.longitude,
                }}
                radius={item.distance * 1609.34}
                fillColor="rgba(0, 0, 255, 0.05)"
                strokeColor="rgba(100, 100, 100, 0.5)"
                zIndex={2}
                strokeWidth={1}
              />
              <Marker
                pinColor={colors.skyblue}
                coordinate={{
                  latitude: item.coordinate.latitude,
                  longitude: item.coordinate.longitude,
                }}
              />
            </>
          );
        })}
      </MapView>
      <SearchBar
        onPress={(data, details = null) => {
          // 'details' is provided when fetchDetails = true
          // console.log(details.geometry.location);
          const {lat: latitude, lng: longitude} = details.geometry.location;
          setRegion(prev => ({...prev, latitude, longitude}));
          mapRef.current.animateToRegion({
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
        }}
      />
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 10,
          right: 10,
          backgroundColor: colors.white,
          padding: 15,
          borderRadius: 50,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 0.34,
          shadowRadius: 6.27,
          elevation: 10,
        }}
        onPress={() => {
          Geolocation.getCurrentPosition(info => {
            if (info?.coords) {
              const {coords} = info;
              mapRef.current.animateToRegion({
                latitude: coords.latitude,
                longitude: coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              });
            }
          });
        }}>
        <MaterialIcons name="my-location" size={25} color={colors.gray} />
      </TouchableOpacity>
      {/* <View style={{position: 'absolute', top: 50}}>
        <Text
          style={{
            fontSize: 20,
            color: 'red',
          }}>{`${currentLocation?.latitude}-${currentLocation?.longitude}`}</Text>
      </View> */}
      <View>
        {/* <SearchBar /> */}
        <RBSheet
          ref={rawSheetRef}
          height={300}
          openDuration={250}
          customStyles={{
            container: {
              padding: 16,
            },
          }}>
          <DistanceAlarmCard
            distanceCheckbox={distanceCheckbox}
            setDistanceCheckbox={setDistanceCheckbox}
            selectDistance={selectDistance}
            setSelectDistance={setSelectDistance}
          />
          <TimeAlarmCard
            date={date}
            setDate={setDate}
            time={time}
            setTime={setTime}
            endTime={endTime}
            setEndTime={setEndTime}
            timeCheckbox={timeCheckbox}
            setTimeCheckbox={setTimeCheckbox}
          />
          {/* <NotificationViaCard
            notificationVia={notificationVia}
            setNotificationVia={setNotificationVia}
          /> */}
          <SubmitButton onPress={onSubmit} />
        </RBSheet>
      </View>
      <Spinner show={loading} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {},
  text: {
    fontSize: 22,
    color: '#fff',
    position: 'relative',
    left: -5,
  },
});

export default Home;
