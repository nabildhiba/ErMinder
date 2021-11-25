import React, {useState, useEffect} from 'react';
import {StyleSheet, View, ScrollView, Switch} from 'react-native';
import {Text} from '../components/Text';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import LinearGradient from 'react-native-linear-gradient';

const AlarmCard = ({data}) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  return (
    <LinearGradient colors={['#4292C5', '#1FAB86']} style={styles.alramCard}>
      <View style={styles.cardRow}>
        <Text style={styles.bigText}>Maa kali temple</Text>
        <Switch
          trackColor={{false: '#767577', true: 'white'}}
          thumbColor={isEnabled ? '#329EA8' : '#329EA8'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
          style={{transform: [{scaleX: 1.2}, {scaleY: 1.2}]}}
        />
      </View>
      <Text style={styles.text}>Maa kali temple</Text>
      {data.distanceAlarm && (
        <Text style={styles.text}>
          Distance Alarm: {`${data.distance} miles`}
        </Text>
      )}
      {data.timeAlarm && (
        <Text style={styles.text}>Time Alarm: {data.dateTime}</Text>
      )}
    </LinearGradient>
  );
};

function AlarmTab({navigation}) {
  const [alarms, setAlarms] = useState([]);

  useEffect(() => {
    if (auth()?.currentUser?.uid) {
      const allAlarms = [];
      const Alarms = firestore()
        .collection('Users')
        .doc(auth().currentUser.uid)
        .collection('Alarms');
      Alarms.get().then(res => {
        console.log(res);
        res.forEach(result => {
          console.log(result.data());
          allAlarms.push(result.data());
        });
        setAlarms(allAlarms);
      });
    }
  }, []);

  return (
    <ScrollView style={styles.scrollView}>
      {alarms.map(item => {
        return <AlarmCard data={item} />;
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#fff',
    padding: 20,
  },
  alramCard: {
    flex: 1,
    backgroundColor: '#319EA7',
    borderRadius: 8,
    padding: 15,
    marginVertical: 10,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bigText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
  text: {
    color: 'white',
    fontSize: 18,
  },
});

export default AlarmTab;
