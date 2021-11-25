import React from 'react';
import {StyleSheet, ActivityIndicator, View} from 'react-native';

export default function Spinner({
  style = {},
  viewProps = {},
  spinnerProps = {},
  show = false,
}) {
  if (!show) {
    return null;
  }
  return (
    <View style={[styles.container, style]} {...viewProps}>
      <ActivityIndicator color="#000" size="large" {...spinnerProps} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.5,
    backgroundColor: '#fff',
  },
});
