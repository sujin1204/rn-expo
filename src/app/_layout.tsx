/**
 * Root Layout 파일
 * - 각종 초기화 설정: Font, SQLite
 */
import * as SplashScreen from 'expo-splash-screen';
import { SQLiteProvider } from 'expo-sqlite/next';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { useEffect, useRef } from 'react';
import { Stack } from 'expo-router';
import { migrateDbIfNeeded } from '~/lib/db';
import React from 'react';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import messaging from '@react-native-firebase/messaging';
SplashScreen.preventAutoHideAsync();

/**
 * 푸시 알림 터치시 설정된 URI로 리다이렉트
 */
function useNotificationObserver() {
  useEffect(() => {
    let isMounted = true;

    function redirect(notification: Notifications.Notification) {
      const url = notification.request.content.data?.url;
      if (url) {
        router.push(url);
      } else {
        router.push(`/trektrack`);
      }
    }

    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (!isMounted || !response?.notification) {
        return;
      }
      redirect(response?.notification);
    });

    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      if (!isMounted || !response?.notification) {
        return;
      }
      redirect(response?.notification);
    });
    return () => {
      subscription.remove();
    };
  }, []);
}

export default function RootLayout() {
  useNotificationObserver();

  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Event - 알림 전송
  const sendNotification = async (title: string | null | undefined, body: string | null | undefined) => {
    if (title && body) {
      // const time = new Date().setHours(15 + 9, 30, 0, 0); // 한국시간 오후 3시 30분
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: {
            url: `/trektrack`,
          },
          vibrate: [0, 200, 200, 200],
        },
        // trigger: {
        //   date: time, // 오후 3시 30분이 되면 알람이 발생합니다.
        //   // repeats: true,
        // },
        trigger: null, // 즉시 알림
      });
    }
  };
  // Register background handler
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    const { title, body } = remoteMessage.notification || { title: null, body: null };
    await sendNotification(title, body);
  });

  // push 알림 설정
  useEffect(() => {
    const didMount = async () => {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: false,
          shouldSetBadge: false,
        }),
      });
      // 알림 권한
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('알림 권한이 거부되었습니다!');
      } else {
        // 알림 전송
        // const fcmToken = await messaging().getToken();
        const unsubscribe = messaging().onMessage(async (remoteMessage) => {
          const { title, body } = remoteMessage.notification || { title: null, body: null };
          await sendNotification(title, body);
        });
        return unsubscribe;
      }
    };
    didMount();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SQLiteProvider databaseName="local-database.db" onInit={migrateDbIfNeeded}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ title: 'Home', headerShown: false }} />
        <Stack.Screen name="chat-config" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="trektrack/index" options={{ title: 'TrekTrack' }} />
        <Stack.Screen name="trektrack/map" options={{ title: 'TrekTrack Map' }} />
      </Stack>
    </SQLiteProvider>
  );
}
