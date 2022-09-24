import { Framework } from '@superfluid-finance/sdk-core';
import { ethers } from 'ethers';

import localTokensIndexable from './tokens-indexable.json';
import localTokensEnumerable from './tokens-enumerable.json';

import polygonTokensIndexable from './polygon-tokens-indexable.json';
import polygonTokensEnumerable from './polygon-tokens-enumerable.json';
import { GET_STREAMS_BY_ACCOUNT } from './graphql/query';
import { HttpLink, ApolloClient, InMemoryCache } from '@apollo/client';
import fetch from 'cross-fetch';

class SuperfluidClient {
  httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_SUPERFLUID_SUBGRAPH_URL,
    fetch,
  });

  client = new ApolloClient({
    uri: process.env.NEXT_PUBLIC_SUPERFLUID_SUBGRAPH_URL,

    link: this.httpLink,
    cache: new InMemoryCache(),
  });
  constructor() {
    switch (process.env.NEXT_PUBLIC_DEPLOY_ENV) {
      case 'local':
        this.tokensIndexable = localTokensIndexable;
        this.tokensEnumerable = localTokensEnumerable;
        this.options = {
          chainId: 31337,
          dataMode: 'WEB3_ONLY',
          resolverAddress: process.env.NEXT_PUBLIC_SUPERFLUID_RESOLVER_ADDRESS,
          protocolReleaseVersion: 'test',
        };
        break;
      case 'docker':
        this.tokensIndexable = localTokensIndexable;
        this.tokensEnumerable = localTokensEnumerable;
        this.options = {
          chainId: 31337,
          dataMode: 'WEB3_ONLY',
          resolverAddress: process.env.NEXT_PUBLIC_SUPERFLUID_RESOLVER_ADDRESS,
          protocolReleaseVersion: 'test',
        };
        break;
      case 'staging':
        this.tokensIndexable = polygonTokensIndexable;
        this.tokensEnumerable = polygonTokensEnumerable;
        this.options = {
          chainId: 137,
        };
        break;
      case 'production':
        this.tokensIndexable = polygonTokensIndexable;
        this.tokensEnumerable = polygonTokensEnumerable;
        this.options = {
          chainId: 137,
        };
        break;
    }
  }

  /**
   * We do not have the Web3 library available on the construction of SuperfluidClient in InitialState, so we must create it
   * via a setter
   */
  async createInstance(library) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        if (!this.instance) {
          const tempInstance = await Framework.create({
            ...this.options,
            provider: library,
          });
          this.instance = tempInstance;
          resolve(tempInstance);
        }
        resolve(this.instance);
      } catch (err) {
        reject(err);
      }
    });
    return promise;
  }

  async createSigner(library) {
    if (!this.signer) {
      const instance = await this.createInstance(library);
      const tempSigner = instance.createSigner({ web3Provider: library });
      this.signer = tempSigner;
    }
    return this.signer;
  }

  async approve(library, superTokenAddress, amount) {
    const promise = new Promise(async (resolve, reject) => {
      const address = superTokenAddress;
      const amountInWei = ethers.utils.parseEther(amount);
      const superToken = await this.loadSuperToken(library, address);
      const unwrappedToken = superToken.underlyingToken.contract.connect(library.getSigner());
      try {
        const tx = await unwrappedToken.approve(address, amountInWei);
        await tx.wait();
        resolve(tx);
      } catch (error) {
        reject(error);
      }
    });
    return promise;
  }
  // UPGRADE + CREATE STREAM
  async upgradeToken(library, superTokenAddress, amount) {
    const address = superTokenAddress;
    const superToken = await this.loadSuperToken(library, address);
    const upgradeOp = superToken.upgrade({
      amount: amount,
    });
    return upgradeOp;
  }

  async superTokenCreateFlow(library, superTokenAddress, sender, receiver, flowRate) {
    const address = superTokenAddress;
    const superToken = await this.loadSuperToken(library, address);
    const createFlowOp = superToken.createFlow({
      sender,
      receiver,
      flowRate,
    });
    return createFlowOp;
  }

  async upgradeAndCreateFlowBacth(library, superTokenAddress, amountPerDay, sender, receiver) {
    const address = superTokenAddress;
    const instance = await this.createInstance(library);
    const signer = await this.createSigner(library);
    // const allowance = await this.allowance(library, sender, address);
    const upgradeOp = await this.upgradeToken(library, address, ethers.utils.parseEther(amountPerDay));
    const createFlowOp = await this.superTokenCreateFlow(
      library,
      address,
      sender,
      receiver,
      this.calculateFlowRateInWeiPerSecond(amountPerDay)
    );
    return await instance.batchCall([upgradeOp, createFlowOp]).exec(signer);
  }

  async updateFlow(library, sender, receiver, amountPerDay) {
    const address = this.tokensEnumerable[0].address;
    const instance = await this.createInstance(library);
    const signer = await this.createSigner(library);
    // const allowance = await this.allowance(library, sender, address);
    const updateFlowOp = instance.cfaV1.updateFlow({
      superToken: address,
      sender,
      receiver,
      flowRate: this.calculateFlowRateInWeiPerSecond(amountPerDay),
    });
    return await updateFlowOp.exec(signer);
  }

  /**
   *
   * @param {Web3 Provider} library
   * @param {*} amount
   * @param {*} address
   * @returns
   * @description Downgrading is essentially the equivalent of withdrawing from the stream
   */
  async downgradeToken(library, superTokenAddress, amount) {
    const address = this.tokensEnumerable[0].address;
    const amountInWei = ethers.utils.parseEther(amount);
    const signer = await this.createSigner(library);
    const superToken = await this.loadSuperToken(library, address);
    const downgradeOp = superToken.downgrade({
      amount: amountInWei.toString(),
    });
    return await downgradeOp.exec(signer);
  }

  async deleteFlow(library, sender, receiver) {
    const address = this.tokensEnumerable[0].address;
    const instance = await this.createInstance(library);
    const signer = await this.createSigner(library);
    const deleteFlowOp = instance.cfaV1.deleteFlow({
      superToken: address,
      sender,
      receiver,
    });
    return await deleteFlowOp.exec(signer);
  }

  // UTILS
  async loadSuperToken(library) {
    const address = this.tokensEnumerable[0].address;
    const instance = await this.createInstance(library);
    const token = await instance.loadSuperToken(address);
    return token;
  }

  async getFlow(library, sender, receiver) {
    const address = this.tokensEnumerable[0].address;
    const instance = await this.createInstance(library);
    return instance.cfaV1.getFlow({
      superToken: address,
      sender,
      receiver,
    });
  }

  async getAccountFlowInfo(library, account) {
    const address = this.tokensEnumerable[0].address;
    const instance = await this.createInstance(library);
    return instance.cfaV1.getAccountFlowInfo({
      superToken: address,
      account,
    });
  }

  async getNetFlow(library, account) {
    const address = this.tokensEnumerable[0].address;
    const instance = await this.createInstance(library);
    return instance.cfaV1.getNetFlow({
      superToken: address,
      account,
    });
  }

  async balanceOf(library, account) {
    const address = this.tokensEnumerable[0].address;
    const superToken = this.loadSuperToken(library, address);
    return await superToken.balanceOf({ account });
  }

  async allowance(library, account) {
    const address = this.tokensEnumerable[0].address;
    const superToken = await this.loadSuperToken(library, address);
    const unwrappedToken = superToken.underlyingToken.contract.connect(library.getSigner());
    const allowanceBigNumber = await unwrappedToken.allowance(account, address);
    return allowanceBigNumber.toString();
  }

  async realtimeBalanceOf(library, account, timestamp) {
    const address = this.tokensEnumerable[0].address;
    const superToken = this.loadSuperToken(library, address);
    return await superToken.realtimeBalanceOf({
      account,
      timestamp,
    });
  }

  calculateFlowRateInWeiPerSecond(amountPerDay) {
    const parsedAmountPerDayInWei = ethers.utils.parseEther(amountPerDay.toString());
    const flowRateInWeiPerSecond = parsedAmountPerDayInWei.div(ethers.utils.formatUnits(60 * 60 * 24, 0));
    return flowRateInWeiPerSecond.toString();
  }

  viewAccount(account) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const result = await this.client.query({
          query: GET_STREAMS_BY_ACCOUNT,
          variables: { account: account.toLowerCase() },
        });
        resolve(result);
      } catch (err) {
        reject(err);
      }
    });
    return promise;
  }
}

export default SuperfluidClient;
