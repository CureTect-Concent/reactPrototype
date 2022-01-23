import React, {
  useCallback,
  useMemo,
  useRef,
  useEffect,
  useState,
} from "react";
import {
  View,
  StyleSheet,
  StatusBar,
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
import sizeOfPhon from "../component/sizeOfPhon";

import { Entypo, MaterialIcons, AntDesign } from "@expo/vector-icons";
const str = `ㅇ\nㅇ\nㅇ\nㅇ\nㅇ\nㅇ`;

const ClogScrollView = ({ route, navigation }) => {
  const MSGText = (str) => {
    const temp = str.split("\n");
    console.log(temp);

    return temp.map((Textvar) => {
      return <Text style={styles.ChatMsg_new}>{Textvar}</Text>;
    });
  };
  MSGText(str);
  return (
    <View style={styles.container}>
      <View style={styles.headerStyle}></View>
      <View style={styles.bodyContent}>
        <ScrollView>
          <View style={styles.signView}>
            <View style={styles.signView_mask}></View>
            <Text style={styles.signView_title}>제목이랄까</Text>
            <Text style={styles.signView_name}>이름</Text>
            <Text style={styles.signView_date}>2022.01.01</Text>
          </View>
          <View style={styles.ScrollSty}>
            <View style={styles.chatBlock}>
              <Text>2022.01.01</Text>
              <View style={styles.ChatMsgBox}>
                <Text style={styles.ChatMsg}>나작왁</Text>
              </View>
            </View>
            <View style={styles.chatBlock}>
              <Text>2022.01.01</Text>
              <View style={styles.ChatMsgBox}>
                <Text style={styles.ChatMsg}>0</Text>
              </View>
            </View>
            <View style={styles.chatBlock}>
              <Text>2022.01.01</Text>
              <View style={styles.ChatMsgBox}>
                <Text style={styles.ChatMsg}>나작왁왁</Text>
              </View>
            </View>
            <View style={styles.chatBlock}>
              <Text>2022.01.01</Text>
              <View style={styles.ChatMsgBox}>
                <Text style={styles.ChatMsg}>나작왁왁</Text>
              </View>
            </View>
            <View style={styles.chatBlock}>
              <Text>2022.01.01</Text>
              <View style={styles.ChatMsgBox}>
                <Text style={styles.ChatMsg}>
                  나의 작은 우왁굳 나만 알거야 나보다 항상 작아야되 사랑해 형❤
                </Text>
              </View>
            </View>
            <View style={styles.chatBlock}>
              <Text>2022.01.01</Text>
              <View style={styles.ChatMsgBox}>
                <Text style={styles.ChatMsg}>나작왁</Text>
              </View>
            </View>
            <View style={styles.chatBlock}>
              <Text>2022.01.01</Text>
              <View style={styles.ChatMsgBox}>{MSGText(str)}</View>
            </View>
            <View style={styles.chatBlock}>
              <Text>2022.01.01</Text>
              <View style={styles.ChatMsgBox}>
                <Text
                  style={styles.ChatMsg}
                >{`아\n 이 \n  우\n 에\n오\n 하\n  요\n  구\n 르\n트`}</Text>
              </View>
            </View>
          </View>
        </ScrollView>
        <View style={styles.titleStyle}>
          <View style={styles.title_all}>
            <View style={styles.titleOne}>
              <Text style={styles.titleTxt}></Text>
            </View>
            <TouchableOpacity style={styles.titleTwo}>
              <AntDesign name="logout" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.titleThree}>
              <AntDesign name="menu-fold" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "teal",
    flex: 1,
  },
  headerStyle: {
    height: sizeOfPhon.getInstance().StatusBarHeight,
    backgroundColor: "white",
  },
  bodyContent: {
    flex: 1,
    width: "100%",
    backgroundColor: "red",
  },
  titleTxt: {
    color: "#F6C109",
    marginLeft: 20,
    fontSize: 25,
  },
  titleStyle: {
    position: "absolute",
    height: sizeOfPhon.getInstance().chartHeight * 0.0677,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  title_all: {
    flex: 1,
    flexDirection: "row",
  },
  titleOne: {
    flex: 5,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  titleTwo: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titleThree: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  ScrollSty: {
    width: "100%",
    paddingHorizontal: 15,
  },
  signView: {
    paddingHorizontal: 15,
    height: sizeOfPhon.getInstance().chartHeight * 0.5,
    justifyContent: "flex-end",
    marginBottom: 10,
  },
  signView_title: {
    width: "100%",
    marginBottom: sizeOfPhon.getInstance().chartHeight * 0.18,
    fontSize: 30,
    color: "white",
  },
  signView_name: {
    color: "white",
  },
  signView_date: {
    color: "white",
  },
  signView_mask: {
    paddingHorizontal: 15,
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    right: 0,
    bottom: 0,
    left: 0,
    top: 0,
  },
  chatBlock: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginVertical: 10,
  },
  ChatMsgBox: {
    maxWidth: "69%",
  },
  ChatMsg: {
    padding: 10,
    backgroundColor: "#FEDE70",
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    margin: 5,
    textAlign: "justify",
  },
  ChatMsg_new: {
    paddingHorizontal: 10,
    backgroundColor: "#FEDE70",
    textAlign: "justify",
  },
});

export default ClogScrollView;
