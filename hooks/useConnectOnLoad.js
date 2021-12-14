import useEagerConnect from './useEagerConnect';

const useConnectOnLoad = () => {
	if (process.env.NEXT_PUBLIC_DEPLOY_ENV == 'local') {
		return () => { console.log('Not connecting on load because local.'); };
	} else {
		return useEagerConnect;
	}
};

export default useConnectOnLoad;