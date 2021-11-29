import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {Text} from '../components/Text';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import {launchImageLibrary} from 'react-native-image-picker';
import firestore from '@react-native-firebase/firestore';

const PIC_SIZE = 150;

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
      setUser({
        email: currentUser.email,
        phone: currentUser.phoneNumber,
        photoURL: currentUser.photoURL,
        isAnonymous: currentUser.isAnonymous,
      });
      firestore()
        .collection('Users')
        .doc(currentUser.uid)
        .get()
        .then(doc => {
          if (doc.exists) {
            console.log('Document data:', doc.data());
            setUser(prev => ({...prev, ...doc.data()}));
          } else {
            // doc.data() will be undefined in this case
            console.log('No such document!');
          }
        });
    }
  }, []);

  const getProfilePhoto = async () => {
    const result = await launchImageLibrary({quality: 0.5});
    if (!result?.didCancel && result?.assets[0]?.uri) {
      let reference = storage().ref(result?.assets[0]?.fileName);
      let task = reference.putFile(result?.assets[0]?.uri);
      task.then(async res => {
        // TODO: need to delete the previous image somehow
        // if (user?.photoURL) {
        //   await storage().ref(user?.photoURL).delete();
        // }
        const url = await storage().ref(res.metadata.fullPath).getDownloadURL();
        setUser(prev => {
          return {...prev, photoURL: url};
        });
        auth().currentUser.updateProfile({photoURL: url});
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <ImageBackground source={require('../assets/profileback.png')}>
        <View style={{height: 160}} />
        <View style={styles.cover}>
          <View
            style={[
              styles.imgContainer,
              {
                transform: [{translateY: -PIC_SIZE / 2}],
              },
            ]}>
            <Image
              style={{
                width: PIC_SIZE,
                height: PIC_SIZE,
                borderRadius: PIC_SIZE / 2,
              }}
              source={
                user?.photoURL
                  ? {uri: user?.photoURL}
                  : require('../assets/profile.png')
              }
            />
            {user && (
              <TouchableOpacity onPress={getProfilePhoto}>
                <Text style={styles.uploadText}>Upload</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={styles.infoContainer}>
          {/* <InfoRow placeholder="Username" value="Justin" /> */}
          <InfoRow
            placeholder="Email"
            value={user?.isAnonymous ? 'Anonymous' : user?.email ?? '-'}
          />
          <InfoRow
            placeholder="Location"
            value={user?.isAnonymous ? 'Anonymous' : user?.location ?? '-'}
          />
          <InfoRow
            placeholder="Phone number"
            value={user?.isAnonymous ? 'Anonymous' : user?.phone ?? '-'}
          />
          {/* <InfoRow placeholder="Password" value={user?.email ?? '-'} /> */}
        </View>
      </ImageBackground>
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
    backgroundColor: '#FFF',
  },
  imgContainer: {
    alignItems: 'center',
    marginBottom: -PIC_SIZE / 2 + 10,
  },
  cover: {
    backgroundColor: '#FFF',
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
    color: '#309FA4',
    fontSize: 17,
    fontWeight: '600',
    marginTop: 2,
  },
});

export default ProfileTab;
