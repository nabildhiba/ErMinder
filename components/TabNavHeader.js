import React from 'react';
import {View, StyleSheet} from 'react-native';
import colors from '../constant/colors.json';
import fontSize from '../constant/fontSize.json';
import {getHeaderTitle} from '@react-navigation/elements';
import { Text } from './Text';

export const TabNavHeader = ({route, options}) => {
  const title = getHeaderTitle(options, route.name);

  switch (route.name) {
    case 'AddProductTab':
      return (
        <View style={styles.container}>
          <Text type='medium' style={styles.text}>Add Product</Text>
        </View>
      );
    case 'LocationTab':
      break;

    default:
      break;
  }
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  text: {
    marginHorizontal: 20,
    fontSize: fontSize.large,
    color: colors.text,
    fontWeight: '600',
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.gray,
  },
});
