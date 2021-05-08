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
  balance: {
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

const IncomeExpenseDetails = () => {
  const heading = "Expense";
  const balanceValue = "$329";
  const description = "Car typre change";
  const date = "April 20, 2021";

  return (
    <View>
      {/* page header */}
      <Text style={styles.headerText}>{heading}</Text>

      {/* close button */}
      <SafeAreaView style={styles.closeButton}>
        <TouchableOpacity>
          <AntDesign name="close" size={24} color="gray" />
        </TouchableOpacity>
      </SafeAreaView>

      {/* main balance */}
      <Text style={styles.balance}>{balanceValue}</Text>

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
