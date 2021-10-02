const OpenQ = require("../../../artifacts/contracts/OpenQ.sol/OpenQ.json");
const MockOpenQContractData = require("./data/MockOpenQContractData.json");
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
            let inputName = "";

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

function extractOutputTypes(outputs) {

}

// for contract of contracts
// create a file in mocks/contracts called `${contract.contractName}.js`
// start with class Mock${contract.contractName}, then open class body

for (member of OpenQ.abi) {
    let name = "";
    let memberType = "";
    let inputNames = [];
    let functionSignature = "";
    let funtionBody = "";

    switch (member.type) {
        case "constructor":
            memberType = member.type;
            inputNames = extractInputNames(member.inputs);
            functionSignature = `${memberType} ${name}(${inputNames.toString()})`;
            functionBody = ` { }`;
            break;
        case "function":
            functionCount += 1;
            memberType = member.type;
            name = member.name;
            inputNames = extractInputNames(member.inputs);
            functionSignature = `${memberType} ${name}(${inputNames.toString()})`;
            functionBody = ` { return ${MockOpenQContractData[name]}; }`;
            break;
        default:
            break;
    }

    console.log(functionSignature + functionBody);
}

console.log("Function count: ", functionCount);
