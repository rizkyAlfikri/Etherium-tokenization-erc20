import React, { Component } from "react";
import "./App.css";
import KycContract from "./contracts/KycContract.json";
import MyToken from "./contracts/MyToken.json";
import MyTokenSale from "./contracts/MyTokenSale.json";
import getWeb3 from "./getWeb3";


class App extends Component {
  state = { isLoading: true, kycAddress: "0x123...", tokenSaleAddress: null, userToken: 0 };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();

      this.myTokenContract = new this.web3.eth.Contract(
        MyToken.abi,
        MyToken.networks[this.networkId] && MyToken.networks[this.networkId].address,
      );

      this.myTokenSaleContract = new this.web3.eth.Contract(
        MyTokenSale.abi,
        MyTokenSale.networks[this.networkId] && MyTokenSale.networks[this.networkId].address,
      );

      this.kycContract = new this.web3.eth.Contract(
        KycContract.abi,
        KycContract.networks[this.networkId] && KycContract.networks[this.networkId].address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      console.log( await this.accounts)
      this.listenTokenTransferEvent();
      this.setState({ isLoading: false, tokenSaleAddress: MyTokenSale.networks[this.networkId].address }, this.updateUserToken);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  handleInput = (event) => {
    const target = event.target;
    const value = target === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleKycSubmit = async () => {
    const { kycAddress } = this.state;
    await this.kycContract.methods.setKycCompleted(kycAddress).send({ from: this.accounts[0] });
    alert("Account " + kycAddress + " is now whitelisted")
  }

  handleBuyToken = async () => {
    await this.myTokenSaleContract.methods.buyTokens(this.accounts[0]).send({ from: this.accounts[0], value: 1 });
  }

  updateUserToken = async () => {
    let userTokens = await this.myTokenContract.methods.balanceOf(this.accounts[0]).call();
    this.setState({ userToken: userTokens });
  }

  listenTokenTransferEvent = () => {
    this.myTokenContract.events.Transfer({ to: this.accounts[0] }).on("data", this.updateUserToken);
  }

  checkKycStatus = async () => {
    const { kycAddress } = this.state;
    const status = await this.kycContract.methods.checkKycStatus(kycAddress).send({from: this.accounts[0]});
    console.log(status)
    // let kycStatus = await status.events.KycStatus.returnValues.kycStatus;
    alert("Account " + kycAddress + " is " + " whitelisted")
  }

  render() {
    if (this.state.isLoading) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Star Tokens</h1>
        <h2>Crowdsale Token Example</h2>
        Input your address here <input type="text" name="kycAddress" value={this.state.kycAddress} onChange={this.handleInput} />
        <button type="button" onClick={this.handleKycSubmit}>Add Address to Whitelisted</button>
        <br />
        <button type="button" onClick={this.checkKycStatus}>Check Kyc Status</button>
        <h3>If you want to buy token, please send Wei to this address {this.state.tokenSaleAddress}</h3>
        <p>You have {this.state.userToken}</p>
        <button type="button" onClick={this.handleBuyToken}>Buy one token</button>
      </div>
    );
  }
}

export default App;
