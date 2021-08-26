const myToken = artifacts.require("./MyToken.sol");
const myTokenSale = artifacts.require("./MyTokenSale.sol");
const myKyc = artifacts.require("./KycContract.sol");

require("dotenv").config({path: "../.env"});

// console.log(process.env);

module.exports = async function(deployer) {
    let addr = await web3.eth.getAccounts();
    await deployer.deploy(myToken, process.env.INITIAL_TOKENS);
    await deployer.deploy(myKyc);
    await deployer.deploy(myTokenSale, 1, addr[0], myToken.address, myKyc.address);
    let tokenInstance = await myToken.deployed();
    await tokenInstance.transfer(myTokenSale.address, process.env.INITIAL_TOKENS);
}   