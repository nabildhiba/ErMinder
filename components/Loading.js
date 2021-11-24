import React from 'react';
import {ActivityIndicator, View, StyleSheet} from 'react-native';
import colors from '../constant/colors.json';

function Loading() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={30} color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundColor,
  },
});

export default Loading;
