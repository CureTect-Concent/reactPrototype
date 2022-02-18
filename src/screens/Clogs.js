import { StatusBar } from "expo-status-bar";
import { darkTheme } from "../theme";
import clogImage from "../img/600.jpg";
import profilePic from "../img/profilePic.jpg";
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
  TouchableOpacity,
  Keyboard,
  Image,
} from "react-native";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import phonSize from "../component/sizeOfPhon";
import Text from "../component/defaultText";
import { Entypo, MaterialIcons, AntDesign } from "@expo/vector-icons";
import serverManager from "../serverManager";
const Clogs = ({ navigation }) => {
  console.log("CLOGS 페이지");
  const [noServer, setNoServer] = useState();
  const [loading, setLoading] = useState(false);
  const [CSCState, setCSCState] = useState(0);
  const [saveClogs, setSaveClogs] = useState([]);
  const [fisidhedClogs, setFisidhedClogs] = useState([]);

  useEffect(async () => {
    // const modelArr = [modelObj, modelObj, modelObj, modelObj]; //서버완료되기전에 테스트버전
    // setSaveClogs(modelArr);\

    if (loading === false) {
      setSaveClogs([]);
      setLoading(await getsetSaveClogs());
    }

    //serverManager.getChat();
  }, [loading]);
  const modelObj = {
    category: [],
    content: "프로토타입",
    saveChatId: "28b1ee46-bc0e-4db3-a86a-6e0ad0c873f0",
    saveChatImage: [],
    title: "오오",
    topMessages: ["수", "ㅊㄹ"],
    writeAt: "2022-01-19",
  };
  const isLoadingDone = () => {
    setLoading(false);
  };
  const getsetSaveClogs = async () => {
    try {
      const value = await serverManager.getChatRooms();
      const value2 = await serverManager.getContentMe();
      value2.contentResponses.map((value) => {
        console.log(value);
      });
      setSaveClogs(value);
      setFisidhedClogs(value2.contentResponses);
      return true;
    } catch (e) {
      // console.log(e);
    }

    // console.log(value);
  };

  const onNextView = (roomName, keyValue = "") => {
    if (roomName === "ClogScrollView") {
      navigation.navigate(roomName, {
        keyValue: keyValue,
        callBack: isLoadingDone,
      });
    } else {
      navigation.navigate(roomName, {
        keyValue: keyValue,
      });
    }
  };
  return loading ? (
    <View style={styles.container}>
      <View style={styles.topandmiddleView}>
        <View style={styles.headerStyle}></View>
        <View style={styles.topbarView}>
          <TouchableOpacity style={styles.topbarView_menu}>
            <AntDesign name="menu-fold" size={24} color="black" />
          </TouchableOpacity>
          <View>
            <Text></Text>
          </View>
        </View>
        <View style={styles.proView}>
          <View>
            <Image style={styles.proView_image} source={profilePic} />
          </View>
          <View style={styles.proView_TextPart}>
            <Text style={styles.proView_TextPart_Title}>굿맨</Text>
            <Text style={styles.proView_TextPart_intro1}>
              자동차가 만드는 라이프
            </Text>
            <Text style={styles.proView_TextPart_intro2}>
              차도 우리 인생의 일부입니다
            </Text>
          </View>
        </View>
        <View style={styles.proEditView}>
          <View style={styles.proEditView_subAndConecter}>
            <Text style={styles.proEditView_subAndConecter_Text}>
              {`135\n구독`}
            </Text>
            <Text
              style={styles.proEditView_subAndConecter_Text}
              s
            >{`4\n커넥터`}</Text>
          </View>
          <View style={styles.proEditView_proEdit}>
            <Text style={styles.proEditView_proEdit_Text}>프로필 편집</Text>
          </View>
        </View>
        <View style={styles.saveOrlookedView}>
          <View style={styles.saveOrlookedView_save_item}>
            <Text>❤</Text>
          </View>
          <View style={styles.saveOrlookedView_looked_item}>
            <Text>💌</Text>
          </View>
        </View>
        <View style={styles.ContentOrSaveOrCatagoryView}>
          <View
            onTouchStart={() => setCSCState((value) => (value = 0))}
            style={styles.ContentOrSaveOrCatagoryView_Item}
          >
            <Text
              style={{
                ...styles.ContentOrSaveOrCatagoryView_Text,
                color:
                  CSCState === 0
                    ? "#0B0B0B"
                    : styles.ContentOrSaveOrCatagoryView_Text.color,
              }}
            >
              컨텐츠
            </Text>
            <View
              style={{
                ...styles.ContentOrSaveOrCatagoryView_selecter,
                backgroundColor: CSCState === 0 ? "black" : null,
              }}
            ></View>
          </View>
          <View
            onTouchStart={() => setCSCState((value) => (value = 1))}
            style={styles.ContentOrSaveOrCatagoryView_Item}
          >
            <Text
              style={{
                ...styles.ContentOrSaveOrCatagoryView_Text,
                color:
                  CSCState === 1
                    ? "#0B0B0B"
                    : styles.ContentOrSaveOrCatagoryView_Text.color,
              }}
            >
              저장
            </Text>
            <View
              style={{
                ...styles.ContentOrSaveOrCatagoryView_selecter,
                backgroundColor: CSCState === 1 ? "black" : null,
              }}
            ></View>
          </View>
          <View
            onTouchStart={() => setCSCState((value) => (value = 2))}
            style={styles.ContentOrSaveOrCatagoryView_Item}
          >
            <Text
              style={{
                ...styles.ContentOrSaveOrCatagoryView_Text,
                color:
                  CSCState === 2
                    ? "#0B0B0B"
                    : styles.ContentOrSaveOrCatagoryView_Text.color,
              }}
            >
              카테고리
            </Text>
            <View
              style={{
                ...styles.ContentOrSaveOrCatagoryView_selecter,
                backgroundColor: CSCState === 2 ? "black" : null,
              }}
            ></View>
          </View>
        </View>
        <View style={styles.ScrollView}>
          <ScrollView>
            {(() => {
              switch (CSCState) {
                case 0:
                  return fisidhedClogs.map((value) => {
                    return (
                      <TouchableOpacity
                        onPress={() =>
                          onNextView("ChatLogView", value.contentId)
                        }
                      >
                        <View style={styles.ClogBlock}>
                          <View style={styles.TextViewOfClog}>
                            <Text style={styles.TextViewOfClog_Title}>
                              {value.title}
                            </Text>
                            <Text style={styles.TextViewOfClog_In_Text}>
                              {value.talks[0]}
                            </Text>
                            <Text style={styles.TextViewOfClog_In_Text}>
                              {value.talks[1]}
                            </Text>
                            <View style={styles.nameAndDate}>
                              <Text style={styles.TextViewOfClog_name}>
                                {true ? "굿맨" : ""}
                              </Text>
                              <Text style={styles.TextViewOfClog_date}>
                                {value.writeAt}
                              </Text>
                            </View>
                          </View>
                          <View style={styles.ImageViewOfClog}>
                            <Image
                              source={
                                value.contentImageName &&
                                value.contentImageName.length
                                  ? {
                                      uri: serverManager.getImageUri(
                                        value.contentImageName[0]
                                      ),
                                    }
                                  : clogImage
                              }
                              resizeMethod="auto"
                              style={styles.ImageViewOfClog_Image}
                              resizeMode="cover"
                            />
                          </View>
                          <TouchableOpacity
                            onPress={() =>
                              serverManager.contentOpen(value.contentId)
                            }
                          >
                            <Text>✅</Text>
                          </TouchableOpacity>
                        </View>
                        <View height={1} backgroundColor="#f4f4f4"></View>
                      </TouchableOpacity>
                    );
                  });
                case 1:
                  return saveClogs.map((value, index) => {
                    return (
                      <TouchableOpacity
                        key={value.saveChatId}
                        onPress={() =>
                          onNextView("ClogScrollView", value.saveChatId)
                        }
                      >
                        <View key={value.saveChatId} style={styles.ClogBlock}>
                          <View style={styles.TextViewOfClog}>
                            <Text style={styles.TextViewOfClog_Title}>
                              {value.title}
                            </Text>
                            <Text style={styles.TextViewOfClog_In_Text}>
                              {value.topMessages[1]}
                            </Text>
                            <Text style={styles.TextViewOfClog_In_Text}>
                              {value.topMessages[0]}
                            </Text>
                            <View style={styles.nameAndDate}>
                              <Text style={styles.TextViewOfClog_name}>
                                {false ? "굿맨" : ""}
                              </Text>
                              <Text style={styles.TextViewOfClog_date}>
                                {value.writeAt.replace(/-/gi, ".")}
                              </Text>
                            </View>
                          </View>
                          <View style={styles.ImageViewOfClog}>
                            <Image
                              source={
                                value.saveChatImage &&
                                value.saveChatImage.length
                                  ? {
                                      uri: serverManager.getImageUri(
                                        value.saveChatImage[0]
                                      ),
                                    }
                                  : clogImage
                              }
                              resizeMethod="auto"
                              style={styles.ImageViewOfClog_Image}
                              resizeMode="cover"
                            />
                          </View>
                        </View>
                        <View height={1} backgroundColor="#f4f4f4"></View>
                      </TouchableOpacity>
                    );
                  });
                  // return (
                  //   <TouchableOpacity
                  //     key="key값넣기"
                  //     onPress={() => onNextView("ClogScrollView")}
                  //   >
                  //     <View style={styles.ClogBlock}>
                  //       <View style={styles.TextViewOfClog}>
                  //         <Text style={styles.TextViewOfClog_Title}>
                  //           편집되기 전인 캐스퍼 2000만원주고 살만한가?
                  //         </Text>
                  //         <Text style={styles.TextViewOfClog_In_Text}>
                  //           캐스퍼 타고 다닌지 얼마됐어?
                  //         </Text>
                  //         <Text style={styles.TextViewOfClog_In_Text}>
                  //           이제 한달된 거 같은데?ㅋㅋ
                  //         </Text>
                  //         <View style={styles.nameAndDate}>
                  //           <Text style={styles.TextViewOfClog_name}>
                  //             {true ? "이름" : ""}
                  //           </Text>
                  //           <Text style={styles.TextViewOfClog_date}>
                  //             2022.04.22
                  //           </Text>
                  //         </View>
                  //       </View>
                  //       <View style={styles.ImageViewOfClog}>
                  //         <Text>🖼</Text>
                  //       </View>
                  //     </View>
                  //     <View height={1} backgroundColor="#f4f4f4"></View>
                  //   </TouchableOpacity>
                  // );
                  break;
                case 2:
                  return (
                    <View style={styles.ClogBlock}>
                      <View style={styles.TextViewOfClog}>
                        <Text style={styles.TextViewOfClog_Title}>
                          Loding...
                        </Text>
                      </View>
                    </View>
                  );
              }
            })()}
          </ScrollView>
        </View>
      </View>

      <View style={styles.botoomTapView}>
        <Text>🎪</Text>
        <Text>🖼</Text>
        <Text>👀</Text>
        <Text>⌚</Text>
        <Text>📝</Text>
      </View>
    </View>
  ) : (
    <View style={styles.appLoading}>
      <Text>Loading</Text>
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
    flex: 1,
  },
  topandmiddleView: {
    flex: 15,
    backgroundColor: "white",
    paddingHorizontal: 15,
  },
  headerStyle: {
    height: phonSize.getInstance().StatusBarHeight,
    backgroundColor: "white",
  },
  topbarView: {
    height: phonSize.getInstance().chartHeight * 0.0742,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row-reverse",
    justifyContent: "space-between",
  },
  topbarView_menu: {},
  proView: {
    //backgroundColor: "teal",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flex: 3,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  proView_image: {
    width: phonSize.getInstance().chartWidth * 0.216,
    height: phonSize.getInstance().chartWidth * 0.216,
    borderRadius: 50,
  },
  proView_TextPart: {
    alignItems: "flex-end",
  },
  proView_TextPart_Title: {
    fontSize: 24,
    marginBottom: 10,
    color: "#0B0B0B",
  },
  proView_TextPart_intro1: {
    fontSize: 17,
    color: "#242424",
  },
  proView_TextPart_intro2: {
    color: "#818181",
  },
  proEditView: {
    width: "100%",
    alignItems: "center",
    flex: 2,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  proEditView_subAndConecter: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  proEditView_subAndConecter_Text: {
    margin: 5,
    textAlign: "center",
    lineHeight: 20,
    color: "#818181",
  },
  proEditView_proEdit: {
    flex: 1,
    alignItems: "flex-end",
  },
  proEditView_proEdit_Text: {
    padding: 8,
    paddingHorizontal: 15,
    borderColor: "#E3E3E3",
    borderWidth: 1,
    textAlign: "center",
    color: "#818181",
  },
  saveOrlookedView: {
    //backgroundColor: "teal",
    width: "100%",
    alignItems: "center",
    flex: 2,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  saveOrlookedView_save_item: {
    flex: 1,
    height: phonSize.getInstance().chartHeight * 0.03817,
    marginRight: 10,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  saveOrlookedView_looked_item: {
    height: phonSize.getInstance().chartHeight * 0.03817,
    flex: 1,
    marginLeft: 10,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#B1B1B1",
    borderWidth: 1.5,
  },
  ContentOrSaveOrCatagoryView: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flex: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  ContentOrSaveOrCatagoryView_Item: {
    alignItems: "center",
  },
  ContentOrSaveOrCatagoryView_selecter: {
    width: phonSize.getInstance().chartWidth * 0.128,
    height: 3,
    marginTop: 5,
  },
  ContentOrSaveOrCatagoryView_Text: {
    fontSize: 20,
    color: "#B1B1B1",
  },
  ScrollView: {
    //backgroundColor: "rgba(1,1,1,0.1)",
    justifyContent: "center",
    flex: 9,
  },
  ClogBlock: {
    height: 111,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  TextViewOfClog: {
    flex: 5,
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  TextViewOfClog_Title: {
    color: "#242424",
    fontSize: 19,
    fontWeight: "600",
    paddingBottom: 5,
  },
  TextViewOfClog_In_Text: {
    color: "#696969",
  },
  TextViewOfClog_name: {
    color: "#176A68",
  },
  TextViewOfClog_date: {
    color: "#A8A8A8",
  },
  ImageViewOfClog: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  ImageViewOfClog_Image: {
    width: phonSize.getInstance().chartWidth * 0.2186,
    height: phonSize.getInstance().chartWidth * 0.2186,
  },
  nameAndDate: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginRight: 15,
    paddingTop: 5,
  },
  botoomTapView: {
    backgroundColor: "black",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,

    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default Clogs;
