import React, { useEffect, useState } from 'react';
import { Text, ScrollView, Pressable, View, Image } from 'react-native';
import { SQLiteProvider } from 'expo-sqlite/next';
import { router } from 'expo-router';
import { migrateDbIfNeeded } from '~/lib/db';
import Ionicons from '@expo/vector-icons/Ionicons';
import { getWeather } from '~/lib/weather';
import { getEurUsdCurrency } from '~/lib/currency';
import * as Notifications from 'expo-notifications';

const trigger = new Date(Date.now() + 60 * 60 * 1000);
trigger.setMinutes(0);
trigger.setSeconds(0);

type WeatherObj = {
  temp: number;
  humidity: any;
  tempMax: number;
  tempMin: number;
  weather: any;
  weatherIcon: keyof typeof Ionicons.glyphMap;
};

export default function HomeTab() {
  // 날씨 정보
  const [weather, setWeather] = useState<WeatherObj>();
  // 환율정보
  const [currency, setCurrency] = useState<{ usd: number; eur: number }>();

  // Event - 알림 전송
  const sendNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'RNEXPO 알림',
        body: '산책하러 가기',
        data: {
          url: `/trektrack`,
        },
        vibrate: [0, 200, 200, 200],
      },
      trigger: null, // 즉시 알림
    });
  };
  
  const scrollData = [
    {
      subTitle: 'TrekTrack',
      title: `푸시 알림 전송`,
      event: () => sendNotification(),
    },
    {
      subTitle: 'TrekTrack',
      title: `Let's Go!!`,
      path: '/trektrack',
    },
    {
      subTitle: 'TrekTrack',
      title: '산책하러 가기',
      path: '/trektrack/map',
    },
  ];
  useEffect(() => {
    const didMount = async () => {
      setWeather(await getWeather());
      setCurrency(await getEurUsdCurrency());
    };
    didMount();
  }, []);
  return (
    <SQLiteProvider databaseName="local-database.db" onInit={migrateDbIfNeeded}>
      <ScrollView className=" divide-slate-500" style={{ flex: 1, backgroundColor: 'white', padding: 20 }}>
        <View className="mb-10">
          <View>
            <Text style={{ fontSize: 20, fontWeight: 500, lineHeight: 30 }}>{`오늘도\n즐거운 하루 보냅시다!`}</Text>
          </View>
        </View>
        <View
          className="rounded-xl py-4 px-5 flex-row justify-between items-center align-middle mb-5"
          style={{ backgroundColor: '#1A6dff' }}
        >
          <View>
            <Text className="text-white text-xl font-bold mb-2">{`오늘의 날씨`}</Text>
            <Text className="text-white font-bold">{`현재 온도 ${weather?.temp}°C`}</Text>
            <Text className="text-white font-bold">{`습도 ${weather?.humidity}%`}</Text>
          </View>
          <Ionicons size={40} name={weather?.weatherIcon} color="white" />
        </View>
        <View className="mb-5">
          <ScrollView horizontal>
            {scrollData.map((data, i) => (
              <Pressable
                key={i}
                onPress={() => {
                  if (data.event) {
                    data.event();
                    return;
                  }
                  if (data.path) {
                    router.push(data.path);
                    return;
                  }
                }}
              >
                <View key={i} className="rounded-xl py-6 px-5 w-56 mr-3" style={{ borderColor: '#eee', borderWidth: 2 }}>
                  <Text className="text-gray-500 text-base font-bold">{data.subTitle}</Text>
                  <Text className="text-xl font-bold ">{data.title}</Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>
        <View className="gap-3 flex-wrap" style={{ maxHeight: 400 }}>
          <View
            className="rounded-xl py-6 px-5"
            style={{ backgroundColor: '#DDEAFF', borderColor: '#DDEAFF', borderWidth: 2, width: '45%' }}
          >
            <Text className="text-gray-600 text-sm font-bold mb-7">{`오늘\n최저 기온`}</Text>
            <Text className="text-gray-600 text-2xl font-bold ">
              {weather?.tempMin}
              <Text className="text-lg ml-1">°C</Text>
            </Text>
          </View>
          <View
            className="rounded-xl py-6 px-5"
            style={{ backgroundColor: '#ccc', borderColor: '#ccc', borderWidth: 2, width: '45%' }}
          >
            <Text className="text-white text-sm font-bold mb-7">환율 정보</Text>
            <Text className="text-white text-2xl font-bold ">
              {currency?.usd}
              <Text className="text-sm"> 달러</Text>
            </Text>
            <Text className="text-white text-sm font-bold ">매매 기준율</Text>
          </View>
          <View className="rounded-xl py-6 px-5 bg-primary border-primary" style={{ borderWidth: 2, width: '45%' }}>
            <Text className="text-gray-600 text-sm font-bold color-white mb-7">{`오늘\n최고 기온`}</Text>
            <Text className="text-gray-600 text-2xl font-bold color-white">
              {weather?.tempMax}
              <Text className="text-lg ml-1">°C</Text>
            </Text>
          </View>
          <View
            className="rounded-xl py-6 px-5"
            style={{ backgroundColor: '#ccc', borderColor: '#ccc', borderWidth: 2, width: '45%' }}
          >
            <Text className="text-white text-sm font-bold mb-7">환율 정보</Text>
            <Text className="text-white text-2xl font-bold ">
              {currency?.eur}
              <Text className="text-sm"> 유로</Text>
            </Text>
            <Text className="text-white text-sm font-bold ">매매 기준율</Text>
          </View>
        </View>
      </ScrollView>
    </SQLiteProvider>
  );
}
