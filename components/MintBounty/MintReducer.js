const MintReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_GOAL_TOKEN': {
      return {
        ...state,
        goalToken: action.payload,
      };
    }
    case 'UPDATE_GOAL_VOLUME': {
      return {
        ...state,
        goalVolume: action.payload,
      };
    }
    case 'UPDATE_ENABLE_CONTEST': {
      return {
        ...state,
        enableContest: action.payload,
      };
    }

    default:
      return state;
  }
};

export default MintReducer;
