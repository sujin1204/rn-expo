import { Text, TouchableOpacity, StyleSheet, View, TextStyle, GestureResponderEvent } from 'react-native';
import React from 'react';

type Props = {
  text: string;
  onPress: (event: GestureResponderEvent) => void;
  style?: TextStyle;
  width?: number;
  height?: number;
};

const PrimaryButton = ({ text, style, width, height, onPress }: Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, { width: width || 230, height: height || 50, ...style }]}
      className="bg-trektrack"
    >
      <Text style={[styles.text, { color: '#fff' }]}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignContent: 'center',
    padding: 15,
    borderRadius: 100,
  },
  text: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});
export default PrimaryButton;
