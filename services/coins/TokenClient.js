import axios from 'axios';
import { ethers } from 'ethers';
import { setup } from 'axios-cache-adapter';

class CoinClient {

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
	cache: { maxAge: 6 * 1000  } // 3s
});
	
	parseTokenValues = async(tokenBalances) => {
		if (tokenBalances) {
			let tokenVolumes = {};
			if (Array.isArray(tokenBalances)) {
				for (let i = 0; i<tokenBalances.length; i++){
					const tokenMetadata = await this.getToken(tokenBalances[i].tokenAddress);
					const tokenAddress = tokenMetadata.address;
					if(tokenVolumes[tokenAddress]){
						tokenVolumes[tokenAddress] = {
							volume: parseInt(tokenVolumes[tokenAddress]) + parseInt(tokenBalances[i].volume),
							decimals: tokenMetadata.decimals
						};
					}
					else{
						tokenVolumes[tokenAddress] ={ 
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
			if (JSON.stringify(data.tokenVolumes) != '{}') {
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
	}

	
	async getTokenMetadata(cursor, limit, list) {
		const promise = new Promise((resolve, reject) => {
			
			const url = `${process.env.NEXT_PUBLIC_COIN_API_URL}/tokenMetadata`;
			axios(url, {params: {cursor, limit, list}})
				.then((result) => {
					resolve(result.data);
				})
				.catch((error) => {
					reject(error);
				});
		});
		return promise;
	}
	async getToken(address){
		const promise = new Promise((resolve, reject) => {
			
			const url = `${process.env.NEXT_PUBLIC_COIN_API_URL}/tokenMetadata/${address}`;
			this.cachingClient(url)
				.then((result) => {		
					console.log(result.data[ethers.utils.getAddress(address)]);
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
