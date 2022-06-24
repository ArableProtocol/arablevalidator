const chainId = Number(process.env.CHAIN_ID || "43113");

const contracts = {
  43113: {
    // testnet
    arableCollateral: "0x0DB06a96Dc7e64CAeCFb84f4f301e83390C0febA",
    arableLiquidation: "0xAc61aed93345ca7346780C6d6b4e17b83b07932B",
    arUSD: "0x51592838990e20a50232FE8ae187682ff9111c23",
    decimals: {
      "0xd00ae08403b9bbb9124bb305c09058e32c39a48c": 18, // wavax
      "0x23542139268078d36b75fab7b3e3deb50f038b3d": 18, // acre
      "0x6bfa5db24866541c8703f84ef36cc202bcd43322": 6, // usdt
      "0x7e309ea562892fcb691b4460d350144020379647": 18, // aft
    },
  },
  43114: {
    // mainnet
    arableCollateral: "",
    arableLiquidation: "",
    arUSD: "",
    decimals: {
      // TODO: to be set for mainnet
      "0xd00ae08403b9bbb9124bb305c09058e32c39a48c": 18, // wavax
      "0x23542139268078d36b75fab7b3e3deb50f038b3d": 18, // acre
      "0x6bfa5db24866541c8703f84ef36cc202bcd43322": 6, // usdt
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
