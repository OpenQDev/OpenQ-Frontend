const Contract = require('../../../artifacts/contracts/FakeToken.sol/FakeToken.json');
// import all abis from artifacts/

// extend to also return mockData 
// find a way to even generate this based off of the ABI outputs values, just like input
// build a bunch of fake addresses etc into the library
// Add a header comment that reads "This mock contract was generated using EthMock."

let functionCount = 0;

function extractInputNames(inputs) {
	const inputNames = [];
	if (inputs) {
		for (input of inputs) {
			let inputName = '';

			if (input.name) {
				inputName = input.name;
			} else {
				inputName = input.type;
			}

			inputNames.push(inputName);
		}
	}
	return inputNames;
}

// function extractOutputTypes(outputs) {

// }

// for contract of contracts
const mockContractName = `Mock${Contract.contractName}Contract`;
console.log(`import ${mockContractName}Data from '../data/${mockContractName}Data.json'`);
console.log(`class ${mockContractName} {`);

for (member of Contract.abi) {
	let name = '';
	let memberType = '';
	let inputNames = [];
	let functionSignature = '';
	let functionBody = '';

	switch (member.type) {
	case 'constructor':
		memberType = member.type;
		inputNames = extractInputNames(member.inputs);
		functionSignature = `${memberType} (${inputNames.toString()})`;
		functionBody = ' { }';
		console.log(functionSignature + functionBody);
		break;
	case 'function':
		functionCount += 1;
		memberType = member.type;
		name = member.name;
		inputNames = extractInputNames(member.inputs);
		functionSignature = `async ${name}(${inputNames.toString()})`;

		// if number, wrap in BigNumber
		functionBody = ` { return new Promise((resolve, reject) => resolve(${mockContractName}Data['${name}'])) }`;

		console.log(functionSignature + functionBody);
		break;
	default:
		break;
	}
}

console.log('}');
console.log(`export default ${mockContractName}`);

console.log('Function count: ', functionCount);
