const StoreReducer = (state, action) => {
  console.log(state, action);
  switch (action.type) {
    case 'BOUNTY_MINTED':
      return {
        ...state,
        bountyMinted: action.payload,
      };
    case 'UPDATE_RELOAD':
      return {
        ...state,
        needsReload: action.payload,
      };
    case 'RELOAD_NOW':
      return {
        ...state,
        reloadNow: action.payload,
      };
    case 'CONNECT_WALLET': {
      return {
        ...state,
        walletConnectModal: action.payload,
      };
    }
    case 'UPDATE_ACCOUNT_DATA': {
      return {
        ...state,
        accountData: { ...state.accountData, ...action.payload },
      };
    }
    default:
      return state;
  }
};

export default StoreReducer;
