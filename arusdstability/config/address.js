const chainId = Number(process.env.CHAIN_ID || '43113');

const contracts = {
  43113: {
    // testnet
    USDT: '',
    arUSD: '0xF01d1b172b008d052C3dbA3A57c21FFd705d49a7',
    pairUSDTarUSD: '',
  },
  43114: {
    // mainnet
    USDT: '',
    arUSD: '',
    pairUSDTarUSD: '',
  },
};

const { arUSD, USDT, pairUSDTarUSD } = contracts[chainId];

exports.USDT = USDT;
exports.arUSD = arUSD;
exports.pairUSDTarUSD = pairUSDTarUSD;
