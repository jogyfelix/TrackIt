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
import colors from "../constants/colors";
import { addDetails, updateData } from "../data/dbFiles";
import { SelectedItemContext } from "../util/SelectedItemContextProvider";

const styles = StyleSheet.create({
  parent: { flex: 1, height: "100%" },
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

const reducer = (state, action) => {
  switch (action.type) {
    case "change_selected":
      return { ...state, selected: action.payload };
    case "change_description":
      return { ...state, description: action.payload };
    case "change_amount":
      return { ...state, amount: action.payload };
    case "change_id":
      return { ...state, id: action.payload };
    case "change_date":
      return { ...state, date: action.payload };
    case "change_show":
      return { ...state, show: action.payload };
    default:
      return state;
  }
};

const IncomeExpense = ({ title, close }) => {
  const { clickedItem } = useContext(SelectedItemContext);
  const heading = clickedItem.Income > 0 ? "Income" : "Expense";

  const db = openDatabase("trackItDb");

  const [state, dispatch] = useReducer(reducer, {
    // selected is true if income is selected, else expense is selected it is false,income is selected by defalut
    selected: true,
    description: "",
    amount: "",
    id: 0,
    date: new Date(),
    // for showing date
    show: false,
  });

  // date configs
  const dateFormat = "MMMM do, yyyy";

  const showDate = () => {
    // setShow(true);
    dispatch({ type: "change_show", payload: true });
  };

  useEffect(() => {
    if (title === "Edit") {
      if (heading === "Income") {
        dispatch({ type: "change_amount", payload: `${clickedItem.Income}` });
        dispatch({ type: "change_selected", payload: true });
      } else {
        dispatch({ type: "change_amount", payload: `${clickedItem.Expense}` });
        dispatch({ type: "change_selected", payload: false });
      }
      // setDescription(descFromEdit);
      dispatch({
        type: "change_description",
        payload: clickedItem.Description,
      });

      // setDate(new Date(dateFromEdit));
      dispatch({ type: "change_date", payload: new Date(clickedItem.Date) });
      // setID(idNo);
      dispatch({ type: "change_id", payload: clickedItem.id });
    }
  }, []);

  // getting date picked from date picker
  const onChange = (event, selectedDate) => {
    try {
      let currentDate;
      if (!selectedDate) currentDate = state.date;
      else currentDate = selectedDate;
      // setShow(Platform.OS === "ios");
      dispatch({ type: "change_show", payload: Platform.OS === "ios" });
      // setDate(currentDate);
      dispatch({ type: "change_date", payload: currentDate });
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
    if (state.description === "" || state.amount === "") {
      Toast.show("Please fill in");
    } else {
      const stringDate = state.date.toISOString();
      // if true updates entries
      if (title === "Edit") {
        // checks if income or expense is selected
        if (state.selected)
          updateData(
            { db },
            state.id,
            state.description,
            stringDate,
            parseInt(state.amount, 10),
            0
          )
            .then(() => {
              Toast.show("Updated");
              close();
            })
            .catch(function (error) {
              console.log(
                `There has been a problem occurred:  ${error.message}`
              );
            });
        else
          updateData(
            { db },
            state.id,
            state.description,
            stringDate,
            0,
            parseInt(state.amount, 10)
          )
            .then(() => {
              Toast.show("Updated");
              close();
            })
            .catch(function (error) {
              console.log(
                `There has been a problem occurred:  ${error.message}`
              );
            });
      }

      // adding new data
      else {
        // checks if income or expense is selected
        // eslint-disable-next-line no-lonely-if
        if (state.selected) {
          addDetails(
            { db },
            stringDate,
            state.description,
            parseInt(state.amount, 10),
            0
          )
            .then(() => {
              showToast();
              close();
            })
            .catch(function (error) {
              console.log(
                `There has been a problem occurred:  ${error.message}`
              );
            });
        } else {
          addDetails(
            { db },
            stringDate,
            state.description,
            0,
            parseInt(state.amount, 10)
          )
            .then(() => {
              showToast();
              close();
            })
            .catch(function (error) {
              console.log(
                `There has been a problem occurred:  ${error.message}`
              );
            });
        }
      }
    }
  };

  return (
    //   main parent view
    <View style={styles.parent}>
      {/* page header */}
      <Text style={styles.headerText}>{`${title} Income/Expense`}</Text>

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
          onPress={() => dispatch({ type: "change_selected", payload: false })}
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

      {/* amount text input */}
      <TextInput
        placeholder="Amount"
        placeholderTextColor="gray"
        keyboardType="numeric"
        style={styles.input}
        onChangeText={(text) =>
          dispatch({ type: "change_amount", payload: text })
        }
        value={state.amount}
        returnKeyType="next"
      />

      {/* description text input */}
      <TextInput
        placeholder="Description"
        placeholderTextColor="gray"
        style={styles.input}
        onChangeText={(text) =>
          dispatch({ type: "change_description", payload: text })
        }
        value={state.description}
        returnKeyType="done"
      />

      {/* date text input */}
      <View style={styles.dateParent}>
        <TextInput
          placeholder="Date"
          placeholderTextColor="gray"
          style={styles.inputDate}
          onChangeText={(text) =>
            dispatch({ type: "change_date", payload: text })
          }
          value={format(state.date, dateFormat)}
          editable={false}
        />
        <TouchableOpacity onPress={showDate} style={styles.dateIcon}>
          <MaterialIcons
            name="date-range"
            size={24}
            color={colors.lightBlack}
          />
        </TouchableOpacity>

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
      </View>

      {/* save button */}
      <TouchableOpacity
        style={{ alignSelf: "center", marginVertical: 18 }}
        onPress={() => {
          addEntry();
        }}
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
