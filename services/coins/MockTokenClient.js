import axios from 'axios';
import { ethers } from 'ethers';

import localEnumerable from '../../constants/openq-local-enumerable.json';
import localIndexable from '../../constants/openq-local-indexable.json';
import indexable from '../../constants/openq-local-indexable.json';
import openqIndexableTokens from '../../constants/openq-local-indexable.json';
import polygonMainnetEnumerable from '../../constants/openq-polygon-mainnet-enumerable.json';
import polygonMainnetIndexable from '../../constants/openq-polygon-mainnet-indexable.json';
import superFluidPolygonIndexable from '../../constants/superfluid-polygon-mainnet-indexable.json';
import superFluidPolygonEnumerable from '../../constants/superfluid-polygon-mainnet-enumerable.json';

class MockCoinClient {
  async sleep(time) {
    return new Promise(async (resolve) => {
      return setTimeout(resolve, time);
    });
  }

  superFluidLocalIndexable = superFluidPolygonIndexable;
  superfluidEnumerable = superFluidPolygonEnumerable;
  openqIndexableTokens = localIndexable;
  openqEnumerableTokens = localEnumerable;
  firstTenPrices = {};

  async getTokenValues(data) {
    const promise = new Promise(async (resolve, reject) => {
      await axios
        .get('http://localhost:3030/tokenPrice')
        .then(async (result) => {
          const price = parseFloat(result.data['0x5FbDB2315678afecb367f032d93F642f64180aa']);
          const tokenValues = { tokenPrices: {}, tokens: {}, total: 0 };
          let total = 0;
          for (let key in data.tokenVolumes) {
            const lowercaseKey = key.toLowerCase();
            const multiplier = parseInt(data.tokenVolumes[key].volume) / Math.pow(10, data.tokenVolumes[key].decimals);
            const value = price;
            tokenValues.tokens[lowercaseKey] = value * multiplier;
            tokenValues.tokenPrices[lowercaseKey] = Math.round(parseFloat(value) * 100) / 100;
            total = total + value * multiplier;
          }
          tokenValues.total = Math.round(parseFloat(total) * 100) / 100;
          await this.sleep(200);
          resolve(tokenValues);
        })
        .catch((error) => {
          reject(error);
        });
    });
    return promise;
  }

  parseTokenValues = async (tokenBalances) => {
    if (tokenBalances) {
      let tokenVolumes = {};
      if (Array.isArray(tokenBalances)) {
        for (let i = 0; i < tokenBalances.length; i++) {
          const tokenMetadata = this.getToken(tokenBalances[i].tokenAddress);

          const tokenAddress = tokenMetadata.valueAddress || this.getToken(tokenAddress).valueAddress;
          if (tokenVolumes[tokenAddress]) {
            tokenVolumes[tokenAddress] = {
              volume: parseInt(tokenVolumes[tokenAddress]) + parseInt(tokenBalances[i].volume),
              decimals: tokenMetadata.decimals,
            };
          } else {
            tokenVolumes[tokenAddress.toLowerCase()] = {
              volume: tokenBalances[i].volume,
              decimals: tokenMetadata.decimals,
            };
          }
        }
      } else {
        const tokenMetadata = await this.getToken(tokenBalances.tokenAddress);
        tokenVolumes[tokenMetadata.valueAddress] = {
          volume: tokenBalances.volume,
          decimals: tokenMetadata.decimals,
        };
      }
      const data = { tokenVolumes, network: 'polygon-pos' };
      const url = this.url + '/tvl';
      //only query tvl for bounties that have deposits
      let fetchValues = false;
      if (JSON.stringify(data.tokenVolumes) != '{}') {
        await new Promise((resolve) => setTimeout(resolve, 200));

        while (!fetchValues) {
          const tokenValues = { tokenPrices: {}, tokens: {}, total: 0 };
          let total = 0;
          for (let key in tokenVolumes) {
            console.log('key', key);
            const lowercaseKey = key.toLowerCase();
            if (this.firstTenPrices[lowercaseKey] && !fetchValues) {
              console.log('hs');
              const multiplier = parseInt(tokenVolumes[key].volume) / Math.pow(10, tokenVolumes[key].decimals);
              const value = this.firstTenPrices[lowercaseKey].usd;
              tokenValues.tokens[lowercaseKey] = value * multiplier;
              tokenValues.tokenPrices[lowercaseKey] = Math.round(parseFloat(value) * 100) / 100;
              total = total + value * multiplier;
            } else {
              console.log('fetching');
              fetchValues = true;
            }
          }
          tokenValues.total = Math.round(parseFloat(total) * 100) / 100;
          if (JSON.stringify(tokenValues) !== '{"tokenPrices":{},"tokens":{},"total":0}' && !fetchValues) {
            console.log('tokenValues', tokenValues);

            return tokenValues;
          }
        }

        try {
          const tokenValues = await this.getTokenValues(data, url);
          return tokenValues;
        } catch (error) {
          throw new Error(error);
        }
      } else {
        return null;
      }
    }
  };
  getToken(address) {
    const checkSummedAddress = ethers.utils.getAddress(address);
    if (indexable[address.toLowerCase()]) {
      return indexable[address.toLowerCase()];
    }
    if (openqIndexableTokens[checkSummedAddress]) {
      return openqIndexableTokens[checkSummedAddress];
    }
    return {
      chainId: 137,
      name: 'Custom Token',
      symbol: 'CUSTOM',
      decimals: 18,
      address: checkSummedAddress,
      path: '/crypto-logos/ERC20.svg',
    };
  }
}

export default MockCoinClient;
