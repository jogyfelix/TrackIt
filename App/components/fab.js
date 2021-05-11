import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../constants/colors";

const styles = StyleSheet.create({
  fab: {
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    width: 50,
    borderRadius: 16,
    backgroundColor: colors.appPrimary,
  },
});

const Fab = ({ onOpen }) => {
  return (
    <>
      <TouchableOpacity onPress={() => onOpen()} style={styles.fab}>
        <MaterialIcons name="add" size={24} color={colors.white} />
      </TouchableOpacity>
    </>
  );
};

export default Fab;
