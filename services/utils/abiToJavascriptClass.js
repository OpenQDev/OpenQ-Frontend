const OpenQ = require("../../artifacts/contracts/OpenQ.sol/OpenQ.json");

let functionCount = 0;
let evenCount = 0;

for (member of OpenQ.abi) {
    switch (member.type) {
        case "constructor":
            break;
        case "function":
            functionCount += 1;
            const name = member.name;
            const inputNames = [];
            const inputs = member.inputs;

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
            console.log(`function ${name}(${inputNames.toString()}) {}`);
            break;
        case "event":
            evenCount += 1;
            break;
        default:
            break;
    }
}

console.log("Function count: ", functionCount);
console.log("Event count: ", evenCount);
;;;
