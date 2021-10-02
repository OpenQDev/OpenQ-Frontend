import MockOpenQContractData from "../mockData";

class MockOpenQContract {
    getERC20Balance(_tokenAddress) {
        return MockOpenQContractData.getERC20Balance();
    }
}

export default MockOpenQContract;