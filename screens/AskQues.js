import React, {useState} from 'react';
import {StyleSheet, View, Dimensions, ScrollView} from 'react-native';
import {Text} from '../components/Text';
import {useForm} from 'react-hook-form';
import {useEffect} from 'react';
import {axiosApi, axiosApiPost} from '../api/axiosApi';
import Button from '../components/Button';
import CTextInput, {CPicker} from '../components/CTextInput';
import fontSize from '../constant/fontSize.json';
import colors from '../constant/colors.json';
import EncryptedStorage from 'react-native-encrypted-storage';
import {showMessage} from 'react-native-flash-message';
import LoginPromptModal from '../components/LoginPromptModal';
import {CommonActions} from '@react-navigation/routers';
import Modal from 'react-native-modal';

const {width} = Dimensions.get('screen');

function AlarmTab({navigation}) {
  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm();

  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const onSubmit = async data => {
    let userData = await EncryptedStorage.getItem('userData').catch(err => {
      console.log(err);
      setIsLoading(false);
    });
    console.log('userData',userData)
    // console.log('sdscdcfdcds', userData);
    if (userData == undefined || userData == null) {
      return setIsModalVisible(true);
    }
    setIsLoading(true);
    let res = await axiosApi({
      query: {
        ...data,
        queristid: 118, // change after
      },
      action: 'AlarmTabt',
    })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      })
      .finally(() => {
        reset();
      });
    if (res?.data?.ResponseMsg === 200) {
      setIsLoading(false);
      showMessage({
        message: 'Question posted successfully',
        type: 'success',
      });
      navigation.goBack();
    }
    console.log(JSON.stringify(res));
  };

  const getCategories = async () => {
    let res = await axiosApiPost({action: 'categories'}).catch(err => {
      console.log(err);
    });
    if (res?.data?.ResponseMsg === 200) {
      setCategories(() => [
        {
          key: 'null',
          label: 'Select Category',
          value: null,
        },
        ...res?.data?.ResponseData?.map(item => {
          return {
            key: item.id,
            label: item.category_name,
            value: item.id,
          };
        }),
      ]);
    }
    // console.log(JSON.stringify(res));
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <ScrollView style={{backgroundColor: '#fff'}}>
      <View style={{flex: 1, alignItems: 'center'}}>
        <Modal
          isVisible={isModalVisible}
          deviceWidth={width}
          onBackButtonPress={() => setIsModalVisible(false)}>
          <LoginPromptModal
            text={'Please login to post Question'}
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
        <Text
          style={{fontSize: fontSize.xlarge, lineHeight: 40, marginTop: 10}}>
          Post Your Question
        </Text>
        <Text
          style={{fontSize: fontSize.normal, opacity: 0.7, marginBottom: 20}}>
          Ask a question and you will be sure to find an answer!
        </Text>
        <CTextInput
          autoFocus={true}
          control={control}
          rules={{
            required: true,
          }}
          placeholder={'Question Title'}
          // icon={<IIcon name="person-outline" size={20} color={colors.primary} />}
          name="ques_title"
          // defaultValue={userData.question_title}
          // editable={false}
        />
        {errors.ques_title && (
          <Text style={styles.error}>This is required.</Text>
        )}
        <CPicker
          autoFocus={true}
          control={control}
          rules={{
            required: true,
          }}
          // placeholder={'Mobile Number'}
          // icon={<IIcon name="person-outline" size={20} color={colors.primary} />}
          name="categorieid"
          // defaultValue={userData.categories}
          pickerData={
            categories.length === 0
              ? [
                  {
                    key: 'null',
                    label: 'Select Category',
                    value: null,
                  },
                ]
              : categories
          }
        />
        {errors.categorieid && (
          <Text style={styles.error}>This is required.</Text>
        )}

        <CTextInput
          autoFocus={true}
          control={control}
          rules={{
            required: true,
          }}
          placeholder={'Question Details'}
          // icon={<IIcon name="person-outline" size={20} color={colors.primary} />}
          name="usrquestion"
          // defaultValue={userData.question_detail}
          multiline={true}
          numberOfLines={20}
        />
        {errors.usrquestion && (
          <Text style={styles.error}>This is required.</Text>
        )}
        <View style={styles.bottomContainer}>
          <Button
            text={'Publish your question'}
            isLoading={isLoading}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bottomContainer: {
    // position: 'absolute',
    // bottom: 20,
    marginVertical: 40,
    width: '90%',
  },
  error: {
    color: 'red',
    alignSelf: 'flex-start',
    marginLeft: 25,
    marginTop: 2,
  },
});

export default AlarmTab;
