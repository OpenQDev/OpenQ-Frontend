import { Framework } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";
import tokensIndexable from "./tokens-indexable.json";
import tokensEnumerable from "./tokens-enumerable.json";

/* Note:
	const usdc = usdcx.underlyingToken.contract.connet(library.getSigner());
	const totalSupply = await usdc.totalSupply();
	
	this way you can access the underlaying token of some superToken
	and send transactions
*/

class SuperfluidClient {

	constructor() {
		switch (process.env.NEXT_PUBLIC_DEPLOY_ENV) {
			case 'local':
				this.openqIndexableTokens = tokensIndexable;
				this.openqEnumerableTokens = tokensEnumerable;
				break;
			case 'docker':
				this.openqIndexableTokens = tokensIndexable;
				this.openqEnumerableTokens = tokensEnumerable;
				break;
			case 'staging':
				this.openqIndexableTokens = tokensIndexable;
				this.openqEnumerableTokens = tokensEnumerable;
				break;
			case 'production':
				this.openqIndexableTokens = tokensIndexable;
				this.openqEnumerableTokens = tokensEnumerable;
				break;
		}
	}

	/**
	 * We do not have the Web3 library available on the construction of SuperfluidClient in InitialState, so we must create it
	 * via a setter
	 */
	async createInstance(library) {
		try {
			if (!this.instance) {
				const tempInstance = await Framework.create({
					chainId: 31337,
					provider: library,
					dataMode: 'WEB3_ONLY',
					resolverAddress: process.env.NEXT_PUBLIC_SUPERFLUID_RESOLVER_ADDRESS,
					protocolReleaseVersion: "test"
				});
				this.instance = tempInstance;
				return tempInstance;
			}
			return this.instance;
		} catch (err) {
			console.log(err);
			console.log(library);
		}
	}

	async createSigner(library) {
		if (!this.signer) {
			const instance = await this.createInstance(library);
			const tempSigner = instance.createSigner({ web3Provider: library });
			this.signer = tempSigner;
		}
		return this.signer;
	}

	// UPGRADE + CREATE STREAM
	async approve(library, address, amount) {
		const amountInWei = ethers.utils.parseEther(amount);
		const superToken = await this.loadSuperToken(
			library,
			address
		);
		const unwrappedToken = superToken.underlyingToken.contract.connect(library.getSigner());
		try {
			const tx = await unwrappedToken.approve(address, amountInWei);
			await tx.wait();
			console.log(tx);
		} catch (error) {
			throw new Error(error);
		}
	}

	// UPGRADE + CREATE STREAM
	async upgradeToken(library, address, amount) {
		const superToken = await this.loadSuperToken(library, address);
		const upgradeOp = superToken.upgrade({
			amount: amount.toString(),
		});
		return upgradeOp;
	}

	async superTokenCreateFlow(library, address, sender, receiver, flowRate) {
		const superToken = await this.loadSuperToken(library, address);
		const createFlowOp = superToken.createFlow({
			sender,
			receiver,
			flowRate,
		});
		return createFlowOp;
	}

	async upgradeAndCreateFlowBacth(library, address, amountPerDay, sender, receiver) {
		const instance = await this.createInstance(library);
		console.log(instance);
		const signer = await this.createSigner(library);

		const allowance = await this.allowance(library, sender, address);

		const upgradeOp = await this.upgradeToken(
			library,
			address,
			ethers.utils.parseEther(amountPerDay.toString())
		);

		const createFlowOp = await this.superTokenCreateFlow(
			library,
			address,
			sender,
			receiver,
			this.calculateFlowRateInWeiPerSecond(amountPerDay),
		);

		return await instance.batchCall([
			upgradeOp,
			createFlowOp
		]).exec(signer);
	}

	async updateFlow(library, sender, receiver, amountPerDay, address) {
		const instance = await this.createInstance(library);
		const signer = await this.createSigner(library);

		const allowance = await this.allowance(library, sender, address);

		const updateFlowOp = instance.cfaV1.updateFlow({
			superToken: address,
			sender,
			receiver,
			flowRate: this.calculateFlowRateInWeiPerSecond(amountPerDay),
		});
		return await updateFlowOp.exec(signer);
	}

	/**
	 * 
	 * @param {Web3 Provider} library 
	 * @param {*} amount 
	 * @param {*} address 
	 * @returns 
	 * @description Downgrading is essentially the equivalent of withdrawing from the stream
	 */
	async downgradeToken(library, amount, address) {
		const superToken = this.loadSuperToken(library, address);
		const upgradeOp = superToken.downgrade({
			amount: amount.toString(),
		});
		return await upgradeOp.exec(signer);
	}

	async deleteFlow(library, sender, receiver, address) {
		const instance = await this.createInstance(library);
		const signer = await this.createSigner(library);
		const deleteFlowOp = instance.cfaV1.deleteFlow({
			superToken: address,
			sender,
			receiver,
		});
		return await deleteFlowOp.exec(signer);
	}

	// UTILS
	async loadSuperToken(library, address) {
		const instance = await this.createInstance(library);
		const token = await instance.loadSuperToken(address);
		return token;
	}

	async getFlow(library, sender, receiver, address) {
		const instance = await this.createInstance(library);
		return instance.cfaV1.getFlow({
			superToken: address,
			sender,
			receiver,
		});
	}

	async getAccountFlowInfo(library, account, address) {
		const instance = await this.createInstance(library);
		return instance.cfaV1.getAccountFlowInfo({
			superToken: address,
			account,
		});
	}

	async getNetFlow(library, account, address) {
		const instance = await this.createInstance(library);
		return instance.cfaV1.getNetFlow({
			superToken: address,
			account,
		});
	}

	async balanceOf(library, account, address) {
		const superToken = this.loadSuperToken(library, address);
		return await superToken.balanceOf({ account });
	}

	async allowance(library, account, superTokenAddress) {
		const superToken = await this.loadSuperToken(library, superTokenAddress);
		const unwrappedToken = superToken.underlyingToken.contract.connect(library.getSigner());
		const allowanceBigNumber = await unwrappedToken.allowance(account, superTokenAddress);
		return allowanceBigNumber.toString();
	}

	async realtimeBalanceOf(library, account, timestamp, address) {
		const superToken = this.loadSuperToken(library, address);
		return await superToken.realtimeBalanceOf({
			account,
			timestamp,
		});
	}

	calculateFlowRateInWeiPerSecond(amountPerDay) {
		const parsedAmountPerDayInWei = ethers.utils.parseEther(amountPerDay.toString());
		const flowRateInWeiPerSecond = parsedAmountPerDayInWei.div(
			ethers.utils.formatUnits(60 * 60 * 24, 0)
		);
		return flowRateInWeiPerSecond.toString();
	}
};

export default SuperfluidClient;