import { ethers } from 'ethers';
import OpenQABI from '../../artifacts/contracts/OpenQ/Implementations/OpenQV0.sol/OpenQV0.json';
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

	async mintBounty(library, issueId, organization) {
		const promise = new Promise(async (resolve, reject) => {
			const signer = library.getSigner();

			const contract = this.OpenQ(signer);
			try {
				const txnResponse = await contract.mintBounty(issueId, organization);
				const txnReceipt = await txnResponse.wait();
				console.log(txnReceipt);

				const bountyId = txnReceipt.events[0].args.bountyId;
				const issuerAddress = txnReceipt.events[0].args.issuerAddress;
				const bountyAddress = txnReceipt.events[0].args.bountyAddress;
				console.log({ bountyId, issuerAddress, bountyAddress });
				resolve({ bountyId, issuerAddress, bountyAddress });
			} catch (err) {
				reject(err);
			}
		});
		return promise;
	}

	async approve(library, _bountyAddress, _tokenAddress, _value) {
		const promise = new Promise(async (resolve, reject) => {
			const signer = library.getSigner();

			const contract = this.ERC20(_tokenAddress, signer);
			try {
				const txnResponse = await contract.approve(_bountyAddress, _value);
				const txnReceipt = await txnResponse.wait();
				resolve(txnReceipt);
			} catch (error) {
				reject(error);
			}
		});
		return promise;
	}

	async fundBounty(library, _bountyAddress, _tokenAddress, _value) {
		const promise = new Promise(async (resolve, reject) => {
			const signer = library.getSigner();

			const contract = this.OpenQ(signer);
			try {
				const txnResponse = await contract.fundBounty(_bountyAddress, _tokenAddress, _value);
				const txnReceipt = await txnResponse.wait();
				resolve(txnReceipt);
			} catch (error) {
				reject(error);
			}
		});
		return promise;
	}

	async refundBounty(library, _bountyAddress) {
		const promise = new Promise(async (resolve, reject) => {
			const signer = library.getSigner();

			const contract = this.OpenQ(signer);
			try {
				const txnResponse = await contract.refundBountyDeposits(_bountyAddress);
				const txnReceipt = await txnResponse.wait();

				// wait for confirmation
				resolve(txnReceipt);
			} catch (err) {
				reject(err);
			}
		});
		return promise;
	}
}

export default OpenQClient;