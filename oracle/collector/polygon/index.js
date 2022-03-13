const { collect_quickswap } = require('./quickSwap');

async function collect_polygon(coingecko) {
  const polygonData = await collect_quickswap(coingecko);
  return {
    polygonData,
  };
}

exports.collect_polygon = collect_polygon;
