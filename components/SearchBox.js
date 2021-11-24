import React from 'react';
import {StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import IIcon from 'react-native-vector-icons/Ionicons';
import colors from '../constant/colors.json';

function SearchBox({
  placeholder,
  onPressBack,
  backIcon = false,
  onPressFilter,
  filterIcon = true,
  onChangeText = () => null,
  onSubmitEditing = () => null,
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
        <TextInput
          {...rest}
          style={styles.searchBoxInput}
          placeholder={placeholder}
          placeholderTextColor="grey"
          onChangeText={onChangeText}
          returnKeyType={'search'}
          onSubmitEditing={onSubmitEditing}
          onBlur={onSubmitEditing}
        />
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

export default SearchBox;
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
    height: 50,
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
});
