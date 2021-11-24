import React, {useEffect, useState} from 'react';
import {StyleSheet, View, ScrollView, Image} from 'react-native';
import {Text} from '../components/Text';
import auth from '@react-native-firebase/auth';

const PIC_SIZE = 130;

const InfoRow = ({placeholder, value}) => {
  return (
    <View style={styles.alramCard}>
      <Text style={styles.placeholderText}>{placeholder}</Text>
      <Text style={styles.valueText}>{value}</Text>
    </View>
  );
};

function ProfileTab({navigation}) {
  const [user, setUser] = useState({});
  useEffect(() => {
    const currentUser = auth().currentUser;
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.cover}>
        <View
          style={[
            styles.imgContainer,
            {
              transform: [{translateY: PIC_SIZE / 2}],
            },
          ]}>
          <Image
            style={{width: PIC_SIZE, height: PIC_SIZE}}
            source={require('../assets/profile.png')}
          />
          <Text style={styles.uploadText}>Upload</Text>
        </View>
      </View>
      <View style={styles.infoContainer}>
        <InfoRow placeholder="Username" value="Justin" />
        <InfoRow placeholder="Email" value={user?.email ?? '-'} />
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
  imgContainer: {
    alignItems: 'center',
  },
  cover: {
    height: 140,
    marginBottom: 80,
    backgroundColor: 'skyblue',
    justifyContent: 'flex-end',
    alignItems: 'center',
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
    marginTop: 2,
  },
});

export default ProfileTab;
