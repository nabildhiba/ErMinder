import React from 'react';
import {TouchableOpacity, StyleSheet, View, TextInput} from 'react-native';
import colors from '../constant/colors.json';
import {Text} from '../components/Text';

export default function SearchBar({style = {}}) {
  return (
    <View style={{position: 'absolute', top: 50}}>
      <Text style={{fontSize: 50}}>465465465</Text>
      {/* <TextInput style={{width: 50, height: 20, backgroundColor: 'red'}} /> */}
      {/* <Text style={{color: 'red', zIndex: 50}}>
        lorems fhskjdfh ksdhfksdj hfkjsdhfkj shdfkjh sdkfhsdkjfhskd fkjsdhf
        kjsdhf kj
      </Text> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 18,
    borderRadius: 15,
    flexDirection: 'row',
  },
  text: {
    fontSize: 16,
    color: '#fff',
  },
});
