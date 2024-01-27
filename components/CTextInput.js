import React from 'react';
import { Controller } from 'react-hook-form';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import IIcon from 'react-native-vector-icons/Ionicons';
import colors from '../constant/colors.json';
import fontSize from '../constant/fontSize.json';
import { Picker } from '@react-native-picker/picker';

export default function CTextInput({
  placeholder,
  style = {},
  icon,
  password = false,
  name,
  defaultValue,
  control,
  keyboardType,
  rules = {},
  editable = true,
  inputRef,
  multiline = false,
  numberOfLines = 1,
  onChangeText = () => null,
  ...rest
}) {
  const [isEyeVisible, setIsEyeVisible] = React.useState(true);
  
  return (
    <Controller
      control={control}
      rules={rules}
      render={({field: {onChange, onBlur, value}}) => (
        <TouchableOpacity
          activeOpacity={0.9}
          style={{
            ...styles.container,
            ...style,
          }}>
          {icon}
          <TextInput
            multiline={multiline}
            numberOfLines={numberOfLines}
            placeholder={placeholder}
            placeholderTextColor={colors.textSecondary}
            style={styles.textInput}
            onChangeText={e => {
              onChange(e);
              onChangeText(e);
            }}
            onBlur={onBlur}
            value={value}
            ref={inputRef}
            editable={editable}
            keyboardType={keyboardType ? keyboardType : 'default'}
            secureTextEntry={password && isEyeVisible}
            {...rest}
          />
          {password && (
            <TouchableOpacity
              onPress={() => setIsEyeVisible(prev => !prev)}
              style={styles.eyeIcon}>
              <IIcon
                name={isEyeVisible ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="gray"
              />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      )}
      defaultValue={defaultValue}
      name={name}
    />
  );
}

// Styles adjustments
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.secondary,
    width: '100%', // Adjusted for full width
    borderRadius: 30,
    alignItems: 'center',
    paddingHorizontal: 15,
    minHeight: 55, // Adjusted for adequate height
    marginTop: 20,
  },
  textInput: {
    flex: 1, // Ensure it occupies the available space
    paddingLeft: 10,
    color: colors.text,
    fontSize: fontSize.normal,
  },
  eyeIcon: {
    position: 'absolute',
    right: 20,
  },
});
