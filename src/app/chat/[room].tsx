import {
  View,
  Text,
  FlatList,
  Button,
  Pressable,
  Platform,
  TextInput,
  type GestureResponderEvent,
  Keyboard,
  InputAccessoryView,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import React from 'react';

export default function ChatRoom() {
  const [data, setData] = useState<Record<string, any>[]>([]);
  const { room } = useLocalSearchParams();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList | null>(null);
  const router = useRouter();

  // State - 메시지
  const [message, setMessage] = useState('');

  // Event - 메시지 입력
  const handleChangeText = (text: string) => {
    setMessage(text);
  };

  // Event - 정보 클릭
  const handlePressConfig = () => {
    router.push('/chat-config');
  };

  // Event - 메시지 전송
  const handleSendMessage = (_event: GestureResponderEvent) => {
    if (!message) return;

    const lastId = data.at(-1)?.id || 1;

    setData((prev) => {
      const newMessage = {
        id: lastId + 1,
        isMe: true,
        message,
        user: '나',
      };
      return [...prev, newMessage];
    });
    setMessage('');
    Keyboard.dismiss();
  };

  // DidUpdate - 헤더 변경
  useEffect(() => {
    const didUpdate = async () => {
      navigation.setOptions({
        title: room,
        headerStyle: {
          backgroundColor: '#DDEAFF',
          color: 'ddd'
        },
        headerTintColor: 'gray',
        headerBackTitle: '목록',
        headerRight: () => <Button onPress={handlePressConfig} title="정보" color="gray" />,
      });
    };
    didUpdate();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // DidUpdate - 데이터 조회
  useEffect(() => {
    const didUpdate = async () => {
      setData([
        { id: '11', user: '상대방', isMe: false, message: '안녕하세요' },
        { id: '12', user: '나', isMe: true, message: '네 안녕하세요' },
        { id: '13', user: '상대방', isMe: false, message: '??' },
        { id: '14', user: '상대방', isMe: false, message: '안녕하세요2' },
        { id: '15', user: '상대방', isMe: false, message: '안녕하세요3' },
        { id: '16', user: '상대방', isMe: false, message: '안녕하세요4' },
        { id: '17', user: '나', isMe: true, message: '네네' },
        { id: '18', user: '상대방', isMe: false, message: '안녕하세요5' },
        { id: '19', user: '나', isMe: true, message: 'ASDF qwdjqwldwfe;wefk;lrgker;gkergerjge;rlgkdfasdasdqwdqwdqwd' },
        { id: '20', user: '상대방', isMe: false, message: '안녕하세요5' },
        { id: '21', user: '상대방', isMe: false, message: '안녕하세요5' },
        { id: '22', user: '상대방', isMe: false, message: '안녕하세요5' },
        { id: '23', user: '상대방', isMe: false, message: '안녕하세요5' },
        { id: '24', user: '상대방', isMe: false, message: '안녕하세요5' },
      ]);
    };
    didUpdate();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <View className="flex-1 flex bg-second">
      <View className="flex-1 pb-16">
        <FlatList
          ref={flatListRef}
          keyboardDismissMode="interactive"
          automaticallyAdjustContentInsets={false}
          contentInsetAdjustmentBehavior="never"
          maintainVisibleContentPosition={{ minIndexForVisible: 0, autoscrollToTopThreshold: 100 }}
          automaticallyAdjustKeyboardInsets={true}
          scrollEnabled
          disableVirtualization={false}
          className="w-full h-full px-4 pt-2 "
          data={data}
          onContentSizeChange={() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }}
          onLayout={() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }}
          renderItem={({ item }) => {
            if (item.isMe) {
              return (
                <View key={item.id} className="flex justify-end self-end mb-4 p-4 rounded-[14px] bg-primary  max-w-[80%]">
                  <Text className="text-white font-medium">{item.message}</Text>
                </View>
              );
            }

            return (
              <View key={item.id} className="flex justify-start mb-4 p-4 rounded-[14px] bg-white flex-grow-0 max-w-[80%]">
                <Text className="font-normal opacity-75">{item.message}</Text>
              </View>
            );
          }}
        />
      </View>
      <View className="basis-[12] flex flex-col bg-white border-t border-slate-300" style={{ paddingBottom: insets.bottom }}>
        {Platform.OS === 'ios' && (
          <InputAccessoryView className="bg-white w-full ">
            <View className="px-4 h-14 flex flex-row items-center bg-white ">
              <View className="flex flex-row items-center border-2 border-light-gray rounded-full mx-auto">
                <TextInput
                  placeholder="메시지를 입력하세요...."
                  onChangeText={handleChangeText}
                  value={message}
                  className="flex-1 pl-4"
                  blurOnSubmit
                />
                <Pressable
                  onPress={handleSendMessage}
                  className="basis-[45px] h-full items-center justify-center align-middle bg-common-gray rounded-full pb-1"
                >
                  <FontAwesome className='self-center align-middle ' size={40} name="arrow-up" color="white" />
                </Pressable>
              </View>
            </View>
          </InputAccessoryView>
        )}
      </View>
    </View>
  );
}
