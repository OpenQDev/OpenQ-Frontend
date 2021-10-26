import React, { useReducer } from "react";
import ChainConnectionReducer from "./ChainConnectionReducer";
import ChainConnectionStore from "./ChainConnectionContext";
import ChainConnectionContext from "./ChainConnectionContext";

const ChainConnectionProvider = ({ children }) => {
    const initialState = {
        hasMetamask: false,
        account: null
    };

    const [state, dispatch] = useReducer(ChainConnectionReducer, initialState);

    return (
        <ChainConnectionContext.Provider value={[state, dispatch]}>
            {children}
        </ChainConnectionContext.Provider>
    );
};

export default ChainConnectionProvider;
