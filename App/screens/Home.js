import React, { useRef, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  StatusBar,
  Dimensions,
  SectionList,
} from "react-native";
import { Modalize } from "react-native-modalize";
import { openDatabase } from "expo-sqlite";
import colors from "../constants/colors";
import Fab from "../components/fab";
import IncomeExpense from "./IncomeExpense";
import { getDetails, getPrimaryDetails } from "../data/dbFiles";
import setDate from "date-fns/setDate";

const screenHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  parent: {
    height: screenHeight,
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
});

const Home = () => {
  const db = openDatabase("trackItDb");

  const [balance, setBalance] = useState("0");
  const [income, setIncome] = useState("0");
  const [expense, setExpense] = useState("0");

  // data from db for section list
  const [sectionData, setSectionData] = useState([]);

  const mapValues = (_array) => {
    const result = [];
    // let date = "";
    _array.forEach((element) => {
      // date = element.Date;
      result.push({ title: element.Date, data: [element] });
    });
    setSectionData(result);
  };

  // const DATA = [
  //   {
  //     title: "Main dishes",
  //     data: ["Pizza", "Burger", "Risotto"],
  //   },
  //   {
  //     title: "Sides",
  //     data: ["French Fries", "Onion Rings", "Fried Shrimps"],
  //   },
  //   {
  //     title: "Drinks",
  //     data: ["Water", "Coke", "Beer"],
  //   },
  //   {
  //     title: "Desserts",
  //     data: ["Cheese Cake", "Ice Cream"],
  //   },
  // ];

  // console.log(DATA);

  useEffect(() => {
    getDetails({ db })
      .then((_array) => {
        mapValues(_array);
      })
      .catch(function (error) {
        console.log(`There has been a problem occurred:  ${error.message}`);
      });

    getPrimaryDetails({ db })
      .then((_array) => {
        setBalance(_array[0].Balance);
        setIncome(_array[0].Income);
        setExpense(_array[0].Expense);
      })
      .catch(function (error) {
        console.log(`There has been a problem occurred:  ${error.message}`);
      });
  }, []);

  const modalizeRef = useRef(null);

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
            {`$${balance}`}
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
            {`$${income}`}
          </Text>
          <Text style={{ color: colors.red, fontSize: 24, fontWeight: "bold" }}>
            {`$${expense}`}
          </Text>
          <Text style={{ color: "gray" }}>Expense</Text>
        </View>
      </View>

      {/* list and fab parnet */}
      <View style={styles.listParent}>
        {/* list */}
        <SectionList
          style={{ marginTop: 16, marginBottom: 90 }}
          sections={sectionData}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                backgroundColor: colors.white,
                marginHorizontal: 16,
                height: 52,
                borderColor: colors.border,
                borderWidth: 1,
                borderRadius: 8,
              }}
            >
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
          )}
          renderSectionHeader={({ section }) => (
            <Text
              style={{
                color: colors.lightBlack,
                alignSelf: "center",
                marginVertical: 16,
              }}
            >
              {section.title}
            </Text>
          )}
          keyExtractor={(item, index) => index + item}
        />

        {/* fab button */}
        <View style={styles.fabParent}>
          <Fab onOpen={() => modalizeRef.current?.open()} />
        </View>
      </View>

      <Modalize ref={modalizeRef}>
        <IncomeExpense title="Add" />
      </Modalize>
    </View>
  );
};

export default Home;
