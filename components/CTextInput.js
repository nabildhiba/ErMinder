import React from 'react';
import {Controller} from 'react-hook-form';
import {View, TextInput, StyleSheet} from 'react-native';
import IIcon from 'react-native-vector-icons/Ionicons';
import colors from '../constant/colors.json';
import fontSize from '../constant/fontSize.json';
import {Picker} from '@react-native-picker/picker';

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
        <View
          style={{
            ...styles.container,
            // backgroundColor: editable ? '#80808026' : '#808080',
            ...style,
          }}>
          {icon}
          <TextInput
            multiline={multiline}
            numberOfLines={numberOfLines}
            placeholder={placeholder}
            placeholderTextColor={colors.textSecondary}
            style={{
              paddingLeft: 10,
              color: colors.text,
              fontSize: fontSize.normal,
            }}
            onChangeText={e => {
              onChange(e);
              onChangeText(e);
            }}
            onBlur={onBlur}
            value={value}
            ref={inputRef}
            editable={editable}
            // defaultValue={defaultValue}
            keyboardType={keyboardType ? keyboardType : 'default'}
            secureTextEntry={password ? isEyeVisible : false}
            {...rest}
          />
          <View style={styles.passwordEye}>
            {password &&
              (isEyeVisible ? (
                <IIcon
                  name="eye-off-outline"
                  size={20}
                  color="gray"
                  onPress={() => setIsEyeVisible(prev => !prev)}
                />
              ) : (
                <IIcon
                  name="eye-outline"
                  size={20}
                  color="gray"
                  onPress={() => setIsEyeVisible(prev => !prev)}
                />
              ))}
          </View>
        </View>
      )}
      defaultValue={defaultValue}
      name={name}
    />
  );
}

export const CPicker = ({
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
  pickerData,
  ...rest
}) => {
  return (
    <Controller
      control={control}
      rules={rules}
      render={({field: {onChange, onBlur, value}}) => (
        <View
          style={{
            ...styles.container,
            backgroundColor: editable ? '#80808026' : '#808080',
            ...style,
            paddingLeft: 8,
          }}>
          {icon}
          <Picker
            style={{
              width: '100%',
              color: colors.text,
              fontSize: fontSize.normal,
            }}
            dropdownIconColor={colors.text}
            selectedValue={value}
            onValueChange={(itemValue, itemIndex) => onChange(itemValue)}>
            {pickerData.map(item => (
              <Picker.Item
                key={item.key}
                label={item.label}
                value={item.value}
              />
            ))}
          </Picker>
        </View>
      )}
      defaultValue={defaultValue}
      name={name}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.secondary,
    width: '90%',
    borderRadius: 30,
    alignItems: 'center',
    paddingHorizontal: 15,
    minHeight: 55,
    marginTop: 20,
  },
  passwordEye: {position: 'absolute', right: 20},
});
