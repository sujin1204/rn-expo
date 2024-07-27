import React from 'react';
import { StyleSheet, Alert, ImageBackground, Dimensions, View, SafeAreaView } from 'react-native';
import PrimaryButton from '../../components/PrimaryButton';
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function TrekTrack() {
  // State - 사용자 로그인 정보
  // const [userInfo, setUserInfo] = useState<string>();
  // State - location
  const [location, setLocation] = useState<Location.LocationObject>();
  // State - error message
  const [errorMsg, setErrorMsg] = useState<string>();
  // const imgPath = 'https://static-image-server.s3.ap-northeast-2.amazonaws.com/map-home-bg.jpg';
  // const [status, requestPermission] = Location.useBackgroundPermissions();

  // Event - 산책하러가기
  const handleGoForAWalk = () => {
    if (!location) {
      Alert.alert('LOCATION PERMISSION', errorMsg, [{ text: 'OK', onPress: () => console.log('OK Pressed') }]);
    } else {
      router.push('/trektrack/map');
    }
  };

  const handleError = (e: any) => {
    console.log(e.nativeEvent.error);
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      const location = await Location.getCurrentPositionAsync();
      if (location) setLocation(location);
    })();
  }, []);

  return (
    // <GestureHandlerRootView style={styles.container}>
    <View style={styles.container}>
      {/* <ImageBackground source={{ uri: require(imgPath) }} onError={handleError} resizeMode={'cover'} style={styles.image}> */}
      <ImageBackground
        source={require('../../assets/images/mapBg.jpg')}
        onError={handleError}
        resizeMode={'cover'}
        style={styles.image}
      >
        <PrimaryButton
          text="산책하러 가기"
          onPress={async (e) => {
            e.preventDefault();
            handleGoForAWalk();
          }}
          style={styles.button}
        />
      </ImageBackground>
    </View>
    // </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // width: '100%',
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height,
    // paddingBottom: '10%'
  },
  image: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    // width: Dimensions.get('screen').width,
    // height: Dimensions.get('screen').height,
  },
  button: {
    margin: 'auto',
    marginBottom: 100,
  },
});
