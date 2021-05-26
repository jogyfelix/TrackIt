import actionTypes from "../../constants/actionTypes";

// reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.CHANGE_SELECTED:
      return { ...state, selected: action.payload };
    case actionTypes.CHANGE_DESCRIPTION:
      return { ...state, description: action.payload };
    case actionTypes.CHANGE_AMOUNT:
      return { ...state, amount: action.payload };
    case actionTypes.CHANGE_ID:
      return { ...state, id: action.payload };
    case actionTypes.CHANGE_DATE:
      return { ...state, date: action.payload };
    case actionTypes.CHANGE_SHOW:
      return { ...state, show: action.payload };
    default:
      return state;
  }
};

export { reducer };
