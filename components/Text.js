import React from 'react';
import {Text as ReactNativeText} from 'react-native';

// const fontFamily = {
//   default: 'Poppins-Regular',
//   medium: 'Poppins-Medium',
//   semiBold: 'Poppins-SemiBold',
//   bold: 'Poppins-Bold',
// };
export function Text(props) {
  // grab the props
  const {
    text,
    children,
    style: styleOverride,
    type = 'default',
    ...rest
  } = props;

  // figure out which content to use
  const content = text || children;

  const styles = [{color: '#000'}, styleOverride];

  return (
    <ReactNativeText {...rest} style={styles}>
      {content}
    </ReactNativeText>
  );
}
