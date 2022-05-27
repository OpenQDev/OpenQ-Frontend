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
				tokenBalances.map((tokenBalance) => {
					const tokenAddress = this.getTokenValues(ethers.utils.getAddress(tokenBalance.tokenAddress)).address;
					if(tokenVolumes[tokenAddress]){
						tokenVolumes[tokenAddress] = parseInt(tokenVolumes[tokenAddress]) + parseInt(tokenBalance.volume);
					}
					else{
						tokenVolumes[tokenAddress] = tokenBalance.volume;
					}
				});
			}
			else {
				const tokenAddress = this.tokenMetadata[ethers.utils.getAddress(tokenBalances.tokenAddress)].address;
				tokenVolumes[tokenAddress] = tokenBalances.volume;
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
}

export default MockCoinClient;
