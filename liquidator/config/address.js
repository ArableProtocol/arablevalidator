const chainId = Number(process.env.CHAIN_ID || '43113');

const contracts = {
  43113: {
    // testnet
    arableCollateral: '0x6b6E63b76B0A1a1289F27721aDC5fa6B28F3e99b',
    arableLiquidation: '0x08668C65f7a1Fa40a170bA17276F2DD08c94aaBF',
    arUSD: '0x57C5c0a1ccAC1A28f9B165d0DdF42feaa0796C25',
    decimals: {
      '0xd00ae08403b9bbb9124bb305c09058e32c39a48c': 18, // wavax
      '0x23542139268078d36b75fab7b3e3deb50f038b3d': 18, // acre
      '0x6bfa5db24866541c8703f84ef36cc202bcd43322': 6, // usdt
      '0x7e309ea562892fcb691b4460d350144020379647': 18, // aft
    },
  },
  43114: {
    // mainnet
    arableCollateral: '',
    arableLiquidation: '',
    arUSD: '',
    decimals: {
      // TODO: to be set for mainnet
      '0xd00ae08403b9bbb9124bb305c09058e32c39a48c': 18, // wavax
      '0x23542139268078d36b75fab7b3e3deb50f038b3d': 18, // acre
      '0x6bfa5db24866541c8703f84ef36cc202bcd43322': 6, // usdt
    },
  },
};

const {
  arableCollateral: collateral,
  arableLiquidation: liquidation,
  arUSD,
  decimals,
} = contracts[chainId];

const getDecimal = function (tokenAddress) {
  for ([key, value] of Object.entries(decimals)) {
    if (key.toLowerCase() == tokenAddress.toLowerCase()) {
      return value;
    }
  }
  return 18;
};

exports.collateral = collateral;
exports.liquidation = liquidation;
exports.arUSD = arUSD;
exports.getDecimal = getDecimal;
