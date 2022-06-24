const { parseEther } = require("ethers/lib/utils");
const { ethers, BigNumber } = require("ethers");
const { setup } = require("../../config/network");
const oracle_abi = require("../abis/oracle_abi");
const { getAddresses } = require("../../config/address");
const web3 = setup();

require("dotenv").config();

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
  let estimatedGas = BigNumber.from(0);
  try {
    estimatedGas = await setFarmReward.estimateGas({
      from: myAccount,
      gasLimit: 500000,
      gasPrice,
    });
  } catch (error) {
    console.log("gas estimation error", error);
  }
  if (!estimatedGas.isZero()) {
    const txObj = await setFarmReward.send({
      from: myAccount,
      gasLimit: 500000,
      gasPrice,
    });
    console.log("Success!", txObj.transactionHash);
    return txObj.transactionHash;
  }
  return null;
};
