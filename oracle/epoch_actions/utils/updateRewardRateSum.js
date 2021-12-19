const { setup } = require('../../submitter/utils/network');
const { farming } = require('../../submitter/config/address');
const { farm_abi } = require('../abi/farm_abi');
const web3 = setup();
require('dotenv').config();

exports.setRewardRateSum = async function (farmId, rewardToken) {
  const account = web3.eth.accounts.privateKeyToAccount(
    process.env.PRIVATE_KEY
  );
  await web3.eth.accounts.wallet.add(account);
  const myAccount = account.address;
  const gasPrice = await web3.eth.getGasPrice();
  const oracleContract = new web3.eth.Contract(farm_abi, farming);

  const setFarmReward = oracleContract.methods.updateRewardRateSum(
    farmId,
    rewardToken
  );
  const txObj = await setFarmReward.send({
    from: myAccount,
    gasLimit: web3.utils.toHex(500000),
    gasPrice,
  });
  console.log('Success!', txObj.transactionHash);
  return txObj.transactionHash;
};
