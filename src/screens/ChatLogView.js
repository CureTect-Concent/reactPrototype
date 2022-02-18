import React, {
  useCallback,
  useMemo,
  useRef,
  useEffect,
  useState,
} from "react";
import {
  Alert,
  View,
  StyleSheet,
  Platform,
  Dimensions,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import Text from "../component/defaultText";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { getStatusBarHeight } from "react-native-status-bar-height";
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { Entypo, MaterialIcons, AntDesign } from "@expo/vector-icons";
import dataManager from "../dataManager";
import serverManager from "../serverManager";
import { dispatchCommand } from "react-native/Libraries/Renderer/implementations/ReactNativeRenderer-dev";
import sizeOfPhon from "../component/sizeOfPhon";
import { WebView } from "react-native-webview";
import { SafeAreaView } from "react-native-safe-area-context";
let num = 0;
const ChatLogView = ({ route, navigation }) => {
  const { keyValue } = route.params;
  const [isReady, setIsReady] = useState(false);
  const [roading, setRoading] = useState("Loading");

  const webViewRef = useRef(null);

  useEffect(() => {
    let num = 0;
    const lodingAnimation = setInterval(() => {
      num++;
      if (num > 3) {
        setRoading("Loading");
        num = 0;
      } else {
        setRoading((e) => e + ".");
      }
    }, 100);
    setTimeout(() => {
      clearInterval(lodingAnimation);
      setIsReady(true);
    }, 1000);
  }, []);
  const runFirst = `hello~`;
  setTimeout(() => {}, 5000);
  return isReady ? (
    <SafeAreaView style={{ width: "100%", height: "100%" }}>
      <View
        style={{
          height: 100,
          width: "100%",
          backgroundColor: "red",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            webViewRef.current.postMessage(
              JSON.stringify({
                type: "cend",
                id: 1,
                name: "testName",
                content: "test content",
                file: null,
              })
            );
          }}
        >
          <Text>데이터 보내기</Text>
        </TouchableOpacity>
      </View>
      <WebView
        ref={webViewRef}
        style={{ width: "100%", height: "100%" }}
        onMessage={(event) => {
          alert(event.nativeEvent.data);
        }}
        source={{
          uri: `https://concentweb.vercel.app/content?watch=${keyValue}`,
        }}
      />
    </SafeAreaView>
  ) : (
    <View style={styles.appLoading}>
      <Text>{roading}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  appLoading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    alignItems: "center",
    flex: 1,
    backgroundColor: "white",
  },
  headerStyle: {
    height: sizeOfPhon.getInstance().StatusBarHeight,
    backgroundColor: "white",
  },
});

export default ChatLogView;
