import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from './Text';

export default function NoData({style = {}}) {
  return (
    <View style={[styles.container, style]}>
      <Text>No data found</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {alignItems: 'center', marginTop: 200},
});
