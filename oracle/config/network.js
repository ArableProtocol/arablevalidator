const Web3 = require("web3");
const { Contract, providers } = require("ethers");
const { fuji_url, avax_url } = require("../../config/config.rpc");

function getNetwork() {
  const chainId = Number(process.env.CHAIN_ID || "43113");
  if (chainId == 43114) {
    return "avax";
  }
  return "fuji";
}

exports.getEthersProvider = function () {
  const network = getNetwork();
  if (network == "avax") {
    return new providers.JsonRpcProvider(avax_url);
  }
  return new providers.JsonRpcProvider(fuji_url);
};

exports.setup = function () {
  const network = getNetwork();
  if (network == "avax") {
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

exports.getNetwork = getNetwork;
