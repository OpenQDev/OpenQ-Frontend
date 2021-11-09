module.exports = () => {
	const env = {
		NEXT_PUBLIC_OPENQ_ADDRESS: process.env.OPENQ_ADDRESS,
		NEXT_PUBLIC_FAKE_TOKEN_ADDRESS: process.env.FAKE_TOKEN_ADDRESS,
		NEXT_PUBLIC_MOCK_TOKEN_ADDRESS: process.env.MOCK_TOKEN_ADDRESS,
		NEXT_PUBLIC_DEPLOY_ENV: process.env.DEPLOY_ENV,
		NEXT_PUBLIC_PROVIDER_URL: process.env.PROVIDER_URL,
		WALLET_KEY: process.env.WALLET_KEY,
		NEXT_PUBLIC_PAT: process.env.PAT,
		NEXT_PUBLIC_OPENQ_ID: process.env.OPENQ_ID,
		NEXT_PUBLIC_BLOCK_EXPLORER_BASE_URL: process.env.BLOCK_EXPLORER_BASE_URL
	};

	const config = {
		reactStrictMode: true,
		env,
		images: {
			domains: ['githubusercontent.com', 'avatars.githubusercontent.com'],
		}
	};

	return config;
};
