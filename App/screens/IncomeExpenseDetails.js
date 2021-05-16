import React, { useRef } from "react";
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

const IncomeExpenseDetails = ({ item, close }) => {
  const db = openDatabase("trackItDb");
  const heading = item.Income > 0 ? "Income" : "Expense";
  const balanceValue = item.Income > 0 ? item.Income : item.Expense;
  const description = item.Description;
  const date = item.Date;
  const id = item.id;

  const modalizeRef = useRef(null);

  const deleteData = () => {
    removeData({ db }, item.id, description)
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
      <Text style={item.Income > 0 ? styles.income : styles.expense}>
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
        onPress={() => deleteData()}
      >
        <Text
          style={{ color: colors.lightBlack, fontSize: 14, fontWeight: "bold" }}
        >
          Delete
        </Text>
      </TouchableOpacity>

      <Modalize ref={modalizeRef} withHandle={false} disableScrollIfPossible>
        <IncomeExpense
          title="Edit"
          close={() => {
            close();
            return modalizeRef.current?.close();
          }}
          heading={heading}
          balanceValue={balanceValue}
          descFromEdit={description}
          dateFromEdit={date}
          idNo={id}
        />
      </Modalize>
    </View>
  );
};

export default IncomeExpenseDetails;
