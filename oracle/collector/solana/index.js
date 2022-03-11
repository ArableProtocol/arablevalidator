const { collect_raydium } = require('./raydium');

async function collect_solana(coingecko) {
  const raydium = await collect_raydium(coingecko);
  return {
    raydium,
  };
}

exports.collect_solana = collect_solana;
