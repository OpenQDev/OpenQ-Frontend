import { EthereumProvider } from '@walletconnect/ethereum-provider'

const getWalletConnectProvider = async () => {
	return new Promise((resolve, reject) => {
		try {
			const wcProvider = await EthereumProvider.init({
				projectId: 'a6cc11517a10f6f12953fd67b1eb67e7',
				chains: [137],
			});
		
			return wcProvider;
		} catch (error) {
			reject(error);
		}
	});
};

export default getWalletConnectProvider;
