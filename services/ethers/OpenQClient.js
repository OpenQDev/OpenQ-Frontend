import { ethers } from 'ethers';
import OpenQABI from '../../artifacts/contracts/OpenQ.sol/OpenQ.json';
import ERC20ABI from '../../artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json';

class OpenQClient {
	constructor() { }

	/**
		 * 
		 * @param {Web3Provider} signer An ethers.js signer
		 * @returns Web3Contract
		 */
	OpenQ = (signer) => {
		const contract = new ethers.Contract(process.env.NEXT_PUBLIC_OPENQ_ADDRESS, OpenQABI.abi, signer);
		return contract;
	};

	/**
		 * 
		 * @param {string} tokenAddress Contract address of an ERC20 token
		 * @param {Web3Provider} signer An ethers.js signer
		 * @returns Web3Contract
		 */
	ERC20 = (tokenAddress, signer) => {
		const contract = new ethers.Contract(tokenAddress, ERC20ABI.abi, signer);
		return contract;
	};

	async getAllIssues(library) {
		const signer = library.getSigner();

		const contract = this.OpenQ(signer);

		try {
			const contractBytecode = await signer.provider.getCode(process.env.NEXT_PUBLIC_OPENQ_ADDRESS);

			if (contractBytecode == '0x') {
				const noContractBytecodeErrorMessage = `
              Your browser wallet provider pointing to chainId ${window.ethereum?.networkVersion} returned no bytecode for the contract you are trying to call at address ${process.env.NEXT_PUBLIC_OPENQ_ADDRESS}. 
              Are you sure MetaMask is connected to the same location as ${process.env.NEXT_PUBLIC_PROVIDER_URL}?
            `;
				throw (new Error(noContractBytecodeErrorMessage));
			}
			const allIssueIds = await contract.getIssueIds();
			return allIssueIds;
		} catch (err) {
			console.log('Error thrown in contract.getIssueIds()', err);
		}
	}

	async getIssueAddresses(library, issues) {
		const signer = library.getSigner();

		const contract = this.OpenQ(signer);
		const issueIdToAddress = {};
		try {
			for (const issueId of issues) {
				const issueAddress = await contract.issueToAddress(issueId);
				issueIdToAddress[issueId] = issueAddress;
			}
			return issueIdToAddress;
		} catch (err) {
			console.log('getIssueAddresses Error: ', err);
		}
	}

	async getIssueIsOpen(library, issueId) {
		const signer = library.getSigner();
		const contract = this.OpenQ(signer);
		try {
			const issueIsOpen = await contract.issueIsOpen(issueId);
			return issueIsOpen;
		} catch (err) {
			console.log('getIssueIsOpen Error: ', err);
		}
	}

	async getIssueIdFromAddress(library, address) {
		const signer = library.getSigner();

		const contract = this.OpenQ(signer);
		try {
			const issueId = await contract.addressToIssue(address);
			return issueId;
		} catch (err) {
			console.log('getIssueIdFromAddress Error: ', err);
		}
	}

	async getIssueDeposits(library, issueIdToAddresses) {
		let tokenAddresses = [process.env.NEXT_PUBLIC_MOCK_TOKEN_ADDRESS, process.env.NEXT_PUBLIC_FAKE_TOKEN_ADDRESS];

		const signer = library.getSigner();

		let issueDeposits = {};
		try {
			for (const [issueId, issueAddress] of Object.entries(issueIdToAddresses)) {
				issueDeposits[issueId] = [];
				for (const tokenAddress of tokenAddresses) {
					const contract = this.ERC20(tokenAddress, signer);

					const symbol = await contract.symbol();
					const name = await contract.name();
					const issueBalanceBigNumber = await contract.balanceOf(issueAddress);

					const balance = ethers.utils.formatEther(issueBalanceBigNumber);

					const deposit = { symbol, name, balance, issueAddress };
					if (balance > 0) {
						issueDeposits[issueId].push(deposit);
					}
				}
			}
			return issueDeposits;
		} catch (err) {
			console.log('getIssueDeposits Error: ', err);
		}
	}

	async mintBounty(library, issueId) {
		const signer = library.getSigner();

		const contract = this.OpenQ(signer);
		try {
			const txnResponse = await contract.mintBounty(issueId);
			const txnReceipt = await txnResponse.wait();
			console.log("mintBounty txnReceipt", txnReceipt);
			console.log("mintBounty events", txnReceipt?.events);

			const id = txnReceipt.events[1].args.id;
			const from = txnReceipt.events[1].args.from;
			const issueAddress = txnReceipt.events[1].args.issueAddress;
			console.log("mintBounty", { id, from, issueAddress });
			return { id, from, issueAddress };
		} catch (err) {
			throw (err);
		}
	}
}

export default OpenQClient;