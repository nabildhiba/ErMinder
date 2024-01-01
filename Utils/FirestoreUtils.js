import firestore from '@react-native-firebase/firestore';

const fetchMapsValue = async () => {
    try {
      const documentSnapshot = await firestore()
        .collection('Metadatas')
        .doc('MetaDataMaps')
        .get();
        const keyApi = documentSnapshot.data().MAPS_KEY;
        console.log(keyApi);
      if (keyApi != null) {
        return keyApi; // Update mapsValue with the retrieved value
      } else {
        console.log('Document does not exist');
        return null;
      }
    } catch (error) {
      console.error('Error getting document:', error);
    }
  };

  export default fetchMapsValue;