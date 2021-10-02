import MockOpenQContractData from "../data/MockOpenQContractData.json";

class MockOpenQContract {
    getERC20Balance(_tokenAddress) {
        return MockOpenQContractData.getERC20Balance();
    }
}

export default MockOpenQContract;