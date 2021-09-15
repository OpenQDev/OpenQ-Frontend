require("dotenv").config();

module.exports = {
  reactStrictMode: true,
  env: {
    PAT: process.env.PAT,
  },
};
