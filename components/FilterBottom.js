import React, {useContext} from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {useState, useEffect} from 'react';
import Button from './Button';
import {Text} from './Text';
import colors from '../constant/colors.json';
import fontSize from '../constant/fontSize.json';
import {Picker} from '@react-native-picker/picker';

function FilterBottom({
  pickerData = [],
  selectedFilterValue = null,
  setSelectedFilterValue = () => null,
  onPressFilter,
}) {
  //   const [pickerData, setPickerData] = useState([]);

  // const getPickerData = async () => {
  //   let res = await stateData(lang);
  //   setPickerItemsState(res);
  //   setSelectedState(selectedFilterValue[0]?.state)
  //   if(selectedFilterValue[0]?.state) {
  //     console.log('in if',selectedFilterValue[0]?.state)
  //     getDistricts({ state_name: selectedFilterValue[0]?.state }, lang).then((res) => {
  //       setPickerItemsDistrict(res);
  //       setSelectedDistrict(selectedFilterValue[0]?.district)
  //     });
  //   }

  //   let res2 = await getInsituteName(lang);
  //   setPickerItemsInsitution(res2);
  //   setSelectedInstitution(selectedFilterValue[0]?.institutionName)
  // };

  //   const getDistrict = e => {
  //     setPickerItemsDistrict(
  //       districtData[0][lang][e].map(item => ({
  //         label: item,
  //         value: item,
  //         Id: item,
  //       })),
  //     );
  //   };

  //   useEffect(() => {
  //     if (selectedState || selectedFilterValue[0]?.state)
  //       getDistrict(selectedState || selectedFilterValue[0]?.state);
  //     // get
  //   }, []);

  return (
    <View style={{flex: 1}}>
      <ScrollView style={{paddingBottom: 15}}>
        <View style={styles.container}>
          <View style={styles.picker}>
            {/* {icon} */}
            <Picker
              style={{
                width: '100%',
                color: colors.text,
                fontSize: fontSize.normal,
              }}
              dropdownIconColor={colors.text}
              selectedValue={selectedFilterValue}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedFilterValue(itemValue)
              }>
              {pickerData.map(item => (
                <Picker.Item
                  key={item.key}
                  label={item.label}
                  value={item.value}
                />
              ))}
            </Picker>
          </View>
        </View>
      </ScrollView>
      <View style={{position: 'absolute', bottom: 0, width: '100%'}}>
        <Button
          text={'Filter'}
          style={{
            borderTopStartRadius: 45,
            borderTopEndRadius: 45,
            borderBottomStartRadius: 0,
            borderBottomEndRadius: 0,
          }}
          onPress={onPressFilter}
        />
      </View>
    </View>
  );
}

export default FilterBottom;
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerIcon: {
    position: 'absolute',
    top: 32,
    right: 25,
  },
  picker: {
    flexDirection: 'row',
    backgroundColor: '#80808026',
    width: '90%',
    borderRadius: 15,
    alignItems: 'center',
    paddingHorizontal: 15,
    minHeight: 55,
    marginTop: 20,
  },
});
