const chainId = Number(process.env.CHAIN_ID || '43113');

const contracts = {
  43113: {
    // testnet
    arableCollateral: '0xF1F2535F85e3A306167Fcc8DA6E72d0e904936d0',
    arableLiquidation: '0xf7107b7455D259F5b31efCecea467BBF116fD768',
    arUSD: '0x1506f2ba1D756875609A373a02bBAa6EA0Acfd4b',
    decimals: {
      '0xd00ae08403b9bbb9124bb305c09058e32c39a48c': 18, // wavax
      '0x23542139268078d36b75fab7b3e3deb50f038b3d': 18, // acre
      '0x6bfa5db24866541c8703f84ef36cc202bcd43322': 6, // usdt
      '0x7e309ea562892fcb691b4460d350144020379647': 18, // aft
    },
  },
  43114: {
    // mainnet
    arableCollateral: '0xf21f840619235af01310c211ee8BE2c1b9b817C5',
    arableLiquidation: '0x38b620D3CE47244b8f3d36CD4788Aa2eD986224d',
    arUSD: '0x025AB35fF6AbccA56d57475249baaEae08419039',
    decimals: {
      // TODO: to be set for mainnet
      '0xd00ae08403b9bbb9124bb305c09058e32c39a48c': 18, // wavax
      '0x23542139268078d36b75fab7b3e3deb50f038b3d': 18, // acre
      '0x6bfa5db24866541c8703f84ef36cc202bcd43322': 6, // usdt
      '0xe76a54d67259970A6956ff7ae0Dd79B1B3655cb3': 18, // aft
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
