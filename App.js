import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./src/screens/Home";
import Chat from "./src/screens/Chat";
import Clogs from "./src/screens/Clogs";

const Stack = createNativeStackNavigator();

function App() {
  return (
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
