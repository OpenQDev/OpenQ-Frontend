const StoreReducer = (state, action) => {
  switch (action.type) {
    case 'BOUNTY_MINTED':
      return {
        ...state,
        bountyMinted: action.payload,
      };
    case 'UPDATE_IS_AUTHENTICATED':
      return {
        ...state,
        isAuthenticated: action.payload,
      };
    case 'UPDATE_ADDRESS':
      return {
        ...state,
        publicAddress: action.payload,
      };
    case 'PROVIDER':
      return {
        ...state,
        provider: action.payload,
      };
    case 'SIGNER':
      return {
        ...state,
        signer: action.payload,
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
    default:
      return state;
  }
};

export default StoreReducer;
