const chainId = Number(process.env.CHAIN_ID || '43113');

const contracts = {
  43113: {
    // testnet
    USDT: '',
    arUSD: '0xF01d1b172b008d052C3dbA3A57c21FFd705d49a7',
    pairUSDTarUSD: '',
    arableCollateral: '0xdfAc6d1e26507815a454eAab43779A19214A6c72',
    arableLiquidation: '0x95d6471b2435252873A5dD39cC693b2c692B3b09',
  },
  43114: {
    // mainnet
    USDT: '',
    arUSD: '',
    pairUSDTarUSD: '',
    arableCollateral: '',
    arableLiquidation: '',
  },
};

const {
  arUSD,
  USDT,
  pairUSDTarUSD,
  arableCollateral: collateral,
  arableLiquidation: liquidation,
} = contracts[chainId];

exports.USDT = USDT;
exports.arUSD = arUSD;
exports.pairUSDTarUSD = pairUSDTarUSD;
exports.collateral = collateral;
exports.liquidation = liquidation;
