import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {ActivityIndicator, FlatList, View, Dimensions} from 'react-native';
import {axiosApi} from '../api/axiosApi';
import QuestionsCard from '../components/QuestionsCard';
import SearchBox from '../components/SearchBox';
import {Text} from '../components/Text';
import colors from '../constant/colors.json';
import EncryptedStorage from 'react-native-encrypted-storage';
import ExpertCard from '../components/ExpertCard';

const {height, width} = Dimensions.get('screen');

function Experts({navigation}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isFooterLoading, setIsFooterLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [quesData, setQuesData] = useState([]);
  const [currentItem, setCurrentItem] = useState('');
  const [userID, setUserID] = useState('');
  const reachedEnd = useRef(false);
  const [pageNo, setPageNo] = useState(1);

  const getQues = async () => {
    console.log('callin with', pageNo);
    let userId = 0;
    let userData = await EncryptedStorage.getItem('userData').catch(err => {
      console.log(err);
    });
    if (userData !== undefined && userData !== null) {
      userId = JSON.parse(userData)?.id;
    }
    if (pageNo === 1) {
      setIsLoading(true);
    } else {
      setIsFooterLoading(true);
    }
    // console.log('userId', userId);
    let res = await axiosApi({
      query: {
        usertype: 'expert',
        pageno: pageNo,
        limit: 10,
      },
      action: 'userDataget',
    }).catch(err => {
      console.log(err);
      setIsLoading(false);
      setIsFooterLoading(false);
    });
    if (res?.data?.ResponseMsg === 200) {
      if (res?.data?.ResponseData?.length !== 0) {
        setQuesData(prev => [...prev, ...res?.data?.ResponseData]);
        setPageNo(prev => prev + 1);
      }
      setIsLoading(false);
      setIsFooterLoading(false);
    } else {
      setIsLoading(false);
      setIsFooterLoading(false);
    }
    // console.log(JSON.stringify(res));
  };

  useEffect(() => {
    getQues();
  }, []);

  return isLoading ? (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.backgroundColor,
      }}>
      <ActivityIndicator size={30} color={colors.primary} />
    </View>
  ) : (
    <View style={{flex: 1}}>
      <FlatList
        onScroll={() => {
          reachedEnd.current = true;
        }}
        onEndReached={() => {
          if (quesData.length * 40 <= height && reachedEnd.current === true) {
            reachedEnd.current = false;
            getQues();
          }
        }}
        ListHeaderComponent={
          <SearchBox
            placeholder={'Search Expert'}
            backIcon={true}
            onPressBack={() => navigation.goBack()}
            filterIcon={false}
          />
        }
        ListFooterComponent={
          <View
            style={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              height: isFooterLoading ? 100 : 40,
            }}>
            {isFooterLoading && (
              <ActivityIndicator size={30} color={colors.primary} />
            )}
          </View>
        }
        data={quesData}
        renderItem={({item}) => (
          <View style={{paddingHorizontal: 10}}>
            <ExpertCard
              {...item}
              onPress={() => navigation.navigate('ExpertDetails', item)}
            />
          </View>
        )}
        style={{width: '100%'}}
        keyExtractor={(item, i) => i}
      />
    </View>
  );
}

export default Experts;
