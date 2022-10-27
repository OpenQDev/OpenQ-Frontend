/* eslint-disable */
// import { issueIds } from './mocks/data/issueIds';
import jsonRpcErrors from './JsonRPCErrors';
import axios from 'axios';
import {ethers} from 'ethers';

class MockOpenQClient {
	shouldSleep = 1000;
	shouldError = false;

	setSleep(time) {
		this.shouldSleep = time;
	}

	constructor() { }

	 	async sleep(time=this.shouldSleep) {
		return new Promise(async (resolve ) => {
			return setTimeout(resolve, time)
		});
		}

	reset() {
		this.shouldError = false;
	}

	async getENS(_callerAddress){
		let promise = new Promise (async (resolve) =>{
			await this.sleep();
			resolve("sample.eth");
			
		})
		return promise
	}

	async getAllIssues(library) {
		await sleep();

		return axios.get(`http://localhost:3030/getAllIssues`)
			.then(result => {
				return result.data;
			})
			.catch(error => {
				console.error(error);
			});
	}

	async getIssueAddresses(library, issues) {
		return axios.get(`http://localhost:3030/getIssueAddresses`)
			.then(result => {
				return result.data;
			})
			.catch(error => {
				console.error(error);
			});
	}

	async getIssueIsOpen(library, issueId) {
		return true;
	}

	async getIssueIdFromAddress(library, address) {
		return axios.get(`http://localhost:3030/getIssueIdFromAddress/${address}`)
			.then(result => {
				return result.data.issueId;
			})
			.catch(error => {
				console.error(error);
			});
	}

	signMessage = async () => {
		const promise = new Promise(async (resolve, reject) => {
			resolve({ });
		});
		return promise;
	};

	async mintBounty(library, issueId, organization) {
		const promise = new Promise(async (resolve, reject) => {
			await this.sleep();
			resolve({ "bountyAddress": "0x1abcD810374b2C0fCDD11cFA280Df9dA7970da4e", "txnReceipt": {events: ["0x1abcD810374b2C0fCDD11cFA280Df9dA7970da4e"]} });
		});
		return promise;
	}

	async fundBounty(library, _bountyId, _tokenAddress, _value, _depositPeriodDays) {
		const promise = new Promise(async (resolve, reject) => {
			await this.sleep();
			resolve( {events: [{transactionHash:"0x1abcD810374b2C0fCDD11cFA280Df9dA7970da4e" }]})});
		return promise;
	}

	async balanceOf(library, _callerAddress, _tokenAddress) {
		const promise = new Promise(async (resolve, reject) => {
				resolve(ethers.BigNumber.from("6600000000000000000"));
		});
		return promise;
	}

	async allowance(library, _callerAddress, _tokenAddress, _bountyAddress) {
		const promise = new Promise(async (resolve, reject) => {
			if(_tokenAddress === '0x5FbDB2315678afecb367f032d93F642f64180aa3' || _tokenAddress === '0x0000000000000000000000000000000000000000') {
				resolve(ethers.BigNumber.from("0"));
			} else {
				resolve(ethers.BigNumber.from("6600000000000000000"));
			}
		});
		return promise;
	}

	async fetchNfts(){
	return  new Promise(async(resolve, reject)=>{
	
				this.sleep();
	resolve([])
	})
	}

	async approve(library, _bountyAddress, _tokenAddress, _value) {
		const promise = new Promise(async (resolve, reject) => {
			try {
				await this.sleep();
				if(this.shouldError){					
				throw new Error();
				}
				resolve({});
				}
			catch (error) {
				reject({
					
					title: 'Internal JSON',
					message: 'Internal JSON-RPC error', 
				data: {
					title: 'Internal JSON',
					message: 'Internal JSON-RPC error'
				}
			});
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
		let promise = new Promise(async (resolve) => {
				this.sleep();
				resolve(true);

		});

		return promise;
	}

	async isWhitelisted(library, tokenAddress) {
		const promise = new Promise(async (resolve, reject) => {
			try {
				resolve();
			} catch (err) {
				reject(err);
			}
		});
		return promise;
	}

	async tokenAddressLimitReached(library, tokenAddress) {
		const promise = new Promise(async (resolve, reject) => {
			try {
				resolve();
			} catch (err) {
				reject(err);
			}
		});
		return promise;
	}

async refundDeposit(library, _bountyId, _depositId)  {
		const promise = new Promise((resolve, reject) => {
			axios.get('http://localhost:3030/txnResponse')
				.then(async(result) => {
				await this.sleep()
					resolve(result.data);
				})
				.catch((error) => {
					reject(error);
				});
		});
		return promise;
	}

	
	handleError(jsonRpcError, data) {
		let errorString = jsonRpcError?.data?.message;
		if(typeof jsonRpcError === 'string'){
			if (jsonRpcError.includes('Ambire user rejected the request')) { errorString = 'USER_DENIED_TRANSACTION'; }
			if (jsonRpcError.includes('Rejected Request')) { errorString = 'USER_DENIED_TRANSACTION'; }}
		
		if(jsonRpcError.message){
		
			if (jsonRpcError.message.includes('Nonce too high.')) { errorString = 'NONCE_TO_HIGH'; }
			if (jsonRpcError.message.includes('User denied transaction signature')) { errorString = 'USER_DENIED_TRANSACTION'; }
			if (jsonRpcError.message.includes('MetaMask is having trouble connecting to the network')) { errorString = 'METAMASK_HAVING_TROUBLE'; }
			if (jsonRpcError.message.includes('Internal JSON-RPC error')) { errorString = 'INTERNAL_ERROR'; }
			if (jsonRpcError.message.includes('Set a higher gas fee')){ errorString = 'UNDERPRICED_TXN';}
		}	
		if(!errorString){
			errorString='CALL_EXCEPTION';
		}
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
		return 'Unknown Error';
	}
}

export default MockOpenQClient;