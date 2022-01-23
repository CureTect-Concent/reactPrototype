import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { StatusBar, Platform, Dimensions } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";

// 핸드폰 사이즈와 관련된 값을 가지고있는 싱글톤 패턴+ 캡슐화 클래스
export default phonSize = (() => {
  let instance;

  function setInstance() {
    instance = {
      StatusBarHeight:
        Platform.OS === "ios"
          ? getStatusBarHeight(true)
          : StatusBar.currentHeight,
      //상단 상태표시줄 제외한 폰의 높이구하기
      chartHeight:
        Dimensions.get("window").height -
        (Platform.OS === "ios"
          ? getStatusBarHeight(true)
          : StatusBar.currentHeight),
      //폰의 가로길이
      chartWidth: Dimensions.get("window").width,
    };
  }
  return {
    getInstance() {
      if (!instance) {
        setInstance();
      }
      return instance;
    },
  };
})();
