import React, { useState, useEffect } from 'react';
import { useSQLiteContext } from 'expo-sqlite/next';
import { View, Switch, Text, Pressable } from 'react-native';

export default function SettingsTab() {
  const db = useSQLiteContext();
  const [buttonList, setButtonList] = useState<any[]>([
    {
      title: '공지사항 알림',
      button: true,
    },
    {
      title: '자동 로그인 사용',
      button: true,
    },
    {
      title: '프로그램 정보',
      text: 'version 0.0.1',
      button: null,
    },
    {
      title: '마지막 접속시간',
      text: '7월 11일 10:11',
      button: null,
    },
    {
      title: '로그아웃',
      button: null,
    },
  ]);

  const toggleSwitch = (index: number) => (value: boolean) => {
    setButtonList([
      ...buttonList.map((item, i) => {
        if (i === index) item.button = value;
        return item;
      }),
    ]);
  };

  return (
    <View className="flex-1  bg-white px-5 py-6">
      {buttonList.map((item, index) => (
        <View key={index} className={`py-4 `}>
          <Pressable key={index}>
            <View className="flex-row justify-between">
              <Text className="text-base font-semibold text-black">{item.title}</Text>
              {item.button !== null && (
                <Switch
                  trackColor={{ false: 'gray', true: '#1A6dff' }}
                  thumbColor={'#fff'}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitch(index)}
                  value={item.button}
                />
              )}
              {item.text && <Text className="text-common-gray font-semibold">{item.text}</Text>}
            </View>
          </Pressable>
        </View>
      ))}
    </View>
  );
}
