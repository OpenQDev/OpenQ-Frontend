import { useWeb3React } from '@web3-react/core';

// This is a lightweight wrapper of web3React which allows the frontend to run in local mode without attempting to connect to any localhost chain
const useWeb3 = () => {
	if (process.env.NEXT_PUBLIC_DEPLOY_ENV == 'local') {
		return { library: {}, account: '0x1abcD810374b2C0fCDD11cFA280Df9dA7970da4e', active: true, chainId: 31337, activate: () => { }, error: () =>{} };
	} else {
		const { library, account, active, activate, chainId, deactivate, error, connector } = useWeb3React();
		return { library, account, active, activate, chainId, deactivate, error, safe: connector?.safe };
	}
};

export default useWeb3;