import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  Dimensions,
} from 'react-native';
import colors from '../constant/colors.json';
import fontSize from '../constant/fontSize.json';
import IIcon from 'react-native-vector-icons/Ionicons';

import {useRoute} from '@react-navigation/native';
import QuestionsCard from '../components/QuestionsCard';
import {Text} from '../components/Text';
import {axiosApi} from '../api/axiosApi';
import CTextInput from '../components/CTextInput';

import {useForm} from 'react-hook-form';
import Button from '../components/Button';
import EncryptedStorage from 'react-native-encrypted-storage';
import {showMessage} from 'react-native-flash-message';
import Modal from 'react-native-modal';
import LoginPromptModal from '../components/LoginPromptModal';
import {CommonActions} from '@react-navigation/routers';

const {width} = Dimensions.get('screen');

function AnswerCard({
  expertprofilePic,
  expertName,
  answer,
  comments,
  id,
  containerStyle = {},
  setData,
  userData = {},
  setIsModalVisible = () => null,
  setModalMsg = () => null,
  ...rest
}) {
  const [comment, setComment] = useState('');
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async () => {
    if (userData.id === undefined) {
      setModalMsg('Please login to add comment');
      setIsModalVisible(true);
      return;
    }
    if (comment === '') {
      setError(true);
      return;
    }
    setIsLoading(true);
    setComment('');
    let res = await axiosApi({
      query: {answer_id: id, user_id: userData.id, comment_text: comment},
      action: 'postcommentforanswer',
    }).catch(err => {
      console.log(err);
      setIsLoading(false);
    });
    console.log(JSON.stringify(res));
    if (res?.data?.ResponseMsg === 200) {
      setData(prev =>
        prev.map(item =>
          item.id === id
            ? {
                ...item,
                comments: [
                  ...item?.comments,
                  {
                    id: Math.random(),
                    comments: comment,
                    comment_by: userData.fullname, // Change this after
                    user_id: userData.id, // Change this after
                  },
                ],
              }
            : item,
        ),
      );
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  return (
    <View
      {...rest}
      style={{
        ...containerStyle,
        marginTop: 10,
        paddingTop: 15,
        paddingHorizontal: 8,
        paddingBottom: 10,
        // borderWidth: 1,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 4,
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {expertprofilePic ? (
            <Image
              source={{uri: expertprofilePic}}
              style={{height: 40, width: 40, borderRadius: 20, marginRight: 8}}
            />
          ) : (
            <View
              style={{
                backgroundColor: colors.primary,
                height: 40,
                width: 40,
                borderRadius: 20,
                marginRight: 8,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <IIcon name={'ios-person'} size={20} color={'#000'} />
            </View>
          )}
          <View>
            <Text style={{fontSize: fontSize.medium, fontWeight: '500'}}>
              {expertName}
            </Text>
            <Text style={{fontSize: fontSize.normal, opacity: 0.6}}>
              {answer}
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          height: 1,
          marginVertical: 10,
          marginLeft: 50,
          marginRight: 10,
          backgroundColor: colors.gray,
          opacity: 0.5,
        }}
      />
      <View style={{marginLeft: 30}}>
        {comments?.map(item => {
          return (
            <View style={{flexDirection: 'row', marginTop: 5}}>
              <View
                style={{
                  backgroundColor: colors.primary,
                  height: 30,
                  width: 30,
                  borderRadius: 20,
                  marginRight: 8,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <IIcon name={'ios-person'} size={15} color={'#000'} />
              </View>
              <View>
                <Text style={{fontSize: fontSize.normal, fontWeight: '500'}}>
                  {item.comment_by}
                </Text>
                <Text style={{fontSize: fontSize.normal, opacity: 0.7}}>
                  {item.comments}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
      <View
        style={{
          //   marginTop: 5,
          paddingHorizontal: 10,
          paddingBottom: 10,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View style={{flex: 1}}>
          <TextInput
            style={{
              width: '96%',
              marginTop: 10,
              minHeight: 30,
              borderRadius: 10,
              backgroundColor: '#80808026',
              paddingLeft: 15,
              color: colors.text,
            }}
            value={comment}
            placeholder={'Your Comments'}
            placeholderTextColor={colors.textSecondary}
            onChangeText={text => {
              if (error) setError(false);
              setComment(text);
            }}
            onFocus={() => {
              if (error) setError(false);
            }}
          />
        </View>
        <Button
          style={{
            height: 48,
            width: 50,
            paddingHorizontal: 0,
            paddingVertical: 0,
            top: 6,
            borderRadius: 12,
          }}
          isLoading={isLoading}
          icon={<IIcon name={'send'} size={25} color={'#fff'} />}
          onPress={onSubmit}
        />
      </View>

      {error && (
        <Text
          style={{
            color: 'red',
            fontSize: fontSize.small,
            top: -5,
            marginLeft: 12,
          }}>
          Please add comment
        </Text>
      )}
    </View>
  );
}
export default function QuestionDetails({navigation}) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMsg, setModalMsg] = useState('');

  const profilePic = 'https://picsum.photos/200/300';
  const route = useRoute();
  //   console.log(route.params);
  const [data, setData] = useState([]);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [answerDataLoading, setAnswerDataLoading] = useState(true);
  const [userData, setUserData] = useState({});

  const getData = async () => {
    let res = await axiosApi({
      query: {
        question_id: route.params?.id,
      },
      action: 'getAnswerForQuestions',
    }).catch(err => {
      console.log(err);
      setAnswerDataLoading(false);
    });
    console.log(JSON.stringify(res));
    if (res?.data?.ResponseMsg === 200) {
      setData(res?.data?.ResponseData);
      setAnswerDataLoading(false);
    } else {
      setAnswerDataLoading(false);
    }
  };
  useEffect(() => {
    (async () => {
      let userData = await EncryptedStorage.getItem('userData').catch(err => {
        console.log(err);
      });
      if (userData !== undefined && userData !== null) {
        setUserData(JSON.parse(userData));
      }
    })();
  }, []);

  useLayoutEffect(() => {
    getData();
  }, []);

  const onSubmit = async () => {
    if (userData.id === undefined) {
      setModalMsg('Please login to post your answer');
      setIsModalVisible(true);
      return;
      // showMessage({
      //   message: 'Please login to post your answer',
      //   type: 'danger',
      // });
    }
    if (answer === '') {
      setError(true);
      return;
    }
    console.log(userData?.usertype)
    if (userData?.usertype != 'expert') {
      showMessage({
        message: 'You are not expert please upgrade your profile to Expert',
        type: 'danger',
      });
      return
    }
    setIsLoading(true);
    let res = await axiosApi({
      query: {
        question_id: route.params?.id,
        expert_user_id: userData?.id,
        answer: answer,
      },
      action: 'qua_answer',
    }).catch(err => {
      console.log(err);
      setIsLoading(false);
    });
    if (res?.data?.ResponseMsg === 200) {
      setData(prev => [
        ...prev,
        {
          id: Math.random(),
          question_id: route.params?.id,
          expert_user_id: userData?.id,
          answer: answer,
          expertName: userData?.fullname,
          expertprofilePic: userData?.profile_pic,
          comments: [],
        },
      ]);
      setAnswer('');
      setIsLoading(false);
    } else {
      console.log('Erroror');
      setIsLoading(false);
    }
    // console.log(JSON.stringify(res));
  };

  return (
    <ScrollView
      style={{
        backgroundColor: colors.backgroundColor,
      }}>
      <Modal
        isVisible={isModalVisible}
        deviceWidth={width}
        onBackButtonPress={() => setIsModalVisible(false)}>
        <LoginPromptModal
          text={modalMsg}
          leftButtonText={'Log In'}
          rightButtonText={'Cancel'}
          onYesPress={() => {
            navigation.dispatch(
              CommonActions.reset({
                index: 1,
                routes: [{name: 'LoginNavigation'}],
              }),
            );
          }}
          onNoPress={() => setIsModalVisible(false)}
        />
      </Modal>
      <View style={styles.container}>
        <QuestionsCard {...route.params} activeOpacity={1} disableAns={true} />

        <View style={{marginVertical: 10}}>
          <Text style={{fontSize: fontSize.large, lineHeight: 35}}>
            Answers
          </Text>
        </View>
        {answerDataLoading ? (
          <View
            style={{
              height: 80,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <ActivityIndicator size={30} color={colors.primary} />
          </View>
        ) : (
          <>
            {data.map(item => {
              return (
                <AnswerCard
                  {...item}
                  setIsModalVisible={setIsModalVisible}
                  setModalMsg={setModalMsg}
                  setData={setData}
                />
              );
            })}
          </>
        )}
      </View>
      <View
        style={{
          backgroundColor: colors.backgroundColor,
          marginHorizontal: 10,
          marginTop: 10,
          borderRadius: 10,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.23,
          shadowRadius: 2.62,

          elevation: 4,
          justifyContent: 'center',
          padding: 5,
          paddingHorizontal: 10,
        }}>
        <Text
          style={{
            fontSize: fontSize.medium,
            lineHeight: 40,
            fontWeight: '500',
            marginLeft: 10,
          }}>
          Post Your Answer
        </Text>
        <TextInput
          style={{
            // width: '90%',
            minHeight: 30,
            borderRadius: 10,
            backgroundColor: '#80808026',
            paddingLeft: 15,
            color: colors.text,
          }}
          value={answer}
          placeholder={'I have the answer!'}
          placeholderTextColor={colors.textSecondary}
          onChangeText={text => {
            if (error) setError(false);
            setAnswer(text);
          }}
          onFocus={() => {
            if (error) setError(false);
          }}
          multiline
          numberOfLines={10}
        />

        {error && (
          <Text
            style={{
              color: 'red',
              fontSize: fontSize.small,
            }}>
            Please add answer
          </Text>
        )}

        <Button
          style={{
            marginTop: 20,
            marginBottom: 10,
            borderRadius: 10,
          }}
          isLoading={isLoading}
          text={'Post Your Answer'}
          onPress={onSubmit}
        />
      </View>
      <View style={{height: 40}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
});
