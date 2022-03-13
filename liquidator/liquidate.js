const { ethers, BigNumber } = require('ethers');
const {
  setup,
  getBackendApiUrl,
  getEthersProvider,
} = require('./config/network');
var { parseEther } = require('ethers/lib/utils');

const { collateral, liquidation, arUSD } = require('./config/address.js');

const collateral_abi = require('./abis/arable_collateral_abi');
const liquidation_abi = require('./abis/arable_liquidation_abi');
const synth_abi = require('./abis/arable_synth_abi');

const web3 = setup();

exports.approveArUSDForLiquidation = async () => {
  console.log(`approve of arUSD started for liquidation`);

  // initiate the account
  const account = web3.eth.accounts.privateKeyToAccount(
    process.env.PRIVATE_KEY
  );
  await web3.eth.accounts.wallet.add(account);
  const myAccount = account.address;
  const gasPrice = await web3.eth.getGasPrice();

  console.log('initiate the contracts with abi and contract address');
  // initiate the contracts with abi and contract address
  const arUSDContract = new web3.eth.Contract(synth_abi, arUSD);

  const allowanceCall = await arUSDContract.methods.allowance(
    myAccount,
    liquidation
  );
  let allowance = await allowanceCall.call();

  if (BigNumber.from(allowance).gte(parseEther('10000000'))) {
    console.log('already allowed and skipping');
    return;
  }

  console.log('approving arUSD to be used for liquidation');
  // approve holding arUSD to be used for liquidation
  const approveTx = arUSDContract.methods.approve(
    liquidation,
    ethers.constants.MaxUint256.toString()
  );

  const approveTxObj = await approveTx.send({
    from: myAccount,
    gasLimit: 300000,
    gasPrice,
  });

  console.log('approval finished', approveTxObj);
};

exports.liquidate = async (unhealthyAccount, liquidationAmount) => {
  console.log(`liquidation started for ${unhealthyAccount.address}`);

  // initiate the account
  const account = web3.eth.accounts.privateKeyToAccount(
    process.env.PRIVATE_KEY
  );
  await web3.eth.accounts.wallet.add(account);
  const myAccount = account.address;
  const gasPrice = await web3.eth.getGasPrice();

  console.log('initiate the contracts with abi and contract address');
  // initiate the contracts with abi and contract address
  const liquidationContract = new web3.eth.Contract(
    liquidation_abi,
    liquidation
  );

  // TODO: For now, liquidating full amount but it shouldn't be like that - should be able to liquidate partial amount
  // TODO: liquidation amount should be min(account_balance, userDebt)
  // TODO: considering the case user debt could change, contract should be able to accept zero value so that liquidation call can liquidate maximum amount - when partial is allowed
  // TODO: there could be also the case that currentDebt > collateral - in this case, even though the liquidator get lose, it should be able to
  // be cleared up for protocol's health - contract can handle this case?
  // call liquidationContract.liquidate()
  try {
    console.log(
      `call liquidationContract.liquidate(${unhealthyAccount.address}) from ${myAccount}`
    );
    const liquidationTx = liquidationContract.methods.liquidate(
      unhealthyAccount.address
    );
    const liquidationTxObj = await liquidationTx.send({
      from: myAccount,
      gasLimit: 300000,
      gasPrice,
    });

    // TODO: for now, this account should have enough arUSD manually deposited by human
    // TODO: implement the mechanism to convert liquidated funds into arUSD or into USDT - the point when to do it - do it instantly?
    console.log('liquidation finished', liquidationTxObj);
  } catch (error) {
    console.error(error);
  }
};

exports.flagAccount = async (unhealthyAccount) => {
  console.log(`flagging operation started for ${unhealthyAccount.address}`);
  // initiate the account
  const account = web3.eth.accounts.privateKeyToAccount(
    process.env.PRIVATE_KEY
  );
  await web3.eth.accounts.wallet.add(account);
  const myAccount = account.address;
  const gasPrice = await web3.eth.getGasPrice();

  // initiate the contracts with abi and contract address
  const liquidationContract = new web3.eth.Contract(
    liquidation_abi,
    liquidation
  );

  // flag account for liquidation
  const flagTx = liquidationContract.methods.flagForLiquidation(
    unhealthyAccount.address
  );
  const txObj = await flagTx.send({
    from: myAccount,
    gasLimit: 300000,
    gasPrice,
  });

  console.log('flagging operation finished', txObj);
};
