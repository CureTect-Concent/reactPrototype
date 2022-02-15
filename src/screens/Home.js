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
import BottomSheet, {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import Btn from "../component/cus_Btn";
import dataManager from "../dataManager";
import serverManager from "../serverManager";

const Home = ({ navigation }) => {
  const [ativeBtn, setAtiveBtn] = useState(false);
  const [text, setText] = useState("");
  //const MemorizedBtn= React.memo(Btn);  //리렌더링 방지 코드

  useEffect(async () => {
    // const s=await AsyncStorage.getItem(STORAGE_ROOM_NAME_KEY);
    // console.log("불러오기"+s)
  }, []);
  useEffect(() => {
    serverManager.loginAuto();
    const showSubscription = Keyboard.addListener("keyboardDidShow", (e) => {
      //sheetRef.current.snapToIndex(0);
      //setKeyboardHeight(e.endCoordinates.height);
      dataManager.setValueForKeyBoardHeight(e.endCoordinates.height.toString());
      // await AsyncStorage.setItem(
      //   STORAGE_KEYBOARD_HEIGHT_KEY,
      //   e.endCoordinates.height.toString()
      // );
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", (e) => {});

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    if (text === "") {
      setAtiveBtn(false);
      return;
    }
    setAtiveBtn(true);
  }, [text]);
  const onSubmitSoloRoom = (roomName) => {
    if (text === "") {
      if (roomName === "Clogs") {
        navigation.navigate(roomName);
      }
      return;
    }
    textInput.current.clear();
    dataManager.setRoomName(text);
    const title = text;
    setText("");
    handleClosePress();
    navigation.navigate(roomName, {
      title: title,
    });
  };
  const textInput = useRef();

  const onChangeText = (prev) => setText(prev);

  const bottomSheetModalRef = useRef(null);
  // variables
  const snapPoints = useMemo(() => ["50%"], []);
  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleSnapPress = useCallback((index) => {
    bottomSheetModalRef.current?.snapToIndex(index);
  }, []);

  const handleClosePress = useCallback(() => {
    bottomSheetModalRef.current?.close();
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar style="auto" />

      <BottomSheetModalProvider>
        <View style={styles.container}>
          <View style={styles.title}>
            <Text style={styles.titleText}>Clog ProtoType</Text>
            {/* <TextInput
              onSubmitEditing={handleClosePress}
              placeholder="제목을 입력해 주세요"
              style={styles.input}
            /> */}
          </View>
          <View style={styles.body}>
            <View style={styles.bottomBar}>
              <TouchableOpacity onPress={() => onSubmitSoloRoom("Clogs")}>
                <Text style={styles.btnSty}>블로그</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handlePresentModalPress}>
                <Text style={styles.btnSty}>혼자하기</Text>
              </TouchableOpacity>
            </View>
          </View>
          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={0}
            snapPoints={snapPoints}
          >
            <View style={styles.contentContainer}>
              <Text style={styles.bottomsheetTitle}>나 혼자하기</Text>
              <View style={styles.inputTitle}>
                <Text>제목(20자이내)</Text>
                <BottomSheetTextInput
                  ref={textInput}
                  onChangeText={onChangeText}
                  autoCapitalize="none"
                  autoCorrect={false}
                  onSubmitEditing={() => handleSnapPress(0)}
                  returnKeyType="done"
                  placeholder="제목을 입력해 주세요"
                  placeholderTextColor="rgba(0, 0, 0, 0.2)"
                  style={styles.bottomInput}
                />
              </View>
              <View style={styles.buttonsheetBtn_view}>
                <Btn
                  name={"완료"}
                  ative={ativeBtn}
                  onPress={() => onSubmitSoloRoom("Chat")}
                />
              </View>
            </View>
          </BottomSheetModal>
        </View>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flex: 1,
    backgroundColor: "#34495e",
  },
  title: {
    marginTop: 50,
  },
  titleText: {
    color: "#3498db",
    fontWeight: "normal",
    fontSize: 40,
  },
  btnSty: {
    color: "white",
    fontSize: 30,
  },
  body: {
    flex: 1,
    justifyContent: "flex-end",
  },
  btnColor: {
    backgroundColor: "#9b59b6",
  },
  bottomBar: {
    backgroundColor: "#283243",
    borderRadius: 10,
    paddingVertical: 15,
    justifyContent: "space-around",
    flexDirection: "row",
  },
  contentContainer: {
    flex: 1,
    marginHorizontal: 33,
  },
  bottomsheetTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 30,
  },
  inputTitle: {
    flex: 1,
  },
  bottomInput: {
    paddingTop: 10,
    borderBottomColor: "rgba(0, 0, 0, 0.2)", // Add this to specify bottom border color
    borderBottomWidth: 1.5, // Add this to specify bottom border thickness
  },
  buttonsheetBtn_view: {
    flex: 1,
  },
});

export default Home;
