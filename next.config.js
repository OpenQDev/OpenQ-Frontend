module.exports = () => {
	const env = {
		NEXT_PUBLIC_OPENQ_ADDRESS: process.env.OPENQ_ADDRESS,
		NEXT_PUBLIC_DEPLOY_ENV: process.env.DEPLOY_ENV,
		NEXT_PUBLIC_PROVIDER_URL: process.env.PROVIDER_URL,
		NEXT_PUBLIC_BASE_URL: process.env.BASE_URL,
		NEXT_PUBLIC_AUTH_URL: process.env.AUTH_URL,
		NEXT_PUBLIC_ORACLE_URL: process.env.ORACLE_URL,
		NEXT_PUBLIC_API_URL: process.env.API_URL,
		NEXT_PUBLIC_COIN_API_URL: process.env.COIN_API_URL,
		NEXT_PUBLIC_PAT: process.env.PAT,
		NEXT_PUBLIC_OPENQ_ID: process.env.OPENQ_ID,
		NEXT_PUBLIC_BLOCK_EXPLORER_BASE_URL: process.env.BLOCK_EXPLORER_BASE_URL,
		NEXT_PUBLIC_OPENQ_SUBGRAPH_HTTP_URL: process.env.OPENQ_SUBGRAPH_HTTP_URL,
		NEXT_PUBLIC_OPENQ_SUBGRAPH_WEBSOCKET_URL: process.env.OPENQ_SUBGRAPH_WEBSOCKET_URL
	};

	const config = {
		reactStrictMode: true,
		env,
		images: {
			domains: ['githubusercontent.com', 'avatars.githubusercontent.com', 'raw.githubusercontent.com'],
		}
	};

	return config;
};
