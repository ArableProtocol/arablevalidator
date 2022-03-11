const Web3 = require('web3');
const BigNumber = require('bignumber.js');
const { eth_url } = require('../../../../config/config.rpc');
const {
  eth_abi,
  tru_abi,
  priceTru_abi,
  priceEth_abi,
  ethTru_abi,
  ethTruMasterContract_abi,
  truPoolReward_abi,
} = require('../../libs/abis');
const {
  calculateLpTokenPrice,
} = require('../../utils/calculatingLpTokenPrice');
const {
  truRewardAddress,
  ethAddress,
  truAddress,
  priceFeedTruAddress,
  priceFeedEthAddress,
  ethTruAddress,
  ethTruMasterContractAddress,
} = require('../../libs/address');
const web3 = new Web3(eth_url);

async function sushiswap_eth_tru_collector(coingecko) {
  try {
    const truPoolContract = new web3.eth.Contract(
      truPoolReward_abi,
      truRewardAddress
    );
    const masterContract = new web3.eth.Contract(
      ethTruMasterContract_abi,
      ethTruMasterContractAddress
    );
    const poolContract = new web3.eth.Contract(ethTru_abi, ethTruAddress);
    const ethContract = new web3.eth.Contract(eth_abi, ethAddress);
    const truContract = new web3.eth.Contract(tru_abi, truAddress);
    const priceTruContract = new web3.eth.Contract(
      priceTru_abi,
      priceFeedTruAddress
    );
    const priceEthContract = new web3.eth.Contract(
      priceEth_abi,
      priceFeedEthAddress
    );
    //getting tru.
    const truDecimals = await truContract.methods.decimals().call();
    const truRewardPerSecondDecimals = await truPoolContract.methods
      .rewardPerSecond()
      .call();
    const truRewardPerDay = new BigNumber(truRewardPerSecondDecimals)
      .div(new BigNumber(Math.pow(10, truDecimals)))
      .times(new BigNumber(86400)); //multiply by total seconds in a day
    //getting sushi allocated to pool
    const poolInfo = await masterContract.methods.poolInfo(8).call();
    const totalPoolAllocation = await masterContract.methods
      .totalAllocPoint()
      .call();
    const sushiPerBlock = new BigNumber(
      await masterContract.methods.sushiPerBlock().call()
    );
    const poolAllocation = new BigNumber(poolInfo.allocPoint);
    const poolAllocationPercent = poolAllocation
      .times(new BigNumber(100))
      .div(new BigNumber(totalPoolAllocation));
    const poolSushiRewardPerBlock = poolAllocationPercent
      .times(sushiPerBlock)
      .div(new BigNumber(1e20));
    //live Price of Tru
    const truPriceRoundData = await priceTruContract.methods
      .latestRoundData()
      .call();
    const truPriceRoundAnswer = await truPriceRoundData.answer;
    const truPriceDecimals = await priceTruContract.methods.decimals().call();
    const truPrice = new BigNumber(await truPriceRoundAnswer).div(
      new BigNumber(Math.pow(10, truPriceDecimals))
    );
    //live Price of ETH
    const ethPriceRoundData = await priceEthContract.methods
      .latestRoundData()
      .call();
    const ethPriceRoundAnswer = await ethPriceRoundData.answer;
    const ethPriceDecimals = await priceEthContract.methods.decimals().call();
    const ethPrice = new BigNumber(await ethPriceRoundAnswer).div(
      new BigNumber(Math.pow(10, ethPriceDecimals))
    );
    //checking supply of the pool
    const totalSupplyPool = await poolContract.methods.totalSupply().call();
    const totalSupplyDecimals = await poolContract.methods.decimals().call();
    const totalSupply = new BigNumber(await totalSupplyPool).div(
      new BigNumber(Math.pow(10, totalSupplyDecimals))
    );
    //getting total number of eth and tru
    const ethDecimals = await ethContract.methods.decimals().call();
    const reserves = await poolContract.methods.getReserves().call();
    const totalEth = new BigNumber(await reserves[1]).div(
      new BigNumber(Math.pow(10, ethDecimals))
    );
    const totalTru = new BigNumber(await reserves[0]).div(
      new BigNumber(Math.pow(10, truDecimals))
    );
    //calculating total liquidity
    const lpTokenPrice = await calculateLpTokenPrice(
      totalEth,
      ethPrice,
      totalTru,
      truPrice,
      totalSupply
    );
    console.log(
      `Tru price ${truPrice}, LP token price: ${lpTokenPrice}, ${poolAllocationPercent} sushi per block. Sushi allocated to TRU/ETH ${poolSushiRewardPerBlock}. Tru reward per second: ${truRewardPerDay}`
    );
    const numberOfBlocksPerDay = 6480.0;

    try {
      const sushiRewardPerDay = poolSushiRewardPerBlock * numberOfBlocksPerDay;
      // console.log('truRewardPerDay', truRewardPerDay / 1);
      // console.log('poolSushiRewardPerDay', sushiRewardPerDay);
      const sushiDailyRewardRate = sushiRewardPerDay / totalSupply;
      const truDailyRewardRate = truRewardPerDay / totalSupply;

      const sushiAPR =
        (sushiDailyRewardRate * 365 * coingecko.prices['sushi'].usd) /
        lpTokenPrice;
      const truAPR =
        (truDailyRewardRate * 365 * coingecko.prices['truefi'].usd) /
        lpTokenPrice;

      // console.log('sushiAPR', sushiAPR);
      // console.log('truAPR', truAPR);

      return {
        sushiRewardPerDay,
        truRewardPerDay,
        sushiDailyRewardRate,
        truDailyRewardRate,
        sushiAPR,
        truAPR,
        truEthLpTokenPrice: lpTokenPrice,
      };
    } catch (err) {
      console.error(err);
    }
  } catch (error) {}
}
exports.sushiswap_eth_tru_collector = sushiswap_eth_tru_collector;
