const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const Campaign = require("../ethereum/build/Campaign.json");
const CampaignFactory = require("../ethereum/build/CampaignFactory.json");

const web3 = new Web3(ganache.provider());

let accounts;
let campaignFactory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  const gasEstimate = await new web3.eth.Contract(CampaignFactory.abi)
    .deploy({
      data: CampaignFactory.evm.bytecode.object,
    })
    .estimateGas();

  campaignFactory = await new web3.eth.Contract(CampaignFactory.abi)
    .deploy({
      data: CampaignFactory.evm.bytecode.object,
    })
    .send({
      from: accounts[0],
      // gas: "1169872",
      gas: gasEstimate,
    });

  await campaignFactory.methods.createCampaign("100").send({
    from: accounts[0],
    gas: "1000000",
  });
  await campaignFactory.methods
    .createCampaign("100")
    .estimateGas({ from: accounts[0] });

  [campaignAddress] = await campaignFactory.methods
    .getDeployedCampaign()
    .call();

  campaign = await new web3.eth.Contract(Campaign.abi, campaignAddress);
});

describe("Campaigns", () => {
  it("deploys a factory and a campaign", () => {
    assert.ok(campaignFactory.options.address);
    assert.ok(campaign.options.address);
  });

  it("marks caller as the campaign manager", async () => {
    const manager = await campaign.methods.manager().call();

    assert.equal(manager, accounts[0]);
  });

  it("allows people to contribute money and marks them as approvers", async () => {
    await campaign.methods.contribute().send({
      value: "200",
      from: accounts[1],
    });
    const isContributor = await campaign.methods.approvers(accounts[1]).call();

    assert(isContributor);
  });

  it("requires a minimum contribution", async () => {
    try {
      await campaign.methods.contribute().send({
        value: "5",
        from: accounts[1],
      });
      assert(false);
    } catch (error) {
      assert(error);
    }
  });

  it("allows a manager to make a payment request", async () => {
    await campaign.methods
      .createRequest("Buy batteries", "100", accounts[1])
      .send({
        gas: "1000000",
        from: accounts[0],
      });
    const request = await campaign.methods.requests(0).call();
    assert.equal("Buy batteries", request.description);
  });

  it("processes requests", async () => {
    await campaign.methods.contribute().send({
      value: web3.utils.toWei("10", "ether"),
      from: accounts[0],
    });

    await campaign.methods
      .createRequest("A", web3.utils.toWei("5", "ether"), accounts[1])
      .send({
        gas: "1000000",
        from: accounts[0],
      });

    await campaign.methods.approveRequest(0).send({
      gas: "1000000",
      from: accounts[0],
    });

    await campaign.methods.finalizeRequest(0).send({
      gas: "1000000",
      from: accounts[0],
    });

    let balance = await web3.eth.getBalance(accounts[1]);
    balance = web3.utils.toWei(balance, "ether");
    balance = parseFloat(balance);

    console.log("balance", balance);

    assert(balance > 104);
  });

  // it("", async () => {});
});
