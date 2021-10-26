const ChainConnectionReducer = (state, action) => {
    switch (action.type) {
        case "ACTIVE_ACCOUNT":
            return {
                ...state,
                activeAccount: action.payload,
            };
        case "HAS_METAMASK":
            return {
                ...state,
                hasMetamask: action.payload,
            };
        case "SHOW_WALLET_CONNECT":
            return {
                ...state,
                showWalletConnect: action.payload,
            };
        default:
            return state;
    }
};

export default ChainConnectionReducer;
