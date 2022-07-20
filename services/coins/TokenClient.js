import axios from 'axios';
import { ethers } from 'ethers';
import { setup } from 'axios-cache-adapter';
import enumerable from '../../constants/polygon-mainnet-enumerable.json';
import indexable from '../../constants/polygon-mainnet-indexable.json';
import localEnumerable from '../../constants/openq-local-enumerable.json';
import localIndexable from '../../constants/openq-local-indexable.json';
import mumbaiEnumerable from '../../constants/openq-polygon-mumbai-enumerable.json';
import mumbaiIndexable from '../../constants/openq-polygon-mumbai-indexable.json';
import polygonMainnetEnumerable from '../../constants/openq-polygon-mainnet-enumerable.json';
import polygonMainnetIndexable from '../../constants/openq-polygon-mainnet-indexable.json';

class CoinClient {
	constructor() {
		switch (process.env.NEXT_PUBLIC_DEPLOY_ENV) {
		case 'local':
			this.openqIndexableTokens = localIndexable;
			this.openqEnumerableTokens = localEnumerable;
			break;
		case 'docker':
			this.openqIndexableTokens = localIndexable;
			this.openqEnumerableTokens = localEnumerable;
			break;
		case 'development':
			this.openqIndexableTokens = mumbaiIndexable;
			this.openqEnumerableTokens = mumbaiEnumerable;
			break;
		case 'staging':
			this.openqIndexableTokens = polygonMainnetIndexable;
			this.openqEnumerableTokens = polygonMainnetEnumerable;
			break;
		case 'production':
			this.openqIndexableTokens = polygonMainnetIndexable;
			this.openqEnumerableTokens = polygonMainnetEnumerable;
			break;
		case 'ethbarcelona':
			this.openqIndexableTokens = polygonMainnetIndexable;
			this.openqEnumerableTokens = polygonMainnetEnumerable;
			break;
		}
	}
	firstTenPrices = {};

	async getTokenValues(tokenVolumes, url) {
		const promise = new Promise((resolve, reject) => {
			axios.post(url, tokenVolumes)
				.then((result) => {
					resolve({ ...result.data });
				})
				.catch((error) => {
					reject(error);
				});
		});
		return promise;
	}

	cachingClient = setup({
		cache: { maxAge: 6 * 1000 } // 3s
	});

	parseTokenValues = async (tokenBalances) => {
		if (tokenBalances) {
			let tokenVolumes = {};
			if (Array.isArray(tokenBalances)) {
				for (let i = 0; i < tokenBalances.length; i++) {
					const tokenMetadata = this.getToken(tokenBalances[i].tokenAddress);
					const tokenAddress = tokenMetadata.address;
					if (tokenVolumes[tokenAddress]) {
						tokenVolumes[tokenAddress] = {
							volume: parseInt(tokenVolumes[tokenAddress]) + parseInt(tokenBalances[i].volume),
							decimals: tokenMetadata.decimals
						};
					}
					else {
						tokenVolumes[tokenAddress.toLowerCase()] = {
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
			const url = process.env.NEXT_PUBLIC_COIN_API_URL + '/tvl';
			//only query tvl for bounties that have deposits
			let fetchValues = false;
			if (JSON.stringify(data.tokenVolumes) != '{}') {
				await new Promise(resolve => setTimeout(resolve, 200));

				while (!fetchValues) {
					const tokenValues = { tokenPrices: {}, tokens: {}, total: 0 };
					let total = 0;
					for (let key in tokenVolumes) {
						const lowercaseKey = key.toLowerCase();
						if (this.firstTenPrices[lowercaseKey] && !fetchValues) {
							const multiplier = parseInt(tokenVolumes[key].volume) / Math.pow(10, tokenVolumes[key].decimals);
							const value = this.firstTenPrices[lowercaseKey].usd;
							tokenValues.tokens[lowercaseKey] = value * multiplier;
							tokenValues.tokenPrices[lowercaseKey] = Math.round(parseFloat(value) * 100) / 100;
							total = total + value * multiplier;
						}
						else {
							console.log(lowercaseKey, this.firstTenPrices);
							fetchValues = true;
						}
					}
					tokenValues.total = Math.round(parseFloat(total) * 100) / 100;
					if (JSON.stringify(tokenValues) !== '{"tokenPrices":{},"tokens":{},"total":0}' && !fetchValues) {
						return tokenValues;
					}
				}

				try {
					const tokenValues = await this.getTokenValues(data, url);
					return tokenValues;
				} catch (error) {
					console.error(error);
				}
			} else {
				return null;
			}
		}
	};


	async getTokenMetadata(cursor, limit, list) {
		if (list === 'polygon') {
			return enumerable.tokens.slice(cursor, cursor + limit);
		}
		if (this.openqEnumerableTokens.length && list === 'constants') {
			return this.openqEnumerableTokens;
		}
		else return [];
	}

	getToken(address) {
		const checkSummedAddress = ethers.utils.getAddress(address);
		if (indexable[address.toLowerCase()]) {
			return indexable[address.toLowerCase()];
		}
		if (this.openqIndexableTokens[checkSummedAddress]) {
			return this.openqIndexableTokens[checkSummedAddress];
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

export default CoinClient;
