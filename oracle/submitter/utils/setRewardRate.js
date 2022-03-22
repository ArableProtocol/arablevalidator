const { parseEther } = require('ethers/lib/utils');
const { setup } = require('../../config/network');
const oracle_abi = require('../abis/oracle_abi');
const { getAddresses } = require('../../config/address');
const web3 = setup();

require('dotenv').config();

exports.setRewardRate = async function (farmId, rewardToken, dailyRewardRate) {
  const { oracle } = await getAddresses();
  const account = web3.eth.accounts.privateKeyToAccount(
    process.env.PRIVATE_KEY
  );
  await web3.eth.accounts.wallet.add(account);
  const myAccount = account.address;
  const gasPrice = await web3.eth.getGasPrice();
  const oracleContract = new web3.eth.Contract(oracle_abi, oracle);

  dailyRewardRate = web3.utils.toHex(
    parseEther(parseFloat(dailyRewardRate).toFixed(15))
  );
  const setFarmReward = oracleContract.methods.registerRewardRate(
    farmId,
    rewardToken,
    dailyRewardRate
  );
  const txObj = await setFarmReward.send({
    from: myAccount,
    gasLimit: web3.utils.toHex(500000),
    gasPrice,
  });
  console.log('Success!', txObj.transactionHash);
  return txObj.transactionHash;
};
