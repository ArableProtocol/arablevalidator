const { Contract, providers, Wallet, utils, BigNumber } = require('ethers');
const { UNISWAP_PAIR_ABI, FACTORY_UNI } = require('./ABI');

async function main() {
  console.log('----- arUSD stability maintainer, in progress code -----');
  console.log('arUSD stability maintainer, starting!');
  const provider = new providers.JsonRpcProvider('');

  const USDC = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
  const arUSD = '0xdac17f958d2ee523a2206206994597c13d831ec7';
  const executorAddress = '';
  const factoryContractAddress = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f';

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
    // buy arUSD
    const bytes = ethers.utils.toUtf8Bytes('2');
    const amount0Out = 500;
    const amount1Out = 250;
    uniswapstablecoins.swap(amount0Out, amount1Out, executorAddress, bytes);
  } else if (priceOfArUSD >= 1.02) {
    // sell arUSD
    const bytes = ethers.utils.toUtf8Bytes('2');
    const amount0Out = 500;
    const amount1Out = 250;
    uniswapstablecoins.swap(amount0Out, amount1Out, executorAddress, bytes);
  } else {
    console.log('no action required for price stability');
  }
  console.log('arUSD stability maintainer, starting!');
}

main();
