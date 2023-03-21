import { ethers } from 'ethers';

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

export { convertPayoutScheduleToBigInt, convertCsvToJson, abiEncodeTieredFixed };
