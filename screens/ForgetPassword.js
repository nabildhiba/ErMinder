import React, {useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  ScrollView,
  View,
} from 'react-native';
import {useForm} from 'react-hook-form';

import colors from '../constant/colors.json';
import fontSize from '../constant/fontSize.json';
import Button from '../components/Button';
import {Text} from '../components/Text';
import CTextInput from '../components/CTextInput';
import IIcon from 'react-native-vector-icons/Ionicons';
import {axiosApi} from '../api/axiosApi';
import {showMessage} from 'react-native-flash-message';
import EncryptedStorage from 'react-native-encrypted-storage';
import {CommonActions} from '@react-navigation/routers';

const {height, width} = Dimensions.get('screen');

function ForgetPassword({navigation}) {
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
    let res = await axiosApi({query: data, action: 'forgotpassword'}).catch(
      err => {
        console.log(err);
        setIsLoading(false);
      },
    );
    console.log(JSON.stringify(res));
    if (res?.data?.ResponseMsg === 200) {
      showMessage({
        message:
          'Password Reset Request has successfully sent. You will receive email with reset password link, if you do not find email in inbox then please check spam/junk folder.',
        type: 'success',
      });
      setIsLoading(false);
      navigation.goBack();
    } else if (res?.data?.ResponseMsg === 3001) {
      showMessage({
        message: 'Entered email is either no registered or invalid',
        type: 'danger',
      });
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }

    console.log(JSON.stringify(res));
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
          Forgot Password
        </Text>
      </View>
      <View style={{flex: 1, paddingHorizontal: 10}}>
        <View
          style={{
            height: height - 270,
            minHeight: 250,
            maxHeight: 350,
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
            placeholder={'Email'}
            icon={
              <IIcon name="person-outline" size={20} color={colors.primary} />
            }
            name="user_name"
          />
          {errors.user_name && (
            <Text style={styles.error}>This is required.</Text>
          )}

          <View style={{flex: 1, marginTop: 30}}>
            <Button
              text={'Reset Password'}
              style={{
                backgroundColor: colors.primary,
                borderRadius: 8,
                marginTop: 8,
                paddingVertical: 15,
              }}
              onPress={handleSubmit(onSubmit)}
              isLoading={isLoading}></Button>
          </View>

          <View
            style={{
              position: 'absolute',
              bottom: 15,
              alignItems: 'center',
              alignSelf: 'center',
            }}>
            <View></View>
          </View>
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
  },
});
