import React from "react";
import { View, StyleSheet, Text, SafeAreaView, StatusBar } from "react-native";
import colors from "../constants/colors";

const styles = StyleSheet.create({});

const Home = () => (
  <SafeAreaView>
    <StatusBar backgroundColor={colors.appPrimary} />
    <Text>Home SCreen</Text>
  </SafeAreaView>
);
export default Home;
