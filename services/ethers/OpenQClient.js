import { ethers } from 'ethers';
import OpenQABI from '../../artifacts/contracts/OpenQ/Implementations/OpenQV0.sol/OpenQV0.json';
import ERC20ABI from '../../artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json';
import jsonRpcErrors from './JsonRPCErrors';

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

				const bountyId = txnReceipt.events[0].args.bountyId;
				console.log(bountyId);
				const issuerAddress = txnReceipt.events[0].args.issuerAddress;
				const bountyAddress = txnReceipt.events[0].args.bountyAddress;
				resolve({ bountyId, issuerAddress, bountyAddress, txnReceipt });
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

	async refundBounty(library, _bountyAddress, _depositId) {
		const promise = new Promise(async (resolve, reject) => {
			const signer = library.getSigner();

			const contract = this.OpenQ(signer);
			try {
				const txnResponse = await contract.refundBountyDeposit(_bountyAddress, ethers.utils.formatBytes32String(_depositId));
				const txnReceipt = await txnResponse.wait();

				// wait for confirmation
				resolve(txnReceipt);
			} catch (err) {
				reject(err);
			}
		});
		return promise;
	}

	handleError(jsonRpcError, data) {
		let errorString = jsonRpcError?.data?.message;
		if (jsonRpcError.message.includes('Nonce too high.')) { errorString = 'NONCE_TO_HIGH'; }
		for (const error of jsonRpcErrors) {
			const revertString = Object.keys(error)[0];
			if (errorString.includes(revertString)) {
				const title = error[revertString]['title'];
				const message = error[revertString].message(data);
				return { title, message };
			}
		}
		return 'Unknown Error';
	}

}

export default OpenQClient;