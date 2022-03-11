const { collect_bsc } = require('./bsc');
const { collect_osmosis } = require('./osmosis');
const { collect_solana } = require('./solana');
const { collect_eth } = require('./ethereum');
const { collect_polygon } = require('./polygon');
const { coingecko_prices } = require('./coingecko');
const { collect_terra } = require('./terra');

async function collect() {
  let coingecko = {},
    bsc = {},
    solana = {},
    osmosis = {},
    eth = {},
    poly = {},
    terra = {};
  try {
    console.log('collecting coingecko prices');
    coingecko = await coingecko_prices();
  } catch (error) {
    console.error(error);
  }

  try {
    console.log('collecting bsc information');
    bsc = await collect_bsc(coingecko);
  } catch (error) {
    console.error(error);
  }

  try {
    console.log('collecting solana information');
    solana = await collect_solana(coingecko);
  } catch (error) {
    console.error(error);
  }

  try {
    console.log('collecting osmosis information');
    osmosis = await collect_osmosis(coingecko);
  } catch (error) {
    console.error(error);
  }

  try {
    console.log('collecting ethereum information');
    eth = await collect_eth(coingecko);
  } catch (error) {
    console.error(error);
  }

  try {
    console.log('collecting polygon information');
    poly = await collect_polygon(coingecko);
  } catch (error) {
    console.error(error);
  }

  try {
    console.log('collecting terra information');
    terra = await collect_terra(coingecko);
  } catch (error) {
    console.error(error);
  }

  return {
    coingecko,
    bsc,
    solana,
    osmosis,
    eth,
    poly,
    terra,
  };
}
exports.collect = collect;
