import MockOpenQContract from "./mocks/contracts/MockOpenQContract";

class MockOpenQClient {
    constructor() { }

    OpenQ = () => {
        return new MockOpenQContract();
    };

    Contract = (tokenAddress, abi) => {
        return new MockFakeTokenContract();
    };
}

export default MockOpenQClient;