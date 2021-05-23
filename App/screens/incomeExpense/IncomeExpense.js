/* eslint-disable no-use-before-define */
import React, { useReducer, useEffect, useContext } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
} from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { openDatabase } from "expo-sqlite";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import Toast from "react-native-simple-toast";
import colors from "../../constants/colors";
import { addDetails, updateData } from "../../data/dbFiles";
import { SelectedItemContext } from "../../util/SelectedItemContextProvider";
import { reducer } from "./reducer";
import actionTypes from "../../constants/actionTypes";

const IncomeExpense = ({ title, close }) => {
  const { clickedItem } = useContext(SelectedItemContext);

  const heading = clickedItem.Income > 0 ? "Income" : "Expense";

  const db = openDatabase("trackItDb");

  const [state, dispatch] = useReducer(reducer, {
    // selected is true if income is selected
    selected: true,
    description: "",
    amount: "",
    id: 0,
    date: new Date(),
    show: false,
  });

  const dateFormat = "MMMM do, yyyy";

  const showDate = () => {
    dispatch({ type: actionTypes.changeShow, payload: true });
  };

  useEffect(() => {
    if (title === "Edit") {
      if (heading === "Income") {
        dispatch({
          type: actionTypes.changeAmount,
          payload: `${clickedItem.Income}`,
        });
        dispatch({ type: actionTypes.changeSelected, payload: true });
      } else {
        dispatch({
          type: actionTypes.changeAmount,
          payload: `${clickedItem.Expense}`,
        });
        dispatch({ type: actionTypes.changeSelected, payload: false });
      }
      dispatch({
        type: actionTypes.changeDescription,
        payload: clickedItem.Description,
      });
      dispatch({
        type: actionTypes.changeDate,
        payload: new Date(clickedItem.Date),
      });
      dispatch({ type: actionTypes.changeId, payload: clickedItem.id });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChange = (event, selectedDate) => {
    try {
      let currentDate;
      if (!selectedDate) currentDate = state.date;
      else currentDate = selectedDate;
      dispatch({
        type: actionTypes.changeShow,
        payload: Platform.OS === "ios",
      });
      dispatch({ type: actionTypes.changeDate, payload: currentDate });
    } catch (error) {
      console.log(error.message);
    }
  };

  const addEntry = async () => {
    try {
      if (state.description === "" || state.amount === "") {
        Toast.show("Please fill in");
        // eslint-disable-next-line no-restricted-globals
      } else if (isNaN(state.amount)) {
        dispatch({ type: actionTypes.changeAmount, payload: "" });
        Toast.show("Please enter a valid amount");
      } else {
        const stringDate = state.date.toISOString();

        if (title === "Edit") {
          if (state.selected) {
            const acknowledgement = await updateData(
              { db },
              state.id,
              state.description,
              stringDate,
              parseInt(state.amount, 10),
              0
            );
            Toast.show(acknowledgement);
            close();
          } else {
            const acknowledgement = await updateData(
              { db },
              state.id,
              state.description,
              stringDate,
              0,
              parseInt(state.amount, 10)
            );
            Toast.show(acknowledgement);
            close();
          }
        } else {
          // eslint-disable-next-line no-lonely-if
          if (state.selected) {
            const acknowledgement = await addDetails(
              { db },
              stringDate,
              state.description,
              parseInt(state.amount, 10),
              0
            );
            Toast.show(acknowledgement);
            close();
          } else {
            const acknowledgement = await addDetails(
              { db },
              stringDate,
              state.description,
              0,
              parseInt(state.amount, 10)
            );
            Toast.show(acknowledgement);
            close();
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.parent}>
      <Text style={styles.headerText}>{`${title} Income/Expense`}</Text>

      <SafeAreaView style={styles.closeButton}>
        <TouchableOpacity onPress={() => close()}>
          <AntDesign name="close" size={24} color="gray" />
        </TouchableOpacity>
      </SafeAreaView>

      <View style={styles.toggleParent}>
        <TouchableOpacity
          style={[
            state.selected
              ? styles.toggleButtonIncomeSelected
              : styles.toggleButtonIncome,
          ]}
          onPress={() => dispatch({ type: "change_selected", payload: true })}
        >
          <Text
            style={[
              state.selected
                ? { color: colors.white }
                : { color: colors.lightBlack },
            ]}
          >
            Income
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            state.selected
              ? styles.toggleButtonExpense
              : styles.toggleButtonExpenseSelected,
          ]}
          onPress={() =>
            dispatch({ type: actionTypes.changeSelected, payload: false })
          }
        >
          <Text
            style={[
              state.selected
                ? { color: colors.lightBlack }
                : { color: colors.white },
            ]}
          >
            Expense
          </Text>
        </TouchableOpacity>
      </View>

      <TextInput
        placeholder="Amount"
        placeholderTextColor="gray"
        keyboardType="numeric"
        style={styles.input}
        onChangeText={(text) => {
          dispatch({ type: actionTypes.changeAmount, payload: text });
        }}
        value={state.amount}
        returnKeyType="next"
      />

      <TextInput
        placeholder="Description"
        placeholderTextColor="gray"
        style={styles.input}
        onChangeText={(text) =>
          dispatch({ type: actionTypes.changeDescription, payload: text })
        }
        value={state.description}
        returnKeyType="done"
      />

      <TouchableOpacity style={styles.dateParent} onPress={showDate}>
        <TextInput
          placeholder="Date"
          placeholderTextColor="gray"
          style={styles.inputDate}
          onChangeText={(text) =>
            dispatch({ type: actionTypes.changeDate, payload: text })
          }
          value={format(state.date, dateFormat)}
          editable={false}
        />
        <View style={styles.dateIcon}>
          <MaterialIcons
            name="date-range"
            size={24}
            color={colors.lightBlack}
          />
        </View>

        {state.show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={state.date}
            mode="date"
            is24Hour
            display="default"
            onChange={onChange}
          />
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.saveTouch}
        onPress={() => {
          addEntry();
        }}
      >
        <Text style={styles.saveText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: { flex: 1, height: "100%" },
  headerText: {
    alignSelf: "center",
    marginTop: 16,
    color: colors.lightBlack,
    fontSize: 18,
  },
  saveTouch: { alignSelf: "center", marginVertical: 18 },
  saveText: { color: colors.appPrimary, fontSize: 14, fontWeight: "bold" },
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
    padding: 10,
    fontSize: 16,
    flex: 1,
  },
  dateParent: {
    borderRadius: 8,
    marginTop: 16,
    height: 42,
    borderWidth: 2,
    marginHorizontal: 16,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  dateIcon: { marginRight: 8 },
});

export default IncomeExpense;
