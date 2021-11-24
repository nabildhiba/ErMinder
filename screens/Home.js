import React, {useEffect, useRef, useState} from 'react';
import {ActivityIndicator, View, Dimensions} from 'react-native';
import {axiosApi, axiosApiPost} from '../api/axiosApi';
import QuestionsCard from '../components/QuestionsCard';
import SearchBox from '../components/SearchBox';
import {Text} from '../components/Text';
import colors from '../constant/colors.json';
import EncryptedStorage from 'react-native-encrypted-storage';
import fontSize from '../constant/fontSize.json';
import {showMessage} from 'react-native-flash-message';
import SearchedBox from '../components/SearchedBox';
import Loading from '../components/Loading';
import MapView from 'react-native-maps';

const {height, width} = Dimensions.get('screen');

function Home({route, navigation}) {
  const [isLoading, setIsLoading] = useState(false);

  return isLoading ? (
    <Loading />
  ) : (
    <MapView
      style={{flex: 1}}
      initialRegion={{
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
    />
  );
}

export default Home;
