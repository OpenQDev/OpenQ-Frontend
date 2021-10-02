import MockOpenQContract from "./mocks/contracts/MockOpenQContract";
import MockFakeTokenContract from "./mocks/contracts/MockFakeTokenContract";

class MockOpenQClient {
    constructor() { }

    OpenQ = () => {
        return new MockOpenQContract();
    };

    ERC20 = (tokenAddress) => {
        return new MockFakeTokenContract();
    };
};

export default MockOpenQClient;