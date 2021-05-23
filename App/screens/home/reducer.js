import actionTypes from "../../constants/actionTypes";

const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.changeBalance:
      return { ...state, balance: action.payload };
    case actionTypes.changeIncome:
      return { ...state, income: action.payload };
    case actionTypes.changeExpense:
      return { ...state, expense: action.payload };
    // section list data
    case actionTypes.changeSectionData:
      return { ...state, sectionData: action.payload };
    default:
      return state;
  }
};

export { reducer };
