const ChainConnectionReducer = (state, action) => {
    switch (action.type) {
        case "ACCOUNT":
            return {
                ...state,
                account: action.payload,
            };
        case "HAS_METAMASK":
            return {
                ...state,
                hasMetamask: action.payload,
            };
        default:
            return state;
    }
};

export default ChainConnectionReducer;
