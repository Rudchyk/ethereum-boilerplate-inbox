const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

const provider = new HDWalletProvider(
  'pelican mask nation sunset erupt bounce road multiply slow stomach immune bless',
  'https://rinkeby.infura.io/v3/aaa20d77c7b24b5c926b5c11ba5e51a7'
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
      data: bytecode,
      arguments: ['Hello World1!'],
    })
    .send({
      from: accounts[0],
      gas: '1000000',
    });

  console.log('result', result.options.address);
  provider.engine.stop();
};

deploy();