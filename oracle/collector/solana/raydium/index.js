const raydium = require('./lib/raydium.js');
const axios = require('axios');

function get_pairs() {
  return axios
    .get('https://api.raydium.io/pairs')
    .then((response) => response.data);
}

async function collect_raydium(coingecko) {
  // api version
  const pairs = ['RAY-SOL', 'RAY-USDT'];
  const keyMapping = {
    'RAY-SOL': 'raySol',
    'RAY-USDT': 'rayUsdt',
  };
  const apiPairs = (await get_pairs()).filter(
    (pair) => pairs.indexOf(pair.name.toUpperCase()) > -1
  );

  const response = {};
  apiPairs.forEach((pair) => {
    response[keyMapping[pair.name.toUpperCase()]] = pair;
  });

  // get from on-chain
  // for (let i = 0; i < pairs.length; i++) {
  //     let pair = pairs[i]
  //     response[keyMapping[pair]].lpPoolPriceChain = await raydium.getLpPoolPrice(pair)
  // }

  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i];
    const apr = (await raydium.getLpRewardApr(pair)) || 0;
    response[keyMapping[pair]].aprChain = apr;
    response[keyMapping[pair]].dailyRewardRate =
      (apr * response[keyMapping[pair]].lp_price) /
      coingecko.prices['raydium'].usd /
      365;
    response[keyMapping[pair]].aprChainPercent = (apr * 100.0).toFixed(2) + '%';
  }
  return response;
}

exports.collect_raydium = collect_raydium;
