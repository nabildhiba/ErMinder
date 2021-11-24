import React from 'react';
import {View} from 'react-native';
import Button from './Button';
import colors from '../constant/colors.json';
import fontSize from '../constant/fontSize.json';
import {Text} from './Text';

function LoginPromptModal({
  text,
  leftButtonText,
  rightButtonText,
  onYesPress,
  onNoPress,
}) {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <View
        style={{
          height: 180,
          width: '100%',
          backgroundColor: '#fff',
          borderRadius: 8,
          paddingVertical: 20,
          paddingHorizontal: 20,
          justifyContent: 'space-between',
        }}>
        <Text
          style={{
            fontSize: fontSize.large,
            alignSelf: 'center',
            fontWeight: '600',
            color: colors.text,
          }}>
          {text}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
          }}>
          <Button
            text={leftButtonText}
            style={{flex: 1, borderRadius: 8, marginRight: 5}}
            onPress={onYesPress}
          />
          <Button
            text={rightButtonText}
            style={{
              flex: 1,
              borderRadius: 8,
              marginLeft: 5,
              backgroundColor: '#fff',
              borderWidth: 0.8,
              borderColor: colors.primary,
            }}
            textStyle={{color: colors.primary}}
            onPress={onNoPress}
          />
        </View>
      </View>
    </View>
  );
}

export default LoginPromptModal;
