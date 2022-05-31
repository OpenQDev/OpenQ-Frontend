import axios from 'axios';
import { ethers } from 'ethers';

class MockCoinClient {

	async getTokenValues() {
		const promise = new Promise((resolve, reject) => {
			axios.get('http://localhost:3030/tvl')
				.then((result) => {
					resolve(result.data);
				})
				.catch((error) => {
					reject(error);
				});
		});
		return promise;
	}

	
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
				return {total: 0};
			}
		}
	}
	
	async getTokenMetadata(cursor, limit, list) {
		const promise = new Promise((resolve, reject) => {
			
			
			axios.get('http://localhost:3030/metadata/')
				.then((result) => {
					resolve(result.data);
				})
				.catch((error) => {
					reject()
		});
		});
		return promise;
	}
	
	async getToken(address){
		const promise = new Promise((resolve, reject) => {
			
			axios.get('http://localhost:3030/getToken')
				.then((result) => {
					resolve( result.data);
				})
				.catch((error) => {
					reject()
		});
	})
		return promise;
}
}

export default MockCoinClient;
