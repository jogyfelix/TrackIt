import React, { useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  Dimensions,
} from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { openDatabase } from "expo-sqlite";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import Toast from "react-native-simple-toast";
import colors from "../constants/colors";
import { addDetails } from "../data/dbFiles";

const screenHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  parent: { flex: 1, height: screenHeight },

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
  toggleButtonExpenseSelected: {
    backgroundColor: colors.appPrimary,
    height: 38,
    width: 68,
    alignItems: "center",
    justifyContent: "center",
    borderTopRightRadius: 8,
    borderBottomEndRadius: 8,
  },
  toggleButtonIncome: {
    backgroundColor: colors.lightGray,
    height: 38,
    width: 68,
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: 8,
    borderBottomStartRadius: 8,
  },
  toggleButtonIncomeSelected: {
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
  inputDate: {
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

const IncomeExpense = ({ title, close }) => {
  // setting up title from parent
  const parent = title;
  const db = openDatabase("trackItDb");

  // selected is true if income is selected, else expense is selected it is false,income is selected by defalut
  const [selected, setSelected] = useState(true);

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  // date configs
  const dateFormat = "MMMM do, yyyy";
  // const dateFormat = " yyyy-MM-dd";
  // const [date, setDate] = useState(format(new Date(), dateFormat));
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const showDate = () => {
    setShow(true);
  };

  // getting date picked from date picker
  const onChange = (event, selectedDate) => {
    try {
      let currentDate;
      if (!selectedDate) currentDate = date;
      else currentDate = selectedDate;
      setShow(Platform.OS === "ios");
      setDate(currentDate);
    } catch (error) {
      console.log(error.message);
    }
  };

  // showing succes toast
  const showToast = () => {
    Toast.show("Saved");
  };

  // add values to the table
  const addEntry = () => {
    // checks if income or expense is selected
    const stringDate = date.toISOString();
    if (selected)
      addDetails({ db }, stringDate, description, parseInt(amount, 10), 0)
        .then(showToast)
        .catch(function (error) {
          console.log(`There has been a problem occurred:  ${error.message}`);
        });
    else
      addDetails({ db }, stringDate, description, 0, parseInt(amount, 10))
        .then(showToast)
        .catch(function (error) {
          console.log(`There has been a problem occurred:  ${error.message}`);
        });
  };

  return (
    //   main parent view
    <View style={styles.parent}>
      {/* page header */}
      <Text style={styles.headerText}>{`${parent} Income/Expense`}</Text>

      {/* close button */}
      <SafeAreaView style={styles.closeButton}>
        <TouchableOpacity onPress={() => close()}>
          <AntDesign name="close" size={24} color="gray" />
        </TouchableOpacity>
      </SafeAreaView>

      {/* income expense toggle button */}
      <View style={styles.toggleParent}>
        <TouchableOpacity
          style={[
            selected
              ? styles.toggleButtonIncomeSelected
              : styles.toggleButtonIncome,
          ]}
          onPress={() => setSelected(true)}
        >
          <Text
            style={[
              selected ? { color: colors.white } : { color: colors.lightBlack },
            ]}
          >
            Income
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            selected
              ? styles.toggleButtonExpense
              : styles.toggleButtonExpenseSelected,
          ]}
          onPress={() => setSelected(false)}
        >
          <Text
            style={[
              selected ? { color: colors.lightBlack } : { color: colors.white },
            ]}
          >
            Expense
          </Text>
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
        returnKeyType="next"
      />

      {/* description text input */}
      <TextInput
        placeholder="Description"
        placeholderTextColor="gray"
        style={styles.input}
        onChangeText={(text) => setDescription(text)}
        value={description}
        returnKeyType="done"
      />

      {/* date text input */}
      <View style={styles.dateParent}>
        <TextInput
          placeholder="Date"
          placeholderTextColor="gray"
          style={styles.inputDate}
          onChangeText={(text) => setDate(text)}
          value={format(date, dateFormat)}
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
