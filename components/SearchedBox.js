import React from 'react';
import {StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import IIcon from 'react-native-vector-icons/Ionicons';
import colors from '../constant/colors.json';
import {Text} from './Text';

function SearchedBox({
  onPressBack,
  backIcon = false,
  onPressFilter,
  filterIcon = true,
  onPressCross = () => null,
  searchstring = '',
  ...rest
}) {
  return (
    <View style={styles.searchContainer}>
      {backIcon && (
        <TouchableOpacity
          style={{
            marginLeft: 0,
            marginRight: 10,
          }}
          onPress={onPressBack}>
          <IIcon name="ios-chevron-back" size={28} color={'#000'} />
        </TouchableOpacity>
      )}
      <View style={styles.searchBoxContainer}>
        <View {...rest} style={styles.searchBoxInput}>
          <View style={styles.searchedBox}>
            <TouchableOpacity
              style={{
                alignSelf: 'flex-end',
                position: 'absolute',
                zIndex: 1,
                top: -8,
                right: -8,
              }}
              onPress={onPressCross}>
              <IIcon name="ios-close-circle" size={22} color={colors.primary} />
            </TouchableOpacity>

            <Text>{searchstring}</Text>
          </View>
        </View>
        <View style={styles.searhIcons}>
          <IIcon name="ios-search-outline" size={22} color="grey" />
          {filterIcon && (
            <TouchableOpacity onPress={onPressFilter}>
              <IIcon
                name="ios-filter-sharp"
                size={22}
                color="grey"
                style={{marginLeft: 10}}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

export default SearchedBox;
const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBoxContainer: {
    flexDirection: 'row',
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    minHeight: 50,
    borderRadius: 10,
    alignItems: 'center',
  },
  searchBoxInput: {
    flex: 1,
    color: '#000',
  },
  searhIcons: {
    flexDirection: 'row',
  },
  searchedBox: {
    backgroundColor: '#efefef',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginVertical: 8,
  },
});
