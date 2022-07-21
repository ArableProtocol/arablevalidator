const { parseEther } = require("ethers/lib/utils");
const { setup, getBackendApiUrl } = require("../config/network");
const oracle_abi = require("../submitter/abis/oracle_abi");
const { getAddresses } = require("../config/address");
const axios = require("axios");
const { Wallet } = require("ethers");
const version = require("../../config/version.json");

const web3 = setup();

exports.setAllowedProvider = async function (addr) {
  const { oracle } = await getAddresses();
  const account = web3.eth.accounts.privateKeyToAccount(
    process.env.PRIVATE_KEY
  );
  await web3.eth.accounts.wallet.add(account);
  const myAccount = account.address;
  const gasPrice = await web3.eth.getGasPrice();

  const oracleContract = new web3.eth.Contract(oracle_abi, oracle);

  const setAllowedProviderTx = oracleContract.methods.setAllowedProvider(addr);
  const txObj = await setAllowedProviderTx.send({
    from: myAccount,
    gasLimit: web3.utils.toHex(3000000),
    gasPrice,
  });
  console.log("Success setAllowedProvider!", addr, txObj.transactionHash);
  return txObj.transactionHash;
};

exports.submitOracleStatus = async function (dstaking) {
  const backendApiUrl = getBackendApiUrl();

  const signer = new Wallet(process.env.PRIVATE_KEY);

  const signature = await signer.signMessage(dstaking);

  await axios.post(`${backendApiUrl}/oracles`, {
    dstaking,
    signature,
    version: version.oracle,
  });
};
