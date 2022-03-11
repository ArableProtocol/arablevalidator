const Web3 = require('web3');
const BigNumber = require('bignumber.js');
const { poly_url } = require('../../../../config/config.rpc');
const {
  polyQuick_abi,
  polyEth_abi,
  polyPriceEth_abi,
  polyPriceQuick_abi,
  polyEthQuickReward_abi,
  stakingLpEthQuick_abi,
} = require('../../libs/abis');
const {
  quickEthpTokenAddress,
  ethPolyAddress,
  quickPolyAddress,
  quickPriceFeedAddress,
  ethPolyPriceFeedAddress,
  quickEthRewardAddress,
} = require('../../libs/address');
const web3 = new Web3(poly_url);

async function quickswap_quick_eth_collector(coingecko) {
  try {
    const poolContract = new web3.eth.Contract(
      stakingLpEthQuick_abi,
      quickEthpTokenAddress
    );
    const quickContract = new web3.eth.Contract(
      polyQuick_abi,
      quickPolyAddress
    );
    const ethContract = new web3.eth.Contract(polyEth_abi, ethPolyAddress);
    const priceQuickContract = new web3.eth.Contract(
      polyPriceQuick_abi,
      quickPriceFeedAddress
    );
    const priceEthContract = new web3.eth.Contract(
      polyPriceEth_abi,
      ethPolyPriceFeedAddress
    );
    const rewardContract = new web3.eth.Contract(
      polyEthQuickReward_abi,
      quickEthRewardAddress
    );
    //live price of eth
    const ethPriceRoundData = await priceEthContract.methods
      .latestRoundData()
      .call();
    const ethPriceRoundAnswer = await ethPriceRoundData.answer;
    const ethPriceDecimals = await priceEthContract.methods.decimals().call();
    const ethPrice = new BigNumber(await ethPriceRoundAnswer).div(
      new BigNumber(Math.pow(10, ethPriceDecimals))
    );
    //live price of quick
    const quickPriceRoundData = await priceQuickContract.methods
      .latestRoundData()
      .call();
    const quickPriceRoundAnswer = await quickPriceRoundData.answer;
    const quickPriceDecimals = await priceQuickContract.methods
      .decimals()
      .call();
    const quickPrice = new BigNumber(await quickPriceRoundAnswer).div(
      new BigNumber(Math.pow(10, quickPriceDecimals))
    );
    //total supply of the pool
    const totalSupplyPool = await poolContract.methods.totalSupply().call();
    const totalSupplyDecimals = await poolContract.methods.decimals().call();
    const totalSupply = new BigNumber(await totalSupplyPool).div(
      new BigNumber(Math.pow(10, totalSupplyDecimals))
    );
    //getting total number of eth and quick
    const ethTokenDecimals = await ethContract.methods.decimals().call();
    const quickTokenDecimals = await quickContract.methods.decimals().call();
    const reserves = await poolContract.methods.getReserves().call();
    const totalQuickStaked = new BigNumber(await reserves[1]).div(
      new BigNumber(Math.pow(10, quickTokenDecimals))
    );
    const totalEthStaked = new BigNumber(await reserves[0]).div(
      new BigNumber(Math.pow(10, ethTokenDecimals))
    );
    //calculating total liquidty pool
    const ethStakeValue = totalEthStaked.times(ethPrice);
    const quickStakeValue = totalQuickStaked.times(quickPrice);
    const totalLiquidity = ethStakeValue.plus(quickStakeValue);
    const lpTokenPrice = totalLiquidity.div(totalSupply);
    // console.log('totalLiquidity', totalLiquidity / 1);
    // console.log('ethStakeValue', ethStakeValue / 1);
    // console.log('quickStakeValue', quickStakeValue / 1);
    //reward Mechanic
    const rewardRateDecimal = await rewardContract.methods.rewardRate().call();
    const rewardRate = new BigNumber(await rewardRateDecimal)
      .div(new BigNumber(1e18))
      .div(totalSupply);
    const dailyRewardRate = rewardRate * 86400;
    const apr =
      (dailyRewardRate * 365 * coingecko.prices['quick'].usd) / lpTokenPrice;
    // console.log(
    //   `ETH/QUICK APR: ${apr}, Lp token Price: ${lpTokenPrice}, Daily reward rate: ${dailyRewardRate},`
    // );

    return {
      ethPrice,
      quickPrice,
      quickEthLpTokenPrice: lpTokenPrice,
      dailyRewardRate,
      apr,
    };
  } catch (error) {
    console.log(error);
  }
}
exports.quickswap_quick_eth_collector = quickswap_quick_eth_collector;
