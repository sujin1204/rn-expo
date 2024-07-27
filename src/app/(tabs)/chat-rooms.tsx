import * as Haptics from 'expo-haptics';
import { useCallback, useState } from 'react';
import { Image, Text, FlatList, View, RefreshControl, Pressable, type GestureResponderEvent } from 'react-native';
import { sleep } from '~/lib/utils';
import { router } from 'expo-router';
import React from 'react';

export default function ChattingRoomTab() {
  // State - 새로고침 완료 여부 값
  const [refreshing, setRefreshing] = useState(false);

  // Event - 당겨서 새로고침
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await sleep(3000);
    setRefreshing(false);
  }, []);

  // Event - 채팅방 클릭
  const handlePressChatRoom = (title: string) => (e: GestureResponderEvent) => {
    router.push(`/chat/${title}`);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const data = Array.from({ length: 50 }).map((_, index) => {
    return {
      id: `${index + 1000}`,
      title: `${index + 1}번 채팅방`,
    };
  });

  return (
    <View className=" bg-white">
      <FlatList
        disableVirtualization={false}
        data={data}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => {
          return (
            <Pressable onPress={handlePressChatRoom(item.title)}>
              <View className="px-4 py-4 flex-row">
                <Image source={require('~/assets/images/icon.png')} className="rounded w-16 h-16 mr-2" />
                <View className="flex-1 flex-row justify-between align-text-top self-stretch" >
                  <Text className="text-base ">{item.title}</Text>
                  <Text className="text-sm text-zinc-500">6시간 전</Text>
                </View>
              </View>
            </Pressable>
          );
        }}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
