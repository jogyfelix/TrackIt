import React, { useRef, useEffect } from "react";
import { View, StyleSheet, Text, StatusBar, Dimensions } from "react-native";
import { Modalize } from "react-native-modalize";
import { openDatabase } from "expo-sqlite";
import colors from "../constants/colors";
import Fab from "../components/fab";
import IncomeExpense from "./IncomeExpense";
import { getDetails } from "../data/dbFiles";

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

  useEffect(() => {
    getDetails({ db })
      .then(console.log)
      .catch(function (error) {
        console.log(
          `There has been a problem with your fetch operation:  ${error.message}`
        );
      });
  });

  const balance = "$3000";
  const income = "$7320";
  const expense = "$4500";

  const modalizeRef = useRef(null);

  return (
    <View style={styles.parent}>
      <StatusBar backgroundColor={colors.appPrimary} />

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
