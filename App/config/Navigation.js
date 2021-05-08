import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import colors from "../constants/colors";
import Home from "../screens/Home";
import IncomeExpense from "../screens/IncomeExpense";

const MainStack = createStackNavigator();
const MainStackScreen = () => (
  <MainStack.Navigator initialRouteName="IncomeExpense">
    <MainStack.Screen
      name="Home"
      component={Home}
      options={{
        title: "TrackIt",
        headerStyle: {
          backgroundColor: colors.appPrimary,
        },
        headerTintColor: colors.white,
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    />
    <MainStack.Screen
      name="IncomeExpense"
      component={IncomeExpense}
      options={{ headerShown: false }}
    />
  </MainStack.Navigator>
);

export default () => (
  <NavigationContainer>
    <MainStackScreen />
  </NavigationContainer>
);
