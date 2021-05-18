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

const styles = StyleSheet.create({
  parent: {
    height: "100%",
    flex: 1,
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

const Home = () => {
  const db = openDatabase("trackItDb");

  // section list clicked item
  const { setclickedItem } = useContext(SelectedItemContext);

  // date format
  const dateFormat = "MMMM do, yyyy";

  const [state, dispatch] = useReducer(reducer, {
    balance: 0,
    income: 0,
    expense: 0,
    sectionData: [],
  });

  // fn for mapping values for section list
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
    dispatch({ type: "change_sectionData", payload: groups });
  };

  // getting data from db
  const getData = () => {
    getDetails({ db })
      .then((_array) => {
        mapValues(_array);
      })
      .catch(function (error) {
        console.log(`There has been a problem occurred:  ${error.message}`);
      });

    getPrimaryDetails({ db })
      .then((_array) => {
        dispatch({ type: "change_balance", payload: _array[0].Balance });
        dispatch({ type: "change_income", payload: _array[0].Income });
        dispatch({ type: "change_expense", payload: _array[0].Expense });
      })
      .catch(function (error) {
        console.log(`There has been a problem occurred:  ${error.message}`);
      });
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refs for modal sheet
  const modalizeRef = useRef(null);
  const modalizeRefDetials = useRef(null);

  return (
    <View style={styles.parent}>
      <StatusBar backgroundColor={colors.appPrimary} barStyle="light-content" />

      {/* content dispaly view */}
      <View style={styles.mainView}>
        {/* balance parent view  */}
        <View style={styles.balanceView}>
          <Text style={{ color: "gray" }}>Balance</Text>
          <Text
            style={{
              color: colors.lightBlue,
              fontSize: 24,
              fontWeight: "bold",
            }}
          >
            {`$${state.balance ? state.balance : 0}`}
          </Text>
        </View>

        {/* line separator */}
        <View style={styles.separator} />

        {/* income/expense view  */}
        <View style={styles.incomeView}>
          <Text style={{ color: "gray" }}>Income</Text>
          <Text
            style={{ color: colors.green, fontSize: 24, fontWeight: "bold" }}
          >
            {`$${state.income ? state.income : 0}`}
          </Text>
          <Text style={{ color: colors.red, fontSize: 24, fontWeight: "bold" }}>
            {`$${state.expense ? state.expense : 0}`}
          </Text>
          <Text style={{ color: "gray" }}>Expense</Text>
        </View>
      </View>

      {/* list and fab parnet */}
      <View style={styles.listParent}>
        {/* list */}
        <SectionList
          style={{ marginTop: 16, marginBottom: 16 }}
          sections={state.sectionData}
          ListFooterComponent={<View style={{ height: 52 }} />}
          ListEmptyComponent={() => {
            return (
              <View style={styles.emptyList}>
                <Image
                  style={{ height: 80, width: 80 }}
                  source={require("../../assets/images/empty_icon.png")}
                />
                <Text style={{ color: colors.lightBlack }}>
                  Ouhh..nothing to Track.
                </Text>
                <Text style={{ color: "gray" }}>Go..add something.</Text>
              </View>
            );
          }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{ marginVertical: 4 }}
              onPress={() => {
                setclickedItem(item);
                return modalizeRefDetials.current?.open();
              }}
            >
              <View style={styles.sectionListItem}>
                <Text
                  style={{
                    alignSelf: "center",
                    marginHorizontal: 16,
                    color: colors.lightBlack,
                    fontSize: 16,
                  }}
                >
                  {item.Description}
                </Text>
                <Text
                  style={[
                    item.Income > 0
                      ? {
                          alignSelf: "center",
                          marginHorizontal: 16,
                          color: colors.green,
                          fontSize: 16,
                        }
                      : {
                          alignSelf: "center",
                          marginHorizontal: 16,
                          color: colors.red,
                          fontSize: 16,
                        },
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

        {/* fab button */}
        <View style={styles.fabParent}>
          <Fab onOpen={() => modalizeRef.current?.open()} />
        </View>
      </View>

      {/* modal for opening add income/expense page */}
      <Modalize ref={modalizeRef} withHandle={false} disableScrollIfPossible>
        <IncomeExpense
          title="Add"
          close={() => {
            getData();
            return modalizeRef.current?.close();
          }}
        />
      </Modalize>

      {/* modal for opening  income/expense details page */}
      <Modalize
        ref={modalizeRefDetials}
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
            return modalizeRefDetials.current?.close();
          }}
        />
      </Modalize>
    </View>
  );
};

export default Home;
