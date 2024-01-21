import React, {useState, useEffect, useLayoutEffect} from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Text} from '../components/Text';
import colors from '../constant/colors.json';
import fontSize from '../constant/fontSize.json';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import EncryptedStorage from 'react-native-encrypted-storage';
import {CommonActions} from '@react-navigation/routers';
import auth from '@react-native-firebase/auth';
import ErrorBoundary from '../Utils/ErrorBoundary';

const ProfileButton = ({
  text,
  icon = <MIcon name={'keyboard-arrow-right'} size={30} color={'#fff'} />,
  onPress = () => null,
}) => {
  return (
    <TouchableOpacity
      style={{
        alignItems: 'center',
        backgroundColor: '#80808026',
        height: 60,
        paddingHorizontal: 15,
        borderRadius: 10,
        flexDirection: 'row',
        marginBottom: 10,
        justifyContent: 'space-between',
      }}
      onPress={onPress}>
      <Text style={{fontSize: fontSize.medium}}>{text}</Text>
      <View
        style={{
          height: 40,
          width: 40,
          backgroundColor: colors.primary,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 20,
        }}>
        {icon}
      </View>
    </TouchableOpacity>
  );
};

function More({navigation}) {
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userLogedIn, setUserLoggedIn] = useState(true);

const logOut = async () => {
    console.log("will log out");
    setIsLoading(true); // Start loading
    try {
      await auth().signOut();
      console.log("logged out");
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [{name: 'LoginNavigation'}],
        }),
      );
    } catch (error) {
      console.error("Logout failed: ", error);
      // Handle logout error here
    } finally {
      setIsLoading(false); // End loading
    }
  };

  useLayoutEffect(() => {
    (async () => {
      let userData = await EncryptedStorage.getItem('userData').catch(err => {
        console.log(err);
      });
      if (userData == undefined || userData == null) {
        // navigation.replace('LoginNavigation');
        setUserLoggedIn(false);
      } else {
        setUserLoggedIn(true);
      }
    })();
  }, []);

  return isLoading ? (
    <View style={styles.loadingcontainer}>
      <ActivityIndicator size={30} color={colors.primary} />
    </View>
  ) : (
    <ErrorBoundary>
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={{marginTop: 20, paddingHorizontal: 10}}>
        <ProfileButton
          text={'Logout'}
          icon={<MIcon name={'logout'} size={25} color={'#fff'} />}
          onPress={logOut}
        />
      </View>
    </View>
    </ErrorBoundary>
  );
}

export default More;

const styles = StyleSheet.create({
  loadingcontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundColor,
  },
});
