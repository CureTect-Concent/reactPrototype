import React, {
  useCallback,
  useMemo,
  useRef,
  useEffect,
  useState,
  createRef,
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
  Animated,
  Image,
  runOnJS,
  TouchableWithoutFeedback,
  PanResponder,
  ImageBackground,
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
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import BottomSheet, {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { LinearGradient } from "expo-linear-gradient";
import { convertRange, normalizeValue } from "../utils";
import chroma from "chroma-js";
import backgroundImage from "../img/backgroundT.png";
import Draggable from "react-native-draggable";
import { Slider } from "@miblanchard/react-native-slider";
import * as ImagePicker from "expo-image-picker";
import { set } from "react-native-reanimated";
import { StackActions } from "@react-navigation/native";
//const str = `ㅇ\nㅇ\nㅇ\nㅇ\nㅇ\nㅇ`;
const POS_CENTER = "CENTER";
const POS_RIGHT = "RIGHT";
const DEFAULT_VALUE = 0;
let positionY;

const defaultProps = {
  onPress: null,
  saturation: 1,
  value: 1,
};

const addImage = [];
let beForChatObj = {};

const ClogEditView = ({ route, navigation }) => {
  const { chatsObjTemp } = route.params;
  const [isReady, setIsReady] = useState(false);
  const [lodingText, setLodingText] = useState("Loding");
  const [chatsObj, setChatsObj] = useState({});
  const [titleText, setTitleText] = useState("");
  const [categoryText, setCategoryText] = useState("");
  const [absenceText, setAbsenceText] = useState("");
  const [editObjText, setEditObjText] = useState("");
  const [editFocus, setEditFocus] = useState(-1);
  const [chatsObjIndex, setChatObjIndex] = useState(0);
  const [editItemRefs, setEditItemRefs] = useState([]);
  const [editTextMode, setEditTextMode] = useState(false);
  const [image, setImage] = useState(null);
  const [bgImage, setBgImage] = useState(null);
  const [titleBgImage, setTitleBgImage] = useState(null);

  //const [colorPickerValue, setColorPickerValue] = useState(1);

  const textRef = React.useRef("");
  const bottomSheetModalRef = useRef(null);
  const editScrollView = useRef(null);
  const editTextInputReference = useRef(null);

  const editText = false;
  const { value, saturation } = defaultProps;

  useEffect(() => {
    positionY = 0;
    beForChatObj = { ...chatsObjTemp };
    // console.log("서버에서 받아오기-------------------");
    // console.log(chatsObjTemp.contentMessageResponses);
    // console.log("서버에서 받아오기-------------------");
    setTitleText(chatsObjTemp.contentResponse.title);
    setAbsenceText(chatsObjTemp.contentResponse.dect);
    chatsObjTemp.contentMessageResponses.map((valueObj, index) => {
      chatsObjTemp.contentMessageResponses[index].position =
        valueObj.backgroundColor === null
          ? POS_RIGHT
          : valueObj.backgroundColor;
    });
    // console.log("새로고친후 -------------------");
    // console.log(chatsObjTemp.contentMessageResponses);
    // console.log("새로고친후-------------------");

    addChatsObj(chatsObjTemp);
    // console.log(chatsObjTemp.contentMessageResponses.length);
    setChatObjIndex(chatsObjTemp.contentMessageResponses.length);
    // console.log(chatsObjTemp);

    setIsReady(true);
  }, []);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", (e) => {
      //키보드 포커싱
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", (e) => {
      //키보드 언포커싱
      // console.log(chatsObj);
      cancelEditText();
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [editFocus]);

  useEffect(() => {
    let editViewLength =
      chatsObj.contentMessageResponses &&
      chatsObj.contentMessageResponses.length
        ? chatsObj.contentMessageResponses.length
        : 0;
    // console.log("리셋");
    // console.log(editViewLength);
    //console.log(chatsObj.contentMessageResponses);

    setEditItemRefs((editItemRefs) =>
      Array(editViewLength)
        .fill()
        .map((_, i) => editItemRefs[i] || createRef())
    );
  }, [chatsObj]);
  useEffect(() => {
    if (image !== null) addToMessage(image);
  }, [image]);
  useEffect(() => {
    if (!!bgImage) addToBackground(bgImage);
  }, [bgImage]);

  useEffect(() => {
    if (isReady === true && lodingText === "저장중") {
      setIsReady(false);
      setTimeout(() => {
        serverManager.contentOpen(chatsObj.contentResponse.contentId);
      }, 2000);
      setTimeout(() => {
        route.params.callBack();
        navigation.dispatch(StackActions.pop(2));
      }, 4000);
    }
  }, [isReady]);
  // useEffect(()=>{
  // },[colorPickPos])
  // useEffect(() => {
  //   if (selectObj > -1) {
  //     setEditFocus(selectObj);
  //   }
  // }, [selectObj]);

  const addChatsObj = (objs) => {
    objs.contentMessageResponses.map((obj, index) => {
      //편집하기위한 객체 재구성
      obj = {
        ...obj,
        editText: false,
        addToScreenChange: false,
        addToBackgroundImage: false,
        effectParent: null,
        thisParent: null,
        chatsObjIndex: index, //나의 고유한 키값인걸 알까? 이걸로 모든것에 키값이랄까...
      };
      objs.contentMessageResponses[index] = obj;
      // console.log("객체 편집");
      // console.log(obj);
    });
    setChatsObj(objs);
  };
  const backBtn = async () => {
    navigation.pop();
  };
  const onChangeTitle = (str) => {
    setTitleText(str.nativeEvent.text);
    //console.log(titleText);
  };
  const onChangeCategory = (str) => setCategoryText(str);
  const onChangeAbsence = (str) => setAbsenceText(str.nativeEvent.text);
  const onChangeEditText = (payload) => setEditObjText(payload);
  // const onSelectChatObj = (key) => {
  //   setSelectObj(key);
  // };
  const onEditChatObj = () => {
    const newChatsObj = { ...chatsObj };
    newChatsObj.contentMessageResponses[editFocus].editText = true;
    setEditObjText(newChatsObj.contentMessageResponses[editFocus].message);
    setChatsObj(newChatsObj);
  };
  const cancelEditText = () => {
    // console.log(chatsObj);
    if (
      editTextInputReference.current &&
      !editTextInputReference.current.isFocused()
    ) {
      EditToMessage();
      //setEditObjText("")
    }
  };
  const EditToMessage = () => {
    const newChatsObj = { ...chatsObj };
    // console.log(editFocus);
    // console.log(newChatsObj.contentMessageResponses[editFocus]);
    newChatsObj.contentMessageResponses[editFocus].editText = false;
    newChatsObj.contentMessageResponses[editFocus].message =
      editObjText === ""
        ? newChatsObj.contentMessageResponses[editFocus].message
        : editObjText;
    //setEditFocus();
    setEditObjText("");
    setChatsObj(newChatsObj);
  };

  const addToMessage = () => {
    const newChatsObj = { ...chatsObj };
    const cloneObj = { ...newChatsObj.contentMessageResponses[editFocus] };
    if (image === null) {
      cloneObj.editText = true;
      cloneObj.editText = true;
      cloneObj.message = "";
      cloneObj.isResizing = false;
      cloneObj.messageImageName = null;
      cloneObj.messageType = "MESSAGE";
    } else {
      cloneObj.editText = false;
      cloneObj.message = "사진을 보냈습니다";
      cloneObj.messageImageName = image;
      cloneObj.messageType = "IMAGE";
    }
    cloneObj.backgroundImage = "";
    cloneObj.backgroundType = false;
    cloneObj.transformScreen = false;
    cloneObj.chatsObjIndex = chatsObjIndex;
    cloneObj.effectParent = null;
    if (cloneObj.messageId > 0) {
      cloneObj.thisParent = cloneObj.messageId;
      cloneObj.messageId = -1;
    }

    newChatsObj.contentMessageResponses.splice(
      editFocus +
        (1 +
          (cloneObj.addToScreenChange ? 1 : 0) +
          (cloneObj.addToBackgroundImage ? 1 : 0)),
      0,
      cloneObj
    );

    // console.log("-----------체크------------------------");
    // console.log(editFocus);
    // console.log("------------체크-----------------------");

    setEditFocus(
      editFocus +
        (1 +
          (cloneObj.addToScreenChange ? 1 : 0) +
          (cloneObj.addToBackgroundImage ? 1 : 0))
    );
    const foucsTemp =
      editFocus +
      (1 +
        (cloneObj.addToScreenChange ? 1 : 0) +
        (cloneObj.addToBackgroundImage ? 1 : 0));
    newChatsObj.contentMessageResponses[foucsTemp].addToScreenChange = false;

    newChatsObj.contentMessageResponses[foucsTemp].addToBackgroundImage = false;

    setChatsObj(newChatsObj);
    setChatObjIndex((num) => (num += 1));
    setImage(null);
    // console.log("-----------------------------------");
    // console.log(editFocus);
    // console.log(newChatsObj);
    // console.log("-----------------------------------");
    // console.log(editFocus);
    //if()
  };

  const screenChange = () => {
    const newChatsObj = { ...chatsObj };
    newChatsObj.contentMessageResponses[editFocus].transformScreen = true;
    setChatsObj(newChatsObj);
    // if (!newChatsObj.contentMessageResponses[editFocus].addToScreenChange) {
    //   const cloneObj = { ...newChatsObj.contentMessageResponses[editFocus] };
    //   //cloneObj.addToScreenChange
    //   cloneObj.editText = false;
    //   cloneObj.message = "화면 전환";
    //   cloneObj.transformScreen = true;
    //   cloneObj.effectParent = cloneObj.chatsObjIndex;
    //   cloneObj.chatsObjIndex = null;
    //   if (cloneObj.messageId > 0) {
    //     cloneObj.thisParent = cloneObj.messageId;
    //     cloneObj.messageId = -1;
    //   }
    //   newChatsObj.contentMessageResponses.splice(
    //     editFocus +
    //       (1 +
    //         (cloneObj.addToBackgroundImage ? 1 : 0) +
    //         (cloneObj.addToScreenChange ? 1 : 0)),
    //     0,
    //     cloneObj
    //   );
    //   cloneObj.addToScreenChange = false;
    //   newChatsObj.contentMessageResponses[editFocus].addToScreenChange = true;
    //   setChatsObj(newChatsObj);
    //   // console.log(
    //   //   newChatsObj.contentMessageResponses[editFocus].addToScreenChange
    //   // );
    //   // console.log(editFocus);
    // } else {
    // }
  };

  const addToBackground = async (bgValue) => {
    const newChatsObj = { ...chatsObj };
    newChatsObj.contentMessageResponses[editFocus].backgroundImage = bgValue;
    newChatsObj.contentMessageResponses[editFocus].backgroundType = true;
    // if (!newChatsObj.contentMessageResponses[editFocus].addToBackgroundImage) {
    //   const cloneObj = { ...newChatsObj.contentMessageResponses[editFocus] };
    //   //cloneObj.addToScreenChange
    //   cloneObj.editText = false;
    //   cloneObj.message = "전체 화면";
    //   //cloneObj.backgroundImage = cloneObj.addToScreenChange + 1;
    //   cloneObj.effectParent = cloneObj.chatsObjIndex;

    //   cloneObj.chatsObjIndex = null;
    //   if (cloneObj.messageId > 0) {
    //     cloneObj.thisParent = cloneObj.messageId;
    //     cloneObj.messageId = -1;
    //   }
    //   cloneObj.messageImageName = null;
    //   cloneObj.backgroundImage = bgValue;
    //   // console.log("____________________");
    //   // console.log(cloneObj.backgroundImage);
    //   // console.log("____________________");
    //   newChatsObj.contentMessageResponses.splice(
    //     editFocus +
    //       (1 +
    //         (cloneObj.addToBackgroundImage ? 1 : 0) +
    //         (cloneObj.addToScreenChange ? 1 : 0)),
    //     0,
    //     cloneObj
    //   );
    //   cloneObj.addToBackgroundImage = false;
    //   newChatsObj.contentMessageResponses[
    //     editFocus
    //   ].addToBackgroundImage = true;
    //   setChatsObj(newChatsObj);
    // } else {
    // }
    setBgImage(null);

    //console.log(newChatsObj.contentMessageResponses[editFocus].addToScreenChange);
    //console.log(editFocus);
  };

  const deleteScreenChange = (index) => {
    const newChatsObj = { ...chatsObj };
    newChatsObj.contentMessageResponses[editFocus].transformScreen = false;
    //console.log(newChatsObj.contentMessageResponses[editFocus].transformScreen);
    setChatsObj(newChatsObj);

    // const cloneObj = { ...newChatsObj.contentMessageResponses[index] };
    // //console.log("데이터검증");

    // const result = newChatsObj.contentMessageResponses.filter(
    //   (findEffectParent, index) => {
    //     // console.log(index);
    //     return cloneObj.effectParent === findEffectParent.chatsObjIndex;
    //   }
    // );
    // const tempIndex = newChatsObj.contentMessageResponses.indexOf(result[0]);
    // !isBackOrChange
    //   ? (newChatsObj.contentMessageResponses[
    //       tempIndex
    //     ].addToBackgroundImage = false)
    //   : (newChatsObj.contentMessageResponses[
    //       tempIndex
    //     ].addToScreenChange = false);
    // newChatsObj.contentMessageResponses.splice(index, 1);
    // setChatsObj(newChatsObj);
  };
  const deleteBgImg = (index) => {
    const newChatsObj = { ...chatsObj };
    newChatsObj.contentMessageResponses[editFocus].backgroundImage = "";
    newChatsObj.contentMessageResponses[editFocus].backgroundType = false;
    setChatsObj(newChatsObj);
  };

  const deleteMSG = (index) => {
    const newChatsObj = { ...chatsObj };
    const cloneObj = { ...newChatsObj.contentMessageResponses[index] };
    if (cloneObj.messageId > 0) {
      const result = newChatsObj.contentMessageResponses.filter(
        (findEffectParent, index) => {
          // console.log(index);
          return cloneObj.messageId === findEffectParent.thisParent;
        }
      );
      // console.log("----------몇개 만들었나 ㅋ----------------");
      // console.log(result.length);
      // console.log("--------------------------");
      newChatsObj.contentMessageResponses.splice(index, 1 + result.length);
    } else {
      newChatsObj.contentMessageResponses.splice(
        index,
        1 +
          (newChatsObj.contentMessageResponses[index].addToScreenChange
            ? 1
            : 0) +
          (newChatsObj.contentMessageResponses[index].addToBackgroundImage
            ? 1
            : 0)
      );
    }
    setChatsObj(newChatsObj);
    setEditFocus(-1);

    //console.log(newChatsObj.contentMessageResponses);
  };

  const editPosition = (pos, index) => {
    const newChatsObj = { ...chatsObj };
    newChatsObj.contentMessageResponses[index].position = pos;
    // console.log(newChatsObj);
    setChatsObj(newChatsObj);
  };
  const editTextColor = (color) => {
    //console.log(color);
    const newChatsObj = { ...chatsObj };
    newChatsObj.contentMessageResponses[editFocus].textColor = color;
    setChatsObj(newChatsObj);
  };

  const editImageResizing = (index) => {
    const newChatsObj = { ...chatsObj };
    if (!newChatsObj.contentMessageResponses[index].isResizing) {
      newChatsObj.contentMessageResponses[index].isResizing = true;
      newChatsObj.contentMessageResponses[index].position = POS_CENTER;
      newChatsObj.contentMessageResponses[index].width = 1;
    } else {
      newChatsObj.contentMessageResponses[index].isResizing = false;
      newChatsObj.contentMessageResponses[index].position = null;
      newChatsObj.contentMessageResponses[index].width = 0;
    }

    setChatsObj(newChatsObj);
  };
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleClosePress = useCallback(() => {
    bottomSheetModalRef.current?.close();
  }, []);

  const showCurrent = () => {
    editScrollView.scrollTo();
  };

  const onPressAndFocus = (index) => {
    setEditTextMode(true);
    handlePresentModalPress();
    editItemRefs[index].current.measure((fx, fy, width, height, px, py) => {
      // console.log("Component width is: " + width);
      // console.log("Component height is: " + height);
      // console.log("X offset to page: " + px);
      // console.log("Y offset to page: " + py);
      // console.log("Y Height: " + sizeOfPhon.getInstance().chartHeight);
      // console.log("positionY: " + positionY);

      py - sizeOfPhon.getInstance().chartHeight * 0.65 > 0
        ? editScrollView.current.scrollTo({
            y: py - sizeOfPhon.getInstance().chartHeight * 0.6 + positionY,
          })
        : null;
      // console.log(
      //   "크기비교: " +
      //     (py - sizeOfPhon.getInstance().chartHeight * 0.7 + positionY)
      // );
    });
  };
  function handleScroll(event) {
    positionY = event.nativeEvent.contentOffset.y;
    // console.log(positionY);
  }

  const editAddTexts = () => {
    const TextMessageJson = {
      addMessageRequests: [
        {
          messageId: messageId,
          transformScreen: false,
          position: "BOTTOM_RIGHT",
          textColor: "", //텍스트색이 없을 경우 ""빈값
          text: "추가테스트", //수정 안했을시 기존 내용 그대로
          backgroundColor: "", //없거나 이미지일경우 ""빈값
          alpha: "1.0",
          messageColor: "", //말풍선 색깔
          backgroundType: "DEFAULT", //IMAGE, COLOR, DEFAULT
        },
      ],
    };
  };

  //
  const getColorValue = (ColorValue, alphaValue) => {
    const newChatsObj = { ...chatsObj };
    // console.log("들어온값 패까보자");
    // console.log(ColorValue.includes("#"));
    // console.log(ColorValue.slice(1));
    newChatsObj.contentMessageResponses[editFocus].messageColor =
      ColorValue.slice(1);
    newChatsObj.contentMessageResponses[editFocus].alpha = alphaValue;
    // console.log(newChatsObj);
    //console.log(newChatsObj.contentMessageResponses[editFocus].backgroundColor);
    setChatsObj(newChatsObj);
    //setColorValue(ColorValue);
  };
  const imagePick = () => {
    let result = ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      //allowsEditing: true,
      quality: 0.38,
    });
    return result;
  };

  const addToImage = async () => {
    let result = await imagePick();
    if (!result.cancelled) {
      // console.log("이미지파일좀 보러 드가자~");
      //console.log(result);
      setImage(result);
    }
  };
  const addToBgImage = async () => {
    let result = await imagePick();
    if (!result.cancelled) {
      // console.log("배경 이미지파일좀 보러 드가자~");
      // console.log(result);
      setBgImage(result);
    }
  };
  const addToTitleBgImage = async () => {
    let result = await imagePick();
    // console.log(result);
    if (!result.cancelled) {
      //  console.log("배경 이미지파일좀 보러 드가자~");
      //  console.log(result);
      setTitleBgImage(result);
    }
  };
  const showValueBaby = (e) => {
    //  console.log(e);
  };

  const MeMoEditColorPick = React.memo(
    ({ editTextColor, editPosition, onChangeColor, ObjColor, alphaValue }) => {
      const [colorPickHue, setColorPickHue] = useState(0);
      const [colorPickAlpha, setColorPickAlpha] = useState(1);
      const [colorPickPos, setColorPickPos] = useState({ x: 0, y: 1 });
      const [isColorChange, setIsColorChange] = useState(false);
      const pan = useRef(new Animated.ValueXY()).current;
      useEffect(() => {
        if (!!ObjColor) {
          // console.log("----------흠.-------");
          // console.log(chroma(ObjColor).get("hsl.h"));
          // // console.log(chroma(ObjColor).get("hsl.l"));
          // console.log("-----------------");
          let tempX = convertRange(
            chroma(ObjColor).get("hsv.s"),
            [0, 1],
            [0, sizeOfPhon.getInstance().chartWidth * 0.3333]
          );
          let tempY = convertRange(
            1 - chroma(ObjColor).get("hsv.v"),
            [0, 1],
            [0, sizeOfPhon.getInstance().chartWidth * 0.4106]
          );
          setColorPickPos({
            x: chroma(ObjColor).get("hsv.s"),
            y: chroma(ObjColor).get("hsv.v"),
          });
          if (isNaN(chroma(ObjColor).get("hsv.h"))) {
            // console.log("----------흠!-------");
            setColorPickHue(0);
          } else {
            setColorPickHue(chroma(ObjColor).get("hsv.h"));
          }
          pan.setOffset({
            x: tempX,
            y: tempY,
          });
          pan.flattenOffset();
        }
        if (!!alphaValue) {
          setColorPickAlpha(alphaValue);
        }
      }, []);
      useEffect(() => {
        if (isColorChange) {
          onChangeColor(
            chroma
              .hsv(colorPickHue, colorPickPos.x, colorPickPos.y)
              .alpha(colorPickAlpha)
              .hex(),
            colorPickAlpha
          );
        }
        setIsColorChange(false);
      }, [isColorChange]);

      const panResponder = useRef(
        PanResponder.create({
          onStartShouldSetPanResponder: () => {
            pan.setOffset({
              x: pan.x,
              y: pan.y,
            });
          },
          onMoveShouldSetPanResponder: () => true,
          onPanResponderGrant: () => {
            pan.setOffset({
              x:
                pan.x._value > sizeOfPhon.getInstance().chartWidth * 0.3333
                  ? sizeOfPhon.getInstance().chartWidth * 0.3333
                  : pan.x._value < 0
                  ? 0
                  : pan.x._value,
              y:
                pan.y._value > sizeOfPhon.getInstance().chartWidth * 0.4106
                  ? sizeOfPhon.getInstance().chartWidth * 0.4106
                  : pan.y._value < 0
                  ? 0
                  : pan.y._value,
            });
          },
          onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
            useNativeDriver: false,
          }),
          onPanResponderEnd: () => {
            //console.log();
            getCurrentColor(pan.x, pan.y);
          },
          onPanResponderRelease: () => {
            pan.flattenOffset();
          },
        })
      ).current;
      const getCurrentColor = (x, y) => {
        let tempX = Math.min(
          Math.max(parseFloat(JSON.stringify(x)), 0),
          sizeOfPhon.getInstance().chartWidth * 0.3333
        );
        let tempY = Math.min(
          Math.max(parseFloat(JSON.stringify(y)), 0),
          sizeOfPhon.getInstance().chartWidth * 0.4106
        );
        tempX = convertRange(
          tempX,
          [0, sizeOfPhon.getInstance().chartWidth * 0.3333],
          [0, 1]
        );
        tempY = convertRange(
          tempY,
          [0, sizeOfPhon.getInstance().chartWidth * 0.4106],
          [0, 1]
        );
        setIsColorChange(true);

        setColorPickPos({ x: tempX, y: 1 - tempY });
      };
      const colorArray = [
        "#FFFFFF",
        "#929292",
        "#34A853",
        "#FBBC04",
        "#FF6D01",
        "#4285F4",
        "#00F0FF",
        "#A44AEB",
        "#FF8686",
        "#57FFD7",
      ];
      return (
        <View style={styles.EditModeView}>
          <View style={styles.ColorShowBox}>
            <LinearGradient
              colors={["#fff", chroma.hsl(colorPickHue, 1, 0.5).hex()]}
              start={[0, 0.5]}
              end={[1, 0.5]}
            >
              <LinearGradient colors={["rgba(0, 0, 0, 0)", "#000"]}>
                <View
                  style={{
                    width: sizeOfPhon.getInstance().chartWidth * 0.3333,
                    height: sizeOfPhon.getInstance().chartWidth * 0.4106,
                    borderRadius: 40,
                  }}
                >
                  <Animated.View
                    onTouchEnd={(e) => {
                      setIsColorChange(true);
                    }}
                    style={[
                      {
                        top: -15,
                        left: -15,
                        position: "absolute",
                        borderColor: "grey",
                      },
                      {
                        width: 30,
                        height: 30,
                        borderRadius: 30 / 1,
                        borderWidth: 30 / 10,
                        backgroundColor: chroma
                          .hsv(colorPickHue, colorPickPos.x, colorPickPos.y)
                          .hex(),
                        transform: [
                          {
                            translateX: pan.x.interpolate({
                              inputRange: [
                                0,
                                sizeOfPhon.getInstance().chartWidth * 0.3333,
                              ],
                              outputRange: [
                                0,
                                sizeOfPhon.getInstance().chartWidth * 0.3333,
                              ],
                              extrapolate: "clamp",
                            }),
                          },
                          {
                            translateY: pan.y.interpolate({
                              inputRange: [
                                0,
                                sizeOfPhon.getInstance().chartWidth * 0.4106,
                              ],
                              outputRange: [
                                0,
                                sizeOfPhon.getInstance().chartWidth * 0.4106,
                              ],
                              extrapolate: "clamp",
                            }),
                          },
                        ],
                      },
                    ]}
                    {...panResponder.panHandlers}
                  ></Animated.View>
                </View>
              </LinearGradient>
            </LinearGradient>
          </View>
          <View style={styles.ColorPickerView}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View>
                <LinearGradient
                  colors={[
                    "#ff0000",
                    "#ffff00",
                    "#00ff00",
                    "#00ffff",
                    "#0000ff",
                    "#ff00ff",
                    "#ff0000",
                  ]}
                  start={[0, 0.5]}
                  end={[1, 0.5]}
                  style={{
                    borderRadius: 20,
                    width: sizeOfPhon.getInstance().chartWidth * 0.448,
                  }}
                >
                  <View
                    style={{
                      width: sizeOfPhon.getInstance().chartWidth * 0.448 + 20,
                      height: 20,
                      justifyContent: "center",
                    }}
                    onTouchEnd={() => {
                      onChangeColor(
                        chroma
                          .hsv(colorPickHue, colorPickPos.x, colorPickPos.y)
                          .alpha(colorPickAlpha)
                          .hex(),
                        colorPickAlpha
                      );
                    }}
                  >
                    <Slider
                      maximumTrackTintColor={"rgba(0,0,0,0)"}
                      minimumTrackTintColor={"rgba(0,0,0,0)"}
                      thumbTouchSize={{ width: 60, height: 60 }}
                      maximumValue={359}
                      value={colorPickHue}
                      onValueChange={(e) => setColorPickHue(e[0])}
                      renderThumbComponent={() => (
                        <View
                          style={{
                            left: -10,
                            width: 20,
                            height: 20,
                            borderRadius: 30 / 1,
                            borderWidth: 30 / 10,
                            // backgroundColor: chroma
                            //   .hsl(colorPickHue, 1, 0.5)
                            //   .hex(),
                          }}
                        ></View>
                      )}
                    />
                  </View>
                </LinearGradient>
                <View style={{ marginTop: 10 }}>
                  <Image
                    style={{
                      width: sizeOfPhon.getInstance().chartWidth * 0.448,
                      height: 20,
                      borderRadius: 20,
                    }}
                    source={backgroundImage}
                  />
                  <LinearGradient
                    colors={["rgba(1,1,1,0)", "#ffffff"]}
                    start={[0, 0.5]}
                    end={[0.7, 0.5]}
                    style={{
                      borderRadius: 20,
                      position: "absolute",
                      width: sizeOfPhon.getInstance().chartWidth * 0.448,
                    }}
                  >
                    <View
                      style={{
                        width: sizeOfPhon.getInstance().chartWidth * 0.448 + 20,
                        height: 20,
                        borderRadius: 20,
                        justifyContent: "center",
                      }}
                      onTouchEnd={() => {
                        onChangeColor(
                          chroma
                            .hsv(colorPickHue, colorPickPos.x, colorPickPos.y)
                            .alpha(colorPickAlpha)
                            .hex(),
                          colorPickAlpha
                        );
                      }}
                    >
                      <Slider
                        maximumTrackTintColor={"rgba(0,0,0,0)"}
                        minimumTrackTintColor={"rgba(0,0,0,0)"}
                        thumbTouchSize={{ width: 60, height: 60 }}
                        maximumValue={1}
                        minimumValue={-0.1}
                        value={colorPickAlpha}
                        onValueChange={(e) => {
                          setColorPickAlpha(e[0]);
                        }}
                        renderThumbComponent={() => (
                          <View
                            style={{
                              left: -10,
                              width: 20,
                              height: 20,
                              borderRadius: 30 / 1,
                              borderWidth: 30 / 10,
                              backgroundColor: "white",
                            }}
                          ></View>
                        )}
                      />
                    </View>
                  </LinearGradient>
                </View>
              </View>
              <TouchableOpacity
              // onPress={() => {
              //   onChangeColor(
              //     chroma
              //       .hsv(colorPickHue, colorPickPos.x, colorPickPos.y)
              //       .alpha(colorPickAlpha)
              //       .hex(),
              //     colorPickAlpha
              //   );
              // }}
              >
                <ImageBackground
                  style={{
                    width: sizeOfPhon.getInstance().chartWidth * 0.128,
                    height: sizeOfPhon.getInstance().chartWidth * 0.128,
                    marginHorizontal: 5,
                  }}
                  imageStyle={{ borderRadius: 10 }}
                  source={backgroundImage}
                >
                  <View
                    style={{
                      position: "absolute",
                      width: sizeOfPhon.getInstance().chartWidth * 0.128,
                      height: sizeOfPhon.getInstance().chartWidth * 0.128,
                      backgroundColor: chroma
                        .hsv(colorPickHue, colorPickPos.x, colorPickPos.y)
                        .alpha(colorPickAlpha)
                        .hex(),
                      borderRadius: 10,
                    }}
                  ></View>
                </ImageBackground>
              </TouchableOpacity>
            </View>

            <View
              style={{
                flexDirection: "row",
              }}
            >
              {colorArray.map((colorValue, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      backgroundColor: colorValue,
                      marginHorizontal: 1.5,
                      width: sizeOfPhon.getInstance().chartWidth * 0.0506,
                      height: sizeOfPhon.getInstance().chartWidth * 0.0506,
                      borderRadius: 10,
                    }}
                  ></View>
                );
              })}
            </View>
            <View
              style={{
                flexDirection: "row",
                width: "100%",
              }}
            >
              <Text style={{ color: "white" }}>텍스트 색상</Text>
              <TouchableOpacity onPress={() => editTextColor("black")}>
                <View
                  style={{
                    backgroundColor: "black",
                    marginHorizontal: 1.5,
                    width: sizeOfPhon.getInstance().chartWidth * 0.0506,
                    height: sizeOfPhon.getInstance().chartWidth * 0.0506,
                    borderRadius: 5,
                  }}
                >
                  {/* <View
                    flex={1}
                    borderWidth={1}
                    borderColor={"yellow"}
                    borderRadius={5}
                  ></View> */}
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => editTextColor("white")}>
                <View
                  style={{
                    backgroundColor: "white",
                    marginHorizontal: 1.5,
                    width: sizeOfPhon.getInstance().chartWidth * 0.0506,
                    height: sizeOfPhon.getInstance().chartWidth * 0.0506,
                    borderRadius: 5,
                  }}
                ></View>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                width: "100%",
              }}
            >
              <Text style={{ color: "white" }}>말풍선 정렬</Text>

              <TouchableOpacity
                onPress={() => editPosition(POS_CENTER, editFocus)}
              >
                <View
                  style={{
                    backgroundColor: "white",
                    marginHorizontal: 1.5,
                    width: sizeOfPhon.getInstance().chartWidth * 0.0506,
                    height: sizeOfPhon.getInstance().chartWidth * 0.0506,
                    borderRadius: 5,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MaterialIcons
                    name="format-align-justify"
                    size={sizeOfPhon.getInstance().chartWidth * 0.0506 - 4}
                    color="black"
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => editPosition(POS_RIGHT, editFocus)}
              >
                <View
                  style={{
                    backgroundColor: "white",
                    marginHorizontal: 1.5,
                    width: sizeOfPhon.getInstance().chartWidth * 0.0506,
                    height: sizeOfPhon.getInstance().chartWidth * 0.0506,
                    borderRadius: 5,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MaterialIcons
                    name="format-align-right"
                    size={sizeOfPhon.getInstance().chartWidth * 0.0506 - 4}
                    color="black"
                  />
                  {/* <View
                    style={{
                      borderColor: "yellow",
                      position: "absolute",
                      borderWidth: 1,
                      width: sizeOfPhon.getInstance().chartWidth * 0.0506,
                      height: sizeOfPhon.getInstance().chartWidth * 0.0506,
                      borderRadius: 5,
                    }}
                  ></View> */}
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }
  );

  const saveChatObjToServer = async () => {
    setIsReady(false);
    setLodingText("저장중");
    // console.log(beForChatObj.contentMessageResponses);
    // console.log(chatsObj.contentMessageResponses);

    let Images = [];
    let BgImages = [];
    let saveTempId = 0;
    let ChatMessageJson = { editAllRequest: [] };

    chatsObj.contentMessageResponses.map((valueObj, index) => {
      if (
        valueObj.messageType === "IMAGE" &&
        valueObj.messageImageName instanceof Object
      ) {
        Images.push(valueObj.messageImageName);
      }
      if (valueObj.backgroundType === true) {
        BgImages.push(valueObj.backgroundImage);
      }
      ChatMessageJson.editAllRequest.push({
        backgroundImageName:
          valueObj.backgroundType === true || valueObj.backgroundImage === null
            ? ""
            : valueObj.backgroundImage,
        backgroundType:
          valueObj.backgroundType === true ||
          valueObj.backgroundType === "IMAGE"
            ? true
            : false,
        transformScreen: valueObj.transformScreen,
        position: "BOTTOM_" + valueObj.position,
        messageType: valueObj.messageType,
        message: valueObj.message,
        messageImageName:
          !valueObj.messageImageName ||
          valueObj.messageImageName instanceof Object
            ? ""
            : valueObj.messageImageName,
        messageColor:
          valueObj.messageColor === "" ? "ffffff" : valueObj.messageColor,
        textColor: valueObj.textColor === "" ? "#000000" : valueObj.textColor,
        alpha: valueObj.alpha.toString(),
        isResizing: valueObj.isResizing,
        width: valueObj.width.toString(),
        height: valueObj.height.toString(),
      });
    });
    console.log(`-------------------------------채팅에서 막 만든 데이터 구조`);
    console.log(ChatMessageJson);
    console.log(`-------------------------------채팅에서 막 만든 데이터 구조`);
    setIsReady(
      await serverManager.editorAll(
        chatsObj.contentResponse.contentId,
        ChatMessageJson,
        Images,
        BgImages
      )
    );
    if (!!titleBgImage && chatsObj.contentResponse.backgroundImage === null) {
      //console.log("신규 카테고리 변경");
      serverManager.editorEditChatInFO(
        [titleBgImage],
        chatsObj.contentResponse.contentId,
        titleText,
        absenceText
      );
    } else if (!!titleBgImage && !!chatsObj.contentResponse.backgroundImage) {
      //console.log("유즈를 사용한 카테고리 변경");
      serverManager.usedEditorEditChatInFO(
        [titleBgImage],
        chatsObj.contentResponse.contentId,
        titleText,
        absenceText
      );
    }
  };

  // console.log("잉");
  // console.log(saturation);
  //console.log(titleText);
  //console.log("렌덜~");
  return isReady ? (
    <MenuProvider>
      <GestureHandlerRootView flex={1}>
        <BottomSheetModalProvider>
          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={0}
            snapPoints={["30%"]}
            handleComponent={null}
            onChange={(e) => {
              if (e < 0) setEditTextMode(false);
            }}
          >
            <MeMoEditColorPick
              editTextColor={editTextColor}
              editPosition={editPosition}
              onChangeColor={getColorValue}
              ObjColor={
                editFocus > -1
                  ? chatsObj.contentMessageResponses[editFocus].messageColor
                  : null
              }
              alphaValue={
                editFocus > -1
                  ? chatsObj.contentMessageResponses[editFocus].alpha
                  : null
              }
            />
          </BottomSheetModal>
          <View
            onTouchStart={() => {
              handleClosePress();
              setEditTextMode(false);
            }}
            style={styles.container}
          >
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
                  <TouchableOpacity
                    onPress={() => {
                      //console.log(chatsObj.contentResponse.contentId);
                      // serverManager.editorAddText(
                      //   chatsObj.contentResponse.contentId
                      // );
                      // serverManager.usedEditorEditChatInFO(
                      //   [titleBgImage],
                      //   chatsObj.contentResponse.contentId
                      // );
                      // serverManager.deleteContent(
                      //   chatsObj.contentResponse.contentId
                      // );
                      saveChatObjToServer();
                    }}
                    style={styles.titleThree_icon}
                  >
                    <Entypo name="edit" size={24} color="#242424" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={styles.bodyContent}>
              <ScrollView
                onScroll={handleScroll}
                decelerationRate={5}
                ref={editScrollView}
              >
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
                    <TouchableOpacity onPress={addToTitleBgImage}>
                      {!!titleBgImage ? (
                        <Image
                          source={{ uri: titleBgImage.uri }}
                          style={{
                            width: 30,
                            height: 30,
                          }}
                          resizeMode="cover"
                        />
                      ) : !!chatsObj.contentResponse.backgroundImage ? (
                        <AutoImage
                          source={{
                            uri: serverManager.getImageUri(
                              chatsObj.contentResponse.backgroundImage
                            ),
                          }}
                          width={30}
                          height={30}
                          resizeMode="cover"
                        />
                      ) : (
                        <MaterialIcons
                          name="aspect-ratio"
                          size={24}
                          color="black"
                        />
                      )}
                    </TouchableOpacity>
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
                  {chatsObj.contentMessageResponses.map((Objarr, index) => {
                    return Objarr.messageImageName === null &&
                      (Objarr.addImageName === "" || !Objarr.addImageName) ? (
                      <View
                        key={index}
                        style={{
                          ...styles.chatBlock,
                          flexDirection: "column",
                          alignItems:
                            Objarr.position === POS_CENTER
                              ? "center"
                              : "flex-end",
                        }}
                      >
                        <Menu
                          onOpen={() => {
                            setEditFocus((pre) => (pre = index));
                          }}
                          // onClose={() => onSelectChatObj(-1)}
                        >
                          <MenuTrigger>
                            <View
                              collapsable={false}
                              ref={editItemRefs[index]}
                              style={styles.ChatMsgBox}
                            >
                              {Objarr.editText ? (
                                <TextInput
                                  key={index}
                                  style={{
                                    ...styles.ChatMsg,
                                    padding: 8.5,
                                    borderTopRightRadius:
                                      Objarr.position === POS_CENTER ? 10 : 0,
                                  }}
                                  autoFocus={true}
                                  placeholder={"편집"}
                                  value={editObjText}
                                  onSubmitEditing={EditToMessage}
                                  onChangeText={onChangeEditText}
                                  ref={editTextInputReference}
                                />
                              ) : (
                                <Text
                                  style={{
                                    ...styles.ChatMsg,
                                    backgroundColor:
                                      Objarr.messageColor === null
                                        ? "#fff"
                                        : Objarr.messageColor.includes("#")
                                        ? Objarr.messageColor
                                        : "#" + Objarr.messageColor,
                                    borderColor: chroma("#BFBFBF")
                                      .alpha(
                                        Objarr.alpha === null ? 1 : Objarr.alpha
                                      )
                                      .hex(),
                                    borderTopRightRadius:
                                      Objarr.position === POS_CENTER ? 10 : 0,
                                    color:
                                      Objarr.textColor === ""
                                        ? "black"
                                        : Objarr.textColor,
                                  }}
                                >
                                  {Objarr.message}
                                </Text>
                              )}
                              {index === editFocus ? (
                                <View
                                  style={{
                                    ...styles.SelectView,
                                    borderTopRightRadius:
                                      Objarr.position === POS_CENTER ? 10 : 0,
                                  }}
                                ></View>
                              ) : null}
                            </View>
                          </MenuTrigger>
                          <MenuOptions customStyles={optionsStyles}>
                            <MenuOption
                              //onSelect={handlePresentModalPress}
                              onSelect={() => {
                                onPressAndFocus(index);
                              }}
                            >
                              <MaterialIcons
                                name="message"
                                size={24}
                                color="black"
                              />
                            </MenuOption>
                            <MenuOption
                              onSelect={() => {
                                deleteMSG(index);
                              }}
                              //disabled={true}]
                            >
                              <MaterialIcons
                                name="delete-outline"
                                size={24}
                                color="black"
                              />
                            </MenuOption>
                            <MenuOption onSelect={addToMessage}>
                              <MaterialIcons
                                name="addchart"
                                size={24}
                                color="black"
                              />
                            </MenuOption>
                            <MenuOption onSelect={onEditChatObj}>
                              <Entypo name="edit" size={24} color="#242424" />
                            </MenuOption>
                          </MenuOptions>
                        </Menu>
                        {Objarr.transformScreen ? (
                          <View
                            style={{
                              width: "100%",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <View key={index} style={styles.effectBlock}>
                              <AntDesign
                                name="reload1"
                                size={24}
                                color="black"
                              />
                              <Text style={styles.effectText}>화면 전환</Text>

                              <TouchableOpacity
                                style={styles.effectDeleteBtn}
                                onPress={() => deleteScreenChange(index)}
                              >
                                <MaterialIcons
                                  name="cancel"
                                  size={30}
                                  color="black"
                                />
                              </TouchableOpacity>
                            </View>
                          </View>
                        ) : null}
                        {Objarr.backgroundType === true ||
                        Objarr.backgroundType === "IMAGE" ? (
                          <View
                            style={{
                              width: "100%",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <View key={index} style={styles.effectBlock}>
                              <View>
                                <Image
                                  source={{
                                    uri:
                                      Objarr.backgroundType === "IMAGE"
                                        ? serverManager.getImageUri(
                                            Objarr.backgroundImage
                                          )
                                        : Objarr.backgroundImage.uri,
                                  }}
                                  style={{
                                    width: 30,
                                    height: 30,
                                  }}
                                  resizeMode="cover"
                                />
                              </View>
                              <Text style={styles.effectText}>전체 배경</Text>

                              <TouchableOpacity
                                style={styles.effectDeleteBtn}
                                onPress={() => deleteBgImg(index)}
                              >
                                <MaterialIcons
                                  name="cancel"
                                  size={30}
                                  color="black"
                                />
                              </TouchableOpacity>
                            </View>
                          </View>
                        ) : null}
                      </View>
                    ) : (
                      <View
                        key={index}
                        style={{
                          ...styles.chatBlock,
                          flexDirection: "column",
                          alignItems:
                            Objarr.position === POS_CENTER
                              ? "center"
                              : "flex-end",
                        }}
                      >
                        <Menu
                          onOpen={() => {
                            setEditFocus((pre) => (pre = index));
                          }}
                          //onClose={() => onSelectChatObj(-1)}
                        >
                          <MenuTrigger>
                            <View>
                              {Objarr.messageId < 0 ? (
                                <Image
                                  source={{ uri: Objarr.messageImageName.uri }}
                                  style={{
                                    ...styles.ChatMsg_image,
                                    borderTopRightRadius:
                                      Objarr.position === POS_CENTER ? 10 : 0,
                                    width: Objarr.isResizing
                                      ? phonSize.getInstance().chartWidth *
                                        Objarr.width
                                      : phonSize.getInstance().chartWidth *
                                        0.69,
                                    height: Objarr.isResizing
                                      ? (phonSize.getInstance().chartWidth *
                                          Objarr.width *
                                          Objarr.messageImageName.height) /
                                        Objarr.messageImageName.width
                                      : (phonSize.getInstance().chartWidth *
                                          0.69 *
                                          Objarr.messageImageName.height) /
                                        Objarr.messageImageName.width,
                                  }}
                                  resizeMode="cover"
                                />
                              ) : (
                                <AutoImage
                                  source={{
                                    uri:
                                      Objarr.addImageName === ""
                                        ? serverManager.getImageUri(
                                            Objarr.messageImageName
                                          )
                                        : serverManager.getImageUri(
                                            Objarr.addImageName
                                          ),
                                  }}
                                  width={
                                    Objarr.isResizing
                                      ? phonSize.getInstance().chartWidth *
                                        Objarr.width
                                      : phonSize.getInstance().chartWidth * 0.69
                                  }
                                  style={{
                                    ...styles.ChatMsg_image,
                                    borderTopRightRadius:
                                      Objarr.position === POS_CENTER ? 10 : 0,
                                  }}
                                  resizeMode="cover"
                                />
                              )}

                              {index === editFocus ? (
                                <View
                                  style={{
                                    ...styles.SelectView,
                                    borderTopRightRadius:
                                      Objarr.position === POS_CENTER ? 10 : 0,
                                  }}
                                ></View>
                              ) : null}
                            </View>
                          </MenuTrigger>
                          {Objarr.isResizing ? (
                            <MenuOptions
                              customStyles={{
                                ...imageOptionsStyles,
                                optionsContainer: {
                                  width: 150,
                                  marginTop: -50,
                                  marginLeft:
                                    sizeOfPhon.getInstance().chartWidth - 150,
                                  alignItems: "center",
                                },
                              }}
                            >
                              <MenuOption
                                onSelect={() => {
                                  editImageResizing(index);
                                }}
                              >
                                <Entypo name="edit" size={24} color="#242424" />

                                <Text>원상태로 </Text>
                              </MenuOption>
                              <MenuOption onSelect={addToMessage}>
                                <MaterialIcons
                                  name="addchart"
                                  size={24}
                                  color="black"
                                />
                              </MenuOption>

                              <MenuOption
                                onSelect={() => {
                                  deleteMSG(index);
                                }}
                                //disabled={true}]
                              >
                                <MaterialIcons
                                  name="delete-outline"
                                  size={24}
                                  color="black"
                                />
                              </MenuOption>
                            </MenuOptions>
                          ) : (
                            <MenuOptions customStyles={imageOptionsStyles}>
                              <MenuOption
                                onSelect={() => {
                                  editPosition(POS_CENTER, index);
                                }}
                              >
                                <MaterialIcons
                                  name="message"
                                  size={24}
                                  color="black"
                                />
                                <Text>가운데 정렬</Text>
                              </MenuOption>
                              <MenuOption
                                onSelect={() => {
                                  editPosition(POS_RIGHT, index);
                                }}
                              >
                                <MaterialIcons
                                  name="message"
                                  size={24}
                                  color="black"
                                />
                                <Text>오른쪽 정렬</Text>
                              </MenuOption>
                              <MenuOption
                                onSelect={() => {
                                  editImageResizing(index);
                                }}
                              >
                                <Entypo name="edit" size={24} color="#242424" />

                                <Text>꽉 채우기</Text>
                              </MenuOption>
                              <MenuOption onSelect={addToMessage}>
                                <MaterialIcons
                                  name="addchart"
                                  size={24}
                                  color="black"
                                />
                              </MenuOption>

                              <MenuOption
                                onSelect={() => {
                                  deleteMSG(index);
                                }}
                                //disabled={true}]
                              >
                                <MaterialIcons
                                  name="delete-outline"
                                  size={24}
                                  color="black"
                                />
                              </MenuOption>
                            </MenuOptions>
                          )}
                        </Menu>
                        {Objarr.transformScreen ? (
                          <View
                            style={{
                              width: "100%",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <View key={index} style={styles.effectBlock}>
                              <AntDesign
                                name="reload1"
                                size={24}
                                color="black"
                              />
                              <Text style={styles.effectText}>화면 전환</Text>

                              <TouchableOpacity
                                style={styles.effectDeleteBtn}
                                onPress={() => deleteScreenChange(index)}
                              >
                                <MaterialIcons
                                  name="cancel"
                                  size={30}
                                  color="black"
                                />
                              </TouchableOpacity>
                            </View>
                          </View>
                        ) : null}
                        {Objarr.backgroundType === true ||
                        Objarr.backgroundType === "IMAGE" ? (
                          <View
                            style={{
                              width: "100%",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <View key={index} style={styles.effectBlock}>
                              <View>
                                <Image
                                  source={{
                                    uri:
                                      Objarr.backgroundType === "IMAGE"
                                        ? serverManager.getImageUri(
                                            Objarr.backgroundImage
                                          )
                                        : Objarr.backgroundImage.uri,
                                  }}
                                  style={{
                                    width: 30,
                                    height: 30,
                                  }}
                                  resizeMode="cover"
                                />
                              </View>
                              <Text style={styles.effectText}>전체 배경</Text>

                              <TouchableOpacity
                                style={styles.effectDeleteBtn}
                                onPress={() => deleteBgImg(index)}
                              >
                                <MaterialIcons
                                  name="cancel"
                                  size={30}
                                  color="black"
                                />
                              </TouchableOpacity>
                            </View>
                          </View>
                        ) : null}
                      </View>
                    );
                  })}
                  {/* ------------------------------------------------- */}
                </View>
              </ScrollView>
              <View
                style={{
                  ...styles.ChatBottombarSize,
                  height: editTextMode
                    ? sizeOfPhon.getInstance().chartHeight * 0.3 -
                      sizeOfPhon.getInstance().chartHeight * 0.06
                    : 0,
                }}
              ></View>
            </View>
            <View style={styles.bottomEditViewStyle}>
              {editFocus >= 0 ? (
                <View style={styles.bottomEdit_all}>
                  <View style={styles.bottomEdit_item}>
                    <TouchableOpacity onPress={addToImage}>
                      <Entypo name="image" size={24} color="white" />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.bottomEdit_item}>
                    <Text>💬</Text>
                  </View>
                  <View style={styles.bottomEdit_item}>
                    <TouchableOpacity onPress={addToBgImage}>
                      <MaterialIcons
                        name="aspect-ratio"
                        size={24}
                        color="white"
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.bottomEdit_item}>
                    <TouchableOpacity onPress={screenChange}>
                      <AntDesign name="reload1" size={24} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.bottomEdit_all}>
                  <View style={styles.bottomEdit_item}>
                    <TouchableOpacity>
                      <Entypo name="image" size={24} color="grey" />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.bottomEdit_item}>
                    <Text>💬</Text>
                  </View>
                  <View style={styles.bottomEdit_item}>
                    <TouchableOpacity>
                      <MaterialIcons
                        name="aspect-ratio"
                        size={24}
                        color="grey"
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.bottomEdit_item}>
                    <TouchableOpacity>
                      <AntDesign name="reload1" size={24} color="grey" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </View>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </MenuProvider>
  ) : (
    <View style={styles.appLoading}>
      <Text>{lodingText}</Text>
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
    alignItems: "center",
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
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  chatBlock: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginVertical: 7,
  },
  effectBlock: {
    width: sizeOfPhon.getInstance().chartWidth * 0.8933,
    height: 60,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 7,
    backgroundColor: "#EDEDED",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
  },
  effectText: {
    fontSize: 20,
    color: "#247465",
  },
  effectDeleteBtn: {
    position: "absolute",
    height: 30,
    width: 30,
    top: 0,
    right: 0,
    borderRadius: 30,
  },
  ChatMsgBox: {
    // width: sizeOfPhon.getInstance().chartWidth,
    maxWidth: sizeOfPhon.getInstance().chartWidth * 0.69,
  },
  ChatMsg: {
    padding: 10,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    textAlign: "justify",
    borderColor: "#BFBFBF",
    borderWidth: 1,
    lineHeight: 20,
  },
  SelectView: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.2)",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    borderWidth: 2,
    borderColor: "black",
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
  EditModeView: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#000000CC",
  },
  ColorShowBox: {
    // height: sizeOfPhon.getInstance().chartWidth * 0.38,
    // width: sizeOfPhon.getInstance().chartWidth * 0.38,
    width: sizeOfPhon.getInstance().chartWidth * 0.3333,
    height: sizeOfPhon.getInstance().chartWidth * 0.4106,
  },
  ColorPickerView: {
    justifyContent: "space-between",
    alignItems: "center",
    height: sizeOfPhon.getInstance().chartWidth * 0.4106,
    //height: "100%",
  },
  bottomInput: {
    paddingTop: 10,
    borderBottomColor: "rgba(0, 0, 0, 0.2)", // Add this to specify bottom border color
    borderBottomWidth: 1.5, // Add this to specify bottom border thickness
  },
  ChatBottombarSize: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    backgroundColor: "transparent",
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
    margin: 5,
    alignItems: "center",
  },
  optionTouchable: {
    // underlayColor: "gold",
    activeOpacity: 70,
  },
  optionText: {
    //color: "brown",
  },
};
const imageOptionsStyles = {
  optionsContainer: {
    width: 300,
    marginTop: -50,
    alignItems: "center",
  },
  optionsWrapper: {
    padding: 0,
    //backgroundColor: "purple",
    flexDirection: "row",
  },
  optionWrapper: {
    margin: 5,
    alignItems: "center",
  },
  optionTouchable: {
    // underlayColor: "gold",
    activeOpacity: 70,
  },
  optionText: {
    //color: "brown",
  },
};
