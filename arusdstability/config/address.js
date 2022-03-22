const chainId = Number(process.env.CHAIN_ID || '43113');

const contracts = {
  43113: {
    // testnet
    arableCollateral: '0x3072189C96ce6De73730499bDC91fa7Cb376C774',
    arableLiquidation: '0x32bb77cDB588C0e55324DF3bC09ea70013c9E482',
    arUSD: '0x5DaF787B6f5839956D1a50d3B9d0d7DF3FEb3328',
    USDT: '0x6BFa5db24866541c8703f84eF36cC202bcd43322',
    pairUSDTarUSD: '0x1bce2604574f6b0c5a9e504c51e1eec458274d5d', // TODO: reset
    pangolinRouter: '0x2d99abd9008dc933ff5c0cd271b88309593ab921', // TODO: reset if required
  },
  43114: {
    // mainnet
    arableCollateral: '',
    arableLiquidation: '',
    arUSD: '',
    USDT: '',
    pairUSDTarUSD: '',
    pangolinRouter: '0xe54ca86531e17ef3616d22ca28b0d458b6c89106',
  },
};

const {
  arUSD,
  USDT,
  pairUSDTarUSD,
  arableCollateral: collateral,
  arableLiquidation: liquidation,
  pangolinRouter,
} = contracts[chainId];

exports.USDT = USDT;
exports.arUSD = arUSD;
exports.pairUSDTarUSD = pairUSDTarUSD;
exports.collateral = collateral;
exports.liquidation = liquidation;
exports.pangolinRouter = pangolinRouter;
