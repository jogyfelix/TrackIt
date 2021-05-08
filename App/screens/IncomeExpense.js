import React from "react";
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import colors from "../constants/colors";

const styles = StyleSheet.create({
  parent: {},

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
  toggleButtonExpense: {
    backgroundColor: colors.lightGray,
    height: 38,
    width: 68,
    alignItems: "center",
    justifyContent: "center",
    borderTopRightRadius: 8,
    borderBottomEndRadius: 8,
  },
  toggleButtonIncome: {
    backgroundColor: colors.appPrimary,
    height: 38,
    width: 68,
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: 8,
    borderBottomStartRadius: 8,
  },
  toggleParent: {
    flexDirection: "row",
    marginTop: 24,
    alignSelf: "center",
  },
  input: {
    borderWidth: 2,
    borderColor: colors.border,
    marginTop: 16,
    marginHorizontal: 16,
    height: 42,
    padding: 10,
    fontSize: 16,
    borderRadius: 8,
  },
});

const IncomeExpense = () => {
  const parent = "Add";

  return (
    //   main parent view
    <View style={styles.parent}>
      {/* page header */}
      <Text style={styles.headerText}>{`${parent} Income/Expense`}</Text>

      {/* close button */}
      <SafeAreaView style={styles.closeButton}>
        <TouchableOpacity>
          <AntDesign name="close" size={24} color="gray" />
        </TouchableOpacity>
      </SafeAreaView>

      {/* income expense toggle button */}
      <View style={styles.toggleParent}>
        <TouchableOpacity style={styles.toggleButtonIncome}>
          <Text style={{ color: colors.white }}>Income</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toggleButtonExpense}>
          <Text style={{ color: colors.lightBlack }}>Expense</Text>
        </TouchableOpacity>
      </View>

      {/* amount text input */}
      <TextInput
        placeholder="Amount"
        placeholderTextColor="gray"
        keyboardType="numeric"
        style={styles.input}
      />

      {/* description text input */}
      <TextInput
        placeholder="Description"
        placeholderTextColor="gray"
        style={styles.input}
      />

      {/* date text input */}
      <TextInput
        placeholder="Date"
        placeholderTextColor="gray"
        style={styles.input}
      />

      {/* save button */}
      <TouchableOpacity style={{ alignSelf: "center", marginVertical: 18 }}>
        <Text
          style={{ color: colors.appPrimary, fontSize: 14, fontWeight: "bold" }}
        >
          Save
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default IncomeExpense;
