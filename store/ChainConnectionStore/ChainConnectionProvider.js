import React, { useReducer } from "react";
import ChainConnectionReducer from "./ChainConnectionReducer";
import ChainConnectionStore from "./ChainConnectionContext";
import ChainConnectionContext from "./ChainConnectionContext";
import InitialState from "./InitialState";

const ChainConnectionProvider = ({ children }) => {

    const [state, dispatch] = useReducer(ChainConnectionReducer, InitialState);

    return (
        <ChainConnectionContext.Provider value={[state, dispatch]}>
            {children}
        </ChainConnectionContext.Provider>
    );
};

export default ChainConnectionProvider;
