import { useWeb3React } from '@web3-react/core';

// This is a lightweight wrapper of web3React which allows the frontend to run in local mode without attempting to connect to any localhost chain
const useWeb3 = () => {
	if (process.env.NEXT_PUBLIC_DEPLOY_ENV == 'local') {
		return { library: {}, account: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', active: true, chainId: 31337, activate: () => { }, deactivate: () =>{ }, error: () =>{} };
	} else {
		const { library, account, active, activate, chainId, deactivate, error, connector } = useWeb3React();
		return { library, account, active, activate, chainId, deactivate, error, safe: connector?.safe };
	}
};

export default useWeb3;