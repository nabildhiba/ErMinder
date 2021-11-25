import React, {useState} from 'react';
import {TouchableOpacity, Image} from 'react-native';

const CHECKED_IMAGE = require('../assets/checkbox/on.png');
const UNCHECKED_IMAGE = require('../assets/checkbox/off.png');

export default function AppCheckbox({
  size = 20,
  onValueChange,
  value,
  ...rest
}) {
  return (
    <TouchableOpacity onPress={() => onValueChange(!value)} {...rest}>
      <Image
        style={{width: size, height: size}}
        source={value ? CHECKED_IMAGE : UNCHECKED_IMAGE}
      />
    </TouchableOpacity>
  );
}
