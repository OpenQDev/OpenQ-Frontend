const os = require("os");
const path = require("path");

const envFilePath = path.resolve(__dirname, `.env.${process.env.DEPLOY_ENV}`);

const fs = require("fs");
// read .env file & convert to array
const readEnvVars = () => fs.readFileSync(envFilePath, "utf-8").split(os.EOL);

/**
 * Finds the key in .env files and returns the corresponding value
 *
 * @param {string} key Key to find
 * @returns {string|null} Value of the key
 */
const getEnvValue = (key) => {
    // find the line that contains the key (exact match)
    const matchedLine = readEnvVars().find((line) => line.split("=")[0] === key);
    // split the line (delimiter is '=') and return the item at index 2
    return matchedLine !== undefined ? matchedLine.split("=")[1] : null;
};

module.exports = { readEnvVars, getEnvValue };