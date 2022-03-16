const { uniswap_weth_usdt_collector } = require('./ethUsdt');

async function collect_uniswap(coingecko) {
  const ethUsdt = await uniswap_weth_usdt_collector(coingecko);

  return {
    ethUsdt,
  };
}

exports.collect_uniswap = collect_uniswap;
