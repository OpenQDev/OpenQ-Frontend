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
        case "FULLY_CONNECTED":
            return {
                ...state,
                fullyConnected: action.payload,
            };
        case "IS_ON_CORRECT_NETWORK":
            return {
                ...state,
                isOnCorrectNetwork: action.payload,
            };
        default:
            return state;
    }
};

export default ChainConnectionReducer;
