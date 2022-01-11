import { StatusBar } from "expo-status-bar";
import { darkTheme } from "./theme";
import React from "react";
import { View, Text, StyleSheet, Button, TouchableOpacity } from "react-native";
import StyleSheetValidation from "react-native/Libraries/StyleSheet/StyleSheetValidation";
const App = () => {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.title}>
        <Text style={styles.titleText}>Clog ProtoType</Text>
      </View>
      <View style={styles.body}>
        <View style={styles.bottomBar}>
          <TouchableOpacity onPress={() => alert("혼자 하는중")}>
            <Text style={styles.btnSty}>블로그</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => alert("혼자 하는중")}>
            <Text style={styles.btnSty}>혼자하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
    fontVariant: 0,
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
});

export default App;
