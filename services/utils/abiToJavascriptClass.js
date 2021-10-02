const OpenQ = require("../../artifacts/contracts/Issue.sol/Issue.json");

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
    let memberType = "";
    let name = "";
    let inputNames = [];

    switch (member.type) {
        case "constructor":
            memberType = member.type;
            inputNames = extractInputNames(member.inputs);
            break;
        case "function":
            functionCount += 1;
            memberType = member.type;
            name = member.name;
            inputNames = extractInputNames(member.inputs);
            break;
        case "event":
            evenCount += 1;
            memberType = member.type;
            name = member.name;
            inputNames = extractInputNames(member.inputs);
            break;
        default:
            break;
    }

    console.log(`${memberType} ${name}(${inputNames.toString()}) {}`);
}

console.log("Function count: ", functionCount);
console.log("Event count: ", evenCount);
;;;
