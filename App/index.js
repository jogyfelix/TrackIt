import React from "react";
import Navigation from "./config/Navigation";
import { SelectedItemContextProvider } from "./util/SelectedItemContextProvider";

export default () => (
  <SelectedItemContextProvider>
    <Navigation />
  </SelectedItemContextProvider>
);
