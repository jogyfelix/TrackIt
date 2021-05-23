import React, { createContext, useState } from "react";

export const SelectedItemContext = createContext();

export const SelectedItemContextProvider = ({ children }) => {
  // eslint-disable-next-line no-unused-vars
  const [clickedItem, setClickedItem] = useState({});

  const contextValue = {
    clickedItem,
    setClickedItem,
  };

  return (
    <SelectedItemContext.Provider value={contextValue}>
      {children}
    </SelectedItemContext.Provider>
  );
};
