const Reducer = (state, action) => {
  console.log("action payload", action.payload);

  switch (action.type) {
    case "UPDATE_NAME":
      return {
        ...state,
        username: action.payload,
      };
    default:
      return state;
  }
};

export default Reducer;
