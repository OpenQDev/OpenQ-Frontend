import { ethers } from 'ethers';
import _ from 'lodash';
import tierWinnerTransactionTemplate from '../constants/tierWinnerTransactionTemplate.json';

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
    return !tiersClaimedPreviouslyInBatch.includes(index);
  });

  return filteredIndexesOnTierWinnerPrevious.length == 0 ? null : filteredIndexesOnTierWinnerPrevious[0];
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
    const tiersClaimedPreviouslyInBatch = [];

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
          payoutSchedule,
          tierWinners ? tierWinners : [],
          tiersClaimedPreviouslyInBatch,
          bigNumberTierVolume
        );

        if (tier == null) {
          return reject(
            `User ${winnerGithubProfileUrl} for bounty ${githubIssueUrl} has no available tiers for ${tierAmount}.\ Tier winners are ${tierWinners}}. Payout schedule is ${payoutSchedule}`
          );
        }

        tiersClaimedPreviouslyInBatch.push(tier);

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
};
