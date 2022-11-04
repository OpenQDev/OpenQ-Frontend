import { ethers } from 'ethers';
import OpenQABI from '../../artifacts/contracts/OpenQ/Implementations/OpenQV2.sol/OpenQV2.json';
import DepositManagerABI from '../../artifacts/contracts/DepositManager/DepositManager.sol/DepositManager.json';
import ClaimManagerAbi from '../../artifacts/contracts/ClaimManager/Implementations/ClaimManagerV2.sol/ClaimManagerV2.json';

import ERC20ABI from '../../artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json';
import ERC721ABI from '../../artifacts/@openzeppelin/contracts/token/ERC721/ERC721.sol/ERC721.json';

import jsonRpcErrors from './JsonRPCErrors';

class OpenQClient {
  constructor() {}

  /**
   *
   * @param {Web3Provider} signer An ethers.js signer
   * @returns Web3Contract
   */
  OpenQ = (signer) => {
    const contract = new ethers.Contract(process.env.NEXT_PUBLIC_OPENQ_PROXY_ADDRESS, OpenQABI.abi, signer);
    return contract;
  };

  /**
   *
   * @param {Web3Provider} signer An ethers.js signer
   * @returns Web3Contract
   */
  DepositManager = (signer) => {
    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_DEPOSIT_MANAGER_PROXY_ADDRESS,
      DepositManagerABI.abi,
      signer
    );
    return contract;
  };

  ClaimManager = (signer) => {
    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_CLAIM_MANAGER_PROXY_ADDRESS,
      ClaimManagerAbi.abi,
      signer
    );
    return contract;
  };
  /**
   *
   * @param {string} tokenAddress Contract address of an ERC20 token
   * @param {Web3Provider} signer An ethers.js signer
   * @returns Web3Contract
   */

  ERC20 = (tokenAddress, signer) => {
    const contract = new ethers.Contract(tokenAddress, ERC20ABI.abi, signer);
    return contract;
  };

  ERC721 = (tokenAddress, signer) => {
    const contract = new ethers.Contract(tokenAddress, ERC721ABI.abi, signer);

    return contract;
  };

  signMessage = async (account) => {
    const message = 'OpenQ';
    const signature = await window.ethereum.request({
      method: 'personal_sign',
      params: [message, account],
    });
    return signature;
  };

  async mintBounty(library, issueId, organization, type, data) {
    const promise = new Promise(async (resolve, reject) => {
      let bountyInitOperation;
      let abiCoder = new ethers.utils.AbiCoder();
      const fundVolumeInWei = data.fundingTokenVolume * 10 ** data.fundingTokenAddress.decimals;
      const fundBigNumberVolumeInWei = ethers.BigNumber.from(
        fundVolumeInWei.toLocaleString('fullwide', { useGrouping: false })
      );
      const hasFundingGoal = fundVolumeInWei > 0;
      switch (type) {
        case 'Fixed Price':
          {
            let abiCoder = new ethers.utils.AbiCoder();
            const fundingGoalBountyParams = abiCoder.encode(
              ['bool', 'address', 'uint256'],
              [hasFundingGoal, data.fundingTokenAddress.address, fundBigNumberVolumeInWei]
            );
            bountyInitOperation = [0, fundingGoalBountyParams];
          }
          break;
        case 'Split Price':
          {
            const payoutVolumeInWei = data.payoutVolume * 10 ** data.payoutToken.decimals;
            const payoutBigNumberVolumeInWei = ethers.BigNumber.from(
              payoutVolumeInWei.toLocaleString('fullwide', {
                useGrouping: false,
              })
            );
            const ongoingAbiEncodedParams = abiCoder.encode(
              ['address', 'uint256', 'bool', 'address', 'uint256'],
              [
                data.payoutToken.address,
                payoutBigNumberVolumeInWei,
                hasFundingGoal,
                data.fundingTokenAddress.address,
                fundBigNumberVolumeInWei,
              ]
            );
            bountyInitOperation = [1, ongoingAbiEncodedParams];
          }
          break;
        case 'Contest':
          {
            const tieredAbiEncodedParams = abiCoder.encode(
              ['uint256[]', 'bool', 'address', 'uint256'],
              [data.tiers, hasFundingGoal, data.fundingTokenAddress.address, fundBigNumberVolumeInWei]
            );
            bountyInitOperation = [2, tieredAbiEncodedParams];
          }
          break;
        case 'Fixed Contest':
          {
            const tieredAbiEncodedParams = abiCoder.encode(
              ['uint256[]', 'address'],
              [data.tiers, data.payoutToken.address]
            );
            bountyInitOperation = [3, tieredAbiEncodedParams];
          }
          break;
        default:
          throw new Error('Unknown Bounty Type');
      }

      const signer = library.getSigner();

      const contract = this.OpenQ(signer);
      try {
        const txnResponse = await contract.mintBounty(issueId, organization, bountyInitOperation);
        const txnReceipt = await txnResponse.wait();
        const bountyAddress = txnReceipt.events.find((eventObj) => eventObj.event === 'BountyCreated').args
          .bountyAddress;
        resolve({ bountyAddress, txnReceipt });
      } catch (err) {
        reject('err', err);
        reject(err);
      }
    });
    return promise;
  }

  // setFunding inspired by fundBounty
  async setFundingGoal(library, _bountyId, _fundingGoalToken, _fundingGoalVolume) {
    const promise = new Promise(async (resolve, reject) => {
      const volumeInWei = _fundingGoalVolume * 10 ** _fundingGoalToken.decimals;
      const bigNumberVolumeInWei = ethers.BigNumber.from(
        volumeInWei.toLocaleString('fullwide', { useGrouping: false })
      );
      const signer = library.getSigner();
      const contract = this.OpenQ(signer);
      try {
        let txnResponse;
        let txnReceipt;
        txnResponse = await contract.setFundingGoal(_bountyId, _fundingGoalToken.address, bigNumberVolumeInWei);
        txnReceipt = await txnResponse.wait();
        resolve(txnReceipt);
      } catch (error) {
        reject(error);
      }
    });
    return promise;
  }

  async setPayout(library, _bountyId, _payoutToken, _payoutVolume) {
    const promise = new Promise(async (resolve, reject) => {
      const volumeInWei = _payoutVolume * 10 ** _payoutToken.decimals;
      const bigNumberVolumeInWei = ethers.BigNumber.from(
        volumeInWei.toLocaleString('fullwide', { useGrouping: false })
      );
      const signer = library.getSigner();
      const contract = this.OpenQ(signer);
      try {
        let txnResponse;
        let txnReceipt;
        txnResponse = await contract.setPayout(_bountyId, _payoutToken.address, bigNumberVolumeInWei);
        txnReceipt = await txnResponse.wait();
        resolve(txnReceipt);
      } catch (error) {
        reject(error);
      }
    });
    return promise;
  }

  async setPayoutSchedule(library, _bountyId, _payoutSchedule) {
    const promise = new Promise(async (resolve, reject) => {
      const signer = library.getSigner();
      const contract = this.OpenQ(signer);
      try {
        let txnResponse;
        let txnReceipt;
        txnResponse = await contract.setPayoutSchedule(_bountyId, _payoutSchedule);
        txnReceipt = await txnResponse.wait();
        resolve(txnReceipt);
      } catch (error) {
        reject(error);
      }
    });
    return promise;
  }

  async setPayoutScheduleFixed(library, _bountyId, _payoutSchedule, payoutTokenAddress) {
    const promise = new Promise(async (resolve, reject) => {
      const signer = library.getSigner();
      const contract = this.OpenQ(signer);
      try {
        let txnResponse;
        let txnReceipt;
        txnResponse = await contract.setPayoutScheduleFixed(_bountyId, _payoutSchedule, payoutTokenAddress);
        txnReceipt = await txnResponse.wait();
        resolve(txnReceipt);
      } catch (error) {
        reject(error);
      }
    });
    return promise;
  }

  async approve(library, _bountyAddress, _tokenAddress, _value) {
    const promise = new Promise(async (resolve, reject) => {
      const signer = library.getSigner();

      const contract = this.ERC20(_tokenAddress, signer);
      try {
        const txnResponse = await contract.approve(_bountyAddress, _value);
        const txnReceipt = await txnResponse.wait();
        resolve(txnReceipt);
      } catch (error) {
        reject(error);
      }
    });
    return promise;
  }
  async approveNFT(library, _bountyAddress, _tokenAddress, _tokenId) {
    const promise = new Promise(async (resolve, reject) => {
      const signer = library.getSigner();

      const contract = this.ERC721(_tokenAddress, signer);
      try {
        const txnResponse = await contract.approve(_bountyAddress, _tokenId);
        const txnReceipt = await txnResponse.wait();
        resolve(txnReceipt);
      } catch (error) {
        reject(error);
      }
    });
    return promise;
  }

  async allowance(library, _callerAddress, _tokenAddress, _bountyAddress) {
    const promise = new Promise(async (resolve) => {
      try {
        const signer = library.getSigner();
        const contract = this.ERC20(_tokenAddress, signer);
        const allowance = await contract.allowance(_callerAddress, _bountyAddress);
        resolve(allowance);
      } catch (err) {
        resolve({ _hex: '0x00', _isBigNumber: true });
      }
    });
    return promise;
  }

  async balanceOf(library, _callerAddress, _tokenAddress) {
    const promise = new Promise(async (resolve, reject) => {
      const signer = library?.getSigner();
      if (!signer) {
        resolve({ noSigner: true });
      }
      const contract = this.ERC20(_tokenAddress, signer);
      try {
        let volume;
        if (_tokenAddress == ethers.constants.AddressZero) {
          volume = await library.getBalance(_callerAddress);
        } else {
          volume = await contract.balanceOf(_callerAddress);
        }
        resolve(volume);
      } catch (error) {
        reject(error);
      }
    });
    return promise;
  }

  async userOwnedTokenBalances(library, _callerAddress, tokens) {
    const promise = new Promise(async (resolve) => {
      const tokensInWallet = [];
      tokens.forEach(async (token) => {
        tokensInWallet.push(this.userBalanceForToken(library, token, _callerAddress));
      });
      resolve(Promise.all(tokensInWallet));
    });

    return promise;
  }

  async userBalanceForToken(library, token, _callerAddress) {
    const signer = library.getSigner();
    const zero = ethers.BigNumber.from(0);

    let promise = new Promise(async (resolve) => {
      let bigNumber;
      let balance;

      try {
        if (token.address == ethers.constants.AddressZero) {
          balance = await library.getBalance(_callerAddress);
        } else {
          const contract = this.ERC20(token.address, signer);
          balance = await contract.balanceOf(_callerAddress);
        }

        bigNumber = ethers.BigNumber.from(balance);
        resolve(!bigNumber.eq(zero));
      } catch (error) {
        resolve(false);
      }
    });

    return promise;
  }

  async getENS(_callerAddress) {
    let promise = new Promise(async (resolve) => {
      let ensName;
      try {
        let provider = new ethers.providers.InfuraProvider('homestead', process.env.NEXT_PUBLIC_INFURA_PROJECT_ID);
        let name = await provider.lookupAddress(_callerAddress);
        let reverseAddress = ethers.utils.getAddress(await provider.resolveName(name));
        // we need to check if their address is reverse registered
        if (ethers.utils.getAddress(_callerAddress) === reverseAddress) {
          ensName = name;
        }
        resolve(ensName);
      } catch (error) {
        resolve(false);
      }
    });
    return promise;
  }

  async fundBounty(library, _bountyAddress, _tokenAddress, _value, _depositPeriodDays) {
    const promise = new Promise(async (resolve, reject) => {
      const signer = library.getSigner();
      const contract = this.DepositManager(signer);
      try {
        const expiration = _depositPeriodDays * 24 * 60 * 60;

        let txnResponse;
        let txnReceipt;

        if (_tokenAddress == ethers.constants.AddressZero) {
          txnResponse = await contract.fundBountyToken(_bountyAddress, _tokenAddress, _value, expiration, {
            value: _value,
          });
        } else {
          txnResponse = await contract.fundBountyToken(_bountyAddress, _tokenAddress, _value, expiration);
        }
        txnReceipt = await txnResponse.wait();
        resolve(txnReceipt);
      } catch (error) {
        reject(error);
      }
    });
    return promise;
  }

  async getNFT(library, _tokenAddress, _tokenId) {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const signer = library.getSigner();
        const contract = new ethers.Contract(process.env.NEXT_PUBLIC_MOCK_NFT_TOKEN_ADDRESS, ERC721ABI.abi, signer);

        resolve({ name: await contract.name(), uri: await contract.tokenURI(_tokenId) });
      } catch (err) {
        reject(err);
      }
    });
    return promise;
  }

  async fundBountyWithNft(library, _bountyAddress, _tokenAddress, _tokenId, _depositPeriodDays) {
    const promise = new Promise(async (resolve, reject) => {
      const signer = library.getSigner();
      const contract = this.DepositManager(signer);

      try {
        const expiration = _depositPeriodDays * 24 * 60 * 60;

        let txnResponse;
        let txnReceipt;
        txnResponse = await contract.fundBountyNFT(_bountyAddress, _tokenAddress, _tokenId, expiration, 0);

        txnReceipt = await txnResponse.wait();
        resolve(txnReceipt);
      } catch (error) {
        reject(error);
      }
    });
    return promise;
  }

  /**
   *
   * @param {*} library
   * @param {*} _bountyAddress
   * @param { account money will be sent to} _closer
   * @param { pull request that's being chosen } _claimantAsset
   * @param {*} _tier
   * @returns {promise}
   */

  async claimBounty(library, _bountyAddress, _closer, _claimantAsset, _tier, _externalUserId, _externalUserName) {
    return new Promise(async (resolve, reject) => {
      const signer = library.getSigner();
      const contract = this.ClaimManager(signer);

      let abiCoder = new ethers.utils.AbiCoder();

      try {
        let closerData = abiCoder.encode(
          ['address', 'string', 'address', 'string', 'uint256'],
          [_bountyAddress, _externalUserName, _closer, _claimantAsset, _tier]
        );

        let txnResponse = await contract.directClaimTieredBounty(_bountyAddress, _externalUserId, closerData);

        let txnReceipt = await txnResponse.wait();
        resolve(txnReceipt);
      } catch (error) {
        reject(error);
      }
    });
  }

  async getAddressById(library, externalUserId, logger) {
    return new Promise(async (resolve, reject) => {
      const signer = library.getSigner();
      const contract = this.OpenQ(signer);
      logger.info(contract);
      try {
        const userId = await contract.externalUserIdToAddress(externalUserId);
        resolve(userId);
      } catch (error) {
        reject(error);
      }
    });
  }

  async closeOngoing(library, _bountyId) {
    const promise = new Promise(async (resolve, reject) => {
      const signer = library.getSigner();

      const contract = this.OpenQ(signer);
      try {
        let txnResponse = await contract.closeOngoing(_bountyId);
        let txnReceipt = await txnResponse.wait();
        resolve(txnReceipt);
      } catch (error) {
        reject(error);
      }
    });
    return promise;
  }

  async extendDeposit(library, _bountyAddress, _depositId, _depositPeriodDays) {
    const promise = new Promise(async (resolve, reject) => {
      const signer = library.getSigner();
      const contract = this.DepositManager(signer);
      try {
        const seconds = _depositPeriodDays * 24 * 60 * 60;
        const txnResponse = await contract.extendDeposit(_bountyAddress, _depositId, seconds);
        const txnReceipt = await txnResponse.wait();
        resolve(txnReceipt);
      } catch (err) {
        reject(err);
      }
    });
    return promise;
  }

  async refundDeposit(library, _bountyAddress, _depositId) {
    const promise = new Promise(async (resolve, reject) => {
      const signer = library.getSigner();
      const contract = this.DepositManager(signer);
      try {
        const txnResponse = await contract.refundDeposit(_bountyAddress, _depositId);
        const txnReceipt = await txnResponse.wait();
        resolve(txnReceipt);
      } catch (err) {
        reject(err);
      }
    });
    return promise;
  }

  async tokenAddressLimitReached(library, _bountyAddress) {
    const promise = new Promise(async (resolve, reject) => {
      const signer = library.getSigner();
      const contract = this.DepositManager(signer);
      try {
        const tokenAddressLimitReached = await contract.tokenAddressLimitReached(_bountyAddress);
        resolve(tokenAddressLimitReached);
      } catch (err) {
        reject(err);
      }
    });
    return promise;
  }

  async isWhitelisted(library, tokenAddress) {
    const promise = new Promise(async (resolve, reject) => {
      const signer = library.getSigner();
      const contract = this.DepositManager(signer);
      try {
        const isWhitelisted = await contract.isWhitelisted(tokenAddress);
        resolve(isWhitelisted);
      } catch (err) {
        reject(err);
      }
    });
    return promise;
  }

  fetchNfts = async (library, account) => {
    return new Promise(async (resolve, reject) => {
      if (process.env.NEXT_PUBLIC_DEPLOY_ENV === 'docker') {
        try {
          const localNfts = [];
          for (let i = 0; i < 6; i++) {
            const value = await this.getNFT(library, process.env.NEXT_PUBLIC_MOCK_NFT_TOKEN_ADDRESS, i);
            const { uri, name } = value;
            const fetchProm = await fetch(uri);
            const fetchJson = await fetchProm.json();
            const nftData = {
              token_address: process.env.NEXT_PUBLIC_MOCK_NFT_TOKEN_ADDRESS,
              token_id: i.toString(),
              amount: '1',
              contract_type: 'ERC721',
              metadata: fetchJson,
              name: name,
              token_uri: uri,
              symbol: 'MNFT',
            };
            localNfts[i] = nftData;
          }
          resolve(localNfts);
        } catch (err) {
          reject(err);
        }
      } else {
        try {
          const url = `https://deep-index.moralis.io/api/v2/${account}/nft?chain=polygon`;
          const headers = { 'X-API-Key': 'test', accept: 'application/json' };
          const fetchProm = await fetch(url, { headers });
          const fetchJson = await fetchProm.json();
          const nfts = fetchJson.result;
          resolve(
            nfts &&
              nfts
                .map((nft) => {
                  return { ...nft, metadata: nft.metadata && JSON.parse(nft.metadata) };
                })
                .filter((nft) => nft.contract_type === 'ERC721')
          );
        } catch (err) {
          reject(err);
        }
      }
    });
  };

  handleError(jsonRpcError, data) {
    let errorString = jsonRpcError?.data?.message;

    // Data messages - more specific than jsonRpcError.message
    if (errorString) {
      for (const error of jsonRpcErrors) {
        const revertString = Object.keys(error)[0];
        if (errorString.includes(revertString)) {
          const title = error[revertString]['title'];
          const message = error[revertString].message(data);
          const link = error[revertString].link;
          const linkText = error[revertString].linkText;
          return { title, message, link, linkText };
        }
      }
    }

    let miscError;
    if (typeof jsonRpcError === 'string') {
      if (jsonRpcError.includes('Ambire user rejected the request')) {
        miscError = 'USER_DENIED_TRANSACTION';
      }
      if (jsonRpcError.includes('Rejected Request')) {
        miscError = 'USER_DENIED_TRANSACTION';
      }
      if (jsonRpcError.includes('Transaction was rejected')) {
        miscError = 'USER_DENIED_TRANSACTION';
      }
    }

    if (jsonRpcError.message) {
      if (jsonRpcError.message.includes('Nonce too high.')) {
        miscError = 'NONCE_TO_HIGH';
      }
      if (jsonRpcError.message.includes('User denied transaction signature')) {
        miscError = 'USER_DENIED_TRANSACTION';
      }
      if (jsonRpcError.message.includes('Transaction was rejected')) {
        miscError = 'USER_DENIED_TRANSACTION';
      }
      if (jsonRpcError.message.includes('MetaMask is having trouble connecting to the network')) {
        miscError = 'METAMASK_HAVING_TROUBLE';
      }
      if (jsonRpcError.message.includes('Internal JSON-RPC error')) {
        miscError = 'INTERNAL_ERROR';
      }
      if (jsonRpcError.message.includes('Set a higher gas fee')) {
        miscError = 'UNDERPRICED_TXN';
      }
      if (jsonRpcError.message.includes('CFA: flow does not exist')) {
        miscError = 'CFA_DOES_NOT_EXIST';
      }
      if (jsonRpcError.message.includes('CFA: flow already exist')) {
        miscError = 'CFA_EXISTS';
      }
      if (jsonRpcError.message.includes('COMPETITION_ALREADY_CLOSED')) {
        miscError = 'COMPETITION_ALREADY_CLOSED';
      }
      if (jsonRpcError.message.includes('ONGOING_BOUNTY_ALREADY_CLOSED')) {
        miscError = 'ONGOING_BOUNTY_ALREADY_CLOSED';
      }
    }

    if (!miscError) {
      errorString = 'CALL_EXCEPTION';
      miscError = 'CALL_EXCEPTION';
    }

    for (const error of jsonRpcErrors) {
      const revertString = Object.keys(error)[0];
      if (miscError.includes(revertString)) {
        const title = error[revertString]['title'];
        const message = error[revertString].message(data);
        const link = error[revertString].link;
        const linkText = error[revertString].linkText;
        return { title, message, link, linkText };
      }
    }

    return 'Unknown Error';
  }
}

export default OpenQClient;
