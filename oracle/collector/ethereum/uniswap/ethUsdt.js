const Web3 = require('web3');
const BigNumber = require('bignumber.js');
const { eth_url } = require('../../../../config/config.rpc');
const {
  eth_abi,
  usdt_abi,
  priceUsdt_abi,
  priceEth_abi,
  ethUsdt_abi,
} = require('../../libs/abis');
const {
  calculateLpTokenPrice,
} = require('../../utils/calculatingLpTokenPrice');
const {
  ethUsdtAddress,
  ethAddress,
  usdtAddress,
  priceFeedUsdtAddress,
  priceFeedEthAddress,
} = require('../../libs/address');
const web3 = new Web3(eth_url);

async function uniswap_weth_usdt_collector() {
  try {
    const poolContract = new web3.eth.Contract(ethUsdt_abi, ethUsdtAddress);
    const ethContract = new web3.eth.Contract(eth_abi, ethAddress);
    const usdtContract = new web3.eth.Contract(usdt_abi, usdtAddress);
    const priceUsdtContract = new web3.eth.Contract(
      priceUsdt_abi,
      priceFeedUsdtAddress
    );
    const priceEthContract = new web3.eth.Contract(
      priceEth_abi,
      priceFeedEthAddress
    );
    // live price of usdt
    const usdtPriceRoundData = await priceUsdtContract.methods
      .latestRoundData()
      .call();
    const usdtPriceRoundAnswer = await usdtPriceRoundData.answer;
    const usdtPriceDecimals = await priceUsdtContract.methods.decimals().call();
    const usdtPrice = new BigNumber(await usdtPriceRoundAnswer).div(
      new BigNumber(Math.pow(10, usdtPriceDecimals))
    );
    // live price of eth
    const ethPriceRoundData = await priceEthContract.methods
      .latestRoundData()
      .call();
    const ethPriceRoundAnswer = await ethPriceRoundData.answer;
    const ethPriceDecimals = await priceEthContract.methods.decimals().call();
    const ethPrice = new BigNumber(await ethPriceRoundAnswer).div(
      new BigNumber(Math.pow(10, ethPriceDecimals))
    );
    // checking supply of the pool
    const totalSupplyPool = await poolContract.methods.totalSupply().call();
    const totalSupplyDecimals = await poolContract.methods.decimals().call();
    const totalSupply =
      (await totalSupplyPool) / Math.pow(10, totalSupplyDecimals);
    // getting total number of eth and usdt
    const ethDecimals = await ethContract.methods.decimals().call();
    const usdtDecimals = await usdtContract.methods.decimals().call();
    const reserves = await poolContract.methods.getReserves().call();
    const totalEth = new BigNumber(await reserves[0]).div(
      new BigNumber(Math.pow(10, ethDecimals))
    );
    const totalUsdt = new BigNumber(await reserves[1]).div(
      new BigNumber(Math.pow(10, usdtDecimals))
    );
    // calculating total liquidity
    const lpTokenPrice = await calculateLpTokenPrice(
      totalEth,
      ethPrice,
      totalUsdt,
      usdtPrice,
      totalSupply
    );
    // console.log(`Eth price ${ethPrice}, Usdt price ${usdtPrice},LP token price:  ${lpTokenPrice}, `)

    return {
      ethPrice,
      usdtPrice,
      ethUsdtLpTokenPrice: lpTokenPrice,
    };
  } catch (error) {
    console.log(error);
  }
}
exports.uniswap_weth_usdt_collector = uniswap_weth_usdt_collector;
