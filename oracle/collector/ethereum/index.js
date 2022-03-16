const { collect_aave } = require('./aave');
const { collect_curve } = require('./curve');
const { collect_sushiswap } = require('./sushiswap');
const { collect_uniswap } = require('./uniswap');

async function collect_eth(coingecko) {
  const uniswap = await collect_uniswap(coingecko);
  const sushiswap = await collect_sushiswap(coingecko);
  const aave = await collect_aave(coingecko);
  const curve = await collect_curve(coingecko);
  return {
    uniswap,
    sushiswap,
    aave,
    curve,
  };
}

exports.collect_eth = collect_eth;
