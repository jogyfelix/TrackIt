import actionTypes from "../../constants/actionTypes";

// reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.changeSelected:
      return { ...state, selected: action.payload };
    case actionTypes.changeDescription:
      return { ...state, description: action.payload };
    case actionTypes.changeAmount:
      return { ...state, amount: action.payload };
    case actionTypes.changeId:
      return { ...state, id: action.payload };
    case actionTypes.changeDate:
      return { ...state, date: action.payload };
    case actionTypes.changeShow:
      return { ...state, show: action.payload };
    default:
      return state;
  }
};

export { reducer };
