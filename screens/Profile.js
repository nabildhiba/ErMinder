import React, {useLayoutEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {ScrollView, StyleSheet, View} from 'react-native';
import CTextInput, {CPicker} from '../components/CTextInput';
import IIcon from 'react-native-vector-icons/Ionicons';
import colors from '../constant/colors.json';
import {Picker} from '@react-native-picker/picker';
import Button from '../components/Button';
import {Text} from '../components/Text';
import {useEffect} from 'react';
import CMultiSelect from '../components/CMultiSelect';
import states from '../Utils/state.json';
import {showMessage} from 'react-native-flash-message';

const titles = [
  {key: 'null', value: null, label: 'Select Title'},
  {value: 'CA', label: 'CA', key: 'CA'},
  {value: 'CS', label: 'CS', key: 'CS'},
  {value: 'CMS', label: 'CMS', key: 'CMS'},
  {value: 'Advocate', label: 'Advocate', key: 'Advocate'},
];

function Profile({route, navigation}) {
  const emailRegx =
    /^(([^<>()[\]\\.,;:\s@\"]+  (\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm();

  const [userData, setUserData] = useState({});
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedExpert, setSelectedExpert] = useState([]);
  const [selectedExperience, setSelectedExperience] = useState([]);
  const [expertErr, setExpertErr] = useState(false);
  const [experienceErr, setExperienceErr] = useState(false);
  const [experience, setExperience] = useState([]);

  // const onSubmit = async data => {
  //   if (
  //     route?.params?.upgradeToExpert === true ||
  //     userData.usertype === 'expert'
  //   ) {
  //     if (selectedExpert?.length === 0) {
  //       setExpertErr(true);
  //       return;
  //     }

  //     if (selectedExperience?.length === 0) {
  //       setExperienceErr(true);
  //       return;
  //     }
  //   }
  //   setIsLoading(true);
  //   console.log(data);
  //   let res = await axiosApi({
  //     query:
  //       route?.params?.upgradeToExpert === true ||
  //       userData.usertype === 'expert'
  //         ? {
  //             ...data,
  //             userid: userData.id,
  //             updatetoexpert: 1,
  //             expertin: selectedExpert.join(),
  //             qualification: selectedExperience.join(),
  //           }
  //         : {...data, userid: userData.id},
  //     action: 'editmyPorfile',
  //   }).catch(err => {
  //     showMessage({
  //       message: err
  //         ? err?.message
  //           ? err?.message?.toString()
  //           : 'Something went wrong'
  //         : 'Something went wrong',
  //       type: 'danger',
  //     });
  //     console.log(err);
  //     setIsLoading(false);
  //   });
  //   if (res?.data?.ResponseMsg === 200) {
  //     setIsLoading(false);
  //     if (route?.params?.upgradeToExpert === true) {
  //       showMessage({
  //         message: 'Request Submitted Successfully!',
  //         type: 'success',
  //       });
  //     } else {
  //       showMessage({
  //         message: 'Profile Updated Successfully!',
  //         type: 'success',
  //       });
  //     }
  //     navigation.goBack();
  //   } else {
  //     showMessage({
  //       message: 'Something went wrong, Please try again',
  //       type: 'danger',
  //     });
  //     setIsLoading(false);
  //   }
  //   // console.log(JSON.stringify(res));
  // };

  // const getCategories = async () => {
  //   let res = await axiosApiPost({action: 'categories'}).catch(err => {
  //     console.log(err);
  //   });
  //   if (res?.data?.ResponseMsg === 200) {
  //     if (route?.params?.userData?.expert_in_id) {
  //       let temp = route?.params?.userData?.expert_in_id?.split(',');
  //       if (temp.length !== 0) {
  //         console.log('inIF');

  //         setCategories(
  //           res?.data?.ResponseData?.map(item => {
  //             if (temp.find(fitem => fitem == item.id) === undefined) {
  //               return {id: item.id, name: item.category_name};
  //             } else {
  //               setSelectedExpert(prev => [...prev, item.id]);
  //               return {id: item.id, name: item.category_name, checked: true};
  //             }
  //           }),
  //         );
  //       } else {
  //         console.log('inElse');
  //         setCategories(() =>
  //           res?.data?.ResponseData?.map(item => ({
  //             id: item.id,
  //             name: item.category_name,
  //           })),
  //         );
  //       }
  //     } else {
  //       console.log('inElse');
  //       setCategories(() =>
  //         res?.data?.ResponseData?.map(item => ({
  //           id: item.id,
  //           name: item.category_name,
  //         })),
  //       );
  //     }
  //   }
  //   console.log('Categories------Res----', JSON.stringify(res));
  // };

  // useEffect(() => {
  //   getCategories();
  // }, []);

  useLayoutEffect(() => {
    let experienceTemp = [
      {id: 'multiselect-all', name: 'All'},
      {id: ' NQ-Practitioner', name: 'Non-Qualified Practitioner'},
      {id: ' 1 Year Plus', name: 'More than 1 years'},
      {id: '4 Years Plus', name: 'More than 4 years'},
      {id: '10 Years Plus', name: 'More than 10 years'},
    ];
    setUserData(route?.params?.userData);
    if (route?.params?.userData?.qualification) {
      let temp = route?.params?.userData?.qualification?.split(',');
      if (temp.length !== 0) {
        setExperience(
          experienceTemp.map(item => {
            if (temp.find(fitem => fitem == item.id) === undefined) {
              return {...item};
            } else {
              setSelectedExperience(prev => [...prev, item.id]);
              return {...item, checked: true};
            }
          }),
        );
      }
    } else {
      setExperience(experienceTemp);
    }

    setLoadingComplete(true);
    console.log('route.params-----', route.params);
  }, []);

  return (
    <ScrollView style={{flex: 1, width: '100%'}}>
      <View
        style={{
          minHeight: '100%',
          width: '100%',
          backgroundColor: '#fff',
          alignItems: 'center',
        }}>
        {loadingComplete && (
          <CTextInput
            autoFocus={true}
            control={control}
            rules={{
              required: true,
            }}
            placeholder={'Full Name'}
            // icon={<IIcon name="person-outline" size={20} color={colors.primary} />}
            name="fullname"
            defaultValue={userData.fullname}
          />
        )}
        {errors.fullname && <Text style={styles.error}>This is required.</Text>}

        {loadingComplete && (
          <CTextInput
            autoFocus={true}
            control={control}
            rules={{
              required: true,
            }}
            placeholder={'Email'}
            // icon={<IIcon name="person-outline" size={20} color={colors.primary} />}
            name="user_name"
            defaultValue={userData.user_name}
            editable={false}
          />
        )}
        {errors.user_name && (
          <Text style={styles.error}>This is required.</Text>
        )}
        {loadingComplete &&
          (userData.usertype === 'expert' ||
            route?.params?.upgradeToExpert === true) && (
            <CPicker
              autoFocus={true}
              control={control}
              rules={{
                required: true,
              }}
              // placeholder={'Mobile Number'}
              // icon={<IIcon name="person-outline" size={20} color={colors.primary} />}
              name="title"
              defaultValue={userData.title}
              pickerData={titles}
            />
          )}
        {errors.title && <Text style={styles.error}>This is required.</Text>}

        {loadingComplete && (
          <CTextInput
            autoFocus={true}
            control={control}
            rules={{
              required: true,
            }}
            placeholder={'Mobile Number'}
            // icon={<IIcon name="person-outline" size={20} color={colors.primary} />}
            name="mobileno"
            defaultValue={userData.mobileno}
            keyboardType={'number-pad'}
          />
        )}
        {errors.mobileno && <Text style={styles.error}>This is required.</Text>}

        {loadingComplete &&
          (userData.usertype === 'expert' ||
            route?.params?.upgradeToExpert === true) && (
            <CTextInput
              autoFocus={true}
              control={control}
              rules={{
                required: false,
              }}
              placeholder={'Facebook'}
              // icon={<IIcon name="person-outline" size={20} color={colors.primary} />}
              name="facebook"
              defaultValue={userData.facebook}
            />
          )}
        {errors.facebook && <Text style={styles.error}>This is required.</Text>}

        {loadingComplete &&
          (userData.usertype === 'expert' ||
            route?.params?.upgradeToExpert === true) && (
            <CTextInput
              autoFocus={true}
              control={control}
              rules={{
                required: false,
              }}
              placeholder={'Twitter'}
              // icon={<IIcon name="person-outline" size={20} color={colors.primary} />}
              name="twitter"
              defaultValue={userData.twitter}
            />
          )}
        {errors.twitter && <Text style={styles.error}>This is required.</Text>}

        {loadingComplete &&
          (userData.usertype === 'expert' ||
            route?.params?.upgradeToExpert === true) && (
            <CTextInput
              autoFocus={true}
              control={control}
              rules={{
                required: false,
              }}
              placeholder={'Linkedin'}
              // icon={<IIcon name="person-outline" size={20} color={colors.primary} />}
              name="linkedIn"
              defaultValue={userData.linkedIn}
            />
          )}
        {errors.linkedIn && <Text style={styles.error}>This is required.</Text>}
        {loadingComplete && (
          <CPicker
            autoFocus={true}
            control={control}
            rules={{
              required: true,
            }}
            // placeholder={'Mobile Number'}
            // icon={<IIcon name="person-outline" size={20} color={colors.primary} />}
            name="state"
            defaultValue={userData.state}
            pickerData={states}
          />
        )}
        {errors.state && <Text style={styles.error}>This is required.</Text>}
        {loadingComplete && (
          <CTextInput
            autoFocus={true}
            control={control}
            rules={{
              required: true,
            }}
            placeholder={'City'}
            // icon={<IIcon name="person-outline" size={20} color={colors.primary} />}
            name="city"
            defaultValue={userData.city}
          />
        )}
        {errors.city && <Text style={styles.error}>This is required.</Text>}
        {loadingComplete &&
          (userData.usertype === 'expert' ||
            route?.params?.upgradeToExpert === true) && (
            <CMultiSelect
              data={categories}
              title="Experties in (Select Category)"
              popupTitle="Select item"
              onSelect={data => {
                if (expertErr) setExpertErr(false);
                setSelectedExpert(data);
              }}
              onRemoveItem={data => {
                setSelectedExpert(data);
              }}
              searchPlaceHolderText={'Search'}
            />
          )}
        {expertErr && <Text style={styles.error}>This is required.</Text>}

        {loadingComplete &&
          (userData.usertype === 'expert' ||
            route?.params?.upgradeToExpert === true) && (
            <CMultiSelect
              title={'Experience'}
              data={experience}
              popupTitle="Select item"
              onSelect={data => {
                if (experienceErr) setExperienceErr(false);
                setSelectedExperience(data);
              }}
              onRemoveItem={data => {
                setSelectedExperience(data);
              }}
              searchPlaceHolderText={'Search'}
            />
          )}
        {experienceErr && <Text style={styles.error}>This is required.</Text>}

        {loadingComplete && (
          <CTextInput
            autoFocus={true}
            control={control}
            rules={{
              required: true,
            }}
            placeholder={
              'About yourself'
              // route?.params?.upgradeToExpert === true
              //   ? 'About yourself'
              //   : 'About myself'
            }
            // icon={<IIcon name="person-outline" size={20} color={colors.primary} />}
            name="about_myself"
            defaultValue={userData.about_myself}
            multiline={true}
            numberOfLines={5}
          />
        )}
        {errors.about_myself && (
          <Text style={styles.error}>This is required.</Text>
        )}
        <View style={styles.bottomContainer}>
          <Button
            text={
              route?.params?.upgradeToExpert === true
                ? 'Upgrade to Expert'
                : 'Update Profile'
            }
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

export default Profile;
