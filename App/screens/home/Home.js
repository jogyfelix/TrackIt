/* eslint-disable no-use-before-define */
import React, { useRef, useEffect, useReducer, useContext } from "react";
import {
  View,
  StyleSheet,
  Text,
  StatusBar,
  SectionList,
  TouchableOpacity,
  Image,
} from "react-native";
import { Modalize } from "react-native-modalize";
import { openDatabase } from "expo-sqlite";
import { format } from "date-fns";
import _ from "lodash";
import colors from "../../constants/colors";
import Fab from "../../components/fab";
import IncomeExpense from "../incomeExpense/IncomeExpense";
import IncomeExpenseDetails from "../incomeExpenseDetails/IncomeExpenseDetails";
import { getDetails, getPrimaryDetails } from "../../data/dbFiles";
import { SelectedItemContext } from "../../util/SelectedItemContextProvider";
import { reducer } from "./reducer";
import actionTypes from "../../constants/actionTypes";

const Home = () => {
  const db = openDatabase("trackItDb");

  const { setClickedItem } = useContext(SelectedItemContext);

  const dateFormat = "MMMM do, yyyy";

  const [state, dispatch] = useReducer(reducer, {
    balance: 0,
    income: 0,
    expense: 0,
    sectionData: [],
  });

  const mapValues = (_array) => {
    const dateArray = [];
    _array.forEach((element) => {
      const date = new Date(element.Date);
      date.setHours(0, 0, 0, 0);
      dateArray.push({ title: date, data: element });
    });
    dateArray.sort((a, b) => b.title - a.title);

    const groups = _(dateArray)
      .groupBy("title")
      .map((details, title) => {
        const data = details.map((detail) => detail.data);
        return {
          title,
          data,
        };
      })
      .value();
    dispatch({ type: actionTypes.changeSectionData, payload: groups });
  };

  const getData = async () => {
    try {
      const getMainData = await getDetails({ db });
      mapValues(getMainData);

      const getDisplayData = await getPrimaryDetails({ db });
      dispatch({
        type: actionTypes.changeBalance,
        payload: getDisplayData[0].Balance,
      });
      dispatch({
        type: actionTypes.changeIncome,
        payload: getDisplayData[0].Income,
      });
      dispatch({
        type: actionTypes.changeExpense,
        payload: getDisplayData[0].Expense,
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const modalizeRef = useRef(null);
  const modalizeRefDetails = useRef(null);

  return (
    <View style={styles.parent}>
      <StatusBar backgroundColor={colors.appPrimary} barStyle="light-content" />

      <View style={styles.mainView}>
        <View style={styles.balanceView}>
          <Text style={{ color: "gray" }}>Balance</Text>
          <Text style={styles.balanceText}>
            {`$${state.balance ? state.balance : 0}`}
          </Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.incomeView}>
          <Text style={styles.heading}>Income</Text>
          <Text style={styles.incomeText}>
            {`$${state.income ? state.income : 0}`}
          </Text>
          <Text style={styles.expenseText}>
            {`$${state.expense ? state.expense : 0}`}
          </Text>
          <Text style={styles.heading}>Expense</Text>
        </View>
      </View>

      <View style={styles.listParent}>
        <SectionList
          style={styles.sectionParent}
          sections={state.sectionData}
          ListFooterComponent={<View style={styles.listFooterStyle} />}
          ListEmptyComponent={() => {
            return (
              <View style={styles.emptyList}>
                <Image
                  style={styles.emptyImage}
                  source={require("../../assets/images/empty_icon.png")}
                />
                <Text style={{ color: colors.lightBlack }}>
                  Ouhh..nothing to Track.
                </Text>
                <Text style={styles.heading}>Go..add something.</Text>
              </View>
            );
          }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.itemTouch}
              onPress={() => {
                setClickedItem(item);
                return modalizeRefDetails.current?.open();
              }}
            >
              <View style={styles.sectionListItem}>
                <Text style={styles.listDesc}>{item.Description}</Text>
                <Text
                  style={[
                    item.Income > 0 ? styles.itemIncome : styles.itemExpense,
                  ]}
                >
                  {item.Income > 0 ? `$${item.Income}` : `$${item.Expense}`}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          renderSectionHeader={({ section }) => (
            <Text style={styles.sectionHeader}>
              {format(Date.parse(section.title), dateFormat)}
            </Text>
          )}
          keyExtractor={(item, index) => index + item}
        />

        <View style={styles.fabParent}>
          <Fab onOpen={() => modalizeRef.current?.open()} />
        </View>
      </View>

      <Modalize ref={modalizeRef} withHandle={false} disableScrollIfPossible>
        <IncomeExpense
          title="Add"
          close={() => {
            getData();
            return modalizeRef.current?.close();
          }}
        />
      </Modalize>

      <Modalize
        ref={modalizeRefDetails}
        withHandle={false}
        disableScrollIfPossible
        closeAnimationConfig={{
          timing: { duration: 280 },
          spring: { speed: 50, bounciness: 0 },
        }}
      >
        <IncomeExpenseDetails
          close={() => {
            getData();
            return modalizeRefDetails.current?.close();
          }}
        />
      </Modalize>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    height: "100%",
    flex: 1,
  },
  incomeText: { color: colors.green, fontSize: 24, fontWeight: "bold" },
  expenseText: { color: colors.red, fontSize: 24, fontWeight: "bold" },
  sectionParent: { marginTop: 16, marginBottom: 16 },
  heading: { color: "gray" },
  listFooterStyle: { height: 52 },
  emptyImage: { height: 80, width: 80 },
  itemTouch: { marginVertical: 4 },
  listDesc: {
    alignSelf: "center",
    marginHorizontal: 16,
    color: colors.lightBlack,
    fontSize: 16,
  },
  itemIncome: {
    alignSelf: "center",
    marginHorizontal: 16,
    color: colors.green,
    fontSize: 16,
  },
  itemExpense: {
    alignSelf: "center",
    marginHorizontal: 16,
    color: colors.red,
    fontSize: 16,
  },
  balanceText: {
    color: colors.lightBlue,
    fontSize: 24,
    fontWeight: "bold",
  },
  listParent: {
    backgroundColor: colors.lightGray,
    marginTop: 16,
    flex: 1,
  },
  separator: {
    borderWidth: 0.5,
    borderColor: colors.border,
    marginVertical: 10,
  },
  mainView: {
    flexDirection: "row",
    height: 140,
    borderWidth: 2,
    borderColor: colors.border,
    marginHorizontal: 16,
    marginTop: 24,
    borderRadius: 8,
    justifyContent: "space-evenly",
  },
  balanceView: {
    alignItems: "center",
    justifyContent: "center",
  },
  incomeView: {
    alignItems: "center",
    justifyContent: "center",
  },
  fabParent: {
    position: "absolute",
    bottom: 16,
    alignSelf: "center",
  },
  emptyList: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    marginVertical: 120,
  },
  sectionListItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: colors.white,
    marginHorizontal: 16,
    height: 52,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 8,
  },
  sectionHeader: {
    color: colors.lightBlack,
    alignSelf: "center",
    marginVertical: 16,
  },
});

export default Home;
