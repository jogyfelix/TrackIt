import React, { useRef, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Toast from "react-native-simple-toast";
import { openDatabase } from "expo-sqlite";
import { Modalize } from "react-native-modalize";
import { removeData } from "../data/dbFiles";
import colors from "../constants/colors";
import IncomeExpense from "./IncomeExpense";
import { SelectedItemContext } from "../util/SelectedItemContextProvider";

const styles = StyleSheet.create({
  headerText: {
    alignSelf: "center",
    marginTop: 16,
    color: colors.lightBlack,
    fontSize: 18,
  },
  closeButton: {
    alignSelf: "flex-end",
    right: 16,
    top: 16,
    position: "absolute",
  },
  income: {
    alignSelf: "center",
    marginVertical: 64,
    fontSize: 28,
    fontWeight: "bold",
    color: colors.green,
  },
  expense: {
    alignSelf: "center",
    marginVertical: 64,
    fontSize: 28,
    fontWeight: "bold",
    color: colors.red,
  },
  description: {
    color: colors.lightBlack,
    fontSize: 18,
    alignSelf: "center",
  },
  date: {
    color: colors.lightBlack,
    fontSize: 14,
    alignSelf: "center",
    marginTop: 8,
  },
});

const IncomeExpenseDetails = ({ close }) => {
  const db = openDatabase("trackItDb");

  const { clickedItem } = useContext(SelectedItemContext);

  const heading = clickedItem.Income > 0 ? "Income" : "Expense";
  const balanceValue =
    clickedItem.Income > 0 ? clickedItem.Income : clickedItem.Expense;
  const description = clickedItem.Description;
  const date = clickedItem.Date;

  const modalizeRef = useRef(null);

  const deleteData = () => {
    removeData({ db }, clickedItem.id, description)
      .then(() => {
        Toast.show("Removed");
      })
      .catch(function (error) {
        console.log(`There has been a problem occurred:  ${error.message}`);
      });
  };

  return (
    <View>
      {/* page header */}
      <Text style={styles.headerText}>{heading}</Text>

      {/* close button */}
      <SafeAreaView style={styles.closeButton}>
        <TouchableOpacity onPress={() => close()}>
          <AntDesign name="close" size={24} color="gray" />
        </TouchableOpacity>
      </SafeAreaView>

      {/* main balance */}
      <Text style={clickedItem.Income > 0 ? styles.income : styles.expense}>
        {`$${balanceValue}`}
      </Text>

      {/* description */}
      <Text style={styles.description}>{description}</Text>

      {/* date */}
      <Text style={styles.date}>{date}</Text>

      {/* edit button */}
      <TouchableOpacity
        style={{ alignSelf: "center", marginTop: 32 }}
        onPress={() => {
          modalizeRef.current?.open();
        }}
      >
        <Text
          style={{ color: colors.appPrimary, fontSize: 14, fontWeight: "bold" }}
        >
          Edit
        </Text>
      </TouchableOpacity>

      {/* delete button */}
      <TouchableOpacity
        style={{ alignSelf: "center", marginVertical: 18 }}
        onPress={() => {
          deleteData();
          close();
        }}
      >
        <Text
          style={{ color: colors.lightBlack, fontSize: 14, fontWeight: "bold" }}
        >
          Delete
        </Text>
      </TouchableOpacity>

      <Modalize
        ref={modalizeRef}
        withHandle={false}
        disableScrollIfPossible
        onBackButtonPress={() => {}}
        openAnimationConfig={{
          timing: { duration: 280 },
          spring: { speed: 50, bounciness: 0 },
        }}
      >
        <IncomeExpense
          title="Edit"
          close={() => {
            close();
            return modalizeRef.current?.close();
          }}
        />
      </Modalize>
    </View>
  );
};

export default IncomeExpenseDetails;
