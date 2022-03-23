const chainId = Number(process.env.CHAIN_ID || '43113');

const contracts = {
  43113: {
    // testnet
    arableCollateral: '0x6b6E63b76B0A1a1289F27721aDC5fa6B28F3e99b',
    arableLiquidation: '0x08668C65f7a1Fa40a170bA17276F2DD08c94aaBF',
    arUSD: '0x57C5c0a1ccAC1A28f9B165d0DdF42feaa0796C25',
    USDT: '0x6BFa5db24866541c8703f84eF36cC202bcd43322',
    pairWAVAXarUSD: '0x1434f3a9724cdc60781d1f5bcc69a8e5316ad999',
    pairUSDTarUSD: '0xfc2648426608965b5b6f21784200af8cb016cf70',
    pangolinRouter: '0x2d99abd9008dc933ff5c0cd271b88309593ab921',
  },
  43114: {
    // mainnet
    arableCollateral: '',
    arableLiquidation: '',
    arUSD: '',
    USDT: '',
    pairWAVAXarUSD: '',
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
