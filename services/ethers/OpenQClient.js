import { ethers } from 'ethers';
import OpenQABI from '../../artifacts/contracts/OpenQ.sol/OpenQ.json';
import ERC20ABI from '../../artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json';

class OpenQClient {
    constructor() { }

    OpenQ = (openQAddress, provierOrSigner) => {
        const contract = new ethers.Contract(openQAddress, OpenQABI.abi, provierOrSigner);
        return contract;
    };

    ERC20 = (tokenAddress, provierOrSigner) => {
        const contract = new ethers.Contract(tokenAddress, ERC20ABI.abi, provierOrSigner);
        return contract;
    };
}

export default OpenQClient;