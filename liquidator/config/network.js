const Web3 = require("web3");
const { fuji_url, avax_url } = require("../../config/config.rpc");

exports.setup = function () {
  const chainId = Number(process.env.CHAIN_ID || "43113");
  if (chainId == 43114) {
    return new Web3(avax_url);
  }
  return new Web3(fuji_url);
};

exports.getBackendApiUrl = function () {
  const chainId = Number(process.env.CHAIN_ID || "43113");
  if (chainId == 43114) {
    return "https://api.arable.finance/api";
  }
  return "https://api.fuji.arable.finance/api";
};

exports.getLiquidationSubgraphEndPoint = function () {
  const chainId = Number(process.env.CHAIN_ID || "43113");
  if (chainId == 43114) {
    return "https://api.thegraph.com/subgraphs/name/arableprotocol/arable-liquidation-avax";
  }
  return "https://api.thegraph.com/subgraphs/name/arableprotocol/arable-liquidation-fuji";
};
