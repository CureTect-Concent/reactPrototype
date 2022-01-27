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
import {
  Menu,
  MenuProvider,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { asin } from "react-native-reanimated";
//const str = `ㅇ\nㅇ\nㅇ\nㅇ\nㅇ\nㅇ`;

const ClogEditView = ({ route, navigation }) => {
  const { chatsObjTemp } = route.params;
  const [isReady, setIsReady] = useState(false);
  const [chatsObj, setChatsObj] = useState({});
  const [titleText, setTitleText] = useState("");
  const [categoryText, setCategoryText] = useState("");
  const [absenceText, setAbsenceText] = useState("");
  const [selectObj, setSelectObj] = useState();

  const textRef = React.useRef("");

  useEffect(() => {
    setChatsObj(chatsObjTemp);
    setTitleText(chatsObjTemp.contentResponse.title);
    console.log(chatsObjTemp);
    setIsReady(true);
  }, []);

  const backBtn = async () => {
    navigation.pop();
  };
  const onChangeTitle = (str) => {
    setTitleText(str.nativeEvent.text);
    //console.log(titleText);
  };
  const onChangeCategory = (str) => setCategoryText(str);
  const onChangeAbsence = (str) => setAbsenceText(str);
  const onSelectChatObj = (key) => {
    setSelectObj(key);
  };

  console.log("렌덜");
  //console.log(titleText);
  //console.log(selectObj);
  return isReady ? (
    <MenuProvider>
      <View onTouchStart={() => {}} style={styles.container}>
        <View style={styles.headerStyle}></View>
        <View style={styles.titleStyle}>
          <View style={styles.title_all}>
            <View style={styles.titleItem}>
              <TouchableOpacity onPress={backBtn}>
                <MaterialIcons
                  name="keyboard-backspace"
                  size={24}
                  color="#242424"
                />
              </TouchableOpacity>
            </View>
            <View style={styles.titleItem}>
              <Text style={styles.titleTwo_Text}>편집</Text>
            </View>
            <View style={styles.titleItem}>
              <TouchableOpacity style={styles.titleThree_icon}>
                <Entypo name="edit" size={24} color="#242424" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.bodyContent}>
          <ScrollView>
            <View style={styles.EditInFoTopView}>
              <View style={styles.EditInFoTopView_item}>
                <TextInput
                  onChange={onChangeCategory}
                  value={categoryText}
                  placeholder="카테고리 미설정"
                />
              </View>
              <View style={styles.EditInFoTopView_item}>
                <TextInput
                  placeholder="제목을 입력하세요"
                  value={titleText}
                  style={styles.titleTxt}
                  onChange={onChangeTitle}
                />
                <Text>🖼</Text>
              </View>
              <View style={styles.EditInFoTopView_item}>
                <TextInput
                  onChange={onChangeAbsence}
                  value={absenceText}
                  placeholder="부재를 입력하세요"
                />
              </View>
            </View>
            <View style={styles.ScrollSty}>
              {/* ------------------------------------------------- */}

              {/* ------------------------------------------------- */}
              {chatsObj.contentMessageResponses.map((Objarr, index) => {
                return Objarr.messageImageName === null ? (
                  <View key={index} style={styles.chatBlock}>
                    <Text>
                      {
                        //Objarr.writeAt
                      }
                    </Text>
                    <Menu
                      onOpen={() => onSelectChatObj(index)}
                      onClose={() => onSelectChatObj(-1)}
                    >
                      <MenuTrigger>
                        <View style={styles.ChatMsgBox}>
                          <Text style={styles.ChatMsg}>{Objarr.message}</Text>
                          {index === selectObj ? (
                            <View style={{ ...styles.SelectView }}></View>
                          ) : null}
                        </View>
                      </MenuTrigger>
                      <MenuOptions customStyles={optionsStyles}>
                        <MenuOption onSelect={() => {}}>
                          <MaterialIcons
                            name="message"
                            size={24}
                            color="black"
                          />
                        </MenuOption>

                        <MenuOption
                          onSelect={() => {}}
                          //disabled={true}]
                        >
                          <MaterialIcons
                            name="delete-outline"
                            size={24}
                            color="black"
                          />
                        </MenuOption>
                        <MenuOption onSelect={() => {}}>
                          <MaterialIcons
                            name="addchart"
                            size={24}
                            color="black"
                          />
                        </MenuOption>
                        <MenuOption onSelect={() => {}}>
                          <Entypo name="edit" size={24} color="#242424" />
                        </MenuOption>
                      </MenuOptions>
                    </Menu>
                  </View>
                ) : (
                  <View key={index} style={styles.chatBlock}>
                    <Menu
                      onOpen={() => onSelectChatObj(index)}
                      onClose={() => onSelectChatObj(-1)}
                    >
                      <MenuTrigger>
                        <View>
                          <AutoImage
                            source={{
                              uri: serverManager.getImageUri(
                                Objarr.messageImageName
                              ),
                            }}
                            width={phonSize.getInstance().chartWidth * 0.69}
                            style={{
                              ...styles.ChatMsg_image,
                            }}
                            resizeMode="cover"
                          />
                          {index === selectObj ? (
                            <View style={{ ...styles.SelectView }}></View>
                          ) : null}
                        </View>
                      </MenuTrigger>
                      <MenuOptions customStyles={optionsStyles}>
                        <MenuOption
                          onSelect={() => alert(`Save`)}
                          text="Save"
                        />
                        <MenuOption onSelect={() => alert(`Delete`)}>
                          <Text style={{ color: "red" }}>Delete</Text>
                        </MenuOption>

                        <MenuOption
                          onSelect={() => alert(`Not called`)}
                          disabled={true}
                          text="Disabled"
                        />
                      </MenuOptions>
                    </Menu>
                  </View>
                );
              })}
              {/* ------------------------------------------------- */}
            </View>
          </ScrollView>
        </View>
        <View style={styles.bottomEditViewStyle}>
          <View style={styles.bottomEdit_all}>
            <View style={styles.bottomEdit_item}>
              <Text>🖼</Text>
            </View>
            <View style={styles.bottomEdit_item}>
              <Text>💬</Text>
            </View>
            <View style={styles.bottomEdit_item}>
              <Text>🔳</Text>
            </View>
            <View style={styles.bottomEdit_item}>
              <Text>💱</Text>
            </View>
          </View>
        </View>
      </View>
    </MenuProvider>
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
    color: "#212121",
    fontSize: 20,
  },
  titleStyle: {
    height: sizeOfPhon.getInstance().chartHeight * 0.0677,
    backgroundColor: "white",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",

    borderBottomColor: "#f2f2f2",
    borderBottomWidth: 1,
  },
  title_all: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  titleItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  titleTwo_Text: {
    color: "#0B0B0B",
  },
  ScrollSty: {
    width: "100%",
    paddingHorizontal: 15,
  },
  EditInFoTopView: {
    height: sizeOfPhon.getInstance().chartHeight * 0.1653,
    justifyContent: "flex-end",
    marginBottom: 20,
  },
  EditInFoTopView_item: {
    flex: 1,
    borderBottomColor: "#f2f2f2",
    borderBottomWidth: 1,
    paddingHorizontal: 15,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  bottomEditViewStyle: {
    height: sizeOfPhon.getInstance().chartHeight * 0.0807,
    backgroundColor: "rgba(0, 0, 0, 0.95)",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomEdit_all: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  bottomEdit_item: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  ChatMsg_image: {
    padding: 10,
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
    maxWidth: sizeOfPhon.getInstance().chartWidth * 0.69,
  },
  ChatMsg: {
    padding: 10,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    textAlign: "justify",
    borderColor: "#BFBFBF",
    borderWidth: 1,

    lineHeight: 20,
  },
  SelectView: {
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.5)",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  SelectView_check: {
    flexDirection: "row",
    position: "relative",
    height: 50,
    width: 100,
    top: -10,
    left: -80,
    justifyContent: "space-around",
    alignItems: "center",
    position: "absolute",
    backgroundColor: "black",
  },
});

export default ClogEditView;

const optionsStyles = {
  optionsContainer: {
    width: 180,
    marginTop: -50,
    alignItems: "center",
  },
  optionsWrapper: {
    padding: 0,
    //backgroundColor: "purple",
    flexDirection: "row",
  },
  optionWrapper: {
    // backgroundColor: "yellow",
    margin: 5,
  },
  optionTouchable: {
    // underlayColor: "gold",
    activeOpacity: 70,
  },
  optionText: {
    //color: "brown",
  },
};
