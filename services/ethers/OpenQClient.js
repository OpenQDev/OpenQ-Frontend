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

    getCurrentAddress = () => {

    };

    async getAllIssues(openQAddress, signer) {
        const contract = this.OpenQ(openQAddress, signer);

        try {
            const contractBytecode = await signer.provider.getCode(process.env.OPENQ_ADDRESS);

            if (contractBytecode == "0x") {
                const noContractBytecodeErrorMessage = `
              Your browser wallet provider pointing to chainId ${window.ethereum.networkVersion} returned no bytecode for the contract you are trying to call at address ${process.env.OPENQ_ADDRESS}. 
              Are you sure MetaMask is connected to the same location as ${process.env.PROVIDER_URL}?
            `;
                throw (new Error(noContractBytecodeErrorMessage));
            }

            const allIssueIds = await contract.getIssueIds();
            return allIssueIds;
        } catch (err) {
            console.log("Error thrown in contract.getIssueIds()", err);
        }
    }

    async getIssueAddresses(openQAddress, signer, issues) {
        const contract = this.OpenQ(openQAddress, signer);
        const issueIdToAddress = {};
        try {
            for (const issueId of issues) {
                const issueAddress = await contract.issueToAddress(issueId);
                issueIdToAddress[issueId] = issueAddress;
            }
            return issueIdToAddress;
        } catch (err) {
            console.log("getIssueAddresses Error: ", err);
        }
    }

    async getIssueDeposits(tokenAddresses, signer, issueIdToAddresses) {
        let issueDeposits = {};
        try {
            for (const [issueId, issueAddress] of Object.entries(issueIdToAddresses)) {
                issueDeposits[issueId] = [];
                for (const tokenAddress of tokenAddresses) {
                    const contract = this.ERC20(tokenAddress, signer);
                    const symbol = await contract.symbol();
                    const name = await contract.name();
                    const issueBalanceBigNumber = await contract.balanceOf(issueAddress);

                    var balance = parseFloat(issueBalanceBigNumber.toString()).toFixed(2);

                    const deposit = { symbol, name, balance, issueAddress };
                    if (balance > 0) {
                        issueDeposits[issueId].push(deposit);
                    }
                }
            }
            return issueDeposits;
        } catch (err) {
            console.log("getIssueDeposits Error: ", err);
        }
    }
}

export default OpenQClient;