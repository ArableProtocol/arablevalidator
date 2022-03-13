const { sushiswap_eth_tru_collector } = require('./truEth');

async function collect_sushiswap(coingecko) {
  const ethTru = await sushiswap_eth_tru_collector(coingecko);

  return {
    ethTru,
  };
}

exports.collect_sushiswap = collect_sushiswap;
