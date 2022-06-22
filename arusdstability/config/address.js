const chainId = Number(process.env.CHAIN_ID || "43113");

const contracts = {
  43113: {
    // testnet
    arableCollateral: "0x9D38695C52ED31E9Bd0A6ABE8b51612554B7de35",
    arableLiquidation: "0x6119B823e3C5081Ca194c352A1001E51f933850A",
    arUSD: "0x4b362aCEB2140540Acded484FEeF5D0238c5EF09",
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
