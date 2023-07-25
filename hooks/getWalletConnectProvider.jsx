import { EthereumProvider } from '@walletconnect/ethereum-provider'

const getWalletConnectProvider = () => {
	return new Promise(async (resolve, reject) => {
		try {
			const wcProvider = await EthereumProvider.init({
				projectId: 'a6cc11517a10f6f12953fd67b1eb67e7',
				chains: [137],
				showQrModal: false
			});
		
			return resolve(wcProvider);
		} catch (error) {
			return reject(error);
		}
	});
};

export default getWalletConnectProvider;
