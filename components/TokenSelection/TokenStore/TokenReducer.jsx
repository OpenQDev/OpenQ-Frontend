import InitialFundState from './InitialTokenState';

const FundReducer = (state, action) => {
  switch (action.type) {
    case 'SET_APPROVE_TRANSFER_STATE': {
      return {
        ...state,
        approveTransferState: action.payload,
      };
    }
    case 'SET_TOKEN': {
      return {
        ...state,
        token: action.payload,
      };
    }
    case 'RESET_STATE': {
      return InitialFundState;
    }
    default:
      return state;
  }
};

export default FundReducer;
