const axios = require('axios');

let ids = [
  'binancecoin',
  'sushi',
  'solana',
  'osmosis',
  'pancakeswap-token',
  'avalanche-2',
  'quick',
  'curve-dao-token',
  'raydium',
  'polkadot',
  'truefi',
  'cosmos',
  'avalanche-2',
  'arable-protocol',
  'evmos',
  'bitcoin',
  'ethereum',
  'matic-network',
];
let url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`;

async function priceFeed() {
  let result = await axios.get(url).then(function (priceFeed) {
    return priceFeed.data;
  });
  return result;
}

exports.priceFeed = priceFeed;
