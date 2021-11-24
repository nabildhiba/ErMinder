import React, {useState} from 'react';
import {StyleSheet, View, ScrollView, Switch} from 'react-native';
import {Text} from '../components/Text';

const AlarmCard = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  return (
    <View style={styles.alramCard}>
      <View style={styles.cardRow}>
        <Text style={styles.bigText}>Maa kali temple</Text>
        <Switch
          trackColor={{false: '#767577', true: 'white'}}
          thumbColor={isEnabled ? 'green' : 'green'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
          style={{transform: [{scaleX: 1.2}, {scaleY: 1.2}]}}
        />
      </View>
      <Text style={styles.text}>Maa kali temple</Text>
      <Text style={styles.text}>Maa kali temple</Text>
    </View>
  );
};

function AlarmTab({navigation}) {
  return (
    <ScrollView style={styles.scrollView}>
      <AlarmCard />
      <AlarmCard />
      <AlarmCard />
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
    backgroundColor: 'red',
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
