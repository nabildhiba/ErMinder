import React, {useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  ScrollView,
  View,
  Image,
  ImageBackground,
} from 'react-native';
import {useForm} from 'react-hook-form';

import colors from '../constant/colors.json';
import fontSize from '../constant/fontSize.json';
import Button from '../components/Button';
import {Text} from '../components/Text';
import CTextInput from '../components/CTextInput';
import IIcon from 'react-native-vector-icons/Ionicons';
import FIcon from 'react-native-vector-icons/Fontisto';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import EIcon from 'react-native-vector-icons/Entypo';
import {axiosApi} from '../api/axiosApi';
import {showMessage} from 'react-native-flash-message';
import EncryptedStorage from 'react-native-encrypted-storage';
import {CommonActions} from '@react-navigation/routers';

const {height, width} = Dimensions.get('screen');

function Login({navigation}) {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm();

  const emailRegx =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [isVerificationCode, setIsVerificationCode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async data => {
    setEmail(data.user_name);
    setIsLoading(true);
    let res = await axiosApi({query: data, action: 'userLogin'}).catch(err => {
      console.log(err);
      setIsLoading(false);
    });
    if (res?.data?.ResponseMsg === 200) {
      await EncryptedStorage.setItem(
        'userData',
        JSON.stringify(res?.data?.user_id),
      ).catch(err => {
        setIsLoading(false);
        console.log(err);
        showMessage({
          message: err
            ? err?.message
              ? err?.message?.toString()
              : 'Something went wrong'
            : 'Something went wrong',
          type: 'danger',
        });
      });
      setIsLoading(false);
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [{name: 'HomeNavigation'}],
        }),
      );
    } else if (res?.data?.ResponseMsg === 3001) {
      showMessage({
        message: 'Please Enter valid Email or Password',
        type: 'danger',
      });
      setIsLoading(false);
    } else if (res?.data?.ResponseMsg === 3002) {
      showMessage({
        message: 'Please verify your Email to continue',
        type: 'danger',
      });
      setIsLoading(false);
      setIsVerificationCode(true);
    } else {
      setIsLoading(false);
    }

    console.log(JSON.stringify(res));
  };

  const resendCode = async () => {
    let res = await axiosApi({
      query: {email},
      action: 'resendVerificationLink',
    }).catch(err => {
      console.log(err);
      showMessage({
        message: err
          ? err?.message
            ? err?.message?.toString()
            : 'Something went wrong'
          : 'Something went wrong',
        type: 'danger',
      });
    });
    console.log(JSON.stringify(res));
    if (res?.data?.ResponseMsg === 200) {
      setIsVerificationCode(false);
      showMessage({
        message: 'Verification code sent to your Email',
        type: 'success',
      });
    } else {
      showMessage({
        message: 'Something went wrong, Please try again',
        type: 'danger',
      });
    }
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 30,
      }}>
      <ImageBackground
        source={require('../assets/loginBack.png')}
        style={{
          flex: 1,
          width: width + 45,
          height,
          position: 'absolute',
          top: -68,
          left: -25,
        }}
      />
      <View
        style={{
          height: 65,
          paddingLeft: 15,
        }}></View>
      <View
        style={{
          flex: 0.1,
          maxHeight: 50,
          justifyContent: 'flex-end',
          alignItems: 'center',
          paddingBottom: 20,
        }}>
        <Text
          style={{
            fontSize: fontSize.large,
            // color: '#fff',
            fontWeight: '400',
            color: colors.secondary,
          }}>
          Login
        </Text>
      </View>
      {/* <View style={{flex: 1, paddingHorizontal: 10}}> */}
      {/* <View
          style={{
            height: height - 270,
            minHeight: 450,
            maxHeight: 550,
            paddingTop: 10,
            paddingHorizontal: 15,
            borderRadius: 15,
            backgroundColor: colors.backgroundColor,
          }}> */}
      <CTextInput
        autoFocus={true}
        control={control}
        rules={{
          required: true,
        }}
        style={{width: '100%', minHeight: 55}}
        placeholder={'Email'}
        icon={<IIcon name="person" size={20} color={colors.primary} />}
        name="user_name"
        onChangeText={() => {
          if (isVerificationCode) setIsVerificationCode(false);
        }}
      />
      {errors.user_name && <Text style={styles.error}>This is required.</Text>}
      <CTextInput
        control={control}
        rules={{
          required: true,
        }}
        style={{width: '100%', minHeight: 55}}
        placeholder={'Password'}
        icon={<FIcon name="locked" size={20} color={colors.primary} />}
        name="user_password"
        password={true}
        // defaultValue={userData.question_detail}
      />
      {errors.user_password && (
        <Text style={styles.error}>This is required.</Text>
      )}
      <View style={styles.checkboxContainer}>
        {isVerificationCode && (
          <Text style={styles.resendCode} onPress={resendCode}>
            Send Verification Code
          </Text>
        )}
        <Text
          style={{
            position: 'absolute',
            right: 15,
            fontSize: fontSize.small,
            top: -10,
            color: colors.secondary,
          }}
          onPress={() => navigation.navigate('ForgetPassword')}>
          Forgot Password?
        </Text>
      </View>

      <View style={{flex: 1, marginTop: 30}}>
        <Button
          text={'Log In'}
          textStyle={{color: colors.primary}}
          style={{
            backgroundColor: colors.secondary,
            borderRadius: 30,
            marginTop: 8,
            paddingVertical: 15,
          }}
          onPress={handleSubmit(onSubmit)}
          isLoading={isLoading}></Button>
      </View>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          alignItems: 'center',
          justifyContent: 'flex-end',
          width,
          // backgroundColor: colors.white,
          // height: 250,
          paddingBottom: 15,
          borderTopEndRadius: 25,
        }}>
        <View
          style={{
            flexDirection: 'row',
            width: 140,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Image
            source={require('../assets/google.png')}
            style={{height: 35, width: 35, borderRadius: 35}}
          />
          {/* <MCIcon name="google" size={40} color={'#000'} /> */}
          <MCIcon name="facebook" size={40} color={'#3b5998'} />
          <EIcon name="twitter-with-circle" size={40} color={'#1DA1F2'} />
        </View>
        <TouchableOpacity onPress={()=>{
          navigation.navigate('HomeNavigation')
        }}>
          <Text style={{fontSize: fontSize.normal}}>No account? Sign up</Text>
        </TouchableOpacity>
        <Button
          text={'Continue without login'}
          textStyle={{color: colors.text, fontSize: fontSize.small}}
          style={{backgroundColor: '#fff', marginTop: 10}}
          onPress={() => {
            navigation.dispatch(
              CommonActions.reset({
                index: 1,
                routes: [{name: 'HomeNavigation'}],
              }),
            );
          }}
        />
      </View>
      {/* </View> */}
      {/* </View> */}
    </View>
  );
}

export default Login;

const styles = StyleSheet.create({
  label: {
    color: colors.primary,
    marginTop: 15,
  },
  inputItem: {
    height: 40,
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  resendCode: {
    fontSize: fontSize.normal,
    color: colors.primary,
  },
  error: {
    color: 'red',
    fontSize: fontSize.small,
  },
});
