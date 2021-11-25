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
import CTextInput, {CPicker} from '../components/CTextInput';
import IIcon from 'react-native-vector-icons/Ionicons';
import FIcon from 'react-native-vector-icons/FontAwesome';
import F5Icon from 'react-native-vector-icons/FontAwesome5';
import {showMessage} from 'react-native-flash-message';
import EncryptedStorage from 'react-native-encrypted-storage';
import {CommonActions} from '@react-navigation/routers';
import state from '../Utils/state.json';

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
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async data => {
    console.log(data);
    // setIsLoading(true);
    // let res = await axiosApi({query: data, action: 'userRegister'}).catch(
    //   err => {
    //     console.log(err);
    //     setIsLoading(false);
    //     showMessage({
    //       message: err
    //         ? err?.message
    //           ? err?.message?.toString()
    //           : 'Something went wrong'
    //         : 'Something went wrong',
    //       type: 'danger',
    //     });
    //   },
    // );
    // console.log(JSON.stringify(res));
    // if (res?.data?.ResponseMsg === 200) {
    //   setIsLoading(false);
    //   showMessage({
    //     message: 'Account Created, Please verify your email to continue',
    //     type: 'success',
    //   });
    //   navigation.goBack();
    // } else if (res?.data?.ResponseMsg === 3001) {
    //   showMessage({
    //     message: 'Please Enter valid Email or Password',
    //     type: 'danger',
    //   });
    //   setIsLoading(false);
    // }

    // console.log(JSON.stringify(res));
  };

  return (
    <ScrollView style={{backgroundColor: colors.primary}}>
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
            color: '#fff',
            fontWeight: '500',
          }}>
          Sign Up
        </Text>
      </View>
      <View style={{flex: 1, paddingHorizontal: 10}}>
        <View
          style={{
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
            icon={
              <IIcon name="person-outline" size={20} color={colors.primary} />
            }
            name="fullname"
          />
          {errors.fullname && (
            <Text style={styles.error}>This is required.</Text>
          )}
          <CTextInput
            control={control}
            rules={{
              required: true,
              pattern: emailRegx,
            }}
            style={{width: '100%', minHeight: 55}}
            placeholder={'Email'}
            icon={
              <IIcon name="person-outline" size={20} color={colors.primary} />
            }
            name="user_name"
          />
          {errors.user_name &&
            (errors.user_name.type === 'pattern' ? (
              <Text style={styles.error}>Please enter valid email.</Text>
            ) : (
              <Text style={styles.error}>This is required.</Text>
            ))}
          <CTextInput
            control={control}
            rules={{
              required: true,
            }}
            style={{width: '100%', minHeight: 55}}
            placeholder={'Password'}
            icon={
              <IIcon
                name="ios-lock-closed-outline"
                size={20}
                color={colors.primary}
              />
            }
            name="user_password"
            password={true}
            // defaultValue={userData.question_detail}
          />
          {errors.user_password && (
            <Text style={styles.error}>This is required.</Text>
          )}
          <CTextInput
            control={control}
            rules={{
              required: true,
              minLength: 10,
              maxLength: 10,
            }}
            style={{width: '100%', minHeight: 55, paddingLeft: 20}}
            placeholder={'Mobile'}
            icon={<FIcon name="mobile" size={25} color={colors.primary} />}
            name="mobileno"
            keyboardType={'number-pad'}
          />
          {errors.mobileno &&
            (errors.mobileno.type === 'maxLength' ||
            errors.mobileno.type === 'minLength' ? (
              <Text style={styles.error}>Please enter valid mobile no.</Text>
            ) : (
              <Text style={styles.error}>This is required.</Text>
            ))}

          <CPicker
            autoFocus={true}
            control={control}
            rules={{
              required: true,
            }}
            style={{width: '100%'}}
            // placeholder={'Mobile Number'}
            icon={<FIcon name="map" size={15} color={colors.primary} />}
            name="state"
            pickerData={state}
          />
          {errors.state && <Text style={styles.error}>This is required.</Text>}
          <CTextInput
            control={control}
            rules={{
              required: true,
            }}
            style={{width: '100%', minHeight: 55}}
            placeholder={'City'}
            icon={<F5Icon name="map-marked" size={18} color={colors.primary} />}
            name="city"
          />
          {errors.city && <Text style={styles.error}>This is required.</Text>}
          <View style={{flex: 1, marginTop: 30}}>
            <Button
              text={'Sign up'}
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
              alignItems: 'center',
              alignSelf: 'center',
              marignTop: 20,
              marginBottom: 10,
              paddingTop: 40,
            }}>
            <Text style={{fontSize: fontSize.small}}>
              Already have an account?
            </Text>
            <View>
              <Button
                style={{
                  paddingHorizontal: 40,
                  borderRadius: 8,
                  marginTop: 8,
                  paddingVertical: 15,
                }}
                onPress={() => navigation.navigate('Login')}
                text="Log In"
              />
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
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
  error: {
    color: 'red',
    fontSize: fontSize.small,
  },
});
