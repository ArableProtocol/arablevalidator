const Web3 = require('web3');
const BigNumber = require('bignumber.js');
const { eth_url } = require('../../../../config/config.rpc');
const { aaveLending_abi } = require('../../libs/abis');
const { lendingPool, usdtAddress } = require('../../libs/address');
const web3 = new Web3(eth_url);

async function aaveLending_usdt() {
  try {
    const poolContract = new web3.eth.Contract(aaveLending_abi, lendingPool);
    const lendingdata = await poolContract.methods
      .getReserveData(usdtAddress)
      .call();
    const decimals = new BigNumber(1e25);
    const currentLendingRate = new BigNumber(await lendingdata[3]).div(
      decimals
    );
    const stableBorrowRate = new BigNumber(
      await lendingdata.currentStableBorrowRate
    ).div(decimals);
    const variedBorrowRate = new BigNumber(
      await lendingdata.currentVariableBorrowRate
    ).div(decimals);
    console.log(
      'lending rate: ' +
        currentLendingRate +
        '%, Stable borrow rate: ' +
        stableBorrowRate +
        '%, Varied borrow rate: ' +
        variedBorrowRate +
        '%'
    );

    const lendingAPR = currentLendingRate / 100;
    const dailyRewardRate = lendingAPR / 365;

    return {
      dailyRewardRate,
      lendingAPR,
      stableBorrowRate,
      variedBorrowRate,
    };
  } catch (error) {
    console.log(error);
  }
}
exports.aaveLending_usdt = aaveLending_usdt;
