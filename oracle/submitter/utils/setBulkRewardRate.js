const { setup } = require('../../config/network');
const { oracle_abi } = require('../abis/oracle_abi');
const { getAddresses } = require('../../config/address');

const web3 = setup();

require('dotenv').config();

exports.setBulkRewardRate = async function (
  farmId,
  rewardTokens,
  dailyRewardRates
) {
  const { oracle } = await getAddresses();
  const account = web3.eth.accounts.privateKeyToAccount(
    process.env.PRIVATE_KEY
  );
  await web3.eth.accounts.wallet.add(account);
  const myAccount = account.address;
  const gasPrice = await web3.eth.getGasPrice();
  const oracleContract = new web3.eth.Contract(oracle_abi, oracle);

  // cut decimals if too low
  dailyRewardRates = dailyRewardRates.map((rate) =>
    web3.utils.toWei(`${parseInt(rate * 1e18)}`, 'wei')
  );
  const setFarmReward = oracleContract.methods.bulkRegisterRewardRate(
    farmId,
    rewardTokens,
    dailyRewardRates
  );
  const txObj = await setFarmReward.send({
    from: myAccount,
    gasLimit: 500000,
    gasPrice,
  });
  console.log('Success!', txObj.transactionHash);
  return txObj.transactionHash;
};
