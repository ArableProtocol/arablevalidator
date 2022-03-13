const { collect_anchor } = require('./anchor');

async function collect_terra(coingecko) {
  const anchor = await collect_anchor(coingecko);
  return {
    anchor,
  };
}

exports.collect_terra = collect_terra;
