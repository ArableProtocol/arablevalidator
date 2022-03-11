const { getAddresses } = require('../../config/address');
const { setBulkPrice } = require('../utils/setBulkPrice');

async function feedPrices(state, beaconRewardRate) {
  try {
    const {
      arBNB,
      arCAKE,
      arPancakeswapBUSDBNB,
      arPancakeswapCAKEBNB,
      arSUSHI,
      arSOL,
      arOSMO,
      arQUICK,
      arRAY,
      arDOT,
      arTRU,
      arCRV,
      arQuickswapETHUSDC,
      arQuickswapETHQUICK,
      arRaydiumRAYSOL,
      arRaydiumRAYUSDT,
      arUniswapETHUSDT,
      arSushiswapETHTRU,
      arOsmosisATOMOSMO,
    } = await getAddresses();
    const bnbPrice = state.coingecko.prices.binancecoin.usd;
    const cakePrice = state.coingecko.prices['pancakeswap-token'].usd;
    const busdBNBLpPrice = state.bsc.pancakeswap.busdBnb.busdBnbLpTokenPrice;
    const cakeBNBLpPrice = state.bsc.pancakeswap.cakeBnb.cakeBnbLpTokenPrice;
    const sushiPrice = state.coingecko.prices.sushi.usd;
    const solPrice = state.coingecko.prices.solana.usd;
    const osmoPrice = state.coingecko.prices.osmosis.usd;
    const quickPrice = state.coingecko.prices.quick.usd;
    const crvPrice = state.coingecko.prices['curve-dao-token'].usd;
    const rayPrice = state.coingecko.prices.raydium.usd;
    const dotPrice = state.coingecko.prices.polkadot.usd;
    const truPrice = state.coingecko.prices.truefi.usd;

    const raydiumRAYSOLPrice =
      beaconRewardRate.syntheticFarms?.raySol?.lpTokenPrice ||
      state.solana.raydium?.raySol?.lp_price;
    const raydiumRAYUSDTPrice =
      beaconRewardRate.syntheticFarms?.rayUsdt?.lpTokenPrice ||
      state.solana.raydium.rayUsdt.lp_price;
    const uniswapETHUSDTPrice =
      beaconRewardRate.syntheticFarms?.uniswapEthUsdt?.lpTokenPrice ||
      state.eth.uniswap.ethUsdt.ethUsdtLpTokenPrice;
    const sushiswapETHTRUPrice =
      beaconRewardRate.syntheticFarms?.ethTru?.truEthLpTokenPrice ||
      state.eth.sushiswap.ethTru.truEthLpTokenPrice;

    const quickswapETHQUICKPrice =
      beaconRewardRate.syntheticFarms?.quickEth?.quickEthLpTokenPrice ||
      state.poly.polygonData.quickEth.quickEthLpTokenPrice / 1;
    const quickswapETHUSDCPrice =
      beaconRewardRate.syntheticFarms?.quickEthUsdc?.ethUsdcLpTokenPrice ||
      state.poly.polygonData.ethUsdc.ethUsdcLpTokenPrice / 1;

    const atomOsmoLpTokenPrice =
      beaconRewardRate.syntheticFarms?.atomOsmo?.lpTokenPrice ||
      state.osmosis.atomOsmoLpTokenPrice;

    /**user readable price -- end **/
    /**Array of all address**/
    let tokensArray = [
      arBNB,
      arCAKE,
      arPancakeswapBUSDBNB,
      arPancakeswapCAKEBNB,
      arSUSHI,
      arSOL,
      arOSMO,
      arQUICK,
      arRAY,
      arDOT,
      arTRU,
      arCRV,
      arQuickswapETHUSDC,
      arQuickswapETHQUICK,
      arRaydiumRAYSOL,
      arRaydiumRAYUSDT,
      arUniswapETHUSDT,
      arSushiswapETHTRU,
      arOsmosisATOMOSMO,
    ];
    /**Array of all address's price**/
    let priceArray = [
      bnbPrice,
      cakePrice,
      busdBNBLpPrice,
      cakeBNBLpPrice,
      sushiPrice,
      solPrice,
      osmoPrice,
      quickPrice,
      rayPrice,
      dotPrice,
      truPrice,
      crvPrice,
      quickswapETHUSDCPrice,
      quickswapETHQUICKPrice,
      raydiumRAYSOLPrice,
      raydiumRAYUSDTPrice,
      uniswapETHUSDTPrice,
      sushiswapETHTRUPrice,
      atomOsmoLpTokenPrice,
    ];

    console.log('priceArray', priceArray);

    await setBulkPrice(tokensArray, priceArray);
  } catch (error) {
    console.log(error);
  }
}

exports.feedPrices = feedPrices;
