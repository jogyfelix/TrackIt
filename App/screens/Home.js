import React, { useRef, useEffect, useState } from "react";
import { View, StyleSheet, Text, StatusBar, Dimensions } from "react-native";
import { Modalize } from "react-native-modalize";
import { openDatabase } from "expo-sqlite";
import colors from "../constants/colors";
import Fab from "../components/fab";
import IncomeExpense from "./IncomeExpense";
import { getDetails, getPrimaryDetails } from "../data/dbFiles";

const screenHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  parent: {
    height: screenHeight,
    flex: 1,
  },
  listParent: {
    backgroundColor: colors.lightGray,
    marginTop: 16,
    flex: 1,
  },
  separator: {
    borderWidth: 0.5,
    borderColor: colors.border,
    marginVertical: 10,
  },
  mainView: {
    flexDirection: "row",
    height: 140,
    borderWidth: 2,
    borderColor: colors.border,
    marginHorizontal: 16,
    marginTop: 24,
    borderRadius: 8,
    justifyContent: "space-evenly",
  },
  balanceView: {
    alignItems: "center",
    justifyContent: "center",
  },
  incomeView: {
    alignItems: "center",
    justifyContent: "center",
  },
  fabParent: {
    position: "absolute",
    bottom: 16,
    alignSelf: "center",
  },
});

const Home = () => {
  const db = openDatabase("trackItDb");

  const [balance, setBalance] = useState("0");
  const [income, setIncome] = useState("0");
  const [expense, setExpense] = useState("0");

  useEffect(() => {
    getDetails({ db })
      .then(console.log)
      .catch(function (error) {
        console.log(`There has been a problem occurred:  ${error.message}`);
      });

    getPrimaryDetails({ db })
      .then((_array) => {
        setBalance(_array[0].Balance);
        setIncome(_array[0].Income);
        setExpense(_array[0].Expense);
      })
      .catch(function (error) {
        console.log(`There has been a problem occurred:  ${error.message}`);
      });
  });

  const modalizeRef = useRef(null);

  return (
    <View style={styles.parent}>
      <StatusBar backgroundColor={colors.appPrimary} barStyle="light-content" />

      {/* content dispaly view */}
      <View style={styles.mainView}>
        {/* balance parent view  */}
        <View style={styles.balanceView}>
          <Text style={{ color: "gray" }}>Balance</Text>
          <Text
            style={{
              color: colors.lightBlue,
              fontSize: 24,
              fontWeight: "bold",
            }}
          >
            {balance}
          </Text>
        </View>

        {/* line separator */}
        <View style={styles.separator} />

        {/* income/expense view  */}
        <View style={styles.incomeView}>
          <Text style={{ color: "gray" }}>Income</Text>
          <Text
            style={{ color: colors.green, fontSize: 24, fontWeight: "bold" }}
          >
            {income}
          </Text>
          <Text style={{ color: colors.red, fontSize: 24, fontWeight: "bold" }}>
            {expense}
          </Text>
          <Text style={{ color: "gray" }}>Expense</Text>
        </View>
      </View>

      {/* list and fab parnet */}
      <View style={styles.listParent}>
        {/* list */}
        <Text>List</Text>

        {/* fab button */}
        <View style={styles.fabParent}>
          <Fab onOpen={() => modalizeRef.current?.open()} />
        </View>
      </View>

      <Modalize ref={modalizeRef}>
        <IncomeExpense title="Add" />
      </Modalize>
    </View>
  );
};

export default Home;
