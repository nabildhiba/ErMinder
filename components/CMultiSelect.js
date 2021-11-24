import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import Select2 from 'react-native-select-two';
import colors from '../constant/colors.json';
import fontSize from '../constant/fontSize.json';
import {Text} from './Text';

const width = Dimensions.get('window').width;

function CMultiSelect({
  label,
  placeholder,
  compWidth,
  iconPadding = 8,
  required = false,
  pickerItems,
  ...rest
}) {
  return (
    <View
      style={{...styles.inputBox}}
      key={pickerItems?.key || Math.round(Math.random() * 1000000).toString()}>
      {/* <Text
        style={{
          zIndex: 1,
          fontSize: fontSize.normal,
          color: colors.secondary,
          paddingLeft: 15,
        }}>
        {label}
        {required && <Text style={{color: '#ff000080'}}> *</Text>}
      </Text> */}
      <Select2
        isSelectSingle={false}
        style={{borderWidth: 0,fontSize:fontSize.normal}}
        colorTheme={colors.primary}
        searchPlaceHolderText={'Search'}
        popupTitle={'Select'}
        cancelButtonText={'Cancel'}
        selectButtonText={'Submit'}
        listEmptyTitle={'No Data found!'}
        selectedTitleStyle={{fontSize: fontSize.normal, color: '#000'}}
        buttonTextStyle={{fontSize: fontSize.normal}}
        {...rest}
      />
    </View>
  );
}

export default CMultiSelect;

const styles = StyleSheet.create({
  // container: {
  //     flexDirection: 'row',
  //     // backgroundColor: '#f7f9f8',
  //     width: '90%',
  //     borderRadius: 15,
  //     alignItems: 'center',
  //     paddingHorizontal: 15,
  //     minHeight: 55,
  //     marginTop: 20,
  //   },

  inputBox: {
    marginTop: 20,
    width: '90%',
    borderRadius: 15,
    backgroundColor: '#80808026',
    paddingHorizontal: 20,
    minHeight: 50,
    borderWidth: 0,
    justifyContent: 'center',
    paddingVertical: 6,
  },
  picker: {
    paddingLeft: 8,
    height: 40,
    color: colors.secondary,
  },
  pickerLabel: {
    color: colors.secondary,
    fontSize: fontSize.normal,
    paddingLeft: 15,
  },
});
