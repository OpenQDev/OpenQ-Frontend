import { ethers } from 'ethers';
import OpenQABI from '../../artifacts/contracts/OpenQ.sol/OpenQ.json';
import ERC20ABI from '../../artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json';

class OpenQClient {
    constructor() {}

    OpenQ = (openQAddress, signer) => {
        console.log("signer", signer)
        console.log("OpenQABI", OpenQABI)
        console.log("openQAddress", openQAddress)
        const contract = new ethers.Contract(openQAddress, OpenQABI, signer);
        return contract;
    };

    ERC20 = (tokenAddress) => {
        const contract = new ethers.Contract(tokenAddress, ERC20ABI, this.signer);
        return contract;
    };
}

export default OpenQClient;