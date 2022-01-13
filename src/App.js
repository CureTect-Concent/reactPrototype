import { StatusBar } from "expo-status-bar";
import { darkTheme } from "./theme";
import React, { useCallback, useMemo, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import StyleSheetValidation from "react-native/Libraries/StyleSheet/StyleSheetValidation";
import {
  GestureHandlerRootView,
  TextInput,
} from "react-native-gesture-handler";
import BottomSheet, {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";

const App = () => {
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
              <TouchableOpacity onPress={() => alert("혼자 하는중")}>
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
                  onSubmitEditing={() => handleSnapPress(0)}
                  placeholder="제목을 입력해 주세요"
                  placeholderTextColor="rgba(0, 0, 0, 0.2)"
                  style={styles.input}
                />
              </View>
              <View style={styles.buttonsheetBtn_view}>
                <TouchableOpacity
                  style={styles.bottomsheetBtn}
                  onPress={() => console.log("완료!")}
                >
                  <Text style={styles.btnText}>완료</Text>
                </TouchableOpacity>
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
  input: {
    paddingTop: 10,
    borderBottomColor: "rgba(0, 0, 0, 0.2)", // Add this to specify bottom border color
    borderBottomWidth: 1.5, // Add this to specify bottom border thickness
  },
  buttonsheetBtn_view: {
    flex: 1,
  },
  btnText: {
    padding: 20,
    backgroundColor: "blue",
    textAlign: "center",
    fontSize: 20,
    color: "white",
  },
});

export default App;
