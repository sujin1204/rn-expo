/**
 * 탭 뷰 레이아웃 - 메인 레이아웃
 */
import * as Haptics from 'expo-haptics';
import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs, router } from 'expo-router';

export default function TabLayout() {
  const iconSize = 24;
  return (
    <Tabs
      screenOptions={{ tabBarActiveTintColor: '#111', tabBarInactiveTintColor: '#bbb', tabBarStyle: {} }}
      screenListeners={{
        tabPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        },
      }}
      initialRouteName="index"
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome size={iconSize} name="home" color={color} />,
          headerTitle: 'RNEXPO',
          headerTitleAlign: 'left',
          headerRight: ({ tintColor }) => (
            <FontAwesome
              onPress={() => router.push('/chat-rooms')}
              style={{ marginRight: 15, color: '#ccc' }}
              size={iconSize}
              name="commenting-o"
              color={tintColor}
            />
          ),
          headerTitleStyle: {
            // fontSize: 28,
            color: '#1A6dff',
          },
        }}
      />
      <Tabs.Screen
        name="chat-rooms"
        options={{
          tabBarLabel: '채팅',
          headerTitle: '채팅',
          headerTitleAlign: 'left',
          headerTitleStyle: {},
          tabBarIcon: ({ color }) => <FontAwesome size={iconSize} name="comments" color={color} />,
        }}
      />
      <Tabs.Screen
        name="MyPage"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesome size={iconSize} name="user" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: '설정',
          tabBarIcon: ({ color }) => <FontAwesome size={iconSize} name="cog" color={color} />,
        }}
      />
    </Tabs>
  );
}
