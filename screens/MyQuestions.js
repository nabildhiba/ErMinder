import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {ActivityIndicator, FlatList, View, Dimensions} from 'react-native';
import {axiosApi, axiosApiPost} from '../api/axiosApi';
import QuestionsCard from '../components/QuestionsCard';
import SearchBox from '../components/SearchBox';
import {Text} from '../components/Text';
import colors from '../constant/colors.json';
import EncryptedStorage from 'react-native-encrypted-storage';
import fontSize from '../constant/fontSize.json';
import RBSheet from 'react-native-raw-bottom-sheet';
import FilterBottom from '../components/FilterBottom';
import {showMessage} from 'react-native-flash-message';

const {height, width} = Dimensions.get('screen');

function MyQuestions({route, navigation}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isFooterLoading, setIsFooterLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [quesData, setQuesData] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const [currentItem, setCurrentItem] = useState('');
  const [userID, setUserID] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [selectedFilterValue, setSelectedFilterValue] = useState(null);
  const reachedEnd = useRef(false);

  const refRBSheet = useRef();
  const [questionCompHeight, setQuestionCompHeight] = useState(0);

  const getCategories = async () => {
    let res = await axiosApiPost({action: 'categories'});
    // console.log(JSON.stringify(res));
    if (res?.data?.ResponseMsg === 200) {
      setCategoriesData([
        {key: 'null', value: null, label: 'Select Catergory'},
        ...res?.data?.ResponseData?.map(item => ({
          key: item.id,
          value: item.id,
          label: item.category_name,
        })),
      ]);
    } else {
      console.log('else');
    }
  };
  const getQues = async (reset = false) => {
    console.log('callin with', pageNo);
    // let userId = 0;
    // let userData = await EncryptedStorage.getItem('userData').catch(err => {
    //   console.log(err);
    // });
    // if (userData !== undefined && userData !== null) {
    //   userId = JSON.parse(userData)?.id;
    // }
    // console.log(route?.params?.userData?.id)
    if (!route?.params?.userData?.id) {
      showMessage({
        message: 'Something went wrong, Please try again',
        type: 'danger',
      });
      return;
    }
    if (pageNo === 1) {
      setIsLoading(true);
    } else {
      setIsFooterLoading(true);
    }
    // console.log('userId', userId);
    let res = await axiosApi({
      query: {
        userid: route?.params?.userData?.id,
        pageno: reset === true ? 1 : pageNo,
        limit: 10,
        category_id: selectedFilterValue !== null ? selectedFilterValue : 0,
      },
      action: 'getQuest',
    }).catch(err => {
      reachedEnd.current = true;

      console.log(err);
      setIsLoading(false);
      setIsFooterLoading(false);
    });
    console.log('callin with 2---------------');

    // console.log(JSON.stringify(res));
    if (res?.data?.ResponseMsg === 200) {
      reachedEnd.current = true;
      if (res?.data?.ResponseData?.length !== 0) {
        if (reset) {
          setQuesData(res?.data?.ResponseData);
        } else {
          setQuesData(prev => [...prev, ...res?.data?.ResponseData]);
        }

        setPageNo(prev => (reset === true ? 2 : prev + 1));
      }
      setIsLoading(false);
      setIsFooterLoading(false);
    } else {
      reachedEnd.current = true;
      setIsLoading(false);
      setIsFooterLoading(false);
    }
    // console.log(JSON.stringify(res));
  };

  const onPressFilter = () => {
    refRBSheet.current.close();
    setIsLoading(true);
    if (selectedFilterValue === null) {
      getQues();
    } else {
      getQues(true);
    }
  };

  useEffect(() => {
    console.log('-------route--------', route.params);
    getQues();
    //   getCategories();
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
    <>
      <View style={{flex: 1, backgroundColor: colors.backgroundColor}}>
        <FlatList
          // onScroll={() => {
          //   reachedEnd.current = true;
          // }}
          onEndReached={() => {
            console.log(quesData.length * 40, height);
            if (questionCompHeight >= height && reachedEnd.current === true) {
              reachedEnd.current = false;
              getQues();
            }
          }}
          //   ListHeaderComponent={
          //     <SearchBox
          //       placeholder={'Search Question'}
          //       onPressFilter={() => refRBSheet.current.open()}
          //     />
          //   }
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
              <QuestionsCard
                onLayout={event => {
                  var {height} = event.nativeEvent.layout;
                  setQuestionCompHeight(prev => prev + height);
                }}
                {...item}
                onPress={() => navigation.navigate('MyQuestionDetails', item)}
              />
            </View>
          )}
          style={{width: '100%'}}
          keyExtractor={(item, i) => i}
        />
      </View>
      {quesData?.length === 0 && (
        <View
          style={{
            height: '100%',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
          }}>
          <Text style={{fontSize: fontSize.normal}}>No Data available!</Text>
        </View>
      )}
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        customStyles={{
          wrapper: {
            backgroundColor: '#00000040',
          },
          draggableIcon: {
            backgroundColor: '#000',
          },
          container: {
            borderRadius: 15,
          },
        }}>
        <FilterBottom
          pickerData={categoriesData}
          selectedFilterValue={selectedFilterValue}
          setSelectedFilterValue={setSelectedFilterValue}
          onPressFilter={onPressFilter}
        />
      </RBSheet>
    </>
  );
}

export default MyQuestions;
