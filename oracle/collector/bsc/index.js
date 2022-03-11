const { collect_pancakeswap } = require('./pancakeswap');

async function collect_bsc(coingecko) {
  const pancakeswap = await collect_pancakeswap(coingecko);
  return {
    pancakeswap,
  };
}

exports.collect_bsc = collect_bsc;
