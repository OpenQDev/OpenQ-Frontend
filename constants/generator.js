const fs = require('fs');

const polygonTokens = require('./polygon-mainnet-tokens.json');
const mumbaiTokens = require('./polygon-mumbai-tokens.json');

function parse(tokensArray, fileOutput) {
	let tokenMap = {};

	for (let token of tokensArray) {
		tokenMap[token['address']] = token;
	}

	fs.writeFile(fileOutput, JSON.stringify(tokenMap), 'utf8', function (err) {
		if (err) {
			console.log('An error occured while writing JSON Object to File.');
			return console.log(err);
		}

		console.log('JSON file has been saved.');
	});
}

parse(polygonTokens, 'polygon-mainnet.json');
parse(mumbaiTokens, 'polygon-mumbai.json');
