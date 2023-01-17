const StoreReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_ACCOUNTDATA':
      return {
        ...state,
        accountData: action.payload || {},
      };
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
        accountData: action.payload,
      };
    }
    default:
      return state;
  }
};

export default StoreReducer;
