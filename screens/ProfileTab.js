import React, {useState} from 'react';
import {StyleSheet, View, ScrollView, Switch, Image} from 'react-native';
import {Text} from '../components/Text';

const InfoRow = ({placeholder, value}) => {
  return (
    <View style={styles.alramCard}>
      <Text style={styles.placeholderText}>{placeholder}</Text>
      <Text style={styles.valueText}>{value}</Text>
    </View>
  );
};

function AlarmTab({navigation}) {
  return (
    <ScrollView style={styles.container}>
      <View
        style={{
          height: 140,
          marginBottom: 80,
          backgroundColor: 'skyblue',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}>
        <View style={{transform: [{translateY: 60}], alignItems: 'center'}}>
          <Image
            style={{width: 120, height: 120}}
            source={require('../assets/profile.png')}
          />
          <Text style={styles.uploadText}>Upload</Text>
        </View>
      </View>
      <View style={styles.infoContainer}>
        <InfoRow placeholder="Username" value="Justin" />
        <InfoRow placeholder="Email" value="justin@gmail.com" />
        <InfoRow placeholder="Location" value="Delhi (NCR)" />
        <InfoRow placeholder="Phone number" value="+91-8888881548" />
        <InfoRow placeholder="Password" value="************" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  alramCard: {
    flex: 1,
    marginVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 5,
    paddingHorizontal: 8,
  },
  infoContainer: {
    padding: 20,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  placeholderText: {
    marginBottom: 5,
    fontSize: 16,
    opacity: 0.6,
  },
  valueText: {
    fontSize: 15,
  },
  uploadText: {
    color: 'skyblue',
    fontSize: 17,
    fontWeight: '600',
  },
});

export default AlarmTab;
