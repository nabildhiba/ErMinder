import React, { useState, useEffect, useRef } from 'react';
import { TouchableOpacity, StyleSheet, View, Dimensions } from 'react-native';
import IIcon from 'react-native-vector-icons/Ionicons';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import firestore from '@react-native-firebase/firestore';
const { width } = Dimensions.get('screen');

export default function SearchBar({ onPress }) {
  const [text, onChangeText] = useState('');
  const [mapsValue, setMapsValue] = useState(null); // Initialize mapsValue as null
  const autoCompleteRef = useRef();

  useEffect(() => {
    // Fetch the value from Firestore and update mapsValue
    const fetchMapsValue = async () => {
      try {
        const documentSnapshot = await firestore()
          .collection('Metadatas')
          .doc('MetaDataMaps')
          .get();
          const keyApi = documentSnapshot.data().MAPS_KEY;
        if (keyApi != null) {
          setMapsValue(keyApi); // Update mapsValue with the retrieved value
        } else {
          console.log('Document does not exist');
        }
      } catch (error) {
        console.error('Error getting document:', error);
      }
    };

    fetchMapsValue(); // Call the function to fetch and update mapsValue
  }, []); // Run this effect only once on component mount

  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        ref={autoCompleteRef}
        placeholder="Search"
        onPress={onPress}
        query={{
          key: mapsValue, // Use mapsValue or a default key
          language: 'en',
        }}
        styles={{
          textInput: {
            borderRadius: 20,
            paddingLeft: 15,
            paddingRight: 36,
          },
        }}
        textInputProps={{ onChangeText }}
        enablePoweredByContainer={false}
        fetchDetails
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
