const { readEnvVars, getEnvValue } = require("./env-loader");

module.exports = () => {
  const env = {
    DEPLOY_ENV: process.env.DEPLOY_ENV,
    OPENQ_ADDRESS: getEnvValue("OPENQ_ADDRESS"),
    RPC_NODE: getEnvValue("RPC_NODE"),
    WALLET_KEY: getEnvValue("WALLET_KEY"),
    MOCK_TOKEN_ADDRESS: getEnvValue("MOCK_TOKEN_ADDRESS"),
    FAKE_TOKEN_ADDRESS: getEnvValue("FAKE_TOKEN_ADDRESS"),
    PAT: getEnvValue("PAT"),
  };

  console.log(`Environment loaded from .env.${process.env.DEPLOY_ENV}`, env);

  const config = {
    reactStrictMode: true,
    env,
    images: {
      domains: ["githubusercontent.com", "avatars.githubusercontent.com"],
    }
  };

  return config;
};
