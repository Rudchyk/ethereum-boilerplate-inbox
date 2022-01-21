import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = await new web3.eth.Contract(
  CampaignFactory.abi,
  '0x6B49d0A976611f2fEC66FbbD4D8570d0365aA0F1'
);

export default instance;
