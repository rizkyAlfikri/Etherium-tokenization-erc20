const path = require("path");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const MetaMaskAccountIndex = 0;
require("dotenv").config({ path: "./.env" });


module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
      port: 7545,
      host: "127.0.0.1",
      network_id: 5777,
    },
    ganache_local: {
      network_id: 5777,
      provider: function () {
        return new HDWalletProvider(process.env.MNEMONIC, "http://127.0.0.1:7545", MetaMaskAccountIndex)
      },
    },
    gorli_infura: {
      network_id: 5,
      provider: function() {
        return new HDWalletProvider(process.env.MNEMONIC, "https://goerli.infura.io/v3/b8a499e007894ab7a394bddcfb5ba3c3", MetaMaskAccountIndex)
      }
    },
    ropsten_infura: {
      network_id: 3,
      provider: function() {
        return new HDWalletProvider(process.env.MNEMONIC, "https://ropsten.infura.io/v3/b8a499e007894ab7a394bddcfb5ba3c3", MetaMaskAccountIndex)
      }
    }
  },
  compilers: {
    solc: {
      version: "^0.8.0"
    }
  }
};
