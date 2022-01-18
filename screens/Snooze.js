import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, TextInput, Dimensions, View} from 'react-native';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../constant/colors.json';
import fontSize from '../constant/fontSize.json';
import Button from '../components/Button';
import {Picker} from '@react-native-picker/picker';
import IIcon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import {format, differenceInMinutes, formatDistanceToNow} from 'date-fns';
import moment from 'moment';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const {width} = Dimensions.get('screen');

const pickerData = [
  {label: '15 Minute', value: 15},
  {label: '30 Minute', value: 30},
  {label: '45 Minute', value: 45},
  {label: '1 hour', value: 60},
  {label: '2 hour', value: 120},
  {label: '3 hour', value: 180},
  {label: '4 hour', value: 240},
  {label: '5 hour', value: 300},
];

const Snooze = ({route, navigation}) => {
  const [date, setDate] = useState(new Date());
  const [selectedPickerValue, setSelectedPickerValue] = useState(null);
  const [time, setTime] = useState(new Date());
  const [showTime, setShowTime] = useState(false);
  const [snooze, setSnooze] = useState(false);
  const [pickerErr, setPickerErr] = useState(false);
  const [textBoxErr, setTextBoxErr] = useState(false);
  const [alarmData, setAlarmData] = useState(false);
  const [upateLoading, setUpateLoading] = useState(false);
  const [customHour, setCustomHour] = useState('');
  // const {data} = route.params;
  const data_id = route?.params?.data_id;
  console.log('data_id', data_id);

  const onChangeTime = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowTime(Platform.OS === 'ios');
    setTime(currentDate);
  };

  const onSubmit = () => {
    if (!selectedPickerValue) {
      setPickerErr(true);
      return;
    }
    if (selectedPickerValue === 'Custom' && !customHour) {
      setTextBoxErr(true);
      return;
    }
    setUpateLoading(true);
    const snoozeTime =
      selectedPickerValue === 'Custom'
        ? customHour
        : selectedPickerValue + selectedPickerValue === 'Custom'
        ? 'hours'
        : 'minutes';

    const snoozeTime2 =
      selectedPickerValue === 'Custom' ? customHour * 60 : selectedPickerValue;

    let time = moment(new Date(alarmData.time.toDate())).add(snoozeTime);
    let endTime = moment(new Date(alarmData.endTime.toDate())).add(snoozeTime);
    let dateTime = moment(new Date(alarmData.dateTime)).add(snoozeTime);
    console.log(time, endTime, snoozeTime);
    firestore()
      .collection('Users')
      .doc(auth().currentUser.uid)
      .collection('Alarms')
      .doc(data_id)
      .update({
        dateTime: new Date(dateTime).toString(),
        time: new Date(time),
        endTime: new Date(endTime),
        snoozeTime: new Date(
          moment(new Date()).add(snoozeTime2, 'minutes'),
        ).toISOString(),
        isActive: true,
      })
      .finally(() => {
        setUpateLoading(false);
        // navigation.goBack();
        navigation.reset({
          index: 0,
          routes: [{name: 'Home'}],
        });
      });
  };

  const getData = async () => {
    if (!data_id) {
      // navigation.goBack();
      navigation.reset({
        index: 0,
        routes: [{name: 'Home'}],
      });
    }
    firestore()
      .collection('Users')
      .doc(auth().currentUser.uid)
      .collection('Alarms')
      .doc(data_id)
      .get()
      .then(doc => {
        if (doc.exists) {
          console.log('Document data:', doc.data());
          console.log(
            '-----------time',
            new Date(doc.data().time.toDate()).toString(),
          );
          console.log(
            '------------endTime',
            new Date(doc.data().endTime.toDate()).toString(),
          );
          setAlarmData(doc.data());
        } else {
          console.log('Document Not Found');
          navigation.goBack();
        }
      });
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    console.log('alarmData', alarmData);
  }, [alarmData]);

  return (
    <View style={styles.container}>
      <View style={{alignItems: 'center'}}>
        <MIcon name="bell-outline" size={128} color={colors.primary} />
        {snooze && (
          <>
            <View style={styles.picker}>
              <Picker
                style={{
                  width: '100%',
                  color: colors.text,
                  fontSize: fontSize.normal,
                }}
                dropdownIconColor={colors.text}
                selectedValue={selectedPickerValue}
                onValueChange={(itemValue, itemIndex) => {
                  if (pickerErr) setPickerErr(false);
                  setSelectedPickerValue(itemValue);
                }}>
                <Picker.Item label={'Snooze for'} />
                {pickerData.map(item => (
                  <Picker.Item
                    key={item.key}
                    label={item.label}
                    value={item.value}
                  />
                ))}

                <Picker.Item key={2} label={'Custom'} value={'Custom'} />
              </Picker>
            </View>
            {pickerErr && (
              <Text style={styles.error}> Please select snooze for</Text>
            )}
          </>
        )}

        {selectedPickerValue === 'Custom' && (
          <>
            <View style={styles.timePicker}>
              <TextInput
                placeholder={'Custom time in hours'}
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
                style={{
                  paddingLeft: 10,
                  color: colors.text,
                  fontSize: fontSize.normal,
                }}
                onChangeText={e => {
                  setCustomHour(e);
                }}
              />
            </View>

            {textBoxErr && (
              <Text style={styles.error}> Please enter hours</Text>
            )}
          </>
          // <TouchableOpacity
          //     onPress={() => setShowTime(true)}
          //     style={styles.timePicker}>
          //     <Text style={{color: '#000', marginRight: 10}}>
          //       {format(time, 'hh:mm a')}
          //     </Text>
          //     <IIcon name="chevron-down" size={20} color="#000" />
          //     {showTime && (
          //       <DateTimePicker
          //         testID="dateTimePicker"
          //         value={time}
          //         mode={'time'}
          //         is24Hour={false}
          //         display="default"
          //         onChange={onChangeTime}
          //       />
          //     )}
          //   </TouchableOpacity>
        )}

        <View style={{flexDirection: 'row', marginTop: 20, width: 300}}>
          <Button
            text={'Thank You'}
            style={{marginRight: 10, flex: 1}}
            onPress={() => {
              // navigation.goBack();
              navigation.reset({
                index: 0,
                routes: [{name: 'Home'}],
              });
            }}
          />
          {snooze ? (
            <Button
              text={'Update'}
              style={{
                backgroundColor: colors.white,
                borderWidth: 2,
                borderColor: colors.primary,
                marginLeft: 10,
                flex: 1,
              }}
              indicatorColor={colors.primary}
              isLoading={upateLoading}
              textStyle={{color: colors.primary}}
              onPress={onSubmit}
            />
          ) : (
            <Button
              text={'Snooze'}
              style={{
                backgroundColor: colors.white,
                borderWidth: 2,
                borderColor: colors.primary,
                marginLeft: 10,
                flex: 1,
              }}
              textStyle={{color: colors.primary}}
              onPress={() => setSnooze(true)}
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default Snooze;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100,
  },
  pickerIcon: {
    position: 'absolute',
    top: 32,
    right: 25,
  },
  picker: {
    flexDirection: 'row',
    backgroundColor: '#80808026',
    width: 300,
    borderRadius: 15,
    alignItems: 'center',
    paddingHorizontal: 15,
    minHeight: 55,
    marginTop: 20,
  },
  timePicker: {
    flexDirection: 'row',
    backgroundColor: '#80808026',
    width: 300,
    borderRadius: 15,
    alignItems: 'center',
    paddingHorizontal: 50,
    minHeight: 55,
    marginTop: 20,
  },
  error: {
    color: 'crimson',
    alignSelf: 'flex-start',
    fontSize: fontSize.small,
  },
});
