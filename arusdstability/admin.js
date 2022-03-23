require('dotenv').config();
const erc20_abi = require('./abis/erc20_abi');

const { setup } = require('./config/network');

const { waitSeconds } = require('../utils/wait');

const { arUSD, USDT } = require('./config/address.js');
const { parseEther, parseUnits } = require('ethers/lib/utils');

const web3 = setup();

async function sendTokens(token, targetAddress, amount) {
  // initiate the account
  const account = web3.eth.accounts.privateKeyToAccount(
    process.env.PRIVATE_KEY
  );
  await web3.eth.accounts.wallet.add(account);
  const myAccount = account.address;
  const gasPrice = await web3.eth.getGasPrice();

  console.log('initiate the contracts with abi and contract address');
  // initiate the contracts with abi and contract address
  const tokenContract = new web3.eth.Contract(erc20_abi, token);

  console.log('sending token');
  const sendTx = tokenContract.methods.transfer(targetAddress, amount);

  const sendTxObj = await sendTx.send({
    from: myAccount,
    gasLimit: 300000,
    gasPrice,
  });

  console.log('send finished', sendTxObj.transactionHash);
}

async function main() {
  // send arUSD tokens
  const arUSDRecipients = [
    '0x09e31dbc9ffce1cd628e34278eb988a265787d6c',
    '0xce8b0312d467e7f055ff052e378b04654e206129',
    '0xfcd58b4a56b0df42e1becaf4c307fc815fa9a66d',
    '0xb841b64f8dda8adc0eba46b22170192f8c6093ef',
    '0x505b48bea9e293c7530b63cece7ca9b8f7b4ef08',
    '0xa9a4ccc9969027d14dcb9ac89b4030353decda10',
    '0x5fe498199c350c577127b07321e4a2c5c57a5d45',

    '0x1298257346562Fa53c5a5FdDc1729518e6827432',
    '0x313857470ca3e8A9A4af337ee60ccbBaB1c6Ab56',
    '0x11b0aefecDb219e37e6eD2CED23B7f63600D79b9',
    '0x892c9218ebb1558537B8c4FCa63f81396B27C16A',
    '0x10f7caDd719D8c7ba0863D943f8d820bEc6220F7',
    '0x7c1Ce9f3c727c427484cC37fe8e74580A00ee13b',
    '0xef96472cd286d10e79646f0c514c84c6cf16130b',
  ];

  for (let i = 0; i < arUSDRecipients.length; i++) {
    const amount = parseEther('10000'); // 10K arUSD
    await sendTokens(arUSD, arUSDRecipients[i], amount);
  }

  // send USDT tokens
  const USDTRecipients = [
    '0x1298257346562Fa53c5a5FdDc1729518e6827432',
    '0x313857470ca3e8A9A4af337ee60ccbBaB1c6Ab56',
    '0x11b0aefecDb219e37e6eD2CED23B7f63600D79b9',
    '0x892c9218ebb1558537B8c4FCa63f81396B27C16A',
    '0x10f7caDd719D8c7ba0863D943f8d820bEc6220F7',
    '0x7c1Ce9f3c727c427484cC37fe8e74580A00ee13b',
    '0xef96472cd286d10e79646f0c514c84c6cf16130b',
  ];

  for (let i = 0; i < USDTRecipients.length; i++) {
    const amount = parseUnits('10000', 6); // 10K USDT
    await sendTokens(USDT, USDTRecipients[i], amount);
  }
}

main();
