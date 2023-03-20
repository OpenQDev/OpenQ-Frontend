import { ethers } from 'ethers';

const convertPayoutScheduleToBigInt = async (payoutSchedule, decimals) => {
	const payoutScheduleParsed = payoutSchedule && JSON.parse(payoutSchedule);

	let decimals = parseInt(token.decimals) || 18;

	const newPayoutSchedule = payoutScheduleParsed.map((tierVolume) => {
		let formattedVolume = tierVolume * 10 ** decimals;
		return ethers.BigNumber.from(formattedVolume.toLocaleString('fullwide', { useGrouping: false }));
	});

	return newPayoutSchedule;
}

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

export { convertPayoutScheduleToBigInt, convertCsvToJson }