import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import colors from "../constants/colors";

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
  const heading = item.Income > 0 ? "Income" : "Expense";
  const balanceValue = item.Income > 0 ? item.Income : item.Expense;
  const description = item.Description;
  const date = item.Date;

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
      <TouchableOpacity style={{ alignSelf: "center", marginTop: 32 }}>
        <Text
          style={{ color: colors.appPrimary, fontSize: 14, fontWeight: "bold" }}
        >
          Edit
        </Text>
      </TouchableOpacity>

      {/* delete button */}
      <TouchableOpacity style={{ alignSelf: "center", marginVertical: 18 }}>
        <Text
          style={{ color: colors.lightBlack, fontSize: 14, fontWeight: "bold" }}
        >
          Delete
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default IncomeExpenseDetails;
