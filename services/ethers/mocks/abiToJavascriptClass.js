const OpenQ = require("../../../artifacts/contracts/OpenQ.sol/OpenQ.json");
const MockOpenQContractData = require("./mockData/MockOpenQContractData.json");

// extend to also return mockData 
// find a way to even generate this based off of the ABI outputs values, just like input
// build a bunch of fake addresses etc into the library

let functionCount = 0;
let evenCount = 0;

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
        case "event":
            evenCount += 1;
            memberType = member.type;
            name = member.name;
            inputNames = extractInputNames(member.inputs);
            functionSignature = `${memberType} ${name}(${inputNames.toString()})`;
            break;
        default:
            break;
    }

    console.log(functionSignature + functionBody);
}

console.log("Function count: ", functionCount);
console.log("Event count: ", evenCount);
