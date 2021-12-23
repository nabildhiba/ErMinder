import React from 'react';
import {TouchableOpacity, StyleSheet, ActivityIndicator} from 'react-native';
import colors from '../constant/colors.json';
import {Text} from './Text';

export default function Button({
  style = {},
  textStyle = {},
  icon,
  text,
  disabled = false,
  isLoading = false,
  indicatorColor = '#fff',
  ...rest
}) {
  return (
    <TouchableOpacity
      disabled={disabled}
      style={{
        ...styles.container,
        backgroundColor: disabled ? colors.gray : colors.primary,
        ...style,
      }}
      {...rest}>
      {isLoading ? (
        <ActivityIndicator size={22} color={indicatorColor} />
      ) : (
        <>
          {icon}
          <Text type="semiBold" style={{...styles.text, ...textStyle}}>
            {text}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 18,
    borderRadius: 15,
    flexDirection: 'row',
  },
  text: {
    fontSize: 16,
    color: '#fff',
  },
});
