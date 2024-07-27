import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, Platform, SafeAreaView } from 'react-native';
import PrimaryButton from '../../components/PrimaryButton';
import MapView, {
  PROVIDER_GOOGLE,
  PROVIDER_DEFAULT,
  // MarkerAnimated,
  Region,
  Marker,
  Polyline,
  AnimatedRegion,
  type LatLng,
} from 'react-native-maps';

import * as Location from 'expo-location';
import { produce } from 'immer';
// @ts-ignore
// import haversine from 'haversine';

const INITIAL_LATITUDE = 37.5802683;
const INITIAL_LONGTITUDE = 126.9754206;

const initialLocation = {
  latitude: INITIAL_LATITUDE,
  longitude: INITIAL_LONGTITUDE,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
  routeCoordinates: [],
  distanceTravelled: 0,
  prevLatLng: { latitude: 0, longitude: 0 },
  coordinate: new AnimatedRegion({
    latitude: INITIAL_LATITUDE,
    longitude: INITIAL_LONGTITUDE,
  }),
  kcal: 0,
  start: false,
};

type TrekingInfo = {
  routeCoordinates: Array<any>;
  distanceTravelled: number;
  prevLatLng: LatLng;
  coordinate: AnimatedRegion;
  kcal: number;
  start: boolean;
};

type TimingAnimationConfig = {
  toValue: number;
  useNativeDriver: boolean;
  duration?: number;
  delay?: number;
  easing?: (value: number) => number;
};

const Map = () => {
  const [startRegion, setStartRegion] = useState<LatLng>({
    latitude: INITIAL_LATITUDE,
    longitude: INITIAL_LONGTITUDE,
  });
  // State - region
  const [state, setState] = useState<Region & TrekingInfo>(initialLocation);

  //거리 계산
  const calcDistance = (newLatLng: LatLng) => {
    const { prevLatLng } = state;
    // return haversine(prevLatLng, newLatLng) || 0;
  };

  // 이동한 거리를 이용해 kcal 계산해주는 함수. 0.1m당 7kcal로 계산함.
  const calcKcal = (distance: number) => {
    return (distance / 0.1) * 7;
  };

  useEffect(() => {
    (async () => {
      const loc = await Location.getCurrentPositionAsync();
      if (loc) {
        setState(
          produce((draft: any) => {
            draft.latitude = loc.coords.latitude;
            draft.longitude = loc.coords.longitude;
            draft.distanceTravelled = 0;
          })
        );
      }

      // 실시간으로 위치 변화 감지
      // Location.watchPositionAsync(
      //   { accuracy: Location.Accuracy.Balanced, timeInterval: 300, distanceInterval: 1 },
      //   (position) => {
      //     if (position.coords && position.coords.latitude !== state.latitude && position.coords.longitude !== state.longitude) {
      //       console.log('watchPositionAsync :: ', position.coords);
      //       // console.log(position.coords);
      //       const { latitude, longitude } = position.coords;

      //       //새롭게 이동된 좌표
      //       const newCoordinate: TimingAnimationConfig & LatLng & { latitudeDelta: number; longitudeDelta: number } = {
      //         toValue: 1,
      //         useNativeDriver: true,
      //         latitude,
      //         longitude,
      //         latitudeDelta: initialLocation.latitudeDelta,
      //         longitudeDelta: initialLocation.longitudeDelta,
      //       };

      //       // state.coordinate.timing({ ...newCoordinate }).start();

      //       // 좌표값 갱신하기
      //       setState(
      //         produce((draft) => {
      //           const newDistanceTravelled = draft.distanceTravelled + calcDistance({ latitude, longitude });
      //           draft.latitude = latitude;
      //           draft.longitude = longitude;
      //           draft.routeCoordinates = state.routeCoordinates.concat([newCoordinate]); //이동경로
      //           draft.distanceTravelled = newDistanceTravelled; // 이동거리
      //           draft.kcal = calcKcal(newDistanceTravelled); //칼로리 계산
      //           draft.prevLatLng = { latitude, longitude };
      //         })
      //       );
      //     }
      //   }
      // );
    })();
  }, []);

  return (
    <SafeAreaView style={[styles.container]}>
      <MapView
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
        style={styles.map}
        region={state}
        showsUserLocation
        followsUserLocation
        loadingEnabled
        // onRegionChange={onRegionChange}
        initialRegion={state}
      >
        {state.start && <Marker key={0} coordinate={startRegion} title={'출발한 위치'} description={''} pinColor={'orange'} />}
        <Polyline coordinates={state.routeCoordinates} strokeWidth={5} />
      </MapView>
      {!state.start && (
        <PrimaryButton
          text="산책 시작하기"
          onPress={async (e) => {
            e.preventDefault();
            setState(
              produce((draft: any) => {
                draft.start = true;
              })
            );
            setStartRegion({ latitude: state.latitude, longitude: state.longitude });
          }}
          style={styles.startButton}
        />
      )}
      {state.start && <Text style={styles.distance}>이동한 거리 : {state.distanceTravelled} km</Text>}
    </SafeAreaView>
  );
};
export default Map;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
    flex: 1,
    width: '90%',
    marginHorizontal: 20,
    marginVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
  },
  map: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  marker: {
    color: '#9971ff',
    fontSize: 18,
    fontWeight: '700',
    borderColor: '#9971ff',
    borderRadius: 10,
    padding: 2,
  },
  startButton: {
    position: 'absolute',
    bottom: 50,
  },
  distance: {
    width: 'auto',
    height: 60,
    borderRadius: 20,
    position: 'absolute',
    bottom: 50,
    padding: 20,
    backgroundColor: 'rgba(255,255,255,.8)',
    borderColor: '#ccc',
    borderWidth: 2,
    textAlign: 'center',
  },
});
