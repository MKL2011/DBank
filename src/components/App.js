import { Tabs, Tab } from 'react-bootstrap'
import dBank from '../abis/dBank.json'
import React, { Component } from 'react';
import Token from '../abis/Token.json'
import dbank from '../dbank.png';
import Web3 from 'web3';
import './App.css';

//h0m3w0rk - add new tab to check accrued interest

class App extends Component {

  async componentWillMount() {
    await this.loadBlockchainData(this.props.dispatch)
  }

  async loadBlockchainData(dispatch) {
    //check if MetaMask exists
if(typeof window.ethereum !== 'undefined'){
        //assign to values to variables: web3, netId, accounts

  const web3 = new Web3(window.ethereum)
  const netId = await web3.eth.net.getId()
  console.log(netId)
  const accounts = await web3.eth.getAccounts()
  console.log(accounts);
        //check if account is detected, then load balance&setStates, elsepush alert
  if(typeof accounts[0] !== 'undefined'){

  const balance = await web3.eth.getBalance(accounts[0])
console.log(balance)
this.setState({account : accounts[0] , balance, web3} );
  }
      //in try block load contracts
      try {
        const token = new web3.eth.Contract(Token.abi, Token.networks[netId].address)
        const dbank = new web3.eth.Contract(dBank.abi, dBank.networks[netId].address)
        const dBankAddress = dBank.networks[netId].address
        this.setState({token: token, dbank: dbank, dBankAddress: dBankAddress})
      } catch (e) {
        console.log('Error', e)
        window.alert('Contracts not deployed to the current network')
      }

    } else {
      window.alert('Please install MetaMask')
    }
  }

  async deposit(amount) {
    if(this.state.dbank!=='undefined'){
      try{
        await this.state.dbank.methods.deposit().send({value: amount.toString(), from: this.state.account})
      } catch (e) {
        console.log('Error, deposit: ', e)
      }
    }
  }

  async withdraw(e) {
    //prevent button from default click
    //check if this.state.dbank is ok
    //in try block call dBank withdraw();
  }

  constructor(props) {
    super(props)
    this.state = {
      web3: 'undefined',
      account: '',
      token: null,
      dbank: null,
      balance: 0,
      dBankAddress: null
    }
  }

  render() {
    return (
      <div className='text-monospace'>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
        <img src={dbank} className="App-logo" alt="logo" height="32"/>
          <b>dBank</b>
        </a>
        </nav>
        <div className="container-fluid mt-5 text-center">
        <br></br>
        <h1>Welcome to d₿ank</h1>
          <h2>{this.state.account}</h2>
          <br></br>
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
              <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
              <Tab eventKey="deposit" title = "Deposit">
                <div>
                  <br></br>How much deposit?
                  <br></br>Minimum deposit amount is 0.01 ETH
                  <br></br>1 deposit at time
                </div>
                <form onSubmit={(e) => {
e.preventDefault()
let amount = this.depositAmount.value
amount = amount * 10**18
this.deposit(amount)

                }
                }>
                  
                  <div className='form-group mr-sm-2'>
                      <br></br>
                        <input
                        id='depositAmount'
                        type='number'
                        step='0.01'
                        ref={input => {this.depositAmount = input}}
                        className="form-control form-control-md"
                          placeholder='amount...'
                          required/>
                <button type='submit' className='btn btn-primary'>DEPOSIT</button>
</div>
                </form>
                </Tab>
                <Tab eventKey="withdraw" title = "Withdraw">
                <div>
                  <br></br>How much withdraw with interes?
                </div>
                </Tab>              </Tabs>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;