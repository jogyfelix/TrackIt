const reducer = (state, action) => {
  switch (action.type) {
    case "change_balance":
      return { ...state, balance: action.payload };
    case "change_income":
      return { ...state, income: action.payload };
    case "change_expense":
      return { ...state, expense: action.payload };
    // section list data
    case "change_sectionData":
      return { ...state, sectionData: action.payload };
    default:
      return state;
  }
};

export { reducer };
