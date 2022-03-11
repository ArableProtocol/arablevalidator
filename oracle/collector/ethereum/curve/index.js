const { crv_three_pool } = require('./crvThreePool');

async function collect_curve(coingecko) {
  const threePool = await crv_three_pool(coingecko);

  return {
    threePool,
  };
}

exports.collect_curve = collect_curve;
