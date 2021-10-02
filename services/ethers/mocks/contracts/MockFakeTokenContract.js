import MockFakeTokenContractData from '../data/MockFakeTokenContractData.json';

class MockFakeTokenContract {
    constructor() { }
    admin() { return MockFakeTokenContractData[admin]; }
    allowance(owner, spender) { return MockFakeTokenContractData[allowance]; }
    approve(spender, amount) { return MockFakeTokenContractData[approve]; }
    balanceOf(account) { return MockFakeTokenContractData[balanceOf]; }
    decimals() { return MockFakeTokenContractData[decimals]; }
    decreaseAllowance(spender, subtractedValue) { return MockFakeTokenContractData[decreaseAllowance]; }
    increaseAllowance(spender, addedValue) { return MockFakeTokenContractData[increaseAllowance]; }
    name() { return MockFakeTokenContractData[name]; }
    symbol() { return MockFakeTokenContractData[symbol]; }
    totalSupply() { return MockFakeTokenContractData[totalSupply]; }
    transfer(recipient, amount) { return MockFakeTokenContractData[transfer]; }
    transferFrom(sender, recipient, amount) { return MockFakeTokenContractData[transferFrom]; }
}
export default MockFakeTokenContract;