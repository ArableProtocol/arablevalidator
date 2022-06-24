const { ethers, BigNumber } = require("ethers");
const { setup } = require("../../config/network");
const { getAddresses } = require("../../config/address");
const { farm_abi } = require("../abi/farm_abi");
const web3 = setup();
require("dotenv").config();

exports.updateRewardRateSum = async function (farmId, rewardToken) {
  const { farming } = await getAddresses();
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

  let estimatedGas = 0;
  try {
    estimatedGas = await setFarmReward.estimateGas({
      from: myAccount,
      gasLimit: 1000000,
      gasPrice,
    });
  } catch (error) {
    console.log("gas estimation error", error);
  }

  if (estimatedGas !== 0) {
    const txObj = await setFarmReward.send({
      from: myAccount,
      gasLimit: 1000000,
      gasPrice,
    });
    console.log("Success!", txObj.transactionHash);
    return txObj.transactionHash;
  }
  return null;
};
