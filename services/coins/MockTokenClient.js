import axios from 'axios';
import { ethers } from 'ethers';

import enumerable from '../../constants/polygon-mainnet-enumerable.json';
import indexable from '../../constants/openq-local-indexable.json';
import openqEnumerableTokens from '../../constants/openq-local-enumerable.json';
import openqIndexableTokens from '../../constants/openq-local-indexable.json';

class MockCoinClient {

	async sleep(time) {
		return new Promise(async (resolve,) => {
			return setTimeout(resolve, time);
		});
	}

	async getTokenValues(data) {
		const promise = new Promise(async (resolve, reject) => {

		await	axios.get('http://localhost:3030/tokenPrice')
				.then(async (result) => {
					const price = parseFloat(result.data["0x5FbDB2315678afecb367f032d93F642f64180aa"]);
					const tokenValues = { tokenPrices: {}, tokens: {}, total: 0 };
					let total = 0;
					for (let key in data.tokenVolumes) {
						const lowercaseKey = key.toLowerCase();
						const multiplier = parseInt(data.tokenVolumes[key].volume) / Math.pow(10, data.tokenVolumes[key].decimals);
						const value = price;
						tokenValues.tokens[lowercaseKey] = value * multiplier;
						tokenValues.tokenPrices[lowercaseKey] = Math.round(parseFloat(value) * 100) / 100;
						total = total + value * multiplier;

					}
					tokenValues.total = Math.round(parseFloat(total) * 100) / 100;
					await this.sleep(200);
					resolve(tokenValues);

				})
				.catch((error) => {
					reject(error);
				});
		});
		return promise;
	}




	getPrices(cursor, limit, list) {
		return Promise(async (resolve, reject) => {
			try {
				const response = await axios.get(
					`${process.env.NEXT_PUBLIC_OPENQ_API_URL}/prices`
				);
				resolve(response.data[0].priceObj);
			}
			catch (err) {
				console.log(err);
			}

		});

	}

	parseTokenValues = async (tokenBalances) => {
		if (tokenBalances) {
			let tokenVolumes = {};
			if (Array.isArray(tokenBalances)) {
				for (let i = 0; i < tokenBalances.length; i++) {
					const tokenMetadata = await this.getToken(tokenBalances[i].tokenAddress);
					const tokenAddress = tokenMetadata.address;
					if (tokenVolumes[tokenAddress]) {
						tokenVolumes[tokenAddress] = {
							volume: parseInt(tokenVolumes[tokenAddress]) + parseInt(tokenBalances[i].volume),
							decimals: tokenMetadata.decimals
						};
					}
					else {
						tokenVolumes[tokenAddress] = {
							volume: tokenBalances[i].volume,
							decimals: tokenMetadata.decimals
						};
					}
				}
			}
			else {
				const tokenMetadata = await this.getToken(tokenBalances.tokenAddress);
				tokenVolumes[tokenMetadata.address] =
				{
					volume: tokenBalances.volume,
					decimals: tokenMetadata.decimals
				};
			}
			const data = { tokenVolumes, network: 'polygon-pos' };
			const url = process.env.NEXT_PUBLIC_COIN_API_URL+ '/tvl';
			//only query tvl for bounties that have deposits
			
			if (JSON.stringify(data.tokenVolumes) != '{}') {
				try {
					const tokenValues = await this.getTokenValues(data, url);
					return tokenValues;
				} catch (error) {
					console.error(error);
				}
			} else {
				return { total: 0 };
			}
		}
	};

	getTokenMetadata(cursor, limit, list) {
		if (list === 'polygon') {
			return enumerable.tokens.slice(cursor, cursor + limit);
		}
		if (openqEnumerableTokens.length && list === 'constants') {
			return openqEnumerableTokens;
		}
		else return [];
	}

	getToken(address) {
		const checkSummedAddress = ethers.utils.getAddress(address);
		if (indexable[address.toLowerCase()]) {
			return indexable[address.toLowerCase()];
		}
		if (openqIndexableTokens[checkSummedAddress]) {
			return openqIndexableTokens[checkSummedAddress];
		}
		return {
			chainId: 137,
			name: 'Custom Token',
			symbol: 'CUSTOM',
			decimals: 18,
			address: checkSummedAddress,
			path: '/crypto-logos/ERC20.svg'
		};
	}
}

export default MockCoinClient;
