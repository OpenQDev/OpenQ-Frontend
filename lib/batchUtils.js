import { ethers } from 'ethers';
import _ from 'lodash';
import tierWinnerTransactionTemplate from '../constants/tierWinnerTransactionTemplate.json';
import supportingDocumentsCompleteTransactionTemplate from '../constants/supportingDocumentsCompleteTransactionTemplate.json';

const convertCsvToJson = (csvData) => {
  const headers = csvData[0];
  const rows = csvData.slice(1);
  const jsonData = rows.map((row) => {
    const jsonObject = {};
    row.forEach((cell, index) => {
      jsonObject[headers[index]] = cell;
    });
    return jsonObject;
  });
  return jsonData;
};

const convertPayoutScheduleToBigInt = (payoutSchedule, decimals) => {
  const payoutScheduleParsed = payoutSchedule && JSON.parse(payoutSchedule);

  const newPayoutSchedule = payoutScheduleParsed.map((tierVolume) => {
    let formattedVolume = tierVolume * 10 ** decimals;
    return ethers.BigNumber.from(formattedVolume.toLocaleString('fullwide', { useGrouping: false }));
  });

  return newPayoutSchedule;
};

const abiEncodeTieredFixed = (initializationData) => {
  let abiCoder = new ethers.utils.AbiCoder();
  const initializationSchema = ['uint256[]', 'address', 'bool', 'bool', 'bool', 'string', 'string', 'string'];

  for (let i = 0; i < initializationData.length; i++) {
    if (initializationData[i] === 'TRUE') {
      initializationData[i] = 1;
    } else if (initializationData[i] === 'FALSE') {
      initializationData[i] = 0;
    }
  }

  const tieredFixedEncoded = abiCoder.encode(initializationSchema, initializationData);

  let tieredFixed = [3, `\"${tieredFixedEncoded}\"`];

  return tieredFixed;
};

const getUnclaimedTierWithVolume = (
  bountyId,
  payoutSchedule,
  tierWinners,
  tiersClaimedPreviouslyInBatch,
  bigNumberTierVolume
) => {
  const indexes = [];

  payoutSchedule.forEach((value, index) => {
    if (ethers.BigNumber.from(value).eq(bigNumberTierVolume)) {
      indexes.push(index);
    }
  });

  let filteredIndexesOnTierWinner = indexes;
  if (tierWinners.length > 0) {
    filteredIndexesOnTierWinner = indexes.filter((index) => {
      return tierWinners[index] === '';
    });
  }

  const filteredIndexesOnTierWinnerPrevious = filteredIndexesOnTierWinner.filter((index) => {
    let previousTiers = [];
    if (tiersClaimedPreviouslyInBatch[bountyId]) {
      previousTiers = tiersClaimedPreviouslyInBatch[bountyId];
    } else {
      previousTiers = [];
    }

    return !previousTiers.includes(index);
  });

  return filteredIndexesOnTierWinnerPrevious.length == 0 ? null : filteredIndexesOnTierWinnerPrevious[0];
};

const getSetSupportingDocumentsCompleteTransactions = async (
  jsonData,
  openQAddress,
  loadGithubData,
  loadGithubDataUser,
  loadOnChainBounty
) => {
  return new Promise(async (resolve, reject) => {
    const transactions = [];

    for (const transactionData of jsonData) {
      const { githubIssueUrl, winnerGithubProfileUrl } = transactionData;

      try {
        const { bountyId } = await loadGithubData(githubIssueUrl);
        const { tierWinners } = await loadOnChainBounty(bountyId);

        let userId;
        try {
          userId = await loadGithubDataUser(winnerGithubProfileUrl);
        } catch (error) {
          return reject(`Failed to load user for URL ${winnerGithubProfileUrl}. Is the case correct?`);
        }

        const tier = tierWinners.findIndex((tierWinner) => tierWinner === userId);

        if (tier == -1) {
          return reject(`User ${winnerGithubProfileUrl} for bounty ${githubIssueUrl} is not in ${tierWinners}.`);
        }

        const abiCoder = new ethers.utils.AbiCoder();
        const _data = abiCoder.encode(['uint256', 'bool'], [tier, true]);

        const supportingDocsBatchTransactionCopy = _.cloneDeep(supportingDocumentsCompleteTransactionTemplate);

        supportingDocsBatchTransactionCopy.to = openQAddress;

        supportingDocsBatchTransactionCopy.contractInputsValues._bountyId = bountyId;
        supportingDocsBatchTransactionCopy.contractInputsValues._data = _data;

        transactions.push(supportingDocsBatchTransactionCopy);
      } catch (err) {
        return reject(err);
      }
    }

    return resolve(transactions);
  });
};

const mapIdToArray = (map, id, element) => {
  // Check if the id already exists in the map
  if (map[id]) {
    // If it exists, push the element onto the array at that index
    map[id].push(element);
  } else {
    // If it doesn't exist, create a new array with the element and map it to the id
    map[id] = [element];
  }

  return map;
};

const getTierWinnerTransactions = async (
  jsonData,
  openQAddress,
  loadGithubData,
  loadGithubDataUser,
  loadOnChainBounty,
  tokenClient
) => {
  return new Promise(async (resolve, reject) => {
    const transactions = [];
    const tiersClaimedPreviouslyInBatchForBounty = {};

    for (const transactionData of jsonData) {
      const { githubIssueUrl, tierAmount, winnerGithubProfileUrl } = transactionData;

      try {
        const { bountyId } = await loadGithubData(githubIssueUrl);

        const bounty = await loadOnChainBounty(bountyId);

        const { payoutSchedule, payoutTokenAddress, tierWinners } = bounty;

        const { decimals } = await tokenClient.getToken(ethers.utils.getAddress(payoutTokenAddress));

        let formattedVolume = tierAmount * 10 ** decimals;

        const bigNumberTierVolume = ethers.BigNumber.from(
          formattedVolume.toLocaleString('fullwide', { useGrouping: false })
        );

        const tier = getUnclaimedTierWithVolume(
          bountyId,
          payoutSchedule,
          tierWinners ? tierWinners : [],
          tiersClaimedPreviouslyInBatchForBounty,
          bigNumberTierVolume
        );

        if (tier == null) {
          return reject(
            `User ${winnerGithubProfileUrl} for bounty ${githubIssueUrl} has no available tiers for ${tierAmount}.\ Tier winners are ${tierWinners}}. Payout schedule is ${payoutSchedule}`
          );
        }

        mapIdToArray(tiersClaimedPreviouslyInBatchForBounty, bountyId, tier);

        let userId;
        try {
          userId = await loadGithubDataUser(winnerGithubProfileUrl, tier);
        } catch (error) {
          return reject(`Failed to load user for URL ${winnerGithubProfileUrl}. Is the case correct?`);
        }

        const tierWinnerTransactionTemplateCopy = _.cloneDeep(tierWinnerTransactionTemplate);

        tierWinnerTransactionTemplateCopy.to = openQAddress;

        tierWinnerTransactionTemplateCopy.contractInputsValues._bountyId = bountyId;
        tierWinnerTransactionTemplateCopy.contractInputsValues._tier = tier.toString();
        tierWinnerTransactionTemplateCopy.contractInputsValues._winner = userId;

        transactions.push(tierWinnerTransactionTemplateCopy);
      } catch (err) {
        return reject(err);
      }
    }

    return resolve(transactions);
  });
};

export {
  convertPayoutScheduleToBigInt,
  convertCsvToJson,
  abiEncodeTieredFixed,
  getUnclaimedTierWithVolume,
  getTierWinnerTransactions,
  getSetSupportingDocumentsCompleteTransactions,
};
