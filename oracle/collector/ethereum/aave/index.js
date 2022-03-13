const { aaveLending_usdt } = require('./aaveUsdtLending');

async function collect_aave(coingecko) {
  const usdtAave = await aaveLending_usdt(coingecko);

  return {
    usdtAave,
  };
}

exports.collect_aave = collect_aave;
