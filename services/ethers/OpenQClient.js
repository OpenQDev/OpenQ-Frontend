import StoreContext from "../store/Store/StoreContext";
import { ethers } from 'ethers';
import OpenQABI from '../../artifacts/contracts/OpenQ.sol/OpenQ.json';
import ERC20ABI from '../../artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json';

class OpenQClient {
    openQAddress;
    provider;
    signer;

    constructor(_openQAddress) {
        openQAddress = _openQAddress;
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
    }

    OpenQ = () => {
        const contract = new ethers.Contract(this.openQAddress, OpenQABI, this.signer);
        return contract;
    };
}

export default OpenQClient;