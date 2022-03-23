const chainId = Number(process.env.CHAIN_ID || '43113');

const contracts = {
  43113: {
    // testnet
    arableCollateral: '0x6b6E63b76B0A1a1289F27721aDC5fa6B28F3e99b',
    arableLiquidation: '0x08668C65f7a1Fa40a170bA17276F2DD08c94aaBF',
    arUSD: '0x57C5c0a1ccAC1A28f9B165d0DdF42feaa0796C25',
    decimals: {
      '0xd00ae08403b9bbb9124bb305c09058e32c39a48c': 18, // wavax
      '0x23542139268078d36b75fAB7b3e3DEb50f038b3D': 18, // acre
      '0x6BFa5db24866541c8703f84eF36cC202bcd43322': 6, // usdt
      '0x7E309EA562892fCB691B4460D350144020379647': 18, // aft
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
      '0x23542139268078d36b75fAB7b3e3DEb50f038b3D': 18, // acre
      '0x6BFa5db24866541c8703f84eF36cC202bcd43322': 6, // usdt
    },
  },
};

const {
  arableCollateral: collateral,
  arableLiquidation: liquidation,
  arUSD,
  decimals,
} = contracts[chainId];

exports.collateral = collateral;
exports.liquidation = liquidation;
exports.arUSD = arUSD;
exports.decimals = decimals;
