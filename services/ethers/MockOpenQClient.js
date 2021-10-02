import StoreContext from "../store/Store/StoreContext";
import { useEffect, useState, useContext } from "react";
import { ethers } from 'ethers';
import OpenQ from '../../artifacts/contracts/OpenQ.sol/OpenQ.json';
import ERC20 from '../../artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json';

import MockOpenQContract from "";
class OpenQClient {
    constructor() { }

    provider = new ethers.providers.Web3Provider(window.ethereum);

    OpenQ = () => {
        // must return a contract which adheres to the OpenQ contract ABI
        return;
    };
}

export default OpenQClient;