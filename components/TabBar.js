import React from 'react';

// import {BoxShadow} from 'react-native-shadow';
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import AIcon from 'react-native-vector-icons/AntDesign';
import IIcon from 'react-native-vector-icons/Ionicons';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import colors from '../constant/colors.json';
import fontSize from '../constant/fontSize.json';
import {Text} from './Text';
import LinearGradient from 'react-native-linear-gradient';

const {width} = Dimensions.get('screen');
export default function TabBar({state, descriptors, navigation}) {
  const shadowOpt = {
    width: width,
    height: 80,
    color: '#000',
    border: 12,
    radius: 10,
    opacity: 0.08,
    x: 0,
    y: 0,
    style: {width: '100%'},
  };
  const shadowOpt2 = {
    width: 70,
    height: 70,
    color: '#000',
    border: 10,
    radius: 30,
    opacity: 0.08,
    x: 10,
    y: -20,
    style: {width: 90},
  };

  const routeName = name => {
    switch (name) {
      case 'LocationTab':
        return 'Location';
      case 'AlarmTab':
        return 'Alarm';
      case 'SettingTab':
        return 'Setting';
      case 'LogOutTab':
        return 'Logout';
      default:
        return null;
    }
  };

  const routeIcon = ({name, isFocused}) => {
    switch (name) {
      case 'LocationTab':
        return (
          <IIcon
            name={'ios-location'}
            size={20}
            color={isFocused ? colors.white : colors.liteGrey}
          />
        );
      case 'SettingTab':
        return (
          <IIcon
            name={'ios-settings'}
            size={20}
            color={isFocused ? colors.white : colors.liteGrey}
          />
        );
      case 'AlarmTab':
        return (
          <IIcon
            name={'ios-alarm-outline'}
            size={20}
            color={isFocused ? colors.white : colors.liteGrey}
          />
        );

      case 'LogOutTab':
        return (
          <IIcon
            name={'ios-power'}
            size={20}
            color={isFocused ? colors.white : colors.liteGrey}
          />
        );
      default:
        return null;
    }
  };

  return (
    // <BoxShadow setting={shadowOpt}>
    <LinearGradient colors={[colors.primary,colors.sec_Primary]} 
    style={{
      width: '100%',
      }}
      >
 
    <View
      style={{
        width: '100%',
        flexDirection: 'row',
      }}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.key}
            activeOpacity={1}
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{
              flex: 1,
              height: 80,
              justifyContent: 'center',
              alignItems: 'center',
              // backgroundColor: '#fff',
            }}>
            {routeIcon({name: route.name, isFocused})}
            {/* {route.name === 'LocationTab' ? (
                <AIcon
                  name={'home'}
                  size={20}
                  color={isFocused ? colors.primary : colors.gray}
                />
              ) : route.name === 'AlarmTab' ? (
                <BoxShadow setting={shadowOpt2}>
                  <View
                    style={{
                      height: 90,
                      width: 90,
                      top: -20,
                      borderRadius: 50,
                      backgroundColor: '#fff',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <AIcon
                      name={'pluscircle'}
                      size={75}
                      color={colors.primary}
                    />
                  </View>
                </BoxShadow>
              ) : (
                route.name === 'ProfileTab' && (
                  <IIcon
                    name={'settings-outline'}
                    size={20}
                    color={isFocused ? colors.primary : colors.gray}
                  />
                )
              )} */}
            <Text style={{color: isFocused ? colors.white : colors.liteGrey}}>
              {routeName(route.name)}
              {/* {route.name === 'LocationTab'
                  ? 'HOME'
                  : route.name === 'AlarmTab'
                  ? null
                  : 'PROFILE'} */}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
    </LinearGradient>
    // </BoxShadow>
  );
}
