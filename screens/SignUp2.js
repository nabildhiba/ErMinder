import React, {useState} from 'react';
import {Dimensions, StyleSheet, ScrollView, View} from 'react-native';
import {useForm} from 'react-hook-form';

import colors from '../constant/colors.json';
import fontSize from '../constant/fontSize.json';
import Button from '../components/Button';
import {Text} from '../components/Text';
import CTextInput from '../components/CTextInput';
import IIcon from 'react-native-vector-icons/Ionicons';
import FIcon from 'react-native-vector-icons/Fontisto';
import {showMessage} from 'react-native-flash-message';
import EncryptedStorage from 'react-native-encrypted-storage';
import auth from '@react-native-firebase/auth';
import {CommonActions} from '@react-navigation/routers';
import firestore from '@react-native-firebase/firestore';

const {height, width} = Dimensions.get('screen');

function ForgetPassword({navigation}) {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm();

  // TODO: use it wherever neeeded
  // const emailRegx =
  //   /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async data => {
    console.log(data);
    setIsLoading(true);
    auth()
      .createUserWithEmailAndPassword(data.user_email, data.user_password)
      .then(async res => {
        const userDB = firestore().collection('Users').doc(res.user.uid);
        await userDB.set(
          {
            fullname: data.fullname,
            email: data.user_email,
            phone: data.user_phone,
            location: data.user_location,
            password: data.user_password,
          },
          {merge: true},
        );

        showMessage({
          message: 'Your account has been created.',
          type: 'success',
        });
        setIsLoading(false);
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [{name: 'HomeNavigation'}],
          }),
        );
      })
      .catch(error => {
        setIsLoading(false);
        const errorMessage = error.message;
        console.log(error.code);
        switch (error.code) {
          case 'auth/email-already-in-use':
            showMessage({
              message: 'Email already registered.',
              type: 'danger',
            });
            break;

          default:
            showMessage({
              message: errorMessage,
              type: 'danger',
            });
            break;
        }
      });
  };

  return (
    <ScrollView style={{backgroundColor: colors.primary}}>
      <View
        style={{
          height: 60,
          paddingLeft: 15,
        }}></View>
      <View
        style={{
          flex: 0.1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingBottom: 20,
          flexDirection: 'row',
        }}>
        <Button
          style={{
            position: 'absolute',
            left: 0,
            top: -20,
          }}
          onPress={() => navigation.goBack()}
          icon={<IIcon name="chevron-back-outline" size={25} color={'#fff'} />}
        />
        <Text
          style={{
            fontSize: fontSize.large,
            color: '#fff',
            fontWeight: '500',
          }}>
          Sign Up
        </Text>
      </View>
      <View style={{flex: 1, paddingHorizontal: 10}}>
        <View
          style={{
            minHeight: 250,
            paddingTop: 10,
            paddingHorizontal: 15,
            borderRadius: 15,
            backgroundColor: colors.backgroundColor,
          }}>
          <CTextInput
            autoFocus={true}
            control={control}
            rules={{
              required: true,
            }}
            style={{width: '100%', minHeight: 55}}
            placeholder={'Full Name'}
            icon={<IIcon name="person" size={20} color={colors.primary} />}
            name="fullname"
          />
          {errors.fullname && (
            <Text style={styles.error}>Please enter your full name.</Text>
          )}
          <CTextInput
            autoFocus={true}
            control={control}
            rules={{
              required: true,
            }}
            style={{width: '100%', minHeight: 55}}
            placeholder={'Email'}
            icon={<IIcon name="mail" size={20} color={colors.primary} />}
            name="user_email"
          />
          {errors.user_email && (
            <Text style={styles.error}>Please enter your email.</Text>
          )}

          <CTextInput
            control={control}
            rules={{
              required: true,
            }}
            style={{width: '100%', minHeight: 55}}
            placeholder={'Phone'}
            icon={
              <IIcon
                name="ios-phone-portrait"
                size={25}
                color={colors.primary}
              />
            }
            name="user_phone"
            keyboardType="phone-pad"
          />
          {errors.user_phone && (
            <Text style={styles.error}>Please enter your phone number.</Text>
          )}

          <CTextInput
            control={control}
            rules={{
              required: true,
            }}
            style={{width: '100%', minHeight: 55}}
            placeholder={'Location'}
            icon={<IIcon name="location" size={25} color={colors.primary} />}
            name="user_location"
          />
          {errors.user_location && (
            <Text style={styles.error}>Please enter your location.</Text>
          )}

          <CTextInput
            control={control}
            rules={{
              required: true,
            }}
            style={{width: '100%', minHeight: 55}}
            placeholder={'Password'}
            icon={<FIcon name="locked" size={20} color={colors.primary} />}
            name="user_password"
            password
          />
          {errors.user_password && (
            <Text style={styles.error}>Please enter your password.</Text>
          )}

          <View style={{flex: 1, margin: 30}}>
            <Button
              text={'Submit'}
              style={{
                backgroundColor: colors.primary,
                borderRadius: 8,
                marginTop: 8,
                paddingVertical: 10,
              }}
              onPress={handleSubmit(onSubmit)}
              isLoading={isLoading}
            />
          </View>

          <View
            style={{
              position: 'absolute',
              bottom: 15,
              alignItems: 'center',
              alignSelf: 'center',
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
}

export default ForgetPassword;

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
    marginLeft: 20,
  },
});
