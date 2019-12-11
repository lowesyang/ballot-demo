import React from "react";
import logo from "./logo.png";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, Button, Spinner, Alert } from "react-bootstrap";
import Web3 from "web3";

const CONTRACT = "0x545B536ec83E473BC79480A0d05Fe991122E921a";
let web3 = window.web3;

class App extends React.Component {
  state = {
    loading: false,
    proposal: "",
    winning: ""
  };
  constructor() {
    super();
  }

  componentWillMount() {
    window.addEventListener("load", async () => {
      if (window.ethereum) {
        console.log("init metamask", window.ethereum);
        web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        web3.eth.getAccounts(function(err, accounts) {
          web3.eth.defaultAccount = accounts[0];
        });
      } else {
        console.log("inject sdk");
        web3 = new Web3(
          new Web3.providers.HttpProvider("http://localhost:8545")
        );
        // 添加Ganache第一个账户的私钥
        web3.eth.accounts.wallet.add(
          "0xa069355cac7049d6eef6103425d0e36482dfc3a7db0a7482328edefbf05e353d"
        );

        web3.eth.defaultAccount = "0x0660987691f85054AeA037E761DcCA723E2a99A4";
      }
      this.winningProposal();
    });
  }

  winningProposal = async () => {
    const payload = web3.eth.abi.encodeFunctionCall(
      {
        name: "winningProposal",
        type: "function",
        inputs: []
      },
      []
    );

    const res = await web3.eth.call({
      to: CONTRACT,
      data: payload
    });

    this.setState({
      winning: web3.eth.abi.decodeParameter("uint8", res)
    });
  };

  sendVote = async () => {
    const funcSig = web3.eth.abi.encodeFunctionSignature("vote(uint8)");
    const param = web3.eth.abi.encodeParameter("uint8", +this.state.proposal);

    this.setState({
      loading: true
    });

    try {
      await web3.eth.sendTransaction({
        to: CONTRACT, // contract address
        data: funcSig + param.slice(2),
        gas: 2000000
      });
      alert("vote success");
      this.winningProposal();
    } catch (e) {
      alert(e.message);
    } finally {
      this.setState({
        loading: false
      });
    }
  };

  proposalChange = e => {
    this.setState({
      proposal: e.target.value
    });
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p className="App-link">Ballot Dapp Demo</p>
          <Form>
            <Alert style={{ fontSize: "20px" }}>
              Winning proposal is{" "}
              <strong style={{ fontSize: "24px" }}>
                No.{this.state.winning}
              </strong>
            </Alert>
            <Form.Group>
              <Form.Label style={{ fontSize: "16px" }}>提案编号</Form.Label>
              <Form.Control
                type="input"
                placeholder="提案编号"
                onChange={this.proposalChange}
              ></Form.Control>
            </Form.Group>
            <Button
              variant="info"
              onClick={this.sendVote}
              disabled={this.state.loading}
            >
              {this.state.loading ? (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              ) : (
                "VOTE"
              )}
            </Button>
          </Form>
        </header>
      </div>
    );
  }
}

export default App;
