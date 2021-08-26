const Token = artifacts.require("MyToken");
const TokenSale = artifacts.require("MyTokenSale")
const Kyc = artifacts.require("KycContract");

let chai = require("./SetupChai.js");
const BN = web3.utils.BN;

const expect = chai.expect;

require("dotenv").config({path: "../.env"});

contract("MyTokenSell Test", async accounts => {
    const [intialHolder, receipent, anotherAccount] = accounts;

    it("Deployment Account should not have token after publish smart contract", async () => {
        let instance = await Token.deployed();

        await expect(instance.balanceOf(intialHolder)).to.eventually.be.a.bignumber.equal(new BN(0));
    });

    it("All token should be in tokensale smart contract", async () => {
        let instance = await Token.deployed();
        let balance = await instance.balanceOf.call(TokenSale.address);
        let totalSupply = await instance.totalSupply.call();

        return expect(balance).to.be.a.bignumber.equal(totalSupply);
    });

    it("should be possible to buy one token by simply sending ether to smart contract", async () => {
        let tokenInstance = await Token.deployed();
        let tokenSaleInstance = await TokenSale.deployed();
        let balanceBeforeAccount = await tokenInstance.balanceOf.call(receipent);

        await expect(tokenSaleInstance.sendTransaction({from: receipent, value: web3.utils.toWei("1","wei")})).to.be.rejected;
        await expect(balanceBeforeAccount).to.be.bignumber.equal(await tokenInstance.balanceOf.call(receipent));

        let kycInstance = await Kyc.deployed();
        await kycInstance.setKycCompleted(receipent);
        await expect(tokenSaleInstance.sendTransaction({from: receipent, value: web3.utils.toWei("1", "wei")})).to.be.fulfilled;
        return expect(balanceBeforeAccount + 1).to.be.bignumber.equal(await tokenInstance.balanceOf.call(receipent));
    });
});