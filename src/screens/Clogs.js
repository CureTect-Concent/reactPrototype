import { StatusBar } from "expo-status-bar";
import { darkTheme } from "../theme";
import React, {
  useCallback,
  useMemo,
  useRef,
  useEffect,
  useState,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const Clogs = ({ navigation }) => {
  return (
    <GestureHandlerRootView style={styles.container}>
      <Text>챗로그들 </Text>
    </GestureHandlerRootView>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flex: 1,
    backgroundColor: "#34495e",
  },
});

export default Clogs;
