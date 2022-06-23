const chainId = Number(process.env.CHAIN_ID || "43113");

const contracts = {
  43113: {
    // testnet
    arableCollateral: "0x3D806551AEfD16FA4C703c9c4AE20f8f1c4c0452",
    arableLiquidation: "0x05Eaa623782A53cDBfB4F13BCA985fb6d129cAF8",
    arUSD: "0x87772543Ca87917Eb01Aff8116715EEE686B6dB9",
    USDT: "0x6BFa5db24866541c8703f84eF36cC202bcd43322",
    pairWAVAXarUSD: "0x69c7547070c928cac8d5c57f9960e1598c55da0e",
    pairUSDTarUSD: "0xa75f5b31d1c36262e7735be0f48cdc6f0f6ccf51",
    pangolinRouter: "0x2d99abd9008dc933ff5c0cd271b88309593ab921",
  },
  43114: {
    // mainnet
    arableCollateral: "",
    arableLiquidation: "",
    arUSD: "",
    USDT: "",
    pairWAVAXarUSD: "",
    pairUSDTarUSD: "",
    pangolinRouter: "0xe54ca86531e17ef3616d22ca28b0d458b6c89106",
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
