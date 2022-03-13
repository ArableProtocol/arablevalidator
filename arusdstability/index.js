const nodeCron = require('node-cron');
require('dotenv').config();
const { Contract, providers, Wallet, utils, BigNumber } = require('ethers');
const { UNISWAP_PAIR_ABI, FACTORY_UNI } = require('./ABI');
const { waitSeconds } = require('../utils/wait');

async function runPriceStabilizer() {
  console.log('----- arUSD stability maintainer, in progress code -----');
  console.log(
    '================ starting arUSD stability maintainer ================'
  );
  const provider = new providers.JsonRpcProvider('');

  const USDC = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'; // TODO: to be updated with new address
  const arUSD = '0xF01d1b172b008d052C3dbA3A57c21FFd705d49a7'; // mvp arUSD address
  const executorAddress = '';
  const factoryContractAddress = ''; // TODO: to be set

  const factoryContract = new Contract(
    factoryContractAddress,
    FACTORY_UNI.abi,
    provider
  );

  // check pair price
  const pair = await factoryContract.getPair(USDC, arUSD);
  const uniswapstablecoins = new Contract(pair, UNISWAP_PAIR_ABI, provider);

  // function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast);
  const stables = await uniswapstablecoins.getReserves();

  const reserve0 = Number(utils.formatUnits(stables[0], 6));
  const reserve1 = Number(utils.formatUnits(stables[1], 6));

  const priceOfArUSD = reserve0 / reserve1;

  console.log('arUSD price', priceOfArUSD);

  const gasPrice = await provider.getGasPrice();
  const amtInGwei = utils.formatUnits(gasPrice, 'gwei');
  console.log('amtInGwei', amtInGwei);

  // function swap(uint amount0Out, uint amount1Out, address to, bytes calldata data) external;
  // for flash swap
  // bytes: data.length is greater than 0, the contract transfers the tokens and then calls the following function on the to address:
  console.log('checking..');
  if (priceOfArUSD <= 0.98) {
    // buy 10000 arUSD
    const bytes = ethers.utils.toUtf8Bytes('2');
    const amount0Out = 10000;
    const amount1Out = 250;
    uniswapstablecoins.swap(amount0Out, amount1Out, executorAddress, bytes);
  } else if (priceOfArUSD >= 1.02) {
    // sell 10000 arUSD
    const bytes = ethers.utils.toUtf8Bytes('2');
    const amount0Out = 10000;
    const amount1Out = 250;
    uniswapstablecoins.swap(amount0Out, amount1Out, executorAddress, bytes);
  } else {
    console.log('no action required for price stability');
  }
  console.log(
    '================ finishing arUSD stability maintainer ================'
  );
}

async function main() {
  // run the script every hour
  await nodeCron.schedule('1 * * * *', async function () {
    await runPriceStabilizer();
  });
}

main();
