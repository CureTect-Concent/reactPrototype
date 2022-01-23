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
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { getStatusBarHeight } from "react-native-status-bar-height";
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { Entypo, MaterialIcons, AntDesign } from "@expo/vector-icons";
import dataManager from "../dataManager";
import serverManager from "../serverManager";
import * as ImagePicker from "expo-image-picker";
import { dispatchCommand } from "react-native/Libraries/Renderer/implementations/ReactNativeRenderer-dev";

const StatusBarHeight =
  Platform.OS === "ios" ? getStatusBarHeight(true) : StatusBar.currentHeight;
const chartHeight = Dimensions.get("window").height;
const chartWidth = Dimensions.get("window").width;

const Chat = ({ route, navigation }) => {
  const { title } = route.params;

  const scrollViewRef = useRef();

  const [chats, setChats] = useState({});
  const [text, setText] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [plusBtn, setPlusBtn] = useState(false);
  const [keyb, setKeyb] = useState(false);
  const [image, setImage] = useState(null);

  useEffect(() => {
    scrollViewRef.current.scrollToEnd();
  }, [chats]);

  useEffect(async () => {
    //const value = await AsyncStorage.getItem(STORAGE_KEYBOARD_HEIGHT_KEY)
    const value = await dataManager.getValueForKeyBoardHeight();
    setKeyboardHeight(parseFloat(value));
  }, []);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", (e) => {
      setKeyb((pre) => true);
      handleSnapPress(1);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", (e) => {
      setKeyb((pre) => false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);
  useEffect(() => {
    if (plusBtn || keyb) {
      handleSnapPress(1);
    } else {
      handleSnapPress(0);
    }
  }, [keyb, plusBtn]);

  const onChangeText = (prev) => setText(prev);
  function leftPad(value) {
    if (value >= 10) {
      return value;
    }
    return `0${value}`;
  }
  function toStringByFormatting(source, delimiter = "-") {
    const year = source.getFullYear();
    const month = leftPad(source.getMonth() + 1);
    const day = leftPad(source.getDate());
    const hours = leftPad;
    return [year, month, day].join(delimiter);
  }
  function timestamp() {
    var today = new Date();
    today.setHours(today.getHours() + 9);
    return today.toISOString().replace("T", " ").substring(0, 19);
  }

  const getTime = (data) => {
    const now = new Date(JSON.parse(data));
    const hours = ("0" + (now.getHours() % 12)).slice(-2);
    const minutes = ("0" + now.getMinutes()).slice(-2);
    const tt = now.getHours() >= 12 ? "오후" : "오전";
    var timeString = tt + hours + ":" + minutes;
    return timeString;
  };

  const addChat = async () => {
    if (text === "" && image === null) {
      return;
    }
    // const nowTime = new Date();
    const nowTime = timestamp();
    //console.log(nowTime);
    // await setTime(getTime());
    const newChats = {
      ...chats,
      [Date.now()]: { text, time: nowTime, image },
    };
    setChats(newChats);
    setText("");
    setImage(null);
    //console.log(chats);
  };
  const sheetRef = useRef(null);
  // variables
  const snapPoints = useMemo(
    () => [chartHeight * 0.0572, chartHeight * 0.0572 + keyboardHeight + 25],
    [keyboardHeight]
  );
  // callbacks
  const handleSheetChange = useCallback((index) => {}, []);
  const handleSnapPress = useCallback((index) => {
    sheetRef.current?.snapToIndex(index);
  }, []);
  const handleClosePress = useCallback(() => {
    sheetRef.current?.close();
  }, []);
  //console.log(time);
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    console.log(result);

    if (!result.cancelled) {
      console.log("이미지파일좀 보러 드가자~");
      console.log(result);
      setImage(result);
    }
  };

  useEffect(() => {
    if (image !== null) addChat(image);
  }, [image]);

  const rebulidData = () => {
    const saveChatData = {
      chatLogMessageRequests: [],
      content: "프로토타입",
      contentBackgroundType: "FULL_SCREEN",
      title: title,
    };
    const Images = [];

    Object.keys(chats).map((key) => {
      if (chats[key].image === null) {
        saveChatData.chatLogMessageRequests.push({
          message: chats[key].text,
          messageType: "MESSAGE",
          writeAt: chats[key].time,
        });
      } else {
        saveChatData.chatLogMessageRequests.push({
          message: chats[key].text,
          messageType: "IMAGE",
          writeAt: chats[key].time,
        });

        // const imageData = new FormData();
        // imageData.append("images", {
        //   name: key,
        //   type: chats[key].image.type,
        //   uri: chats[key].image.uri,
        // });
        //Images.push(chats[key].image);
        const file = {
          name: chats[key].image.uri.split("/").pop(),
          type: chats[key].image.type,
          uri: chats[key].image.uri,
        };
        Images.push(file);
      }
    });
    console.log(Images);
    serverManager.saveChats(saveChatData, Images);
    // navigation.pop();
    // console.log(saveChatData);
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.headerStyle}></View>
      <View style={styles.titleStyle}>
        <View style={styles.title_all}>
          <View style={styles.titleOne}>
            <Text style={styles.titleTxt}>{title}</Text>
          </View>
          <TouchableOpacity onPress={rebulidData} style={styles.titleTwo}>
            <AntDesign name="logout" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.titleThree}>
            <AntDesign name="menu-fold" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View
        onTouchStart={() => setPlusBtn(() => false)}
        style={{ ...styles.ChatView }}
      >
        <ScrollView ref={scrollViewRef} style={styles.ScrollSty}>
          {Object.keys(chats).map((key) => {
            return (
              <View style={styles.chatBlock} key={key}>
                <Text style={styles.timeTxt}>
                  {
                    //getTime(chats[key].time).toString()
                    chats[key].time
                  }
                </Text>

                {chats[key].image !== null ? (
                  <Image
                    source={{ uri: chats[key].image.uri }}
                    style={{
                      ...styles.ChatMsg_image,
                      width:
                        chats[key].image.width > chartWidth * 0.69
                          ? "69%"
                          : chats[key].image.width,
                      height:
                        (chartWidth * 0.69 * chats[key].image.height) /
                        chats[key].image.width,
                    }}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.ChatMsgBox}>
                    <Text style={styles.ChatMsg}>{chats[key].text}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      </View>
      <View
        style={{
          ...styles.ChatBottombarSize,
          height:
            keyb || plusBtn
              ? keyboardHeight + 25 + chartHeight * 0.0572
              : chartHeight * 0.0572,
        }}
      >
        {/* <TouchableOpacity style={styles.chatBtnAdd}>
          <MaterialIcons name="add" size={24} color="#F6C109" />
        </TouchableOpacity>
        <TextInput
          blurOnSubmit={false}
          onChangeText={onChangeText}
          style={styles.ChatTextInput}
          placeholder="입력"
          value={text}
          onSubmitEditing={addChat}
        />
        <TouchableOpacity style={styles.chatBtnEmo}>
          <Entypo name="emoji-happy" size={24} color="#818181" />
        </TouchableOpacity> */}
      </View>
      <BottomSheet
        ref={sheetRef}
        snapPoints={snapPoints}
        onChange={handleSheetChange}
        handleComponent={null}
      >
        <View style={styles.ChatBottombar}>
          <TouchableOpacity
            style={styles.chatBtnAdd}
            onPress={() => {
              setPlusBtn(() => true);
              if (keyb) {
                Keyboard.dismiss();
              }
            }}
          >
            <MaterialIcons name="add" size={24} color="#F6C109" />
          </TouchableOpacity>
          <TextInput
            blurOnSubmit={false}
            onChangeText={onChangeText}
            style={styles.ChatTextInput}
            placeholder="입력"
            value={text}
            onSubmitEditing={addChat}
          />
          <TouchableOpacity style={styles.chatBtnEmo}>
            <Entypo name="emoji-happy" size={24} color="#818181" />
          </TouchableOpacity>
        </View>
        <BottomSheetView style={styles.bottomSheetView}>
          <View style={styles.bottomSheetView_1}>
            <TouchableOpacity onPress={pickImage}>
              <AntDesign name="picture" size={30} color="black" />
            </TouchableOpacity>
            <TouchableOpacity>
              <AntDesign name="camerao" size={30} color="black" />
            </TouchableOpacity>
            <TouchableOpacity>
              <AntDesign name="enviromento" size={30} color="black" />
            </TouchableOpacity>
            <TouchableOpacity>
              <AntDesign name="pushpino" size={30} color="black" />
            </TouchableOpacity>
          </View>
          <View style={styles.bottomSheetView_2}>
            <TouchableOpacity>
              <AntDesign name="picture" size={30} color="black" />
            </TouchableOpacity>
            <TouchableOpacity>
              <AntDesign name="picture" size={30} color="black" />
            </TouchableOpacity>
            <TouchableOpacity>
              <AntDesign name="picture" size={30} color="black" />
            </TouchableOpacity>
            <TouchableOpacity>
              <AntDesign name="picture" size={30} color="black" />
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};
const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EEEFF1",
    flex: 1,
  },
  titleTxt: {
    color: "#F6C109",
    marginLeft: 20,
    fontSize: 25,
  },
  titleStyle: {
    height: chartHeight * 0.0677,
    backgroundColor: "#000000E5",
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
  headerStyle: {
    height: StatusBarHeight,
    backgroundColor: "white",
  },
  ScrollSty: {
    paddingHorizontal: 5,
  },
  chatBlock: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  timeTxt: {
    color: "#979696",
    margin: 5,
  },
  ChatView: {
    flex: 12,
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
  },
  ChatMsg_image: {
    padding: 10,
    backgroundColor: "#FEDE70",
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    margin: 5,
  },
  ChatBottombarSize: {
    flexDirection: "row",
    backgroundColor: "teal",
    width: "100%",
    height: chartHeight * 0.0572,
    justifyContent: "center",
  },
  ChatBottombar: {
    flexDirection: "row",
    backgroundColor: "white",
    width: "100%",
    height: chartHeight * 0.0572,
    justifyContent: "center",
  },
  chatBtnAdd: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  chatBtnEmo: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  ChatTextInput: {
    flex: 6,
    fontSize: 18,
  },
  bottomSheetView: {
    flex: 1,
  },
  bottomSheetView_1: {
    justifyContent: "space-around",
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
  },
  bottomSheetView_2: {
    justifyContent: "space-around",
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
  },
});

export default Chat;
