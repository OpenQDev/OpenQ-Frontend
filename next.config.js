module.exports = () => {
  const env = {
    DEPLOY_ENV: process.env.DEPLOY_ENV,
    OPENQ_ADDRESS: process.env.OPENQ_ADDRESS,
    RPC_NODE: process.env.RPC_NODE,
    WALLET_KEY: process.env.WALLET_KEY,
    MOCK_TOKEN_ADDRESS: process.env.MOCK_TOKEN_ADDRESS,
    FAKE_TOKEN_ADDRESS: process.env.FAKE_TOKEN_ADDRESS
  };
  return {
    reactStrictMode: true,
    env,
    images: {
      domains: ["githubusercontent.com", "avatars.githubusercontent.com"],
    }
  };
};
