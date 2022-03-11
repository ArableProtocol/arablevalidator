const { feedPrices } = require('./feedPrices');
const { feedRewardRates } = require('./feedRewardRates');
const { state } = require('../state');

var axios = require('axios');
const { getBackendApiUrl } = require('../config/network');

async function feed(state) {
  const backendApiUrl = getBackendApiUrl();

  const beaconRewardRate = (
    await axios.get(`${backendApiUrl}/beacon_reward_rate`)
  ).data;
  console.log('beaconRewardRate', beaconRewardRate);

  await feedPrices(state, beaconRewardRate);
  await feedRewardRates(state, beaconRewardRate);
}

// TODO: test code just for submission
// feed(state);

exports.feed = feed;
