import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import React from 'react';

export default function ChatConfig() {
  const router = useRouter();
  const isPresented = router.canGoBack();

  // DidUpdate - API Call Example
  useEffect(() => {
    const didUpdate = async () => {
      fetch('https://jsonplaceholder.typicode.com/todos/1')
        .then((response) => response.json())
        .then((json) => console.log(json));

      // local server
      // const resp = await fetch('http://192.168.0.81:3000');
      // const json = await resp.text();
      // console.log(json);
    };
    didUpdate();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="mb-12">채팅방 설정</Text>
      {isPresented && (
        <Pressable
          onPress={() => {
            router.back();
          }}
        >
          <Text className="text-lg font-semibold">Close</Text>
        </Pressable>
      )}
    </View>
  );
}
