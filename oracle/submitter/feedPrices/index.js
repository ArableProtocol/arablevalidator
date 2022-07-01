const { getAddresses } = require("../../config/address");
const { setBulkPrice } = require("../utils/setBulkPrice");

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
      WAVAX,
      ACRE,
      arBTC,
      arETH,
      arAVAX,
      arATOM,
      arEVMOS,
      arMATIC,
    } = await getAddresses();
    const bnbPrice = state.coingecko.prices.binancecoin.usd;
    const cakePrice = state.coingecko.prices["pancakeswap-token"].usd;
    const busdBNBLpPrice = state.bsc.pancakeswap.busdBnb.busdBnbLpTokenPrice;
    const cakeBNBLpPrice = state.bsc.pancakeswap.cakeBnb.cakeBnbLpTokenPrice;
    const sushiPrice = state.coingecko.prices.sushi.usd;
    const solPrice = state.coingecko.prices.solana.usd;
    const osmoPrice = state.coingecko.prices.osmosis.usd;
    const quickPrice = state.coingecko.prices.quick.usd;
    const crvPrice = state.coingecko.prices["curve-dao-token"].usd;
    const rayPrice = state.coingecko.prices.raydium.usd;
    const dotPrice = state.coingecko.prices.polkadot.usd;
    const truPrice = state.coingecko.prices.truefi.usd;
    const wavaxPrice = state.coingecko.prices["avalanche-2"].usd;
    const acrePrice = state.coingecko.prices["arable-protocol"].usd;

    const btcPrice = state.coingecko.prices.bitcoin.usd;
    const ethPrice = state.coingecko.prices.ethereum.usd;
    const maticPrice = state.coingecko.prices["matic-network"].usd;
    const evmosPrice = state.coingecko.prices.evmos.usd;
    const atomPrice = state.coingecko.prices.cosmos.usd;

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
      WAVAX,
      ACRE,
      arBTC,
      arETH,
      arAVAX,
      arMATIC,
      arATOM,
      arEVMOS,
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
      wavaxPrice,
      acrePrice,
      btcPrice,
      ethPrice,
      wavaxPrice,
      maticPrice,
      atomPrice,
      evmosPrice,
    ];

    const finalTokensArray = tokensArray.filter((e) => !!e);
    const finalPriceArray = finalTokensArray.map(
      (token) => priceArray[tokensArray.indexOf(token)]
    );

    console.log("finalTokensArray", finalTokensArray);
    console.log("finalPriceArray", finalPriceArray);

    await setBulkPrice(finalTokensArray, finalPriceArray);
  } catch (error) {
    console.log(error);
  }
}

exports.feedPrices = feedPrices;
