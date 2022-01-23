import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./src/screens/Home";
import Chat from "./src/screens/Chat";
import Clogs from "./src/screens/Clogs";
import ClogScrollView from "./src/screens/ClogScrollView";
import * as Font from "expo-font";

const Stack = createNativeStackNavigator();

function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(async () => {
    await Font.loadAsync({
      NanumBarunGothic: require("./assets/fonts/NanumBarunGothic.ttf"),
      NanumBarunGothicUltraLight: require("./assets/fonts/NanumBarunGothicUltraLight.ttf"),
      NanumBarunGothicBold: require("./assets/fonts/NanumBarunGothicBold.ttf"),
      NanumBarunGothicLight: require("./assets/fonts/NanumBarunGothicLight.ttf"),
    });
    setIsReady(true);
  }, []);

  return isReady ? (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          options={{ headerShown: false }}
          name="Home"
          component={Home}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Chat"
          component={Chat}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Clogs"
          component={Clogs}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="ClogScrollView"
          component={ClogScrollView}
        />
      </Stack.Navigator>
    </NavigationContainer>
  ) : (
    <View style={styles.appLoading}>
      <Text>Loading...</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  appLoading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default App;
