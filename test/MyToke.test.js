const Token = artifacts.require("MyToken");

let chai = require("./SetupChai.js");
const BN = web3.utils.BN;

const expect = chai.expect;

require("dotenv").config({path: "../.env"});

contract("MyToken Test", async accounts => {
    const [initialHolder, recipient, anotherAccount] = accounts;

    beforeEach( async() => {
        this.myToken = await Token.new(process.env.INITIAL_TOKENS);
    });

    it("All tokens should be in my account", async () => {
        let instance = this.myToken;
        let totalSupply = await instance.totalSupply();

        // old style
        // let balance = await instance.balanceOf.call(initialHolder);
        // console.log(balance.valueOf());
        // assert.equal(balance.valueOf(), 0, "Account 1 has balance");

        await expect(instance.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(totalSupply);
    });

    it("I can send tokens from Account 1 to Account 2", async () => {
        const sendToken = 1;
        let instance = this.myToken;
        let totalSupply = await instance.totalSupply();

        console.log(await instance.balanceOf(initialHolder));
        await expect(instance.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(totalSupply);
        await expect(instance.transfer(recipient, sendToken)).to.eventually.be.a.fulfilled;
        await expect(instance.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(totalSupply.sub(new BN(sendToken)));
    });

    it("It is not possible to send more tokens than account 1 has", async () => {
        let instance = this.myToken;
        let balanceOfAmount = await instance.balanceOf(initialHolder);
        await expect(instance.transfer(recipient, new BN(balanceOfAmount + 1))).to.eventually.be.rejected;

        // check if the balance still same
        await expect(instance.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(balanceOfAmount);
    });


});