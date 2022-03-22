const chainId = Number(process.env.CHAIN_ID || '43113');

const contracts = {
  43113: {
    // testnet
    arableCollateral: '0x3072189C96ce6De73730499bDC91fa7Cb376C774',
    arableLiquidation: '0x32bb77cDB588C0e55324DF3bC09ea70013c9E482',
    arUSD: '0x5DaF787B6f5839956D1a50d3B9d0d7DF3FEb3328',
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
