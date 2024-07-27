import React from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
type IconName = keyof typeof FontAwesome.glyphMap;

const buttonList = [
  {
    title: '내정보',
    children: ['회원정보 수정', '비밀번호 변경'],
  },
  {
    title: '영업관리',
    children: ['실적 인센티브 현황', '영업활동 관리', '위탁 현황', '판매 현황', '자문 현황', '패들 현황'],
  },
  {
    title: '현황관리',
    children: ['연간 실적 현황', '결제 현황', '고객별 위탁/낙찰 현황'],
  },
];

const threeIconButtons: { icon: IconName; title: string }[] = [
  {
    title: '공지사항',
    icon: 'clipboard',
  },
  {
    title: '나의 고객',
    icon: 'users',
  },
  {
    title: '최근 이용 메뉴',
    icon: 'newspaper-o',
  },
];
const MyPage = () => {
  const renderItem = useCallback(
    ({ item, index }: { item: any; index: number }) => (
      <View key={index} className={`py-4 ${(index % 2 == 1 || index == 0) && 'border-b border-light-gray'}`}>
        <Text className="font-bold text-gray-400 pb-4 pt-4">{item.title}</Text>
        {item.children.map((child: string, i: number) => (
          <Pressable key={i}>
            <View className="py-4">
              <Text className="text-base font-semibold text-black">{child}</Text>
            </View>
          </Pressable>
        ))}
      </View>
    ),
    []
  );

  return (
    <View className="flex-1  bg-white px-5 py-12">
      <View className="py-14">
        <Text className="text-2xl font-semibold text-black">{`안녕하세요\n김서울님`}</Text>
        <Text className="pt-4">seoul@seoulauction.com</Text>
      </View>
      <View className="px-4 flex-row justify-between mb-4">
        {threeIconButtons.map((btn, i) => (
          <View key={i} className="align-center">
            <Pressable className="w-24 flex items-center align-center">
              <FontAwesome size={45} name={btn.icon} className="m-auto " color="gray" />
              <Text className="mt-3 font-semibold"> {btn.title}</Text>
            </Pressable>
          </View>
        ))}
      </View>
      <FlatList data={buttonList} renderItem={renderItem}></FlatList>
    </View>
  );
};
export default MyPage;
