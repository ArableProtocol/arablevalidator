const { setup } = require('../../submitter/utils/network');
const fujiAddresses = require('../../submitter/config/fujiAddress');
const avaxAddresses = require('../../submitter/config/avaxAddress');
const web3 = setup();

async function getAddresses() {
  const id = await web3.eth.getChainId();
  if (id == 43114) {
    console.log('Avax Mainnet: no deployment on mainnet yet');
    return avaxAddresses;
  } else if (id == 43113) {
    // console.log("Avalanche FUJI Testnet")
    return fujiAddresses;
  } else {
    console.log('Network is not supported');
    return null;
  }
}

exports.getAddresses = getAddresses;