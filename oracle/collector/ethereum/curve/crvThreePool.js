const Web3 = require('web3');
const BigNumber = require('bignumber.js');
const { eth_url } = require('../../../../config/config.rpc');
const {
  totalGauageAddress,
  threePoolGaugeAddress,
  threePoolLPAddress,
  threePoolAddress,
  priceFeedCrvAddress,
  usdcAddress,
  usdtAddress,
  daiAddress,
} = require('../../libs/address');
const {
  gauageThreePool_abi,
  totalGauage_abi,
  priceCrv_abi,
} = require('../../libs/abis');
const erc20_abi = require('../../libs/erc20_abi');
const web3 = new Web3(eth_url);

async function crv_three_pool(coingecko) {
  try {
    const totalGauageContract = new web3.eth.Contract(
      totalGauage_abi,
      totalGauageAddress
    );
    const threePoolGaugeContract = new web3.eth.Contract(
      gauageThreePool_abi,
      threePoolGaugeAddress
    );
    const priceCrvContract = new web3.eth.Contract(
      priceCrv_abi,
      priceFeedCrvAddress
    );

    const usdcContract = new web3.eth.Contract(erc20_abi, usdcAddress);
    const usdtContract = new web3.eth.Contract(erc20_abi, usdtAddress);
    const daiContract = new web3.eth.Contract(erc20_abi, daiAddress);
    const threePoolLPTokenContract = new web3.eth.Contract(
      erc20_abi,
      threePoolLPAddress
    );

    // live price of eth
    const crvPriceRoundData = await priceCrvContract.methods
      .latestRoundData()
      .call();
    const crvPriceRoundAnswer = await crvPriceRoundData.answer;
    const crvPriceDecimals = await priceCrvContract.methods.decimals().call();
    const crvPrice = new BigNumber(await crvPriceRoundAnswer).div(
      new BigNumber(Math.pow(10, crvPriceDecimals))
    );
    // getting the gauage weight of 3pool
    const getGauageWeight = new BigNumber(
      await totalGauageContract.methods
        .get_gauge_weight(threePoolGaugeAddress)
        .call()
    );
    const totalGauageWeight = new BigNumber(
      await totalGauageContract.methods.get_total_weight().call()
    );
    const threePoolWeightBP = getGauageWeight
      .times(new BigNumber(1e22))
      .div(totalGauageWeight);
    console.log('threePoolWeightPercent', threePoolWeightBP / 100);

    const curveInflation = new BigNumber(
      await threePoolGaugeContract.methods.inflation_rate().call()
    );
    const curveMintedPerSecond = curveInflation.div(new BigNumber(1e18));
    const threePoolReward = curveMintedPerSecond
      .times(threePoolWeightBP)
      .div(new BigNumber(10000));

    const usdtBalanceWithDecimals = await usdtContract.methods
      .balanceOf(threePoolAddress)
      .call();
    const usdtDecimals = await usdtContract.methods.decimals().call();
    const usdtBalance = new BigNumber(usdtBalanceWithDecimals).div(
      new BigNumber(Math.pow(10, usdtDecimals))
    );
    const usdcBalanceWithDecimals = await usdcContract.methods
      .balanceOf(threePoolAddress)
      .call();
    const usdcDecimals = await usdcContract.methods.decimals().call();
    const usdcBalance = new BigNumber(usdcBalanceWithDecimals).div(
      new BigNumber(Math.pow(10, usdcDecimals))
    );
    const daiBalanceWithDecimals = await daiContract.methods
      .balanceOf(threePoolAddress)
      .call();
    const daiDecimals = await daiContract.methods.decimals().call();
    const daiBalance = new BigNumber(daiBalanceWithDecimals).div(
      new BigNumber(Math.pow(10, daiDecimals))
    );
    const totalLiquidity = usdtBalance.plus(usdcBalance).plus(daiBalance);
    // console.log('totalLiquidity', totalLiquidity / 1);
    const threePoolLPDecimals = await threePoolLPTokenContract.methods
      .decimals()
      .call();
    const totalLPSupplyWithDecimals = await threePoolLPTokenContract.methods
      .totalSupply()
      .call();
    const totalLPSupply = new BigNumber(totalLPSupplyWithDecimals).div(
      new BigNumber(Math.pow(10, threePoolLPDecimals))
    );
    const totalStakingLPWithDecimals = await threePoolGaugeContract.methods
      .totalSupply()
      .call();
    const totalStakingLP = new BigNumber(totalStakingLPWithDecimals).div(
      new BigNumber(Math.pow(10, threePoolLPDecimals))
    );

    const lpTokenPrice = new BigNumber(totalLiquidity).div(totalLPSupply);
    const threePoolRewardPerDay = threePoolReward * 86400;
    const dailyRewardRate = threePoolRewardPerDay / totalStakingLP;
    const apr =
      (dailyRewardRate * 365 * coingecko.prices['curve-dao-token'].usd) /
      lpTokenPrice;

    // https://curve.fi/3pool/deposit
    // console.log('lpTokenPrice', lpTokenPrice / 1);
    // console.log('dailyRewardRate', dailyRewardRate / 1);
    // console.log('apr', apr);

    return {
      curveMintedPerSecond,
      threePoolReward,
      crvPrice,
      lpTokenPrice,
      dailyRewardRate,
      apr,
    };
  } catch (error) {
    console.log(error);
  }
}
exports.crv_three_pool = crv_three_pool;
