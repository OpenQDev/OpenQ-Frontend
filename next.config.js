module.exports = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_OPENQ_PROXY_ADDRESS: process.env.OPENQ_PROXY_ADDRESS,
    NEXT_PUBLIC_DEPOSIT_MANAGER_PROXY_ADDRESS: process.env.DEPOSIT_MANAGER_PROXY_ADDRESS,
    NEXT_PUBLIC_DEPLOY_ENV: process.env.DEPLOY_ENV,
    NEXT_PUBLIC_SUPERFLUID_RESOLVER_ADDRESS: process.env.SUPERFLUID_RESOLVER_ADDRESS,
    NEXT_PUBLIC_FDAIX_ADDRESS: process.env.FDAIX_ADDRESS,
    NEXT_PUBLIC_INFURA_KEY: process.env.INFURA_KEY,
    NEXT_PUBLIC_BASE_URL: process.env.BASE_URL,
    NEXT_PUBLIC_AUTH_URL: process.env.AUTH_URL,
    NEXT_PUBLIC_INVOICE_URL: process.env.INVOICE_URL,
    NEXT_PUBLIC_GITHUB_PROXY_URL: process.env.GITHUB_PROXY_URL,
    NEXT_PUBLIC_OPENQ_API_URL: process.env.OPENQ_API_URL,
    NEXT_PUBLIC_ORACLE_URL: process.env.ORACLE_URL,
    NEXT_PUBLIC_GITHUB_BOT_WEBHOOK: process.env.GITHUB_BOT_WEBHOOK,
    NEXT_PUBLIC_COIN_API_URL: process.env.COIN_API_URL,
    NEXT_PUBLIC_OPENQ_ID: process.env.OPENQ_ID,
    NEXT_PUBLIC_BLOCK_EXPLORER_BASE_URL: process.env.BLOCK_EXPLORER_BASE_URL,
    NEXT_PUBLIC_OPENQ_SUBGRAPH_HTTP_URL: process.env.OPENQ_SUBGRAPH_HTTP_URL,
    NEXT_PUBLIC_SUPERFLUID_SUBGRAPH_URL: process.env.SUPERFLUID_SUBGRAPH_URL,
    NEXT_PUBLIC_GA_TRACKING_ID: process.env.GA_TRACKING_ID,
    NEXT_PUBLIC_INFURA_PROJECT_ID: process.env.INFURA_PROJECT_ID,
    NEXT_PUBLIC_CLAIM_MANAGER_PROXY_ADDRESS: process.env.CLAIM_MANAGER_PROXY_ADDRESS,
    NEXT_PUBLIC_MOCK_NFT_TOKEN_ADDRESS: process.env.MOCK_NFT_TOKEN_ADDRESS,
    NEXT_PUBLIC_KYC_ADDRESS: process.env.KYC_ADDRESS,
    NEXT_PUBLIC_BUILD_NUMBER: process.env.BUILD_NUMBER,
    NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY: process.env.MAGIC_PUBLISHABLE_KEY,
    NEXT_PUBLIC_CONVERTKIT_API_KEY: process.env.CONVERTKIT_API_KEY,
    NEXT_PUBLIC_NOTIFICATIONS_PUBLIC_KEY: process.env.NOTIFICATIONS_PUBLIC_KEY,
    NEXT_PUBLIC_NOTIFICATIONS_CHANNEL_ID: process.env.NOTIFICATIONS_CHANNEL_ID,
    NEXT_PUBLIC_PAT: process.env.PAT,
  },
  headers: async () => {
    return [
      {
        source: '/manifest.json',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET' },
          { key: 'Access-Control-Allow-Headers', value: 'X-Requested-With, content-type, Authorization' },
        ],
      },
    ];
  },
  images: {
    domains: [
      'githubusercontent.com',
      //... more domains
    ],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};
