const path = require("path");
const fs = require("fs-extra");
const solc = require("solc");
const contractFileName = "Campaign.sol";

const buildPath = path.resolve(__dirname, "build");

fs.removeSync(buildPath);

const inboxPath = path.resolve(__dirname, "contracts", contractFileName);
const source = fs.readFileSync(inboxPath, "utf8");
const input = {
  language: "Solidity",
  sources: {
    [contractFileName]: {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};
const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
  contractFileName
];

fs.ensureDirSync(buildPath);

for (const contract in output) {
  fs.outputJSONSync(
    path.resolve(buildPath, `${contract}.json`),
    output[contract]
  );
}
