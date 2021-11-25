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
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import RBSheet from 'react-native-raw-bottom-sheet';
import {Picker} from '@react-native-picker/picker';
import IIcon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import {format} from 'date-fns';
import BackgroundTimer from 'react-native-background-timer';
import {getLocation} from '../Utils/requestLocationPermission';
import notifee from '@notifee/react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import LinearGradient from 'react-native-linear-gradient';

const milesArray = [1, 2, 5, 10, 20];

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
            <Text style={styles.text}>{`${selectDistance} mile(s)`}</Text>
            <IIcon name="chevron-down" size={20} color="#fff" />
            <Picker
              dropdownIconColor="#319EA700"
              ref={pickerRef}
              selectedValue={selectDistance}
              onValueChange={itemValue => setSelectDistance(itemValue)}>
              {milesArray.map(item => {
                return <Picker.Item label={`${item} mile(s)`} value={item} />;
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
  timeCheckbox,
  setTimeCheckbox,
}) => {
  // const [date, setDate] = useState(new Date());
  // const [time, setTime] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);
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
          <Text style={styles.text}>Time:</Text>
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
                is24Hour={true}
                display="default"
                onChange={onChangeTime}
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
            marginBottom: -10,
          }}>
          <Text style={styles.text}>Notification via:</Text>
          <TouchableOpacity
            onPress={() => pickerRef.current.focus()}
            style={{flexDirection: 'row'}}>
            <Text style={styles.text}>{notificationVia}</Text>
            <IIcon name="chevron-down" size={20} color="#fff" />
            <Picker
              dropdownIconColor="#319EA700"
              ref={pickerRef}
              selectedValue={notificationVia}
              onValueChange={(itemValue, itemIndex) =>
                setNotificationVia(itemValue)
              }>
              <Picker.Item
                label="App Notification"
                value={'push_notification'}
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
  const [notificationVia, setNotificationVia] = useState('App Notification');
  const [distanceCheckbox, setDistanceCheckbox] = useState(false);
  const [timeCheckbox, setTimeCheckbox] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onDisplayNotification() {
    // Create a channel
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    // Display a notification
    await notifee.displayNotification({
      title: 'Notification Title',
      body: 'Main body content of the notification',
      android: {
        channelId,
        // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
      },
    });
  }

  const onMapPress = e => {
    onDisplayNotification();
    setMarker({
      coordinate: e.nativeEvent.coordinate,
    });
    rawSheetRef.current.open();
  };

  const performTask = async () => {
    getLocation().then(res => console.log(res));
  };

  const onSubmit = () => {
    console.log(auth().currentUser.uid);
    if (auth()?.currentUser?.uid) {
      setLoading(true);
      const Alarms = firestore()
        .collection('Users')
        .doc(auth().currentUser.uid)
        .collection('Alarms');
      Alarms.add({
        distanceAlarm: distanceCheckbox,
        timeAlarm: timeCheckbox,
        date: date,
        time: time,
        coordinate: marker.coordinate,
        location: 'Delhi',
        distance: 2,
        notificationVia: notificationVia,
        dateTime: `${format(date, 'yyyy-MM-dd')} ${format(time, 'HH:mm')}`,
        isActive: true,
      })
        .then(() => {
          setLoading(false);
          setTimeCheckbox(false);
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
    // BackgroundTimer.runBackgroundTimer(() => {
    //   performTask();
    // }, 20000);
    // return () => {
    //   BackgroundTimer.stopBackgroundTimer();
    // };
  }, []);

  return (
    <>
      <MapView
        style={{flex: 1}}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={onMapPress}>
        {marker?.coordinate && <Marker coordinate={marker.coordinate} />}
      </MapView>
      <View>
        {/* <SearchBar /> */}
        <RBSheet
          ref={rawSheetRef}
          height={330}
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
            timeCheckbox={timeCheckbox}
            setTimeCheckbox={setTimeCheckbox}
          />
          <NotificationViaCard
            notificationVia={notificationVia}
            setNotificationVia={setNotificationVia}
          />
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
  },
});

export default Home;
