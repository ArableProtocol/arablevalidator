const { parseEther } = require('ethers/lib/utils');
const { setup } = require('../../config/network');
const oracle_abi = require('../abis/oracle_abi');
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
    parseEther(parseFloat(rate).toFixed(15))
  );
  console.log('bulkRegisterRewardRate', farmId, rewardTokens, dailyRewardRates);
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
