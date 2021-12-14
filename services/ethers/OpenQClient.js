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

	async mintBounty(library, issueId, organization) {
		const signer = library.getSigner();

		const contract = this.OpenQ(signer);
		try {
			const txnResponse = await contract.mintBounty(issueId, organization);
			const txnReceipt = await txnResponse.wait();

			const bountyId = txnReceipt.events[1].args.bountyId;
			const issuerAddress = txnReceipt.events[1].args.issuerAddress;
			const bountyAddress = txnReceipt.events[1].args.bountyAddress;
			return { bountyId, issuerAddress, bountyAddress };
		} catch (err) {
			throw (err);
		}
	}

	async approve(library, _bountyAddress, _tokenAddress, _value) {
		const signer = library.getSigner();

		const contract = this.ERC20(_tokenAddress, signer);
		try {
			const txnResponse = await contract.approve(_bountyAddress, _value);
			const txnReceipt = await txnResponse.wait();
			return txnReceipt;
		} catch (err) {
			throw (err);
		}
	}

	async fundBounty(library, _bountyAddress, _tokenAddress, _value) {
		const signer = library.getSigner();

		const contract = this.OpenQ(signer);
		try {
			const txnResponse = await contract.fundBounty(_bountyAddress, _tokenAddress, _value);
			const txnReceipt = await txnResponse.wait();
			return txnReceipt;
		} catch (err) {
			throw (err);
		}
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