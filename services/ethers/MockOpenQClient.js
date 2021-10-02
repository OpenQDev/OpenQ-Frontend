import StoreContext from "../store/Store/StoreContext";
import { useEffect, useState, useContext } from "react";
import { ethers } from 'ethers';
import MockOpenQContract from "./mocks/contracts/MockOpenQContract";

import MockOpenQContract from "";
class OpenQClient {
    constructor() { }

    provider = new ethers.providers.Web3Provider(window.ethereum);

    OpenQ = () => {
        return new MockOpenQContract();
    };
}

export default OpenQClient;