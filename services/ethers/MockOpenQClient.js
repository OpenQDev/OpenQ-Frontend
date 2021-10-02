import StoreContext from "../store/Store/StoreContext";
import { useEffect, useState, useContext } from "react";
import { ethers } from 'ethers';
import MockOpenQContract from "./mocks/contracts/MockOpenQContract";

class MockOpenQClient {
    constructor() { }

    OpenQ = () => {
        return new MockOpenQContract();
    };

    Contract = (tokenAddress, abi) => {
        return new MockFakeTokenContract();
    };
}

export default MockOpenQClient;