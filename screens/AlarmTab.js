import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Switch, FlatList} from 'react-native';
import {Text} from '../components/Text';
import NoData from '../components/NoData';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import LinearGradient from 'react-native-linear-gradient';

const AlarmCard = ({data}) => {
  const [isEnabled, setIsEnabled] = useState(data.item.isActive);
  const toggleSwitch = () => {
    setIsEnabled(prev => !prev);
    if (auth()?.currentUser?.uid) {
      // const allAlarms = [];
      firestore()
        .collection('Users')
        .doc(auth().currentUser.uid)
        .collection('Alarms')
        .doc(data.item.id)
        .update({isActive: !isEnabled});
    }
  };

  useEffect(() => {
    setIsEnabled(data.item.isActive);
  }, [data.item.isActive]);

  console.log(data.item);
  if (!data.item.timeAlarm && !data.item.distanceAlarm) {
    return null;
  }

  return (
    <LinearGradient colors={['#4292C5', '#1FAB86']} style={styles.alramCard}>
      <View style={styles.cardRow}>
        <Text style={styles.bigText}>{data.item.location}</Text>
        <Switch
          trackColor={{false: '#767577', true: 'white'}}
          thumbColor={isEnabled ? '#329EA8' : '#329EA8'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
          style={{transform: [{scaleX: 1.2}, {scaleY: 1.2}]}}
        />
      </View>
      {data.item.distanceAlarm && (
        <Text style={styles.text}>
          Distance Alarm: {`${data.item.distance} miles`}
        </Text>
      )}
      {data.item.timeAlarm && (
        <Text style={styles.text}>Time Alarm: {data.item.dateTime}</Text>
      )}
    </LinearGradient>
  );
};

function AlarmTab({navigation}) {
  const [alarms, setAlarms] = useState([]);

  useEffect(() => {
    if (auth()?.currentUser?.uid) {
      // const allAlarms = [];
      firestore()
        .collection('Users')
        .doc(auth().currentUser.uid)
        .collection('Alarms')
        .onSnapshot(doc => {
          doc.docChanges().forEach(change => {
            if (change.type === 'added') {
              setAlarms(prev => [
                {...change.doc.data(), id: change.doc.id},
                ...prev,
              ]);
            }
            if (change.type === 'modified') {
              setAlarms(prev =>
                prev.map(item => {
                  if (item.id === change.doc.id) {
                    return {...item, ...change.doc.data()};
                  } else {
                    return item;
                  }
                }),
              );
            }
            if (change.type === 'removed') {
              setAlarms(prev =>
                prev.filter(item => {
                  if (item.id === change.doc.id) {
                    return false;
                  }
                  return true;
                }),
              );
            }
          });
        });
      // const Alarms = firestore()
      //   .collection('Users')
      //   .doc(auth().currentUser.uid)
      //   .collection('Alarms');
      // Alarms.get().then(res => {
      //   console.log(res);
      //   res.forEach(result => {
      //     console.log(result.data());
      //     allAlarms.push({...result.data(), key: result.id});
      //   });
      //   setAlarms(allAlarms);
      // });
    }
  }, []);

  return (
    <View style={styles.container}>
      {/* {alarms.map(item => {
        return <AlarmCard data={item} />;
      })} */}
      {alarms.length === 0 && <NoData />}
      <FlatList
        data={alarms}
        keyExtractor={item => item.id}
        renderItem={item => <AlarmCard data={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  alramCard: {
    flex: 1,
    backgroundColor: '#319EA7',
    borderRadius: 8,
    padding: 15,
    marginTop: 20,
    marginHorizontal: 20,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bigText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    width: '80%',
  },
  text: {
    color: 'white',
    fontSize: 18,
  },
});

export default AlarmTab;
