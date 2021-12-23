import React from 'react';
import {StyleSheet, TouchableOpacity, Text, View} from 'react-native';
import {getHeaderTitle} from '@react-navigation/elements';
import colors from '../constant/colors.json';
import fontSize from '../constant/fontSize.json';
import IIcon from 'react-native-vector-icons/Ionicons';

export const HomeStackHeader = ({navigation, route, options}) => {
  const title = getHeaderTitle(options, route.name);

  switch (route.name) {
    case 'Home':
      break;

    default:
      return (
        <View style={styles.container}>
          <TouchableOpacity
            style={{marginLeft: 12}}
            onPress={() => navigation.goBack()}>
            <IIcon name="ios-chevron-back" size={28} color={colors.white} />
          </TouchableOpacity>
          <Text
            style={{
              color: colors.white,
              fontSize: fontSize.large,
              marginLeft: 10,
            }}>
            ErMinder
          </Text>
        </View>
      );
  }
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    flexDirection: 'row',
  },
});
