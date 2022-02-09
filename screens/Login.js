import React, {useState, useEffect} from 'react';
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
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
import {showMessage} from 'react-native-flash-message';
import {CommonActions} from '@react-navigation/routers';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId:
    '108353413486-ibnungoagc64o9k8eno2ctcfa3f6i8dn.apps.googleusercontent.com',
});

async function onGoogleButtonPress() {
  const isUserSignedIn = await GoogleSignin.isSignedIn();
  if (isUserSignedIn) {
    await GoogleSignin.signOut();
  }
  // Get the users ID token
  const {idToken} = await GoogleSignin.signIn();

  // Create a Google credential with the token
  const googleCredential = auth.GoogleAuthProvider.credential(idToken);

  // Sign-in the user with the credential
  return auth().signInWithCredential(googleCredential);
}

const {height, width} = Dimensions.get('screen');

function Login({navigation}) {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm();

  const emailRegx =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  // const [email, setEmail] = useState(null);
  // const [password, setPassword] = useState(null);
  const [isVerificationCode, setIsVerificationCode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  // const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(user) {
    // console.log(user);
    if (user) {
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [{name: 'HomeNavigation'}],
        }),
      );
    }
    // setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async data => {
    // console.log(data);
    setIsLoading(true);
    auth()
      .signInWithEmailAndPassword(data.user_name, data.user_password)
      // .then(() => {
      //   navigation.dispatch(
      //     CommonActions.reset({
      //       index: 1,
      //       routes: [{name: 'HomeNavigation'}],
      //     }),
      //   );
      // })
      .catch(error => {
        const errorMessage = error.message;
        console.log(errorMessage);
        console.log(error.code);
        switch (error.code) {
          case 'auth/wrong-password':
            showMessage({
              message: 'Email or Password is incorrect.',
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
      })
      .finally(() => {
        setIsLoading(false);
      });
    // setEmail(data.user_name);
    // setIsLoading(true);
    // auth()
    //   .createUserWithEmailAndPassword('honey@gmail.com', 'Honey@123')
    //   .then(() => {
    //     console.log('User account created & signed in!');
    //   })
    //   .catch(error => {
    //     if (error.code === 'auth/email-already-in-use') {
    //       console.log('That email address is already in use!');
    //     }

    //     if (error.code === 'auth/invalid-email') {
    //       console.log('That email address is invalid!');
    //     }

    //     console.error(error);
    //   });
    // setIsLoading(false);
    // let res = await axiosApi({query: data, action: 'userLogin'}).catch(err => {
    //   console.log(err);
    //   setIsLoading(false);
    // });
    // if (res?.data?.ResponseMsg === 200) {
    //   await EncryptedStorage.setItem(
    //     'userData',
    //     JSON.stringify(res?.data?.user_id),
    //   ).catch(err => {
    //     setIsLoading(false);
    //     console.log(err);
    //     showMessage({
    //       message: err
    //         ? err?.message
    //           ? err?.message?.toString()
    //           : 'Something went wrong'
    //         : 'Something went wrong',
    //       type: 'danger',
    //     });
    //   });
    //   setIsLoading(false);
    //   navigation.dispatch(
    //     CommonActions.reset({
    //       index: 1,
    //       routes: [{name: 'HomeNavigation'}],
    //     }),
    //   );
    // } else if (res?.data?.ResponseMsg === 3001) {
    //   showMessage({
    //     message: 'Please Enter valid Email or Password',
    //     type: 'danger',
    //   });
    //   setIsLoading(false);
    // } else if (res?.data?.ResponseMsg === 3002) {
    //   showMessage({
    //     message: 'Please verify your Email to continue',
    //     type: 'danger',
    //   });
    //   setIsLoading(false);
    //   setIsVerificationCode(true);
    // } else {
    //   setIsLoading(false);
    // }
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
          marginTop: 35,
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
      {errors.user_name && (
        <Text style={styles.error}>Please enter your email.</Text>
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
        password={true}
        // defaultValue={userData.question_detail}
      />
      {errors.user_password && (
        <Text style={styles.error}>Please enter your password.</Text>
      )}
      <View style={styles.checkboxContainer}>
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
          <TouchableOpacity
            onPress={() => {
              onGoogleButtonPress()
                .then(() => {
                  console.log('Success');
                })
                .catch(err => {
                  console.log(JSON.stringify(err));
                });
            }}>
            <Image
              source={require('../assets/google.png')}
              style={{height: 35, width: 35, borderRadius: 35}}
            />
          </TouchableOpacity>
          {/* <MCIcon name="google" size={40} color={'#000'} /> */}
          <MCIcon name="facebook" size={40} color={'#3b5998'} />
          <EIcon name="twitter-with-circle" size={40} color={'#1DA1F2'} />
        </View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('SignUp');
          }}>
          <Text style={{fontSize: fontSize.medium, marginTop: 8}}>
            No account? Sign up
          </Text>
        </TouchableOpacity>
        <Button
          text={'Continue without login'}
          textStyle={{color: colors.text, fontSize: fontSize.small}}
          style={{backgroundColor: '#fff', marginTop: 10}}
          onPress={() => {
            auth().signInAnonymously();
            // navigation.dispatch(
            //   CommonActions.reset({
            //     index: 1,
            //     routes: [{name: 'HomeNavigation'}],
            //   }),
            // );
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
    marginLeft: 20,
    // position: 'absolute',
    marginTop: 2,
  },
});
