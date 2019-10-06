import Web3 from "web3";
//连接以太坊客户端，若有Ganache则为Ganache私网的endpoint
let web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
// 添加Ganache第一个账户的私钥
web3.eth.accounts.wallet.add(
  "0xa069355cac7049d6eef6103425d0e36482dfc3a7db0a7482328edefbf05e353d"
);

web3.eth.defaultAccount = "0x0660987691f85054AeA037E761DcCA723E2a99A4";

export default web3;
