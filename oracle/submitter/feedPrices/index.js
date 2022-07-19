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
      // newly added
      arXRP,
      arADA,
      arDOGE,
      arTRX,
      arEGLD,
      arFIL,
      arAAVE,
      arTHETA,
      arAXS,
      arEOS,
      arMKR,
      arBTT,
      arZEC,
      arAR,
      arMIOTA,
      arLDO,
      arGRT,
      arHT,
      arKLAY,
      arRUNE,
      arFTM,
      arSNX,
      arCHZ,
      arBAT,
      arCVX,
      arCELO,
      arSRM,
      arMINA,
      arFXS,
      arKAVA,
      arCOMP,
      ar1INCH,
      arGNO,
      arIOST,
      arKDA,
      arIOTX,
      arONE,
      arJST,
      arGMX,
      arZRX,
      arOMG,
      arAUDIO,
      arENS,
      arPAXG,
      arGMT,
      arBIT,
      arWAVES,
      arKSM,
      arDASH,
      arLRC,
      arENJ,
      arLTC,
      arLEO,
      arFTT,
      arUNI,
      arOKB,
      arCRO,
      arLINK,
      arXLM,
      arNEAR,
      arXMR,
      arALGO,
      arXCN,
      arICP,
      arVET,
      arFLOW,
      arSAND,
      arMANA,
      arXTZ,
      arAPE,
      arQNT,
      arDYDX,
      arANKR,
      arLPT,
      arLOOKS,
      arGLMR,
      arSCRT,
    } = getAddresses();

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
      arXRP,
      arADA,
      arDOGE,
      arTRX,
      arEGLD,
      arFIL,
      arAAVE,
      arTHETA,
      arAXS,
      arEOS,
      arMKR,
      arBTT,
      arZEC,
      arAR,
      arMIOTA,
      arLDO,
      arGRT,
      arHT,
      arKLAY,
      arRUNE,
      arFTM,
      arSNX,
      arCHZ,
      arBAT,
      arCVX,
      arCELO,
      arSRM,
      arMINA,
      arFXS,
      arKAVA,
      arCOMP,
      ar1INCH,
      arGNO,
      arIOST,
      arKDA,
      arIOTX,
      arONE,
      arJST,
      arGMX,
      arZRX,
      arOMG,
      arAUDIO,
      arENS,
      arPAXG,
      arGMT,
      arBIT,
      arWAVES,
      arKSM,
      arDASH,
      arLRC,
      arENJ,
      arLTC,
      arLEO,
      arFTT,
      arUNI,
      arOKB,
      arCRO,
      arLINK,
      arXLM,
      arNEAR,
      arXMR,
      arALGO,
      arXCN,
      arICP,
      arVET,
      arFLOW,
      arSAND,
      arMANA,
      arXTZ,
      arAPE,
      arQNT,
      arDYDX,
      arANKR,
      arLPT,
      arLOOKS,
      arGLMR,
      arSCRT,
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
      state.coingecko.prices.ripple.usd,
      state.coingecko.prices.cardano.usd,
      state.coingecko.prices.dogecoin.usd,
      state.coingecko.prices.tron.usd,
      state.coingecko.prices["elrond-erd-2"].usd,
      state.coingecko.prices.filecoin.usd,
      state.coingecko.prices.aave.usd,
      state.coingecko.prices["theta-token"].usd,
      state.coingecko.prices["axie-infinity"].usd,
      state.coingecko.prices.eos.usd,
      state.coingecko.prices.maker.usd,
      state.coingecko.prices.bittorrent.usd,
      state.coingecko.prices.zcash.usd,
      state.coingecko.prices.arweave.usd,
      state.coingecko.prices.iota.usd,
      state.coingecko.prices["lido-dao"].usd,
      state.coingecko.prices["the-graph"].usd,
      state.coingecko.prices["huobi-token"].usd,
      state.coingecko.prices["klay-token"].usd,
      state.coingecko.prices.thorchain.usd,
      state.coingecko.prices.fantom.usd,
      state.coingecko.prices.havven.usd,
      state.coingecko.prices.chiliz.usd,
      state.coingecko.prices["basic-attention-token"].usd,
      state.coingecko.prices["convex-finance"].usd,
      state.coingecko.prices.celo.usd,
      state.coingecko.prices.serum.usd,
      state.coingecko.prices["mina-protocol"].usd,
      state.coingecko.prices["frax-share"].usd,
      state.coingecko.prices.kava.usd,
      state.coingecko.prices["compound-governance-token"].usd,
      state.coingecko.prices["1inch"].usd,
      state.coingecko.prices.gnosis.usd,
      state.coingecko.prices.iostoken.usd,
      state.coingecko.prices.kadena.usd,
      state.coingecko.prices.iotex.usd,
      state.coingecko.prices.harmony.usd,
      state.coingecko.prices.just.usd,
      state.coingecko.prices.gmx.usd,
      state.coingecko.prices["0x"].usd,
      state.coingecko.prices.omisego.usd,
      state.coingecko.prices.audius.usd,
      state.coingecko.prices["ethereum-name-service"].usd,
      state.coingecko.prices["pax-gold"].usd,
      state.coingecko.prices.stepn.usd,
      state.coingecko.prices.bitdao.usd,
      state.coingecko.prices.waves.usd,
      state.coingecko.prices.kusama.usd,
      state.coingecko.prices.dash.usd,
      state.coingecko.prices.loopring.usd,
      state.coingecko.prices.enjincoin.usd,
      state.coingecko.prices.litecoin.usd,
      state.coingecko.prices.leo.usd,
      state.coingecko.prices["ftx-token"].usd,
      state.coingecko.prices.uniswap.usd,
      state.coingecko.prices.okb.usd,
      state.coingecko.prices["crypto-com-chain"].usd,
      state.coingecko.prices.chainlink.usd,
      state.coingecko.prices.stellar.usd,
      state.coingecko.prices.near.usd,
      state.coingecko.prices.monero.usd,
      state.coingecko.prices.algorand.usd,
      state.coingecko.prices["chain-2"].usd,
      state.coingecko.prices["internet-computer"].usd,
      state.coingecko.prices.vechain.usd,
      state.coingecko.prices.flow.usd,
      state.coingecko.prices["the-sandbox"].usd,
      state.coingecko.prices.decentraland.usd,
      state.coingecko.prices.tezos.usd,
      state.coingecko.prices.apecoin.usd,
      state.coingecko.prices.aragon.usd,
      state.coingecko.prices.dydx.usd,
      state.coingecko.prices.ankr.usd,
      state.coingecko.prices.livepeer.usd,
      state.coingecko.prices.looksrare.usd,
      state.coingecko.prices.moonbeam.usd,
      state.coingecko.prices.secret.usd,
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
