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
    '0xd341Cde0FD55274bcFef2CA8daBfA61e92aCC1C2',
    '0x2355FF2fDe0c23a446301c4BEE1eD601ab099e63',
    '0xE27A94268f5aa5b70748a38e58293Cd993579a91',
    '0x714D8b5874b3a6a69f289f4e857F4C9670074296',
    '0xc2872FA7a678165922bCEe07A0D2DBeF7bdC381F',
    '0xa231114E7E5575df64361281D784ab8fD9862A61',
    '0x07bcC8689c55AE394356Eb27a77d9FD6f5efe4CC',

    '0x490551860F315183bf68D5a6e84252564151B879',
    '0x11B9dd6d3129Eb740011b1A948aDCbCB67758a10',
    '0x9116D36Fa534Ac8054D2F9b28a5d49660700c212',
    '0xfc48f1BD8ffa29a377CaA8792F00670C1DcED642',
    '0x5Ba42Ff329eA75510430b60B6DBCd7986D1a8e20',
    '0x86455a719565281fCbEe3f8c8ca2Ad026A0Dfe49',
    '0xC224cd7Ab43c5150Dfc60B153a433a43600107F2',
    '0xb9270C481226d7EB33059426dA6ea5F81F8bE857',
  ];

  for (let i = 0; i < arUSDRecipients.length; i++) {
    const amount = parseEther('1000'); // 1K arUSD
    await sendTokens(arUSD, arUSDRecipients[i], amount);
  }

  // send USDT tokens
  const USDTRecipients = [
    '0xd341Cde0FD55274bcFef2CA8daBfA61e92aCC1C2',
    '0x2355FF2fDe0c23a446301c4BEE1eD601ab099e63',
    '0xE27A94268f5aa5b70748a38e58293Cd993579a91',
    '0x714D8b5874b3a6a69f289f4e857F4C9670074296',
    '0xc2872FA7a678165922bCEe07A0D2DBeF7bdC381F',
    '0xa231114E7E5575df64361281D784ab8fD9862A61',
    '0x07bcC8689c55AE394356Eb27a77d9FD6f5efe4CC',

    '0x490551860F315183bf68D5a6e84252564151B879',
    '0x11B9dd6d3129Eb740011b1A948aDCbCB67758a10',
    '0x9116D36Fa534Ac8054D2F9b28a5d49660700c212',
    '0xfc48f1BD8ffa29a377CaA8792F00670C1DcED642',
    '0x5Ba42Ff329eA75510430b60B6DBCd7986D1a8e20',
    '0x86455a719565281fCbEe3f8c8ca2Ad026A0Dfe49',
    '0xC224cd7Ab43c5150Dfc60B153a433a43600107F2',
    '0xb9270C481226d7EB33059426dA6ea5F81F8bE857',
  ];

  for (let i = 0; i < USDTRecipients.length; i++) {
    const amount = parseUnits('1000', 6); // 1K USDT
    await sendTokens(USDT, USDTRecipients[i], amount);
  }
}

main();
