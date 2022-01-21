import web3 from './web3';
import Campaign from './build/Campaign.json';

const CampaignInstance = async (address) => {
  return await new web3.eth.Contract(Campaign.abi, address);
};

export default CampaignInstance;
