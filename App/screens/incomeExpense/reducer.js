// reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case "change_selected":
      return { ...state, selected: action.payload };
    case "change_description":
      return { ...state, description: action.payload };
    case "change_amount":
      return { ...state, amount: action.payload };
    case "change_id":
      return { ...state, id: action.payload };
    case "change_date":
      return { ...state, date: action.payload };
    case "change_show":
      return { ...state, show: action.payload };
    default:
      return state;
  }
};

export { reducer };
