import React, { useEffect, useState } from 'react';
import { Text, ScrollView, Pressable, View, Image } from 'react-native';
import { SQLiteProvider } from 'expo-sqlite/next';
import { router } from 'expo-router';
import { migrateDbIfNeeded } from '~/lib/db';
import { getWeather } from '~/lib/weather';
import Ionicons from '@expo/vector-icons/Ionicons';

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

const scrollData = [
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
export default function HomeTab() {
  const [weather, setWeather] = useState<WeatherObj>();
  useEffect(() => {
    const didMount = async () => {
      setWeather(await getWeather());
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
              <Pressable key={i} onPress={() => (data.path ? router.push(data.path) : {})}>
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
            <Text className="text-white text-sm font-bold mb-7">프리미엄 온라인 7/10</Text>
            <Text className="text-white text-2xl font-bold ">
              9360<Text className="text-sm"> 만원</Text>
            </Text>
            <Text className="text-white text-sm font-bold ">낙찰율 29.63%</Text>
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
            <Text className="text-white text-sm font-bold mb-7">프리미엄 온라인 7/10</Text>
            <Text className="text-white text-2xl font-bold ">
              9360<Text className="text-sm"> 만원</Text>
            </Text>
            <Text className="text-white text-sm font-bold ">낙찰율 29.63%</Text>
          </View>
        </View>
      </ScrollView>
    </SQLiteProvider>
  );
}
