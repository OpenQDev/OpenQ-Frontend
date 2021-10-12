module.exports = () => {
  const env = {
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
