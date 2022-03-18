require('dotenv').config();
const { ethers, Contract, utils, BigNumber } = require('ethers');
const pangolin_pair_abi = require('./abis/pangolin_pair_abi');
const pangolin_router_abi = require('./abis/pangolin_router_abi');
const erc20_abi = require('./abis/erc20_abi');

const { setup } = require('./config/network');

const { waitSeconds } = require('../utils/wait');

const {
  arUSD,
  USDT,
  pairUSDTarUSD,
  pangolinRouter,
} = require('./config/address.js');
const { parseEther } = require('ethers/lib/utils');

const web3 = setup();

async function approveTokenTo(token, targetAddress) {
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

  const allowanceCall = await tokenContract.methods.allowance(
    myAccount,
    targetAddress
  );
  let allowance = await allowanceCall.call();

  if (BigNumber.from(allowance).gte(parseEther('10000000'))) {
    console.log('already allowed and skipping');
    return;
  }
  //
  console.log('approve pair');
  const pairApproveTx = tokenContract.methods.approve(
    targetAddress,
    ethers.constants.MaxUint256.toString()
  );

  const pairApproveTxObj = await pairApproveTx.send({
    from: myAccount,
    gasLimit: 300000,
    gasPrice,
  });

  console.log('pair approval finished', pairApproveTxObj);
}

async function runPriceStabilizer() {
  console.log(
    '================ starting arUSD stability maintainer ================'
  );

  // initiate the account
  const account = web3.eth.accounts.privateKeyToAccount(
    process.env.PRIVATE_KEY
  );
  await web3.eth.accounts.wallet.add(account);
  const myAccount = account.address;
  const gasPrice = await web3.eth.getGasPrice();

  console.log('----- step1 -----', gasPrice);
  // check pair price
  const pairContract = new web3.eth.Contract(pangolin_pair_abi, pairUSDTarUSD);
  const routerContract = new web3.eth.Contract(
    pangolin_router_abi,
    pangolinRouter
  );

  // function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast);
  const getReserveCall = await pairContract.methods.getReserves();
  let reserves = await getReserveCall.call();

  console.log('----- step2 -----', reserves);
  const reserve0 = Number(utils.formatUnits(reserves[0], 6));
  const reserve1 = Number(utils.formatUnits(reserves[1], 18));

  console.log('----- step3 -----');
  const priceOfArUSD = reserve0 / reserve1;

  console.log('arUSD price', priceOfArUSD);

  // function swap(uint amount0Out, uint amount1Out, address to, bytes calldata data) external;
  // bytes: data.length is greater than 0, the contract transfers the tokens and then calls the following function on the to address:
  console.log('checking..');
  if (priceOfArUSD <= 0.98) {
    // buy 10000 arUSD
    const amount0Out = parseEther('10000');
    console.log('----- step4 -----');

    const swapTx = routerContract.methods.swapTokensForExactTokens(
      amount0Out.toString(),
      ethers.constants.MaxUint256.toString(),
      [USDT, arUSD],
      myAccount,
      Math.floor(Date.now() / 1000) + 5 * 60 // 5 min
    );

    console.log('----- step5 -----');
    const swapTxObj = await swapTx.send({
      from: myAccount,
      gasLimit: 300000,
      gasPrice,
    });

    console.log('swap finished', swapTxObj);
  } else if (priceOfArUSD >= 1.02) {
    // sell 10000 arUSD
    const amount1Out = parseEther('10000');

    console.log('----- step6 -----');

    const swapTx = routerContract.methods.swapExactTokensForTokens(
      amount1Out.toString(),
      0,
      [arUSD, USDT],
      myAccount,
      Math.floor(Date.now() / 1000) + 5 * 60 // 5 min
    );

    console.log('----- step7 -----');
    const swapTxObj = await swapTx.send({
      from: myAccount,
      gasLimit: 300000,
      gasPrice,
    });

    console.log('swap finished', swapTxObj);
  } else {
    console.log('no action required for price stability');
  }
  console.log(
    '================ finishing arUSD stability maintainer ================'
  );
}

async function main() {
  // approve tokens to be used for stability
  await approveTokenTo(arUSD, pairUSDTarUSD);
  await approveTokenTo(USDT, pairUSDTarUSD);
  await approveTokenTo(arUSD, pangolinRouter);
  await approveTokenTo(USDT, pangolinRouter);

  // run price stabilizer once per min
  while (1 == 1) {
    try {
      await runPriceStabilizer();
    } catch (error) {
      console.error(error);
    }
    await waitSeconds(60);
  }
}

main();
