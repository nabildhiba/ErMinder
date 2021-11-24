import React from 'react';
import {Image, View, TouchableOpacity} from 'react-native';
import colors from '../constant/colors.json';
import fontSize from '../constant/fontSize.json';
import {Text} from './Text';
import IIcon from 'react-native-vector-icons/Ionicons';

function QuestionsCard({
  no_of_answers,
  time_ago,
  profilePic,
  questerName,
  categoryName,
  categorie_id,
  querist_id,
  cc_question,
  cc_title,
  onPress,
  disableAns = false,
  containerStyle = {},
  ...rest
}) {
  return (
    <TouchableOpacity
      {...rest}
      onPress={onPress}
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
          {profilePic ? (
            <Image
              source={{uri: profilePic}}
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
              {questerName}
            </Text>
            <Text style={{fontSize: fontSize.small}}>{time_ago}</Text>
          </View>
        </View>
        {categoryName && (
          <View
            style={{
              backgroundColor: colors.primary,
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 5,
            }}>
            <Text
              style={{
                fontSize: fontSize.normal,
                color: '#fff',
                fontWeight: '500',
              }}>
              {categoryName}
            </Text>
          </View>
        )}
      </View>
      <View style={{marginTop: 5, paddingHorizontal: 10, paddingBottom: 10}}>
        <Text style={{fontSize: fontSize.medium, lineHeight: 25}}>
          {cc_title}
        </Text>
        <Text style={{fontSize: fontSize.normal, opacity: 0.6}}>
          {cc_question}
        </Text>
      </View>
      {!disableAns && (
        <Text style={{fontSize: fontSize.small, color: colors.primary}}>
          {no_of_answers} answered
        </Text>
      )}
    </TouchableOpacity>
  );
}

export default QuestionsCard;
