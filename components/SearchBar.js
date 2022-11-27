import React, {useRef} from 'react';
import {TouchableOpacity, StyleSheet, View, Dimensions} from 'react-native';
import IIcon from 'react-native-vector-icons/Ionicons';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

const GLOBAL = require('../Utils/Global');
const {width} = Dimensions.get('screen');

export default function SearchBar({onPress}) {
  const [text, onChangeText] = React.useState('');
  const autoCompleteRef = useRef();

  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        ref={autoCompleteRef}
        placeholder="Search"
        onPress={onPress}
        query={{
          key: GLOBAL.MAPS_API_KEY,
          language: 'en',
        }}
        styles={{
          textInput: {
            borderRadius: 20,
            paddingLeft: 15,
            paddingRight: 36,
          },
        }}
        textInputProps={{onChangeText}}
        enablePoweredByContainer={false}
        fetchDetails
        // GoogleReverseGeocodingQuery
      />
      {text === '' ? (
        <TouchableOpacity
          onPress={() => {
            autoCompleteRef?.current?.setAddressText('');
            onChangeText('');
          }}
          style={styles.iconContainer}>
          <IIcon name="ios-search" size={20} color="#808080" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => {
            autoCompleteRef?.current?.setAddressText('');
            onChangeText('');
          }}
          style={styles.iconContainer}>
          <IIcon name="close" size={20} color="#808080" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    width: width * 0.85,
  },
  input: {
    height: 40,
    width: width * 0.8,
    margin: 12,
    // borderWidth: 1,
    borderRadius: 15,
    padding: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  iconContainer: {
    position: 'absolute',
    right: 15,
    top: 12,
  },
});
