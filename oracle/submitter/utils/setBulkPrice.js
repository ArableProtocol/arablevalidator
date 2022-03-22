const { parseEther } = require('ethers/lib/utils');
const { setup } = require('../../config/network');
const oracle_abi = require('../abis/oracle_abi');
const { getAddresses } = require('../../config/address');

const web3 = setup();

exports.setBulkPrice = async function (tokenArray, priceArray) {
  const { oracle } = await getAddresses();
  const account = web3.eth.accounts.privateKeyToAccount(
    process.env.PRIVATE_KEY
  );
  await web3.eth.accounts.wallet.add(account);
  const myAccount = account.address;
  const gasPrice = await web3.eth.getGasPrice();
  const oracleContract = new web3.eth.Contract(oracle_abi, oracle);
  priceArray = priceArray.map((price) =>
    parseEther(parseFloat(price).toFixed(15))
  );
  const setBulkPrice = oracleContract.methods.bulkPriceSet(
    tokenArray,
    priceArray
  );
  const txObj = await setBulkPrice.send({
    from: myAccount,
    gasLimit: 3000000,
    gasPrice,
  });
  console.log('Success!', txObj.transactionHash);
  return txObj.transactionHash;
};
