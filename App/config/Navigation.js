import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import colors from "../constants/colors";
import Home from "../screens/home/Home";
import IncomeExpense from "../screens/incomeExpense/IncomeExpense";
import IncomeExpenseDetails from "../screens/incomeExpenseDetails/IncomeExpenseDetails";

const MainStack = createStackNavigator();
const MainStackScreen = () => {
  const screenNames = {
    Home: "Home",
    IncomeExpense: "IncomeExpense",
    IncomeExpenseDetails: "IncomeExpenseDetails",
  };

  return (
    <NavigationContainer>
      <MainStack.Navigator
      // initialRouteName="IncomeExpenseDetails"
      // eslint-disable-next-line react/jsx-closing-bracket-location
      >
        <MainStack.Screen
          name={screenNames.Home}
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
          name={screenNames.IncomeExpense}
          component={IncomeExpense}
          options={{ headerShown: false }}
        />
        <MainStack.Screen
          name={screenNames.IncomeExpenseDetails}
          component={IncomeExpenseDetails}
          options={{ headerShown: false }}
        />
      </MainStack.Navigator>
    </NavigationContainer>
  );
};

export default MainStackScreen;
