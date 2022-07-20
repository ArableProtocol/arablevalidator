const { parseEther } = require("ethers/lib/utils");
const { setup } = require("../../config/network");
const oracle_abi = require("../abis/oracle_abi");
const { getAddresses } = require("../../config/address");

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

  const itemsPerTx = 30;
  let index = 0;
  let subTokenArray = [];
  let subPriceArray = [];

  while (true) {
    subTokenArray = [];
    subPriceArray = [];
    while (subTokenArray.length < itemsPerTx && index < tokenArray.length) {
      subTokenArray.push(tokenArray[index]);
      subPriceArray.push(priceArray[index]);
      index++;
    }

    if (subTokenArray.length > 0) {
      const setBulkPrice = oracleContract.methods.bulkPriceSet(
        subTokenArray,
        subPriceArray
      );
      const txObj = await setBulkPrice.send({
        from: myAccount,
        gasLimit: 8000000,
        gasPrice: Math.floor(gasPrice * 1.2),
      });
      console.log("Success!", txObj.transactionHash);

      return txObj.transactionHash;
    }

    if (index >= tokenArray.length) {
      break;
    }
  }
};
