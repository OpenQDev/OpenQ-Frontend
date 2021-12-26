module.exports = () => {
	const env = {
		NEXT_PUBLIC_OPENQ_ADDRESS: process.env.OPENQ_PROXY_ADDRESS,
		NEXT_PUBLIC_DEPLOY_ENV: process.env.DEPLOY_ENV,
		NEXT_PUBLIC_PROVIDER_URL: process.env.PROVIDER_URL,
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
