const path = require('path');
const fs = require('fs');
const solc = require('solc');
const contractFileName = 'Lottery.sol';

const inboxPath = path.resolve(__dirname, 'contracts', contractFileName);
const source = fs.readFileSync(inboxPath, 'utf8');
const input = {
  language: 'Solidity',
  sources: {
    [contractFileName]: {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*'],
      },
    },
  },
};

module.exports = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
  contractFileName
].Lottery;