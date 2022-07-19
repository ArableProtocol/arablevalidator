const axios = require("axios");

let ids = [
  "binancecoin",
  "sushi",
  "solana",
  "osmosis",
  "pancakeswap-token",
  "avalanche-2",
  "quick",
  "curve-dao-token",
  "raydium",
  "polkadot",
  "truefi",
  "cosmos",
  "avalanche-2",
  "arable-protocol",
  "evmos",
  "bitcoin",
  "ethereum",
  "matic-network",
  "ripple",
  "cardano",
  "dogecoin",
  "tron",
  "elrond-erd-2",
  "filecoin",
  "aave",
  "theta-token",
  "axie-infinity",
  "eos",
  "maker",
  "bittorrent",
  "zcash",
  "arweave",
  "iota",
  "lido-dao",
  "the-graph",
  "huobi-token",
  "klay-token",
  "thorchain",
  "fantom",
  "havven",
  "chiliz",
  "basic-attention-token",
  "convex-finance",
  "celo",
  "serum",
  "mina-protocol",
  "frax-share",
  "kava",
  "compound-governance-token",
  "1inch",
  "gnosis",
  "iostoken",
  "kadena",
  "iotex",
  "harmony",
  "just",
  "gmx",
  "0x",
  "omisego",
  "audius",
  "ethereum-name-service",
  "pax-gold",
  "stepn",
  "bitdao",
  "waves",
  "kusama",
  "dash",
  "loopring",
  "enjincoin",
  "litecoin",
  "leo",
  "ftx-token",
  "uniswap",
  "okb",
  "crypto-com-chain",
  "chainlink",
  "stellar",
  "near",
  "monero",
  "algorand",
  "chain-2",
  "internet-computer",
  "vechain",
  "flow",
  "the-sandbox",
  "decentraland",
  "tezos",
  "apecoin",
  "aragon",
  "dydx",
  "ankr",
  "livepeer",
  "looksrare",
  "moonbeam",
  "secret",
];
let url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`;

async function priceFeed() {
  let result = await axios.get(url).then(function (priceFeed) {
    return priceFeed.data;
  });
  return result;
}

exports.priceFeed = priceFeed;
