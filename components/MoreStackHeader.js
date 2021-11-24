import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {getHeaderTitle} from '@react-navigation/elements';
import colors from '../constant/colors.json';
import fontSize from '../constant/fontSize.json';
import IIcon from 'react-native-vector-icons/Ionicons';
import {Text} from './Text';

export const MoreStackHeader = ({navigation, route, options}) => {
  const title = getHeaderTitle(options, route.name);

  switch (route.name) {
    case 'More':
      break;
    case 'Experts':
      break;
    case 'Kundli':
      break;
    case 'ExpertDetails':
      break;
    case 'Profile':
      return (
        <View
          style={{
            ...styles.container,
            justifyContent: 'space-between',
            flexDirection: 'row',
            // backgroundColor: 'red',
            alignItems: 'center',
          }}>
          <View style={{flex: 1}}>
            <TouchableOpacity
              style={{
                marginLeft: 12,
              }}
              onPress={() => navigation.goBack()}>
              <IIcon name="ios-chevron-back" size={28} color={colors.text} />
            </TouchableOpacity>
          </View>
          <View style={{flex: 1}}>
            {/* <Text style={{fontSize: fontSize.medium, fontWeight: '500'}}>
              Update Profile
            </Text> */}
          </View>
          <View style={{flex: 1}}></View>
        </View>
      );

    default:
      return (
        <View style={styles.container}>
          <TouchableOpacity
            style={{marginLeft: 12}}
            onPress={() => navigation.goBack()}>
            <IIcon name="ios-chevron-back" size={28} color={colors.text} />
          </TouchableOpacity>
        </View>
      );
  }
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
});
