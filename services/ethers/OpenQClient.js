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
		const contract = new ethers.Contract(process.env.NEXT_PUBLIC_OPENQ_PROXY_ADDRESS, OpenQABI.abi, signer);
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
				const bountyAddress = txnReceipt.events.find(eventObj=>eventObj.event==='BountyCreated').args.bountyAddress;
				resolve({ bountyAddress });
			} catch (err) {
				console.log(err);
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

	async allowance(library, _tokenAddress){
		const promise = new Promise(async (resolve) => {
			try{
				const signer = library.getSigner();
				const contract = this.ERC20(_tokenAddress, signer);
				const allowance =	await contract.allowance('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707');
				resolve(allowance);
			}
			catch(err){
				resolve({ _hex: '0x00', _isBigNumber: true });
			
			}
		}
		);
		return promise;}

	async balanceOf(library, _callerAddress, _tokenAddress) {
		const promise = new Promise(async (resolve, reject) => {
			const signer = library?.getSigner();
			if (!signer) {
				resolve({ noSigner: true });
			}
			const contract = this.ERC20(_tokenAddress, signer);
			try {
				let volume;
				if (_tokenAddress == ethers.constants.AddressZero) {
					volume = await library.getBalance(_callerAddress);
				} else {
					volume = await contract.balanceOf(_callerAddress);
				}
				resolve(volume);
			} catch (error) {
				console.log(error);
				reject(error);
			}
		});
		return promise;
	}

	async userOwnedTokenBalances(library, _callerAddress, tokens) {
		const promise = new Promise(async (resolve) => {
			const tokensInWallet = [];
			tokens.forEach(async (token) => {
				tokensInWallet.push(this.userBalanceForToken(library, token, _callerAddress));
			});
			resolve(Promise.all(tokensInWallet));
		});

		return promise;
	}

	async userBalanceForToken(library, token, _callerAddress) {
		const signer = library.getSigner();
		const zero = ethers.BigNumber.from(0);

		let promise = new Promise(async (resolve) => {
			let bigNumber;
			let balance;

			try {
				if (token.address == ethers.constants.AddressZero) {
					balance = await library.getBalance(_callerAddress);
				} else {
					const contract = this.ERC20(token.address, signer);
					balance = await contract.balanceOf(_callerAddress);
				}

				bigNumber = ethers.BigNumber.from(balance);
				resolve(!bigNumber.eq(zero));
			} catch (error) {
				resolve(false);
			}

		});

		return promise;
	}

	async getENS(_callerAddress) {
		let promise = new Promise(async (resolve) => {
			let ensName;
			try {
				let provider = new ethers.providers.InfuraProvider('homestead', process.env.PROVIDER_URL);
				let name = await provider.lookupAddress(_callerAddress);
				let reverseAddress = ethers.utils.getAddress(await provider.resolveName(name));
				// we need to check if their address is reverse registered 
				if (ethers.utils.getAddress(_callerAddress) === reverseAddress) {
					ensName = name;
				}
				resolve(ensName);
			}
			catch (error) {
				resolve(false);
			}
		});
		return promise;
	}

	async fundBounty(library, _bountyId, _tokenAddress, _value, _depositPeriodDays) {
		const promise = new Promise(async (resolve, reject) => {
			const signer = library.getSigner();

			const contract = this.OpenQ(signer);
			try {
				const expiration = _depositPeriodDays * 24 * 60 * 60;

				let txnResponse;
				let txnReceipt;

				if (_tokenAddress == ethers.constants.AddressZero) {
					txnResponse = await contract.fundBountyToken(_bountyId, _tokenAddress, _value, expiration, { value: _value });
				} else {				
					txnResponse = await contract.fundBountyToken(_bountyId, _tokenAddress, _value, expiration);
				}
				txnReceipt = await txnResponse.wait();
				console.log(txnReceipt);
				resolve(txnReceipt);
			} catch (error) {
				console.log(error);
				reject(error);
			}
		});
		return promise;
	}

	async extendDeposit(library, _bountyId, _depositId, _depositPeriodDays) {
		const promise = new Promise(async (resolve, reject) => {
			const signer = library.getSigner();
			const contract = this.OpenQ(signer);
			try {
				const seconds = _depositPeriodDays * 24 * 60 * 60;
				const txnResponse = await contract.extendDeposit(_bountyId, _depositId, seconds);
				const txnReceipt = await txnResponse.wait();
				console.log(txnReceipt);
				resolve(txnReceipt);
			} catch (err) {
				reject(err);
			}
		});
		return promise;
	}


	async refundDeposit(library, _bountyId, _depositId) {
		const promise = new Promise(async (resolve, reject) => {
			const signer = library.getSigner();
			const contract = this.OpenQ(signer);
			try {
				const txnResponse = await contract.refundDeposit(_bountyId, _depositId);
				const txnReceipt = await txnResponse.wait();
				console.log(txnReceipt);
				resolve(txnReceipt);
			} catch (err) {
				reject(err);
			}
		});
		return promise;
	}

	async tokenAddressLimitReached(library, _bountyId) {
		const promise = new Promise(async (resolve, reject) => {
			const signer = library.getSigner();
			const contract = this.OpenQ(signer);
			try {
				const tokenAddressLimitReached = await contract.tokenAddressLimitReached(_bountyId);
				resolve(tokenAddressLimitReached);
			} catch (err) {
				reject(err);
			}
		});
		return promise;
	}

	async isWhitelisted(library, tokenAddress) {
		const promise = new Promise(async (resolve, reject) => {
			const signer = library.getSigner();
			const contract = this.OpenQ(signer);
			try {
				const isWhitelisted = await contract.isWhitelisted(tokenAddress);
				resolve(isWhitelisted);
			} catch (err) {
				reject(err);
			}
		});
		return promise;
	}

	handleError(jsonRpcError, data) {
		let errorString = jsonRpcError?.data?.message;
		console.log(errorString);

		// Data messages - more specific than jsonRpcError.message
		if (errorString) {
			for (const error of jsonRpcErrors) {
				const revertString = Object.keys(error)[0];
				if (errorString.includes(revertString)) {
					const title = error[revertString]['title'];
					const message = error[revertString].message(data);
					const link = error[revertString].link;
					const linkText = error[revertString].linkText;
					return { title, message, link, linkText };
				}
			}
		}

		let miscError;
		console.log(jsonRpcError);
		if (typeof jsonRpcError === 'string') {
			if (jsonRpcError.includes('Ambire user rejected the request')) { miscError = 'USER_DENIED_TRANSACTION'; }
			if (jsonRpcError.includes('Rejected Request')) { miscError = 'USER_DENIED_TRANSACTION'; }
			if (jsonRpcError.includes('Transaction was rejected')) { miscError = 'USER_DENIED_TRANSACTION'; }
		}

		if (jsonRpcError.message) {
			if (jsonRpcError.message.includes('Nonce too high.')) { miscError = 'NONCE_TO_HIGH'; }
			if (jsonRpcError.message.includes('User denied transaction signature')) { miscError = 'USER_DENIED_TRANSACTION'; }
			if (jsonRpcError.message.includes('Transaction was rejected')) { miscError = 'USER_DENIED_TRANSACTION'; }
			if (jsonRpcError.message.includes('MetaMask is having trouble connecting to the network')) { miscError = 'METAMASK_HAVING_TROUBLE'; }
			if (jsonRpcError.message.includes('Internal JSON-RPC error')) { miscError = 'INTERNAL_ERROR'; }
			if (jsonRpcError.message.includes('Set a higher gas fee')) { miscError = 'UNDERPRICED_TXN'; }
			if (jsonRpcError.message.includes('CFA: flow does not exist')) { miscError = 'CFA_DOES_NOT_EXIST'; }
			if (jsonRpcError.message.includes('CFA: flow already exist')) { miscError = 'CFA_EXISTS'; }
		
		}

		if (!miscError) {
			errorString = 'CALL_EXCEPTION';
			miscError = 'CALL_EXCEPTION';
		}

		for (const error of jsonRpcErrors) {
			const revertString = Object.keys(error)[0];
			if (miscError.includes(revertString)) {
				const title = error[revertString]['title'];
				const message = error[revertString].message(data);
				const link = error[revertString].link;
				const linkText = error[revertString].linkText;
				return { title, message, link, linkText };
			}
		}

		return 'Unknown Error';
	}

}

export default OpenQClient;