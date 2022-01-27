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
import profilePic from "../img/profilePic.jpg";
import { Entypo, MaterialIcons, AntDesign } from "@expo/vector-icons";
import serverManager from "../serverManager";
import AutoImage from "react-native-scalable-image";
import { asin } from "react-native-reanimated";
//const str = `ㅇ\nㅇ\nㅇ\nㅇ\nㅇ\nㅇ`;

const ClogScrollView = ({ route, navigation }) => {
  const { keyValue } = route.params;
  const [isReady, setIsReady] = useState(false);
  const [chatsObj, setChatsObj] = useState({});
  // const [imgObjs, setImgObj] = useState({});
  // const [size, setSize] = useState(null);

  // const [ImageObj, setImageObj] = useState({
  //   width: 0,
  //   height: 0,
  // });
  // console.log("방에 들어왔당꼐요");
  // console.log(keyValue);
  useEffect(async () => {
    setChatsObj(await serverManager.getChats(keyValue));
    //console.log(chatsObj);
    setIsReady(true);
  }, [isReady]);

  // useEffect(async () => {
  //   await getSize();
  // }, [chatsObj]);

  const success = (width, height, num) => {
    console.log("결과");
    console.log(imgObjs);
    console.log(size);
    const newImgObj = {
      ...imgObjs,
      [num]: { width, height },
    };
    setImgObj(newImgObj);
  };

  const MSGText = (str) => {
    const temp = str.split("\n");
    console.log(temp);

    return temp.map((Textvar, index) => {
      return <Text style={styles.ChatMsg_new}>{Textvar}</Text>;
    });
  };
  const backBtn = async () => {
    navigation.pop();
  };
  const GoToEdit = async () => {
    navigation.navigate("ClogEditView", {
      chatsObjTemp: chatsObj,
    });
  };
  const getSize = async () => {
    const objImgs = chatsObj;
    try {
      objImgs.contentMessageResponses.map((Objarr, num) => {
        console.log(num + "dd");
        if (!(Objarr.messageImageName === null)) {
          const newChats = {
            ...size,
            [num]: { image: Objarr.messageImageName },
          };
          //setSize((vals) => vals + ":" + num + " " + Objarr.messageImageName);
          console.log("실행");
          Image.getSize(
            serverManager.getImageUri(Objarr.messageImageName),
            (width, height) => {
              setImgObj(() => {
                const newImgObj = {
                  ...imgObjs,
                  [num]: { width, height },
                };
                return newImgObj;
              });
            }
          );
        }
      });
    } catch (e) {
      console.log(e);
    }
  };

  //console.log(image.width);
  //MSGText(str);
  // console.log("결과");
  // console.log(imgObjs);
  // console.log(size);

  return isReady ? (
    <View style={styles.container}>
      <View style={styles.headerStyle}></View>
      <View style={styles.bodyContent}>
        <ScrollView>
          <View style={styles.signView}>
            {chatsObj.contentResponse.contentImageName &&
            chatsObj.contentResponse.contentImageName.length ? (
              <Image
                style={styles.signView_image}
                source={{
                  uri: serverManager.getImageUri(
                    chatsObj.contentResponse.contentImageName[0]
                  ),
                }}
              />
            ) : null}
            <View style={styles.signView_mask}></View>
            <Text style={styles.signView_title}>
              {chatsObj.contentResponse.title}
            </Text>
            <Text style={styles.signView_name}>굿맨</Text>
            <Text style={styles.signView_date}>
              {chatsObj.contentResponse.writeAt.replace(/-/gi, ".")}
            </Text>
          </View>
          <View style={styles.ScrollSty}>
            {chatsObj.contentMessageResponses.map((Objarr, index) => {
              //console.log(Objarr);
              // console.log(serverManager.getImageUri(Objarr.messageImageName));
              // getImageObj(serverManager.getImageUri(Objarr.messageImageName));

              return Objarr.messageImageName === null ? (
                <View key={index} style={styles.chatBlock}>
                  <Text>
                    {
                      //Objarr.writeAt
                    }
                  </Text>
                  <View style={styles.ChatMsgBox}>
                    <Text style={styles.ChatMsg}>{Objarr.message}</Text>
                  </View>
                </View>
              ) : (
                <View key={index} style={styles.chatBlock}>
                  <AutoImage
                    source={{
                      uri: serverManager.getImageUri(Objarr.messageImageName),
                    }}
                    width={phonSize.getInstance().chartWidth * 0.69}
                    style={{
                      ...styles.ChatMsg_image,
                    }}
                    resizeMode="cover"
                  />
                </View>
              );
            })}
          </View>
          <View style={styles.ClogFinalInFoView}>
            <View style={styles.ClogFinalInFoView_ImageAndName}>
              <Image
                style={styles.ClogFinalInFoView_image}
                source={profilePic}
              />
              <Text style={styles.ClogFinalInFoView_Name}>데미</Text>
            </View>
            <View style={styles.ClogFinalInFoView_SimpleInFoView}>
              <Text style={styles.ClogFinalInFoView_SimpleInFoView_Text1}>
                시간은 정해져 있는데 하고 싶은 일이 넘쳐
              </Text>
              <Text style={styles.ClogFinalInFoView_SimpleInFoView_Text2}>
                하루하루가 여행
              </Text>
            </View>
            <View style={styles.ClogFinalInFoView_BackAndSubView}>
              <View
                onTouchStart={() => alert("처음으로")}
                style={styles.ClogFinalInFoView_BackAndSubView_Button}
              >
                <Text
                  style={styles.ClogFinalInFoView_BackAndSubView_Button_Text}
                >
                  처음으로
                </Text>
              </View>
              <View
                onTouchStart={() => alert("처음으로")}
                style={styles.ClogFinalInFoView_BackAndSubView_Button}
              >
                <Text
                  style={styles.ClogFinalInFoView_BackAndSubView_Button_Text}
                >
                  구독
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
        <View style={styles.titleStyle}>
          <View style={styles.title_all}>
            <View style={styles.titleOne}>
              <TouchableOpacity style={styles.titleOne_icon} onPress={backBtn}>
                <MaterialIcons
                  name="keyboard-backspace"
                  size={24}
                  color="white"
                />
              </TouchableOpacity>
            </View>
            <View style={styles.titleTwo}>
              <Text style={styles.title_catagory_Text}>카테고리 미설정</Text>
            </View>
            <View style={styles.titleThree}>
              <TouchableOpacity
                style={styles.titleThree_icon}
                onPress={GoToEdit}
              >
                <Entypo name="edit" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.titleThree_icon}>
                <MaterialIcons name="delete-outline" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  ) : (
    <View style={styles.appLoading}>
      <Text>Loading...</Text>
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
  bodyContent: {
    flex: 1,
    width: "100%",
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
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  titleOne: {
    justifyContent: "center",
    alignItems: "flex-start",
    flex: 1,
  },
  titleOne_icon: {
    marginHorizontal: 15,
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
    flexDirection: "row",
  },
  title_catagory_Text: {
    color: "white",
  },
  titleThree_icon: {
    marginHorizontal: 15,
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
  signView_image: {
    paddingHorizontal: 15,
    position: "absolute",
    right: 0,
    bottom: 0,
    left: 0,
    top: 0,
  },
  signView_mask: {
    paddingHorizontal: 15,
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    right: 0,
    bottom: 0,
    left: 0,
    top: 0,
  },
  ChatMsg_image: {
    padding: 10,
    backgroundColor: "#FEDE70",
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  chatBlock: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginVertical: 7,
  },
  ChatMsgBox: {
    maxWidth: "69%",
  },
  ChatMsg: {
    padding: 10,
    // backgroundColor: "#FEDE70",
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    borderColor: "#BFBFBF",
    borderWidth: 1,
    textAlign: "justify",

    lineHeight: 20,
  },
  ClogFinalInFoView: {
    width: "100%",
    height: sizeOfPhon.getInstance().chartHeight * 0.4,
    backgroundColor: "#F8F8F8",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
  },
  ClogFinalInFoView_ImageAndName: {
    margin: 10,
    alignItems: "center",
  },
  ClogFinalInFoView_image: {
    margin: 10,
    width: phonSize.getInstance().chartWidth * 0.216,
    height: phonSize.getInstance().chartWidth * 0.216,
    borderRadius: 50,
  },
  ClogFinalInFoView_Name: {
    fontSize: 22,
    color: "#0B0B0B",
    textAlign: "center",
  },
  ClogFinalInFoView_SimpleInFoView: {
    margin: 10,
  },
  ClogFinalInFoView_SimpleInFoView_Text1: {
    fontSize: 16,
    color: "#242424",
    textAlign: "center",
    margin: 2,
  },
  ClogFinalInFoView_SimpleInFoView_Text2: {
    color: "#818181",
    textAlign: "center",
    margin: 2,
  },
  ClogFinalInFoView_BackAndSubView: {
    width: "100%",
    margin: 10,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  ClogFinalInFoView_BackAndSubView_Button: {
    width: sizeOfPhon.getInstance().chartWidth * 0.2506,
    borderColor: "#E3E3E3",
    borderWidth: 2,
    alignItems: "center",
  },
  ClogFinalInFoView_BackAndSubView_Button_Text: {
    margin: 7,
    color: "#818181",
    textAlign: "center",
  },
  // ChatMsg_new: {
  //   paddingHorizontal: 10,
  //   backgroundColor: "#FEDE70",
  //   textAlign: "justify",
  // },
});

export default ClogScrollView;
