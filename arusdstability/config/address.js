const chainId = Number(process.env.CHAIN_ID || "43113");

const contracts = {
  43113: {
    // testnet
    arableCollateral: "0xF1F2535F85e3A306167Fcc8DA6E72d0e904936d0",
    arableLiquidation: "0xf7107b7455D259F5b31efCecea467BBF116fD768",
    arUSD: "0x1506f2ba1D756875609A373a02bBAa6EA0Acfd4b",
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
