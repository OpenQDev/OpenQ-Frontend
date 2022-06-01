import axios from 'axios';
import { ethers } from 'ethers';
import { setup } from 'axios-cache-adapter';

class CoinClient {
	enumerableTokens = [];
	indexableTokens = {};
	firstTenPrices = {}

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
					const tokenMetadata = this.enumerableTokens[tokenAddress] || await this.getToken(tokenBalances[i].tokenAddress);
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
			const url = process.env.NEXT_PUBLIC_COIN_API_URL + '/tvl';
			//only query tvl for bounties that have deposits
			let fetchValues = false;
			if (JSON.stringify(data.tokenVolumes) != '{}') {
				if(!fetchValues){
					const tokenValues = {tokenPrices:{}, tokens: {}, total: 0};
					let total = 0;
					for(let key in tokenVolumes){
						const lowercaseKey = key.toLowerCase();
						if(this.firstTenPrices[lowercaseKey] && !fetchValues){
							tokenVolumes[lowercaseKey];
							const multiplier = tokenVolumes[key].volume / Math.pow(10, tokenVolumes[key].decimals);
							const value = this.firstTenPrices[lowercaseKey].usd;
							tokenValues.tokens[lowercaseKey] = value * multiplier;
							tokenValues.tokenPrices[lowercaseKey] =  Math.round(parseFloat(value) * 100) / 100;
							total = tokenValues.total + value*multiplier;	
						}
						else {
							fetchValues = true;
						}
					}
					tokenValues.total = Math.round(parseFloat(total) * 100) / 100;
					return tokenValues;
				}
				try {
					const tokenValues = await this.getTokenValues(data, url);
					console.log(tokenValues);
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
		const promise = new Promise((resolve, reject) => {
			if(this.enumerableTokens.length){
				resolve(this.enumerableTokens.slice(cursor, cursor+limit));
			}
			const url = `${process.env.NEXT_PUBLIC_COIN_API_URL}/tokenMetadata`;
			axios(url, { params: { cursor, limit, list } })
				.then((result) => {
					resolve(result.data);
				})
				.catch((error) => {
					reject(error);
				});
		});
		return promise;
	}

	async getToken(address) {
		const promise = new Promise((resolve, reject) => {
			if(this.indexableTokens[address]){
				resolve(  this.indexableTokens[address]);}

			const url = `${process.env.NEXT_PUBLIC_COIN_API_URL}/tokenMetadata/${address}`;
			this.cachingClient(url)
				.then((result) => {
					resolve(result.data[ethers.utils.getAddress(address)]);
				})
				.catch((error) => {
					reject(error);
				});
		});
		return promise;
	}

}

export default CoinClient;
