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
import IIcon from 'react-native-vector-icons/Ionicons';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {axiosApi} from '../api/axiosApi';
import EncryptedStorage from 'react-native-encrypted-storage';
import {CommonActions} from '@react-navigation/routers';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {showMessage} from 'react-native-flash-message';

const NumberCard = ({text, number}) => {
  return (
    <View
      style={{
        height: 80,
        width: 80,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.transparentGray,
        borderRadius: 10,
      }}>
      <Text
        style={{
          fontSize: fontSize.xxlarge,
          fontWeight: '500',
          color: '#fff',
          lineHeight: 35,
        }}>
        {number}
      </Text>
      <Text style={{fontSize: fontSize.normal, color: '#fff'}}>{text}</Text>
    </View>
  );
};

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
  const [isLoading, setIsLoading] = useState(true);
  const [userLogedIn, setUserLoggedIn] = useState(true);
  const [imageUrl, setImageUrl] = useState('');

  const logOut = async () => {
    await EncryptedStorage.removeItem('userData').catch(err => {
      console.log(err);
      showMessage({
        message: 'Something went wrong, Please try again',
        type: 'danger',
      });
    });
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{name: 'LoginNavigation'}],
      }),
    );
  };
  const getUserData = async () => {
    let userId = 0;
    let userData = await EncryptedStorage.getItem('userData').catch(err => {
      console.log(err);
    });
    if (userData !== undefined && userData !== null) {
      userId = JSON.parse(userData)?.id;
    } else {
      setIsLoading(false);
      return;
    }
    let res = await axiosApi({
      query: {user_id: userId},
      action: 'getProfileDetail',
    }).catch(err => {
      console.log(err);
      setIsLoading(false);
    });
    console.log('Profile-----------', JSON.stringify(res));
    if (res?.data?.ResponseMsg === 200) {
      setUserData(res?.data?.user_id);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  const uploadImage = () => {
    launchImageLibrary({mediaType: 'photo'}, async e => {
      console.log(e.assets[0].uri);
      let res = await axiosApi({
        query: {
          imgInp: e.assets[0].uri,
          user_id: userData.id,
        },
        action: 'imageupload',
      });
      console.log(JSON.stringify(res));
      if (res.status === 200) {
        setImageUrl(e.assets[0].uri);
        showMessage({
          message: 'Profile uploaded Successfully',
          type: 'success',
        });
      } else {
        showMessage({
          message: 'Something went wrong, Please try again',
          type: 'danger',
        });
      }
      // copy_of_scheme: {
      //   type: "image/*",
      //   uri: imageDoc.uri,
      //   name: imageDoc.uri,
      // },
    });
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

  useEffect(() => {
    console.log(userData);
  }, [userData]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', e => {
      getUserData();
    });
    return unsubscribe;
  }, [navigation]);

  return isLoading ? (
    <View style={styles.loadingcontainer}>
      <ActivityIndicator size={30} color={colors.primary} />
    </View>
  ) : (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      {userLogedIn && (
        <View
          style={{
            backgroundColor: colors.primary,
            height: 380,
            borderBottomStartRadius: 25,
            borderBottomEndRadius: 25,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              height: 120,
              width: 120,
              backgroundColor: '#fff',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 35,
            }}>
            <Image
              source={
                userData.profile_pic
                  ? {uri: imageUrl ? imageUrl : userData.profile_pic}
                  : require('../assets/man.png')
              }
              style={{
                top: 8,
                height: 105,
                width: 105,
                borderBottomLeftRadius: 26,
                borderBottomRightRadius: 26,
              }}
            />
            <TouchableOpacity
              onPress={uploadImage}
              style={{
                position: 'absolute',
                bottom: -10,
                right: -5,
                backgroundColor: colors.gray,
                borderRadius: 50,
                justifyContent: 'center',
                alignItems: 'center',
                width: 40,
                height: 40,
              }}>
              <IIcon
                style={{left: 1}}
                name={'md-add'}
                size={30}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              marginTop: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontWeight: '500',
                fontSize: fontSize.large,
                lineHeight: 30,
                color: '#fff',
              }}>
              {userData.fullname}
            </Text>
            <Text
              style={{
                fontSize: fontSize.normal,
                color: '#fff',
                opacity: 0.8,
              }}>
              {userData.expert_in}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              width: 130,
              justifyContent: 'space-between',
              marginVertical: 10,
            }}>
            <Image
              source={require('../assets/facebook.png')}
              style={{height: 35, width: 35}}
            />
            <Image
              source={require('../assets/google.png')}
              style={{height: 35, width: 35}}
            />
            <Image
              source={require('../assets/linkedin.png')}
              style={{height: 35, width: 35}}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              width: 280,
              justifyContent: 'space-between',
              marginTop: 15,
            }}>
            <NumberCard number={userData.noOfQuestions} text={'Questions'} />
            <NumberCard number={userData.noOfAnswers} text={'Answered'} />
            <NumberCard
              number={userData.rank ? userData.rank : 0}
              text={'Rank'}
            />
          </View>
        </View>
      )}
      <View style={{marginTop: 20, paddingHorizontal: 10}}>
        <ProfileButton
          text={'Kundli'}
          onPress={() => {
            navigation.navigate('Kundli');
          }}
        />
        <ProfileButton
          text={'Experts'}
          onPress={() => {
            navigation.navigate('Experts');
          }}
        />
        {userLogedIn && (
          <>
            <ProfileButton
              text={'My Profile'}
              onPress={() => {
                navigation.navigate('Profile', {userData});
              }}
            />
            <ProfileButton
              text={'My Questions'}
              onPress={() => {
                navigation.navigate('MyQuestions', {userData});
              }}
            />
            {userData?.usertype !== 'expert' && (
              <ProfileButton
                text={'Upgrade to expert'}
                onPress={() => {
                  navigation.navigate('Profile', {
                    userData,
                    upgradeToExpert: true,
                  });
                }}
              />
            )}
          </>
        )}
        {userLogedIn ? (
          <ProfileButton
            text={'Log Out'}
            icon={<MIcon name={'logout'} size={25} color={'#fff'} />}
            onPress={logOut}
          />
        ) : (
          <ProfileButton
            text={'Account'}
            icon={<MIcon name={'logout'} size={25} color={'#fff'} />}
            onPress={logOut}
          />
        )}
        {/* <Text style={{fontSize: fontSize.medium, marginTop: 5}}>Details</Text> */}
      </View>
    </View>
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
