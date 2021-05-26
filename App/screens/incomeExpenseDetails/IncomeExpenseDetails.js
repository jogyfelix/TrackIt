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
import { format } from "date-fns";
import { openDatabase } from "expo-sqlite";
import { Modalize } from "react-native-modalize";
import { removeData } from "../../data/dbFiles";
import colors from "../../constants/colors";
import IncomeExpense from "../incomeExpense/IncomeExpense";
import { SelectedItemContext } from "../../util/SelectedItemContextProvider";

const IncomeExpenseDetails = ({ close }) => {
  const db = openDatabase("trackItDb");

  const dateFormat = "MMMM do, yyyy";

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
      <Text style={styles.headerText}>{heading}</Text>

      <SafeAreaView style={styles.closeButton}>
        <TouchableOpacity onPress={() => close()}>
          <AntDesign name="close" size={24} color="gray" />
        </TouchableOpacity>
      </SafeAreaView>

      <Text style={clickedItem.Income > 0 ? styles.income : styles.expense}>
        {`$${balanceValue}`}
      </Text>

      <Text style={styles.description}>{description}</Text>

      <Text style={styles.date}>{format(Date.parse(date), dateFormat)}</Text>

      <TouchableOpacity
        style={styles.editTouch}
        onPress={() => {
          modalizeRef.current?.open();
        }}
      >
        <Text style={styles.editText}>Edit</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteTouch}
        onPress={() => {
          deleteData();
          close();
        }}
      >
        <Text style={styles.deleteText}>Delete</Text>
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

const styles = StyleSheet.create({
  headerText: {
    alignSelf: "center",
    marginTop: 16,
    color: colors.lightBlack,
    fontSize: 18,
  },
  editTouch: { alignSelf: "center", marginTop: 32 },
  editText: { color: colors.appPrimary, fontSize: 14, fontWeight: "bold" },
  deleteTouch: { alignSelf: "center", marginVertical: 18 },
  deleteText: { color: colors.lightBlack, fontSize: 14, fontWeight: "bold" },
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

export default IncomeExpenseDetails;
