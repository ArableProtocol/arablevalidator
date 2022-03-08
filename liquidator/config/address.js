const chainId = Number(process.env.CHAIN_ID || '43113');

const contracts = {
  43113: {
    // testnet
    arableCollateral: '0x3C1CFcff282d4E577c17689e2F9DbFce636501f8',
    arableLiquidation: '0xc289A25a8E4bdcB66D091848d37B1Cc7ceD9b1eA',
    arUSD: '0xB4Bdf1c6D36430Fb15fCc307e2467e75E91a18D5',
  },
  43114: {
    // mainnet
    arableCollateral: '',
    arableLiquidation: '',
    arUSD: '',
  },
};

const {
  arableCollateral: collateral,
  arableLiquidation: liquidation,
  arUSD,
} = contracts[chainId];

exports.collateral = collateral;
exports.liquidation = liquidation;
exports.arUSD = arUSD;
