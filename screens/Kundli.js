import React from 'react';
import {
  Animated,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  Dimensions,
  View,
  ScrollView,
} from 'react-native';

import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {Text} from '../components/Text';
import colors from '../constant/colors.json';
import fontSize from '../constant/fontSize.json';

const {width} = Dimensions.get('screen');
const PersonalDetails = () => {
  const List = ({grey = false,title,text}) => (
    <View
      style={{
        ...styles.listContainer,
        backgroundColor: grey ? '#ececec' : '#fff',
      }}>
      <View style={styles.listCell}>
        <Text style={styles.listTitleText}>{title}</Text>
      </View>
      <View style={styles.listCell}>
        <Text style={styles.listText}>{text}</Text>
      </View>
    </View>
  );
  return (
    <ScrollView style={{flex: 1, backgroundColor: '#fff'}}>
      <List grey title={'Sex'} text={'Male'}/>
      <List title={'Date of Birth'} text={'5:11:2021'}/>
      <List grey title={'Time of Birth'} text={'14:43:5'}/>
      <List title={'Day of Birth'} text={'Friday'}/>
      <List grey title={'Ishtkaal'} text={'021-07-03'}/>
      <List title={'Place of Birth'} text={'Hyderabad'}/>
      <List grey title={'Time zone'} text={'5.5'}/>
      <List title={'Latitute'} text={'17:22:N'}/>
      <List grey title={'Sex'} text={'Male'}/>
      <List title={'Date of Birth'} text={'5:11:2021'}/>
      <List grey title={'Sex'} text={'Male'}/>
      <List title={'Date of Birth'} text={'5:11:2021'}/>
    </ScrollView>
  );
};
const FirstRoute = () => <View style={{flex: 1, backgroundColor: '#ff4081'}} />;

const SecondRoute = () => (
  <View style={{flex: 1, backgroundColor: '#673ab7'}} />
);

const renderScene = SceneMap({
  personalDetails: PersonalDetails,
  second: SecondRoute,
  first1: FirstRoute,
  second1: SecondRoute,
  first2: FirstRoute,
  second2: SecondRoute,
  first3: FirstRoute,
  second3: SecondRoute,
  first4: FirstRoute,
  second4: SecondRoute,
  first5: FirstRoute,
  second5: SecondRoute,
  first6: FirstRoute,
  second6: SecondRoute,
});
const CTabBar = props => (
  <TabBar
    scrollEnabled={true}
    {...props}
    indicatorStyle={{backgroundColor: 'white'}}
    style={{backgroundColor: colors.primary}}
  />
);

export default function Kundli() {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'personalDetails', title: 'Personal Details'},
    {key: 'second', title: 'Second'},
    {key: 'first1', title: 'First'},
    {key: 'second1', title: 'Second'},
    {key: 'first2', title: 'First'},
    {key: 'second2', title: 'Second'},
    {key: 'first3', title: 'First'},
    {key: 'second3', title: 'Second'},
    {key: 'first4', title: 'First'},
    {key: 'second4', title: 'Second'},
    {key: 'first5', title: 'First'},
    {key: 'second5', title: 'Second'},
    {key: 'first6', title: 'First'},
    {key: 'second6', title: 'Second'},
  ]);

  return (
    <TabView
      navigationState={{index, routes}}
      renderScene={renderScene}
      renderTabBar={CTabBar}
      onIndexChange={setIndex}
      initialLayout={{width}}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    flexDirection: 'row',
    height: 50,
  },
  listCell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listTitleText: {
    fontSize: fontSize.normal,
    fontWeight: '500',
  },
  listText: {
    fontSize: fontSize.normal,
    opacity: 0.8,
  },
});
