module.exports = () => {
  const env = {
    OPENQ_ADDRESS: process.env.OPENQ_ADDRESS,
    FAKE_TOKEN_ADDRESS: process.env.FAKE_TOKEN_ADDRESS,
    MOCK_TOKEN_ADDRESS: process.env.MOCK_TOKEN_ADDRESS,
    DEPLOY_ENV: process.env.DEPLOY_ENV,
    PROVIDER_URL: process.env.PROVIDER_URL,
    WALLET_KEY: process.env.WALLET_KEY,
    PAT: process.env.PAT,
  };

  const config = {
    reactStrictMode: true,
    env,
    images: {
      domains: ["githubusercontent.com", "avatars.githubusercontent.com"],
    }
  };

  return config;
};
