const chainId = Number(process.env.CHAIN_ID || '43113');

const contracts = {
  43113: {
    // testnet
    arableCollateral: '0xdfAc6d1e26507815a454eAab43779A19214A6c72',
    arableLiquidation: '0x95d6471b2435252873A5dD39cC693b2c692B3b09',
    arUSD: '0xF01d1b172b008d052C3dbA3A57c21FFd705d49a7',
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
