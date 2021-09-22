require("dotenv").config();

module.exports = {
  reactStrictMode: true,

  images: {
    domains: ["githubusercontent.com", "avatars.githubusercontent.com"],
  },
  env: {
    PAT: process.env.PAT,
  },
};
