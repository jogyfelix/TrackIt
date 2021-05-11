import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Platform,
} from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { openDatabase } from "expo-sqlite";
import DateTimePicker from "@react-native-community/datetimepicker";
import colors from "../constants/colors";
import { addDetails } from "../data/dbFiles";
import { format } from "date-fns";

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
    flex: 1,
  },
  dateParent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  dateIcon: { marginRight: 16, paddingTop: 10 },
});

const IncomeExpense = ({ title }) => {
  // setting up title from parent
  const parent = title;
  const db = openDatabase("trackItDb");

  const [date, setDate] = useState(format(new Date(), "MMMM do, yyyy"));
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  const [show, setShow] = useState(false);

  const showDate = () => {
    setShow(true);
  };

  const onChange = (event, selectedDate) => {
    const currentDate = format(selectedDate || date, "MMMM do, yyyy");
    setShow(Platform.OS === "ios");
    setDate(currentDate);
  };

  const addEntry = () => {
    addDetails({ db }, date, description, parseInt(amount, 10), 0);
  };

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
        onChangeText={(text) => setAmount(text)}
        value={amount}
      />

      {/* description text input */}
      <TextInput
        placeholder="Description"
        placeholderTextColor="gray"
        style={styles.input}
        onChangeText={(text) => setDescription(text)}
        value={description}
      />

      {/* date text input */}
      <View style={styles.dateParent}>
        <TextInput
          placeholder="Date"
          placeholderTextColor="gray"
          style={styles.input}
          onChangeText={(text) => setDate(text)}
          value={date}
          editable={false}
        />
        <TouchableOpacity onPress={showDate} style={styles.dateIcon}>
          <MaterialIcons
            name="date-range"
            size={24}
            color={colors.lightBlack}
          />
        </TouchableOpacity>

        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={new Date()}
            mode="date"
            is24Hour
            display="default"
            onChange={onChange}
          />
        )}
      </View>

      {/* save button */}
      <TouchableOpacity
        style={{ alignSelf: "center", marginVertical: 18 }}
        onPress={addEntry}
      >
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
