import React, {useState, useEffect, useLayoutEffect} from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
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

const ExpertCardList = ({text, desc}) => {
  return (
    <>
      <View
        style={{
          backgroundColor: '#80808026',
          paddingHorizontal: 15,
          paddingVertical: 12,
          borderRadius: 10,
          marginBottom: 10,
        }}>
        <Text style={{fontSize: fontSize.medium, lineHeight: 30}}>{text}</Text>
        <Text style={{fontSize: fontSize.normal, opacity: 0.7}}>{desc}</Text>
      </View>
    </>
  );
};

function ExpertDetails({route, navigation}) {
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  console.log(route.params);
  const getUserData = async () => {
    let res = await axiosApi({
      query: {expert_id: route.params.id},
      action: 'expertProfile',
    }).catch(err => {
      console.log(err);
      setIsLoading(false);
    });
    console.log('expert', JSON.stringify(res));
    if (res?.data?.ResponseMsg === 200) {
      setUserData(
        res?.data?.ResponseData?.length !== 0
          ? res?.data?.ResponseData[0]
          : res?.data?.ResponseData,
      );
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return isLoading ? (
    <View style={styles.loadingcontainer}>
      <ActivityIndicator size={30} color={colors.primary} />
    </View>
  ) : (
    <ScrollView style={{flex: 1, backgroundColor: '#fff'}}>
      <View
        style={{
          backgroundColor: colors.primary,
          height: 380,
          borderBottomStartRadius: 25,
          borderBottomEndRadius: 25,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            position: 'absolute',
            alignSelf: 'flex-start',
            top: 10,
            left: 10,
            height: 50,
            width: 50,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <IIcon name="ios-chevron-back" size={28} color={colors.text} />
        </TouchableOpacity>
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
              userData?.profile_pic
                ? {uri: userData?.profile_pic}
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
            {userData?.fullname}
          </Text>
          <Text
            style={{
              fontSize: fontSize.normal,
              color: '#fff',
              opacity: 0.8,
            }}>
            {userData?.expert_in}
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
          <NumberCard number={userData?.questioned} text={'Questions'} />
          <NumberCard number={userData?.answered} text={'Answered'} />
          <NumberCard number={userData?.rank} text={'Rank'} />
        </View>
      </View>
      <View style={{marginTop: 20, paddingHorizontal: 10}}>
        <ExpertCardList text={'Expert In '} desc={userData?.expert_in} />
        <ExpertCardList text={'Mobile Number'} desc={userData?.mobileno} />
        <ExpertCardList text={'Email'} desc={userData?.email} />
        <ExpertCardList text={'State'} desc={userData?.state} />
        <ExpertCardList text={'City'} desc={userData?.city} />
        <ExpertCardList text={'Experience'} desc={userData?.qualification} />
        <ExpertCardList text={'About'} desc={userData?.about_myself} />
        <View style={{height: 40}} />
      </View>
    </ScrollView>
  );
}

export default ExpertDetails;

const styles = StyleSheet.create({
  loadingcontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundColor,
  },
});
