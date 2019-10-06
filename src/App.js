import React from "react";
import logo from "./logo.png";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, Button, Spinner, Alert } from "react-bootstrap";
import web3 from "./web3";

const CONTRACT = "0x0C7704aD8316156C65F6DD040100796872C18B37";

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
    this.winningProposal();
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
        from: web3.eth.defaultAccount,
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
