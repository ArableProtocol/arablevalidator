const { parseEther } = require("ethers/lib/utils");
const { setup } = require("../../config/network");
const multisig_feeder_abi = require("../abis/multisig_feeder_abi");
const { getAddresses } = require("../../config/address");

const web3 = setup();

exports.bulkSuggestAction = async function (
  actionTypes,
  param1Arr,
  param2Arr,
  param3Arr
) {
  const { multisigFeeder } = await getAddresses();
  const account = web3.eth.accounts.privateKeyToAccount(
    process.env.PRIVATE_KEY
  );
  await web3.eth.accounts.wallet.add(account);
  const myAccount = account.address;
  const gasPrice = await web3.eth.getGasPrice();
  const feederContract = new web3.eth.Contract(
    multisig_feeder_abi,
    multisigFeeder
  );

  const bulkSuggestAction = feederContract.methods.bulkSuggestAction(
    actionTypes,
    param1Arr,
    param2Arr,
    param3Arr
  );
  const txObj = await bulkSuggestAction.send({
    from: myAccount,
    gasLimit: 3000000,
    gasPrice,
  });
  console.log("Success!", txObj.transactionHash);
  return txObj.transactionHash;
};

exports.bulkApproveAction = async function (actionIndexes) {
  const { multisigFeeder } = await getAddresses();
  const account = web3.eth.accounts.privateKeyToAccount(
    process.env.PRIVATE_KEY
  );
  await web3.eth.accounts.wallet.add(account);
  const myAccount = account.address;
  const gasPrice = await web3.eth.getGasPrice();
  const feederContract = new web3.eth.Contract(
    multisig_feeder_abi,
    multisigFeeder
  );

  const bulkApproveAction =
    feederContract.methods.bulkApproveAction(actionIndexes);
  const txObj = await bulkApproveAction.send({
    from: myAccount,
    gasLimit: 3000000,
    gasPrice,
  });
  console.log("Success!", txObj.transactionHash);
  return txObj.transactionHash;
};

exports.bulkExecuteAction = async function (tokenArray, priceArray) {
  const { multisigFeeder } = await getAddresses();
  const account = web3.eth.accounts.privateKeyToAccount(
    process.env.PRIVATE_KEY
  );
  await web3.eth.accounts.wallet.add(account);
  const myAccount = account.address;
  const gasPrice = await web3.eth.getGasPrice();
  const feederContract = new web3.eth.Contract(
    multisig_feeder_abi,
    multisigFeeder
  );

  const bulkExecuteAction =
    feederContract.methods.bulkExecuteAction(actionIndexes);
  const txObj = await bulkExecuteAction.send({
    from: myAccount,
    gasLimit: 3000000,
    gasPrice,
  });
  console.log("Success!", txObj.transactionHash);
  return txObj.transactionHash;
};
