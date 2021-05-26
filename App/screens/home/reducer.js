import actionTypes from "../../constants/actionTypes";

const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.CHANGE_BALANCE:
      return { ...state, balance: action.payload };
    case actionTypes.CHANGE_INCOME:
      return { ...state, income: action.payload };
    case actionTypes.CHANGE_EXPENSE:
      return { ...state, expense: action.payload };
    // section list data
    case actionTypes.CHANGE_SECTION_DATA:
      return { ...state, sectionData: action.payload };
    default:
      return state;
  }
};

export { reducer };
